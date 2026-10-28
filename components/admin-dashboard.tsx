"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from "react";
import { AdminRecordForm } from "./admin/admin-record-form";
import { EmptyState } from "@/components/public/empty-state";
import { Badge, type BadgeTone } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Input, Select } from "@/components/ui/field";
import { LoadingState } from "@/components/ui/loading-state";

type ContentTab = "services" | "events" | "articles" | "gallery";
type AdminTab = ContentTab | "inquiries" | "applications" | "settings";
type SubmissionTab = "inquiries" | "applications";
type AdminRecord = Record<string, unknown> & { id?: string };
type ApiResult = { data: unknown; error: { message: string } | null };
type ListResult = { items: AdminRecord[]; page: number; pages: number; total: number };
type Notice = { tone: "success" | "error"; message: string };

const contentTabs: ContentTab[] = ["services", "events", "articles", "gallery"];
const adminTabs: AdminTab[] = [...contentTabs, "inquiries", "applications", "settings"];
const tabLabels: Record<AdminTab, string> = {
  services: "Services",
  events: "Events",
  articles: "Articles",
  gallery: "Gallery",
  inquiries: "Inquiries",
  applications: "Applications",
  settings: "Site settings",
};
const endpoint: Record<AdminTab, string> = {
  services: "/api/admin/services",
  events: "/api/admin/events",
  articles: "/api/admin/articles",
  gallery: "/api/admin/gallery",
  inquiries: "/api/admin/inquiries",
  applications: "/api/admin/applications",
  settings: "/api/admin/site-settings",
};
const newContent: Record<ContentTab, AdminRecord> = {
  services: { title: "", slug: "", summary: "", description: "", category: "", published: false, archived: false },
  events: { title: "", slug: "", summary: "", description: "", startDate: new Date().toISOString(), status: "upcoming", venueVerified: false, registration: { enabled: false }, published: false, archived: false },
  articles: { title: "", slug: "", excerpt: "", body: "", category: "", tags: [], published: false, archived: false },
  gallery: { title: "", slug: "", description: "", category: "", images: [], published: false, archived: false },
};
const statusOptions: Record<SubmissionTab, string[]> = {
  inquiries: ["new", "in_progress", "responded", "closed"],
  applications: ["new", "reviewing", "accepted", "declined", "closed"],
};

export function AdminDashboard({ email, role }: { email: string; role: "admin" | "editor" }) {
  const allowedTabs = useMemo<AdminTab[]>(() => (role === "admin" ? adminTabs : contentTabs), [role]);
  const [tab, setTab] = useState<AdminTab>("services");
  const [records, setRecords] = useState<AdminRecord[]>([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(0);
  const [total, setTotal] = useState(0);
  const [selected, setSelected] = useState<AdminRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState(false);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [loadError, setLoadError] = useState("");
  const [query, setQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [refresh, setRefresh] = useState(0);

  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const loadRecords = useCallback(
    async (signal: AbortSignal) => {
      setLoading(true);
      setLoadError("");
      try {
        const params = new URLSearchParams({ page: String(page), limit: "20" });
        if (submittedQuery && tab !== "settings") params.set("q", submittedQuery);
        const response = await fetch(
          tab === "settings" ? endpoint.settings : `${endpoint[tab]}?${params}`,
          { cache: "no-store", signal },
        );
        const body = await parseResponse(response);
        if (signal.aborted) return;
        if (tab === "settings") {
          setRecords([asRecord(body.data) ?? {}]);
          setPages(1);
          setTotal(1);
          return;
        }
        const data = asRecord(body.data);
        const result = data ? asListResult(data) : null;
        if (!result) throw new Error("The server returned an unexpected list response.");
        setRecords(result.items);
        setPages(result.pages);
        setTotal(result.total);
      } catch (error) {
        if (signal.aborted) return;
        setLoadError(errorMessage(error));
        setRecords([]);
        setPages(0);
        setTotal(0);
      } finally {
        if (!signal.aborted) setLoading(false);
      }
    },
    [page, submittedQuery, tab],
  );

  useEffect(() => {
    const controller = new AbortController();
    void loadRecords(controller.signal);
    return () => controller.abort();
  }, [loadRecords, refresh]);

  const mutate = useCallback(async (work: () => Promise<string>): Promise<boolean> => {
    setPending(true);
    setNotice(null);
    try {
      const message = await work();
      if (mountedRef.current) setNotice({ tone: "success", message });
      return true;
    } catch (error) {
      if (mountedRef.current) setNotice({ tone: "error", message: errorMessage(error) });
      return false;
    } finally {
      if (mountedRef.current) setPending(false);
    }
  }, []);

  const initialData = useMemo<AdminRecord>(() => {
    if (selected) return withoutServerFields(selected);
    if (tab === "settings") return records[0] ?? {};
    return contentTabs.includes(tab as ContentTab) ? newContent[tab as ContentTab] : {};
  }, [records, selected, tab]);

  const isContent = contentTabs.includes(tab as ContentTab);
  const statuses = tab === "inquiries" || tab === "applications" ? statusOptions[tab] : null;

  function createNew() {
    if (!contentTabs.includes(tab as ContentTab)) return;
    setSelected(null);
    setNotice(null);
  }

  function selectTab(next: AdminTab) {
    setTab(next);
    setPage(1);
    setSelected(null);
    setNotice(null);
    setLoadError("");
  }

  function selectRecord(record: AdminRecord) {
    setSelected(record);
    setNotice(null);
  }

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPage(1);
    setSubmittedQuery(query.trim());
  }

  async function saveRecord(payload: AdminRecord) {
    if (!asRecord(payload)) {
      setNotice({ tone: "error", message: "The content must be a JSON object." });
      return;
    }
    const id = selected?.id;
    const url = id ? `${endpoint[tab]}/${encodeURIComponent(id)}` : endpoint[tab];
    const method = tab === "settings" || id ? "PATCH" : "POST";
    const updated = await mutate(async () => {
      await sendJson(method, url, payload);
      return id ? "Changes saved." : "Content created.";
    });
    if (updated && mountedRef.current) {
      setSelected(null);
      setRefresh((value) => value + 1);
    }
  }

  async function patchRecord(record: AdminRecord, patch: AdminRecord, successMessage: string) {
    const recordId = record.id;
    if (!recordId) return;
    const updated = await mutate(async () => {
      await sendJson("PATCH", `${endpoint[tab]}/${encodeURIComponent(recordId)}`, patch);
      return successMessage;
    });
    if (updated && mountedRef.current) {
      setSelected((value) => (value?.id === recordId ? { ...value, ...patch } : value));
      setRefresh((value) => value + 1);
    }
  }

  async function deleteRecord(record: AdminRecord) {
    const recordId = record.id;
    if (!recordId || !window.confirm(`Permanently delete ${displayTitle(record)}?`)) return;
    const deleted = await mutate(async () => {
      await sendJson("DELETE", `${endpoint[tab]}/${encodeURIComponent(recordId)}`);
      return "Record deleted.";
    });
    if (deleted && mountedRef.current) {
      setSelected(null);
      setRefresh((value) => value + 1);
    }
  }

  async function changeSubmissionStatus(record: AdminRecord, status: string) {
    await patchRecord(record, { status }, "Submission status updated.");
  }

  async function signOut() {
    setPending(true);
    try {
      await parseResponse(await fetch("/api/admin/session", { method: "DELETE" }));
      window.location.assign("/admin");
    } catch (error) {
      if (mountedRef.current) {
        setNotice({ tone: "error", message: errorMessage(error) });
        setPending(false);
      }
    }
  }

  const listPane = loading ? (
    <div className="space-y-3" aria-busy="true">
      <LoadingState label={`Loading ${tabLabels[tab].toLowerCase()}…`} />
      {[0, 1, 2].map((index) => (
        <div className="h-28 animate-pulse border border-brand-purple/10 bg-brand-paper-dark" key={index} />
      ))}
    </div>
  ) : loadError ? (
    <div className="border border-red-200 bg-red-50 p-8 text-center">
      <p className="text-sm font-semibold text-red-800">{loadError}</p>
      <Button className="mt-4" onClick={() => setRefresh((value) => value + 1)} type="button" variant="outline">
        Try again
      </Button>
    </div>
  ) : records.length === 0 ? (
    <div className="space-y-4">
      <EmptyState
        description="Records you add will appear here once they are saved."
        title={`No ${tabLabels[tab].toLowerCase()} yet`}
      />
      {isContent && (
        <div className="flex justify-center">
          <Button onClick={createNew} type="button" variant="dark">
            Create your first {singular(tab as ContentTab)}
          </Button>
        </div>
      )}
    </div>
  ) : (
    <div className="space-y-3">
      {records.map((record) => renderRecord(record))}
    </div>
  );

  const pagination = pages > 1 && (
    <nav aria-label="Pagination" className="flex items-center justify-between border-t border-brand-purple/10 pt-6">
      <Button
        disabled={page <= 1 || loading}
        onClick={() => setPage((value) => value - 1)}
        size="sm"
        type="button"
        variant="ghost"
      >
        ← Previous
      </Button>
      <span className="text-xs font-bold uppercase tracking-widest text-brand-ink/60">
        Page {page} of {pages}
      </span>
      <Button
        disabled={page >= pages || loading}
        onClick={() => setPage((value) => value + 1)}
        size="sm"
        type="button"
        variant="ghost"
      >
        Next →
      </Button>
    </nav>
  );

  const editor = (
    <div className="border border-brand-purple/10 bg-white">
      <div className="flex items-center justify-between gap-3 bg-brand-purple px-5 py-4 text-white">
        <h2 className="text-sm font-bold uppercase tracking-wider">
          {tab === "settings"
            ? "Public settings"
            : selected
              ? `Edit ${singular(tab as ContentTab)}`
              : `New ${singular(tab as ContentTab)}`}
        </h2>
        {isContent && selected && (
          <button
            className="text-[11px] font-bold uppercase tracking-widest text-white/70 transition-colors hover:text-white hover:underline"
            onClick={createNew}
            type="button"
          >
            Clear
          </button>
        )}
      </div>
      <div className="p-5 sm:p-6">
        <AdminRecordForm
          isPending={pending}
          initialData={initialData}
          key={`${tab}-${selected?.id ?? "new"}`}
          onCancel={isContent && selected ? () => setSelected(null) : undefined}
          onSave={saveRecord}
          tab={tab === "settings" ? "settings" : (tab as ContentTab)}
        />
      </div>
    </div>
  );

  return (
    <>
      <header className="mesh-dark grain relative text-white">
        <div className="mx-auto flex max-w-content flex-wrap items-center justify-between gap-6 px-5 py-10 sm:px-8">
          <div>
            <Eyebrow tone="dark">Administration portal</Eyebrow>
            <h1 className="font-display mt-3 text-3xl leading-[1.1] sm:text-4xl">ECK Dashboard</h1>
            <p className="mt-3 flex flex-wrap items-center gap-2 text-sm text-white/70">
              <span aria-hidden="true" className="h-2 w-2 rounded-sm bg-brand-teal" />
              <span>
                Signed in as <span className="font-semibold text-white">{email}</span>
              </span>
              <span aria-hidden="true">·</span>
              <span className="capitalize">{role}</span>
            </p>
          </div>
          <Button disabled={pending} onClick={() => void signOut()} type="button" variant="onDark">
            Sign out
          </Button>
        </div>
      </header>

      <div className="mx-auto max-w-content px-5 py-14 sm:px-8 sm:py-20">
        <nav aria-label="Admin sections" className="flex flex-wrap gap-px border border-brand-purple/10 bg-brand-purple/10">
          {allowedTabs.map((item) => (
            <button
              aria-current={tab === item ? "page" : undefined}
              className={`min-h-11 px-5 text-xs font-bold uppercase tracking-widest transition-colors ${
                tab === item
                  ? "bg-brand-purple text-white"
                  : "bg-white text-brand-ink/70 hover:bg-brand-paper hover:text-brand-purple"
              }`}
              key={item}
              onClick={() => selectTab(item)}
              type="button"
            >
              {tabLabels[item]}
            </button>
          ))}
        </nav>

        {notice && (
          <p
            aria-live="polite"
            className={`mt-6 border-l-2 p-4 text-sm ${
              notice.tone === "error"
                ? "border-red-500 bg-red-50 text-red-800"
                : "border-brand-teal bg-white text-brand-ink"
            }`}
            role="status"
          >
            {notice.message}
          </p>
        )}

        {tab === "settings" ? (
          <div className="mx-auto mt-8 max-w-2xl">
            {loading ? <LoadingState label="Loading site settings…" /> : editor}
          </div>
        ) : (
          <>
            <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border border-brand-purple/10 bg-brand-paper px-4 py-3 sm:px-5">
              <div>
                <h2 className="font-display text-xl leading-tight text-brand-purple">{tabLabels[tab]}</h2>
                <p className="mt-1 text-xs font-semibold uppercase tracking-widest text-brand-ink/50">
                  {total} record{total === 1 ? "" : "s"}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <form className="flex items-stretch gap-2" onSubmit={submitSearch}>
                  <label className="sr-only" htmlFor="admin-search">
                    Search records
                  </label>
                  <div className="w-56">
                    <Input
                      id="admin-search"
                      onChange={(event) => setQuery(event.target.value)}
                      placeholder={`Search ${tabLabels[tab].toLowerCase()}…`}
                      type="search"
                      value={query}
                    />
                  </div>
                  <Button type="submit" variant="outline">
                    Search
                  </Button>
                </form>
                {isContent && (
                  <Button onClick={createNew} type="button" variant="primary">
                    Add {singular(tab as ContentTab)}
                  </Button>
                )}
              </div>
            </div>

            <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_400px] xl:grid-cols-[1fr_440px]">
              <div className="space-y-4">
                {listPane}
                {pagination}
              </div>
              <aside className="lg:sticky lg:top-8 lg:h-fit">{editor}</aside>
            </div>
          </>
        )}
      </div>
    </>
  );

  function renderRecord(record: AdminRecord) {
    const selectedRow = selected?.id === record.id;
    const contactLine = [
      typeof record.email === "string" ? record.email : null,
      typeof record.phone === "string" && record.phone ? record.phone : null,
    ]
      .filter(Boolean)
      .join(" · ");
    const createdAt = typeof record.createdAt === "string" ? new Date(record.createdAt) : null;

    return (
      <article
        className={`group border bg-white transition-colors ${
          selectedRow ? "border-brand-teal ring-1 ring-brand-teal" : "border-brand-purple/10 hover:border-brand-purple/25"
        }`}
        key={record.id ?? JSON.stringify(record)}
      >
        <div className="space-y-3 p-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            {isContent ? (
              <button className="min-w-0 flex-1 text-left" onClick={() => selectRecord(record)} type="button">
                <h3 className="font-display text-lg leading-6 text-brand-purple transition-colors group-hover:text-brand-teal">
                  {displayTitle(record)}
                </h3>
                {recordSubtitle(record) && (
                  <p className="mt-1 truncate text-xs text-brand-ink/60">{recordSubtitle(record)}</p>
                )}
              </button>
            ) : (
              <div className="min-w-0 flex-1">
                <h3 className="font-display text-lg leading-6 text-brand-purple">{displayTitle(record)}</h3>
                {recordSubtitle(record) && (
                  <p className="mt-1 truncate text-xs text-brand-ink/60">{recordSubtitle(record)}</p>
                )}
              </div>
            )}
            <div className="flex flex-wrap items-center gap-2">
              {typeof record.published === "boolean" && (
                <ToggleBadge
                  active={record.published}
                  disabled={pending}
                  onClick={() =>
                    void patchRecord(
                      record,
                      { published: !record.published },
                      `Content ${record.published ? "unpublished" : "published"}.`,
                    )
                  }
                  toneOn="green"
                >
                  {record.published ? "Published" : "Draft"}
                </ToggleBadge>
              )}
              {typeof record.archived === "boolean" && (
                <ToggleBadge
                  active={record.archived}
                  disabled={pending}
                  onClick={() =>
                    void patchRecord(
                      record,
                      { archived: !record.archived },
                      `Content ${record.archived ? "unarchived" : "archived"}.`,
                    )
                  }
                  toneOn="danger"
                >
                  {record.archived ? "Archived" : "Active"}
                </ToggleBadge>
              )}
              {statuses && (
                <div className="relative w-44">
                  <Select
                    aria-label={`Update status for ${displayTitle(record)}`}
                    disabled={pending}
                    onChange={(event) => void changeSubmissionStatus(record, event.target.value)}
                    value={String(record.status ?? "new")}
                  >
                    {statuses.map((status) => (
                      <option key={status} value={status}>
                        {status.replace("_", " ").toUpperCase()}
                      </option>
                    ))}
                  </Select>
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-brand-ink/50"
                  >
                    ▾
                  </span>
                </div>
              )}
              {(isContent || statuses) && (
                <button
                  className="transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={pending}
                  onClick={() => void deleteRecord(record)}
                  type="button"
                >
                  <Badge square tone="danger">
                    Delete
                  </Badge>
                </button>
              )}
            </div>
          </div>

          {typeof record.summary === "string" && record.summary && (
            <p className="line-clamp-2 text-sm leading-6 text-brand-ink/70">{record.summary}</p>
          )}
          {typeof record.message === "string" && record.message && (
            <p className="line-clamp-3 whitespace-pre-line text-sm leading-6 text-brand-ink/70">{record.message}</p>
          )}

          {(contactLine || createdAt) && (
            <div className="flex flex-wrap items-center gap-4 border-t border-brand-purple/5 pt-3">
              {contactLine && <p className="text-xs font-medium text-brand-ink/60">{contactLine}</p>}
              {createdAt && <p className="text-xs text-brand-ink/45">Received {createdAt.toLocaleDateString()}</p>}
            </div>
          )}
        </div>
      </article>
    );
  }
}

function ToggleBadge({
  active,
  children,
  disabled,
  onClick,
  toneOff = "neutral",
  toneOn,
}: {
  active: boolean;
  children: ReactNode;
  disabled: boolean;
  onClick: () => void;
  toneOff?: BadgeTone;
  toneOn: BadgeTone;
}) {
  return (
    <button
      aria-pressed={active}
      className="transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
      disabled={disabled}
      onClick={onClick}
      type="button"
    >
      <Badge square tone={active ? toneOn : toneOff}>
        {children}
      </Badge>
    </button>
  );
}

async function sendJson(method: string, url: string, body?: unknown): Promise<ApiResult> {
  return parseResponse(
    await fetch(url, {
      method,
      headers: body === undefined ? undefined : { "Content-Type": "application/json" },
      body: body === undefined ? undefined : JSON.stringify(body),
    }),
  );
}

async function parseResponse(response: Response): Promise<ApiResult> {
  const value: unknown = await response.json().catch(() => null);
  if (!response.ok) {
    const error = asRecord(value) && asRecord(asRecord(value)?.error);
    throw new Error(typeof error?.message === "string" ? error.message : "The request could not be completed.");
  }
  const result = asRecord(value);
  if (!result || !("data" in result) || !("error" in result)) throw new Error("The server returned an invalid response.");
  return { data: result.data, error: result.error as ApiResult["error"] };
}

function asRecord(value: unknown): AdminRecord | null {
  return typeof value === "object" && value !== null && !Array.isArray(value) ? (value as AdminRecord) : null;
}

function asListResult(value: AdminRecord): ListResult | null {
  if (!Array.isArray(value.items)) return null;
  if (typeof value.page !== "number" || typeof value.pages !== "number" || typeof value.total !== "number") return null;
  const items = value.items.map(asRecord);
  if (items.some((item) => item === null)) return null;
  return { items: items.filter((item): item is AdminRecord => item !== null), page: value.page, pages: value.pages, total: value.total };
}

function withoutServerFields(record: AdminRecord): AdminRecord {
  return Object.fromEntries(
    Object.entries(record).filter(
      ([key]) => !["id", "_id", "__v", "createdAt", "updatedAt", "lastLoginAt"].includes(key),
    ),
  );
}

function displayTitle(record: AdminRecord): string {
  for (const field of ["title", "name", "email", "slug"]) {
    const value = record[field];
    if (typeof value === "string" && value) return value;
  }
  return "Untitled record";
}

function recordSubtitle(record: AdminRecord): string {
  if (typeof record.slug === "string" && record.slug) return record.slug;
  if (typeof record.email === "string" && record.email) return record.email;
  if (typeof record.createdAt === "string") return new Date(record.createdAt).toLocaleString();
  return "";
}

function singular(tab: ContentTab): string {
  return tab === "services" ? "service" : tab === "articles" ? "article" : tab === "gallery" ? "gallery item" : "event";
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "The request could not be completed.";
}
