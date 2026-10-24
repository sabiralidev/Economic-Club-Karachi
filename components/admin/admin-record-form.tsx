"use client";

import { useEffect, useRef, useState } from "react";
import { FormField } from "@/components/ui/form-field";
import { gsap } from "gsap";

type AdminTab = "services" | "events" | "articles" | "gallery" | "settings";
type AdminRecord = Record<string, unknown> & {
  seo?: Record<string, unknown>;
  contact?: Record<string, unknown>;
  socialLinks?: Record<string, unknown>;
};

interface AdminRecordFormProps {
  tab: AdminTab;
  initialData: AdminRecord;
  onSave: (data: AdminRecord) => void;
  onCancel?: () => void;
  isPending: boolean;
}

export function AdminRecordForm({
  tab,
  initialData,
  onSave,
  onCancel,
  isPending,
}: AdminRecordFormProps) {
  const [formData, setFormData] = useState<AdminRecord>(initialData);
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  useEffect(() => {
    if (formRef.current) {
      const children = formRef.current.querySelectorAll(".form-field-container");
      gsap.fromTo(
        children,
        { opacity: 0, y: 20 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.5, 
          stagger: 0.05, 
          ease: "power2.out",
          clearProps: "all"
        }
      );
    }

  }, [tab]);

  const handleChange = (key: string, value: unknown) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleNestedChange = (parentKey: "seo" | "contact" | "socialLinks", key: string, value: unknown) => {
    setFormData((prev) => ({
      ...prev,
      [parentKey]: {
        ...(isRecord(prev[parentKey]) ? prev[parentKey] : {}),
        [key]: value,
      },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const renderInput = (
    label: string,
    key: string,
    type: string = "text",
    placeholder: string = ""
  ) => (
    <div className="form-field-container">
      <FormField id={key} label={label}>
        <input
          id={key}
          type={type}
          value={textValue(formData[key])}
          onChange={(e) => handleChange(key, e.target.value)}
          placeholder={placeholder}
          className="min-h-11 w-full border border-brand-purple/20 bg-white px-3 text-sm transition-all focus:border-brand-teal focus:outline-none focus:ring-1 focus:ring-brand-teal"
        />
      </FormField>
    </div>
  );

  const renderTextarea = (label: string, key: string, placeholder: string = "") => (
    <div className="form-field-container">
      <FormField id={key} label={label}>
        <textarea
          id={key}
          value={textValue(formData[key])}
          onChange={(e) => handleChange(key, e.target.value)}
          placeholder={placeholder}
          rows={4}
          className="w-full border border-brand-purple/20 bg-white p-3 text-sm transition-all focus:border-brand-teal focus:outline-none focus:ring-1 focus:ring-brand-teal"
        />
      </FormField>
    </div>
  );

  const renderCheckbox = (label: string, key: string) => (
    <div className="form-field-container flex items-center gap-3 py-2">
      <input
        id={key}
        type="checkbox"
        checked={!!formData[key]}
        onChange={(e) => handleChange(key, e.target.checked)}
        className="h-5 w-5 rounded border-brand-purple/20 text-brand-teal focus:ring-brand-teal"
      />
      <label htmlFor={key} className="text-sm font-medium text-brand-purple cursor-pointer">
        {label}
      </label>
    </div>
  );

  const renderSelect = (label: string, key: string, options: { label: string; value: string }[]) => (
    <div className="form-field-container">
      <FormField id={key} label={label}>
        <select
          id={key}
          value={textValue(formData[key])}
          onChange={(e) => handleChange(key, e.target.value)}
          className="min-h-11 w-full border border-brand-purple/20 bg-white px-3 text-sm transition-all focus:border-brand-teal focus:outline-none focus:ring-1 focus:ring-brand-teal"
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </FormField>
    </div>
  );

  const renderSEO = () => (
    <div className="form-field-container mt-6 space-y-4 rounded-sm border border-brand-purple/10 bg-brand-paper/30 p-4">
      <h4 className="text-xs font-bold uppercase tracking-wider text-brand-purple/60">SEO Optimization</h4>
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField id="seo-title" label="Meta Title">
          <input
            id="seo-title"
            value={textValue(formData.seo?.title)}
            onChange={(e) => handleNestedChange("seo", "title", e.target.value)}
            className="min-h-11 w-full border border-brand-purple/20 bg-white px-3 text-sm"
          />
        </FormField>
        <FormField id="seo-canonical" label="Canonical URL">
          <input
            id="seo-canonical"
            value={textValue(formData.seo?.canonicalUrl)}
            onChange={(e) => handleNestedChange("seo", "canonicalUrl", e.target.value)}
            className="min-h-11 w-full border border-brand-purple/20 bg-white px-3 text-sm"
          />
        </FormField>
      </div>
      <FormField id="seo-description" label="Meta Description">
        <textarea
          id="seo-description"
          value={textValue(formData.seo?.description)}
          onChange={(e) => handleNestedChange("seo", "description", e.target.value)}
          rows={2}
          className="w-full border border-brand-purple/20 bg-white p-3 text-sm"
        />
      </FormField>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div ref={formRef} className="space-y-5">
        {tab === "services" && (
          <>
            {renderInput("Title", "title")}
            {renderInput("Slug", "slug", "text", "e-g-service-name")}
            {renderInput("Category", "category")}
            {renderInput("Image URL / Path", "image")}
            {renderTextarea("Summary", "summary")}
            {renderTextarea("Full Description", "description")}
            <div className="flex flex-wrap gap-6">
              {renderCheckbox("Published", "published")}
              {renderCheckbox("Archived", "archived")}
            </div>
            {renderSEO()}
          </>
        )}

        {tab === "events" && (
          <>
            {renderInput("Title", "title")}
            {renderInput("Slug", "slug")}
            <div className="grid gap-4 sm:grid-cols-2">
              {renderInput("Category", "category")}
              {renderSelect("Status", "status", [
                { label: "Upcoming", value: "upcoming" },
                { label: "Past", value: "past" },
                { label: "Cancelled", value: "cancelled" },
              ])}
            </div>
            {renderInput("Image URL", "image")}
            {renderTextarea("Summary", "summary")}
            {renderTextarea("Full Description", "description")}
            <div className="grid gap-4 sm:grid-cols-2">
              {renderInput("Start Date", "startDate", "datetime-local")}
              {renderInput("End Date", "endDate", "datetime-local")}
            </div>
            {renderInput("Venue", "venue")}
            <div className="flex flex-wrap gap-6">
              {renderCheckbox("Venue Verified", "venueVerified")}
              {renderCheckbox("Registration Enabled", "registrationEnabled")}
              {renderCheckbox("Published", "published")}
              {renderCheckbox("Archived", "archived")}
            </div>
            {renderSEO()}
          </>
        )}

        {tab === "articles" && (
          <>
            {renderInput("Title", "title")}
            {renderInput("Slug", "slug")}
            {renderInput("Category", "category")}
            {renderInput("Featured Image", "featuredImage")}
            <div className="form-field-container">
              <FormField id="tags" label="Tags (comma separated)">
                <input
                  id="tags"
                  value={Array.isArray(formData.tags) ? formData.tags.join(", ") : ""}
                  onChange={(e) => handleChange("tags", e.target.value.split(",").map(t => t.trim()).filter(Boolean))}
                  className="min-h-11 w-full border border-brand-purple/20 bg-white px-3 text-sm"
                  placeholder="tag1, tag2, tag3"
                />
              </FormField>
            </div>
            {renderTextarea("Excerpt", "excerpt")}
            {renderTextarea("Body Content", "body")}
            <div className="flex flex-wrap gap-6">
              {renderCheckbox("Published", "published")}
              {renderCheckbox("Archived", "archived")}
            </div>
            {renderSEO()}
          </>
        )}

        {tab === "gallery" && (
          <>
            {renderInput("Title", "title")}
            {renderInput("Slug", "slug")}
            {renderInput("Category", "category")}
            {renderTextarea("Description", "description")}
            <div className="form-field-container space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-brand-purple/60">Images List (JSON format)</h4>
              <textarea
                value={JSON.stringify(formData.images || [], null, 2)}
                onChange={(e) => {
                  try {
                    const parsed = JSON.parse(e.target.value);
                    if (Array.isArray(parsed)) handleChange("images", parsed);
                  } catch {
                    // Ignore invalid JSON while typing
                  }
                }}
                rows={6}
                className="w-full border border-brand-purple/20 bg-brand-paper p-3 font-mono text-xs"
                placeholder='[{"src": "/path", "alt": "desc"}]'
              />
              <p className="text-[10px] text-brand-ink/50 italic">Format: Array of objects with src, alt, and optional caption.</p>
            </div>
            <div className="flex flex-wrap gap-6">
              {renderCheckbox("Published", "published")}
              {renderCheckbox("Archived", "archived")}
            </div>
            {renderSEO()}
          </>
        )}

        {tab === "settings" && (
          <div className="space-y-8">
            <section className="space-y-4">
              <h4 className="text-sm font-bold text-brand-purple border-b border-brand-purple/10 pb-2">Contact Information</h4>
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField id="contact-email" label="Email Address">
                  <input
                    id="contact-email"
                    type="email"
                    value={textValue(formData.contact?.email)}
                    onChange={(e) => handleNestedChange("contact", "email", e.target.value)}
                    className="min-h-11 w-full border border-brand-purple/20 bg-white px-3 text-sm"
                  />
                </FormField>
                <FormField id="contact-phone" label="Phone Number">
                  <input
                    id="contact-phone"
                    value={textValue(formData.contact?.phone)}
                    onChange={(e) => handleNestedChange("contact", "phone", e.target.value)}
                    className="min-h-11 w-full border border-brand-purple/20 bg-white px-3 text-sm"
                  />
                </FormField>
              </div>
              <FormField id="contact-address" label="Physical Address">
                <textarea
                  id="contact-address"
                  value={textValue(formData.contact?.address)}
                  onChange={(e) => handleNestedChange("contact", "address", e.target.value)}
                  rows={2}
                  className="w-full border border-brand-purple/20 bg-white p-3 text-sm"
                />
              </FormField>
            </section>

            <section className="space-y-4">
              <h4 className="text-sm font-bold text-brand-purple border-b border-brand-purple/10 pb-2">Social Presence</h4>
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField id="social-linkedin" label="LinkedIn URL">
                  <input
                    id="social-linkedin"
                    value={textValue(formData.socialLinks?.linkedin)}
                    onChange={(e) => handleNestedChange("socialLinks", "linkedin", e.target.value)}
                    className="min-h-11 w-full border border-brand-purple/20 bg-white px-3 text-sm"
                  />
                </FormField>
                <FormField id="social-instagram" label="Instagram URL">
                  <input
                    id="social-instagram"
                    value={textValue(formData.socialLinks?.instagram)}
                    onChange={(e) => handleNestedChange("socialLinks", "instagram", e.target.value)}
                    className="min-h-11 w-full border border-brand-purple/20 bg-white px-3 text-sm"
                  />
                </FormField>
              </div>
            </section>
            
            <section className="space-y-4">
               <h4 className="text-sm font-bold text-brand-purple border-b border-brand-purple/10 pb-2">Branding</h4>
               {renderInput("Site Logo URL", "logo")}
            </section>
          </div>
        )}
      </div>

      <div className="flex gap-3 pt-6 border-t border-brand-purple/10">
        <button
          type="submit"
          disabled={isPending}
          className="flex-1 min-h-11 rounded-sm bg-brand-purple px-5 text-sm font-semibold text-white transition-all hover:bg-brand-purple/90 disabled:opacity-50"
        >
          {isPending ? "Saving changes..." : "Save changes"}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isPending}
            className="min-h-11 rounded-sm border border-brand-purple/20 px-5 text-sm font-semibold text-brand-purple transition-all hover:bg-brand-paper disabled:opacity-50"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function textValue(value: unknown): string | number {
  return typeof value === "string" || typeof value === "number" ? value : "";
}
