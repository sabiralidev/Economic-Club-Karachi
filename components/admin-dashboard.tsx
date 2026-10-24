"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

type ContentTab = "services" | "events" | "articles" | "gallery";
type AdminTab = ContentTab | "inquiries" | "applications" | "settings";
type AdminRecord = Record<string, unknown> & { id?: string };
type ApiResult = { data: unknown; error: { message: string } | null };
type ListResult = { items: AdminRecord[]; page: number; pages: number; total: number };

const contentTabs: ContentTab[] = ["services", "events", "articles", "gallery"];
const adminTabs: AdminTab[] = [...contentTabs, "inquiries", "applications", "settings"];
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
const statusOptions: Record<"inquiries" | "applications", string[]> = {
  inquiries: ["new", "in_progress", "responded", "closed"],
  applications: ["new", "reviewing", "accepted", "declined", "closed"],
};

export function AdminDashboard({ email, role }: { email: string; role: "admin" | "editor" }) {
  const allowedTabs = useMemo(() => role === "admin" ? adminTabs : contentTabs, [role]);
  const [tab, setTab] = useState<AdminTab>("services");
  const [records, setRecords] = useState<AdminRecord[]>([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(0);
  const [total, setTotal] = useState(0);
  const [selected, setSelected] = useState<AdminRecord | null>(null);
  const [editor, setEditor] = useState(JSON.stringify(newContent.services, null, 2));
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState(false);
  const [notice, setNotice] = useState("");
  const [query, setQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [refresh, setRefresh] = useState(0);

  const loadRecords = useCallback(async () => {
    setLoading(true);
    setNotice("");
    try {
      const params = new URLSearchParams({ page: String(page), limit: "20" });
      if (submittedQuery && tab !== "settings") params.set("q", submittedQuery);
      const response = await fetch(tab === "settings" ? endpoint.settings : `${endpoint[tab]}?${params}`, { cache: "no-store" });
      const body = await parseResponse(response);
      if (tab === "settings") {
        const settings = asRecord(body.data) ?? {};
        setRecords([settings]);
        setEditor(JSON.stringify(settings, null, 2));
        setPages(1);
        setTotal(1);
      } else {
        const data = asRecord(body.data);
        const result = data && asListResult(data);
        if (!result) throw new Error("The server returned an unexpected list response.");
        setRecords(result.items);
        setPages(result.pages);
        setTotal(result.total);
      }
    } catch (error) {
      setNotice(errorMessage(error));
      setRecords([]);
      setPages(0);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [page, submittedQuery, tab]);

  useEffect(() => {
    void loadRecords();
  }, [loadRecords, refresh]);

  function createNew() {
    if (!contentTabs.includes(tab as ContentTab)) return;
    const contentTab = tab as ContentTab;
    setSelected(null);
    setEditor(JSON.stringify(newContent[contentTab], null, 2));
    setNotice("");
  }

  function selectRecord(record: AdminRecord) {
    setSelected(record);
    setEditor(JSON.stringify(withoutServerFields(record), null, 2));
    setNotice("");
  }

  async function saveRecord(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setNotice("");
    try {
      const payload: unknown = JSON.parse(editor);
      if (!asRecord(payload)) throw new Error("The content must be a JSON object.");
      const settingsEdit = tab === "settings";
      const url = selected?.id ? `${endpoint[tab]}/${encodeURIComponent(selected.id)}` : endpoint[tab];
      const response = await fetch(url, {
        method: settingsEdit || selected?.id ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      await parseResponse(response);
      setNotice(selected?.id ? "Changes saved." : "Content created.");
      setSelected(null);
      if (contentTabs.includes(tab as ContentTab)) setEditor(JSON.stringify(newContent[tab as ContentTab], null, 2));
      else setEditor("{}");
      setRefresh((value) => value + 1);
    } catch (error) {
      setNotice(errorMessage(error));
    } finally {
      setPending(false);
    }
  }

  async function patchRecord(record: AdminRecord, patch: AdminRecord, successMessage: string) {
    if (!record.id) return;
    setPending(true);
    setNotice("");
    try {
      const response = await fetch(`${endpoint[tab]}/${encodeURIComponent(record.id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      await parseResponse(response);
      setNotice(successMessage);
      setSelected((value) => value?.id === record.id ? { ...value, ...patch } : value);
      setRefresh((value) => value + 1);
    } catch (error) {
      setNotice(errorMessage(error));
    } finally {
      setPending(false);
    }
  }

  async function deleteRecord(record: AdminRecord) {
    if (!record.id || !window.confirm(`Permanently delete ${displayTitle(record)}?`)) return;
    setPending(true);
    setNotice("");
    try {
      await parseResponse(await fetch(`${endpoint[tab]}/${encodeURIComponent(record.id)}`, { method: "DELETE" }));
      setNotice("Record deleted.");
      setSelected(null);
      setRefresh((value) => value + 1);
    } catch (error) {
      setNotice(errorMessage(error));
    } finally {
      setPending(false);
    }
  }

  async function changeSubmissionStatus(record: AdminRecord, status: string) {
    if (!record.id) return;
    await patchRecord(record, { status }, "Submission status updated.");
  }

  async function signOut() {
    setPending(true);
    try {
      await parseResponse(await fetch("/api/admin/session", { method: "DELETE" }));
      window.location.assign("/admin/login");
    } catch (error) {
      setNotice(errorMessage(error));
      setPending(false);
    }
  }

  const isContent = contentTabs.includes(tab as ContentTab);
  return (
    <section className="mx-auto max-w-content px-5 py-12 sm:px-8">
      <header className="flex flex-wrap items-center justify-between gap-5 border-b border-brand-purple/15 pb-7">
        <div><p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-green">Administration · {role}</p><h1 className="mt-2 text-4xl font-semibold text-brand-purple">ECK dashboard</h1><p className="mt-2 text-sm text-brand-ink/65">Signed in as {email}</p></div>
        <button className="min-h-11 rounded-sm border border-brand-purple/20 px-4 text-sm font-semibold text-brand-purple disabled:opacity-50" disabled={pending} onClick={() => void signOut()} type="button">Sign out</button>
      </header>
      <nav aria-label="Admin sections" className="mt-7 flex flex-wrap gap-2">{allowedTabs.map((item) => <button aria-current={tab === item ? "page" : undefined} className={`rounded-full border px-4 py-2 text-sm font-semibold capitalize ${tab === item ? "border-brand-purple bg-brand-purple text-white" : "border-brand-purple/15 text-brand-ink/75"}`} key={item} onClick={() => { setTab(item); setPage(1); setSelected(null); setNotice(""); }} type="button">{item === "settings" ? "Site settings" : item}</button>)}</nav>
      <div className="mt-7 flex flex-wrap items-end justify-between gap-4">
        <div><h2 className="text-2xl font-semibold capitalize text-brand-purple">{tab === "settings" ? "Site settings" : tab}</h2><p className="mt-1 text-sm text-brand-ink/65">{total} record{total === 1 ? "" : "s"}</p></div>
        {isContent && <button className="min-h-11 rounded-sm bg-brand-purple px-5 text-sm font-semibold text-white" onClick={createNew} type="button">Create {singular(tab as ContentTab)}</button>}
        {tab !== "settings" && <form className="flex gap-2" onSubmit={(event) => { event.preventDefault(); setPage(1); setSubmittedQuery(query.trim()); }}><label className="sr-only" htmlFor="admin-search">Search records</label><input className="min-h-11 border border-brand-purple/20 bg-white px-3 text-sm" id="admin-search" onChange={(event) => setQuery(event.target.value)} placeholder="Search" value={query} /><button className="min-h-11 border border-brand-purple/20 px-4 text-sm font-semibold text-brand-purple" type="submit">Search</button></form>}
      </div>
      {notice && <p aria-live="polite" className="mt-5 border-l-2 border-brand-teal bg-white p-4 text-sm text-brand-ink" role="status">{notice}</p>}
      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.9fr)]">
        <div className="space-y-3">
          {loading ? <p className="py-8 text-sm text-brand-ink/65">Loading records…</p>
            : records.length === 0 ? <p className="border border-brand-purple/10 bg-white p-6 text-sm text-brand-ink/70">No records found.</p>
              : records.map((record) => <article className={`border bg-white p-5 ${selected?.id === record.id ? "border-brand-teal" : "border-brand-purple/10"}`} key={record.id ?? JSON.stringify(record)}>
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <button className="text-left" onClick={() => selectRecord(record)} type="button"><h3 className="font-semibold text-brand-purple">{displayTitle(record)}</h3><p className="mt-1 text-xs text-brand-ink/60">{record.slug ? String(record.slug) : record.email ? String(record.email) : record.createdAt ? new Date(String(record.createdAt)).toLocaleString() : ""}</p></button>
                  <div className="flex flex-wrap items-center gap-2">
                    {record.published !== undefined && <button className="text-xs font-semibold text-brand-purple underline" disabled={pending} onClick={() => void patchRecord(record, { published: !record.published }, `Content ${record.published ? "unpublished" : "published"}.`)} type="button">{record.published ? "Unpublish" : "Publish"}</button>}
                    {record.archived !== undefined && <button className="text-xs font-semibold text-brand-purple underline" disabled={pending} onClick={() => void patchRecord(record, { archived: !record.archived }, `Content ${record.archived ? "unarchived" : "archived"}.`)} type="button">{record.archived ? "Unarchive" : "Archive"}</button>}
                    {statusOptions[tab as "inquiries" | "applications"] && <select aria-label={`Update status for ${displayTitle(record)}`} className="border border-brand-purple/15 px-2 py-1 text-xs" disabled={pending} onChange={(event) => void changeSubmissionStatus(record, event.target.value)} value={String(record.status ?? "new")}>{statusOptions[tab as "inquiries" | "applications"].map((status) => <option key={status} value={status}>{status.replace("_", " ")}</option>)}</select>}
                    {(isContent || tab === "inquiries" || tab === "applications") && <button className="text-xs font-semibold text-red-700 underline" disabled={pending} onClick={() => void deleteRecord(record)} type="button">Delete</button>}
                  </div>
                </div>
                {typeof record.summary === "string" && record.summary && <p className="mt-3 text-sm leading-6 text-brand-ink/70">{record.summary}</p>}
                {typeof record.message === "string" && record.message && <p className="mt-3 whitespace-pre-line text-sm leading-6 text-brand-ink/70">{record.message}</p>}
                {typeof record.email === "string" && <p className="mt-2 text-xs text-brand-ink/60">{record.email}{typeof record.phone === "string" && record.phone ? ` · ${record.phone}` : ""}</p>}
                {typeof record.createdAt === "string" && <p className="mt-2 text-xs text-brand-ink/50">Received: {new Date(record.createdAt).toLocaleString()}</p>}
              </article>)}
          {pages > 1 && <div className="flex items-center justify-between py-3"><button className="text-sm font-semibold text-brand-purple underline disabled:text-brand-ink/40" disabled={page <= 1 || loading} onClick={() => setPage((value) => value - 1)} type="button">Previous</button><span className="text-xs text-brand-ink/65">Page {page} of {pages}</span><button className="text-sm font-semibold text-brand-purple underline disabled:text-brand-ink/40" disabled={page >= pages || loading} onClick={() => setPage((value) => value + 1)} type="button">Next</button></div>}
        </div>
        {(isContent || tab === "settings") && <form className="h-fit border border-brand-purple/10 bg-white p-5" onSubmit={(event) => void saveRecord(event)}>
          <div className="flex items-center justify-between gap-4"><h3 className="font-semibold text-brand-purple">{tab === "settings" ? "Edit public settings" : selected ? `Edit ${singular(tab as ContentTab)}` : `New ${singular(tab as ContentTab)}`}</h3>{selected && <button className="text-xs font-semibold text-brand-purple underline" onClick={createNew} type="button">Clear</button>}</div>
          <p className="mt-2 text-xs leading-5 text-brand-ink/60">Provide the complete valid JSON document. Fields and validation are enforced by the server.</p>
          <label className="sr-only" htmlFor="admin-json">Content JSON</label><textarea className="mt-4 min-h-[28rem] w-full resize-y border border-brand-purple/15 bg-brand-paper p-3 font-mono text-xs leading-5 text-brand-ink" id="admin-json" onChange={(event) => setEditor(event.target.value)} spellCheck={false} value={editor} />
          <button className="mt-4 min-h-11 w-full rounded-sm bg-brand-purple px-5 text-sm font-semibold text-white disabled:opacity-50" disabled={pending} type="submit">{pending ? "Saving…" : "Save changes"}</button>
        </form>}
      </div>
    </section>
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
  return typeof value === "object" && value !== null && !Array.isArray(value) ? value as AdminRecord : null;
}

function asListResult(value: AdminRecord): ListResult | null {
  if (!Array.isArray(value.items) || typeof value.page !== "number" || typeof value.pages !== "number" || typeof value.total !== "number") return null;
  const items = value.items.map(asRecord);
  if (items.some((item) => item === null)) return null;
  return { items: items.filter((item): item is AdminRecord => item !== null), page: value.page, pages: value.pages, total: value.total };
}

function withoutServerFields(record: AdminRecord): AdminRecord {
  return Object.fromEntries(Object.entries(record).filter(([key]) => !["id", "_id", "__v", "createdAt", "updatedAt", "lastLoginAt"].includes(key)));
}

function displayTitle(record: AdminRecord): string {
  for (const field of ["title", "name", "email", "slug"]) {
    const value = record[field];
    if (typeof value === "string" && value) return value;
  }
  return "Untitled record";
}

function singular(tab: ContentTab): string {
  return tab === "services" ? "service" : tab === "articles" ? "article" : tab === "gallery" ? "gallery item" : "event";
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "The request could not be completed.";
}
