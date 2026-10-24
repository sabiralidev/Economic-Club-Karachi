import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { InquiryForm } from "@/components/home/inquiry-form";

describe("InquiryForm", () => {
  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it("shows field validation errors and preserves entered values", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify({
      data: null,
      error: { message: "Request validation failed.", issues: [{ path: ["message"], message: "Please add more detail." }] },
    }), { status: 400, headers: { "Content-Type": "application/json" } })));
    render(<InquiryForm />);
    fireEvent.change(screen.getByLabelText("Name"), { target: { value: "Test Visitor" } });
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "visitor@example.com" } });
    fireEvent.change(screen.getByLabelText("Message"), { target: { value: "A sufficiently detailed enquiry." } });
    fireEvent.click(screen.getByRole("checkbox"));
    fireEvent.submit(screen.getByRole("form", { name: "Contact enquiry" }));

    expect(await screen.findByText("Please add more detail.")).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: /Message/ })).toHaveValue("A sufficiently detailed enquiry.");
    expect(screen.getByRole("status")).toHaveTextContent("Request validation failed.");
  });

  it("submits a membership application to the application endpoint", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({
      data: { id: "stored-application" }, error: null,
    }), { status: 201, headers: { "Content-Type": "application/json" } }));
    vi.stubGlobal("fetch", fetchMock);
    render(<InquiryForm application />);
    fireEvent.change(screen.getByLabelText("Name"), { target: { value: "Test Applicant" } });
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "applicant@example.com" } });
    fireEvent.change(screen.getByLabelText("Message"), { target: { value: "I would like more information about participating." } });
    fireEvent.click(screen.getByRole("checkbox"));
    fireEvent.submit(screen.getByRole("form", { name: "Membership application" }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    expect(fetchMock.mock.calls[0]?.[0]).toBe("/api/applications");
    expect(JSON.parse(String(fetchMock.mock.calls[0]?.[1]?.body))).toMatchObject({
      interest: "membership",
      consent: true,
    });
    expect(await screen.findByText("Thank you. Your application has been received for review.")).toBeInTheDocument();
  });
});
