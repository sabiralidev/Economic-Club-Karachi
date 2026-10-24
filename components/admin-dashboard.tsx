"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AdminRecordForm } from "./admin/admin-record-form";

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
    setSelected(null);
    setNotice("");
  }

  function selectRecord(record: AdminRecord) {
    setSelected(record);
    setNotice("");
  }

  async function saveRecord(payload: AdminRecord) {
    setPending(true);
    setNotice("");
    try {
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
      window.location.assign("/admin");
    } catch (error) {
      setNotice(errorMessage(error));
      setPending(false);
    }
  }

  const isContent = contentTabs.includes(tab as ContentTab);
  return (
    <section className="mx-auto max-w-content px-5 py-12 sm:px-8">
      <header className="flex flex-wrap items-center justify-between gap-5 border-b border-brand-purple/15 pb-8">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-teal">Administration Portal</p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight text-brand-purple">ECK Dashboard</h1>
          <div className="mt-3 flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-brand-green animate-pulse" />
            <p className="text-sm font-medium text-brand-ink/65">Signed in as <span className="text-brand-purple">{email}</span> · <span className="capitalize">{role}</span></p>
          </div>
        </div>
        <button 
          className="min-h-11 rounded-sm border border-brand-purple/20 px-6 text-sm font-bold text-brand-purple transition-all hover:bg-brand-purple hover:text-white disabled:opacity-50" 
          disabled={pending} 
          onClick={() => void signOut()} 
          type="button"
        >
          Sign out
        </button>
      </header>
      
      <nav aria-label="Admin sections" className="mt-8 flex flex-wrap gap-2">
        {allowedTabs.map((item) => (
          <button 
            aria-current={tab === item ? "page" : undefined} 
            className={`group relative overflow-hidden rounded-full border px-6 py-2.5 text-xs font-bold uppercase tracking-widest transition-all ${
              tab === item 
                ? "border-brand-purple bg-brand-purple text-white shadow-lg shadow-brand-purple/20" 
                : "border-brand-purple/15 text-brand-ink/70 hover:border-brand-purple/40 hover:text-brand-purple"
            }`} 
            key={item} 
            onClick={() => { setTab(item); setPage(1); setSelected(null); setNotice(""); }} 
            type="button"
          >
            {item === "settings" ? "Site Settings" : item}
          </button>
        ))}
      </nav>
      <div className="mt-8 flex flex-wrap items-center justify-between gap-6 bg-brand-paper/50 p-4 rounded-sm border border-brand-purple/5">
        <div>
          <h2 className="text-xl font-bold uppercase tracking-tight text-brand-purple">{tab === "settings" ? "Site Settings" : tab}</h2>
          <p className="mt-1 text-xs font-bold text-brand-ink/50 uppercase tracking-widest">{total} record{total === 1 ? "" : "s"} found</p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          {tab !== "settings" && (
            <form className="flex items-center" onSubmit={(event) => { event.preventDefault(); setPage(1); setSubmittedQuery(query.trim()); }}>
              <label className="sr-only" htmlFor="admin-search">Search records</label>
              <div className="relative">
                <input 
                  className="min-h-11 w-64 border border-brand-purple/20 bg-white pl-10 pr-4 text-sm transition-all focus:border-brand-teal focus:ring-1 focus:ring-brand-teal" 
                  id="admin-search" 
                  onChange={(event) => setQuery(event.target.value)} 
                  placeholder="Search records..." 
                  value={query} 
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-ink/40">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>
                </div>
              </div>
              <button className="ml-2 min-h-11 bg-brand-purple px-6 text-xs font-bold uppercase tracking-widest text-white transition-all hover:bg-brand-purple/90" type="submit">Search</button>
            </form>
          )}
          {isContent && (
            <button 
              className="min-h-11 rounded-sm bg-brand-teal px-6 text-xs font-bold uppercase tracking-widest text-white shadow-lg shadow-brand-teal/20 transition-all hover:bg-brand-teal/90" 
              onClick={createNew} 
              type="button"
            >
              Add {singular(tab as ContentTab)}
            </button>
          )}
        </div>
      </div>
      {notice && <p aria-live="polite" className="mt-5 border-l-2 border-brand-teal bg-white p-4 text-sm text-brand-ink" role="status">{notice}</p>}
      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_400px] xl:grid-cols-[1fr_450px]">
        <div className="space-y-4">
          {loading ? (
            <div className="flex flex-col gap-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 w-full animate-pulse bg-brand-purple/5 rounded-sm" />
              ))}
            </div>
          ) : records.length === 0 ? (
            <div className="flex flex-col items-center justify-center border border-brand-purple/10 bg-white p-12 text-center">
              <p className="text-sm text-brand-ink/70">No records found in {tab}.</p>
              {isContent && (
                <button 
                  onClick={createNew}
                  className="mt-4 text-sm font-bold text-brand-purple underline"
                >
                  Create your first {singular(tab as ContentTab)}
                </button>
              )}
            </div>
          ) : (
            <div className="grid gap-4">
              {records.map((record) => (
                <article 
                  className={`group relative border bg-white p-5 transition-all hover:shadow-md ${selected?.id === record.id ? "border-brand-teal ring-1 ring-brand-teal" : "border-brand-purple/10"}`} 
                  key={record.id ?? JSON.stringify(record)}
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <button className="text-left group-hover:cursor-pointer" onClick={() => selectRecord(record)} type="button">
                      <h3 className="font-semibold text-brand-purple group-hover:text-brand-teal transition-colors">{displayTitle(record)}</h3>
                      <p className="mt-1 text-xs text-brand-ink/60">{record.slug ? String(record.slug) : record.email ? String(record.email) : record.createdAt ? new Date(String(record.createdAt)).toLocaleString() : ""}</p>
                    </button>
                    <div className="flex flex-wrap items-center gap-3">
                      {record.published !== undefined && (
                        <button 
                          className={`text-xs font-bold px-2 py-1 rounded-full border transition-colors ${record.published ? "bg-brand-green/10 border-brand-green/20 text-brand-green" : "bg-brand-ink/5 border-brand-ink/10 text-brand-ink/60"}`}
                          disabled={pending} 
                          onClick={() => void patchRecord(record, { published: !record.published }, `Content ${record.published ? "unpublished" : "published"}.`)} 
                          type="button"
                        >
                          {record.published ? "Published" : "Draft"}
                        </button>
                      )}
                      {record.archived !== undefined && (
                        <button 
                          className={`text-xs font-bold px-2 py-1 rounded-full border transition-colors ${record.archived ? "bg-red-50 border-red-100 text-red-600" : "bg-brand-ink/5 border-brand-ink/10 text-brand-ink/60"}`}
                          disabled={pending} 
                          onClick={() => void patchRecord(record, { archived: !record.archived }, `Content ${record.archived ? "unarchived" : "archived"}.`)} 
                          type="button"
                        >
                          {record.archived ? "Archived" : "Active"}
                        </button>
                      )}
                      {statusOptions[tab as "inquiries" | "applications"] && (
                        <select 
                          aria-label={`Update status for ${displayTitle(record)}`} 
                          className="border border-brand-purple/15 bg-white px-2 py-1 text-xs font-medium focus:border-brand-teal focus:outline-none" 
                          disabled={pending} 
                          onChange={(event) => void changeSubmissionStatus(record, event.target.value)} 
                          value={String(record.status ?? "new")}
                        >
                          {statusOptions[tab as "inquiries" | "applications"].map((status) => (
                            <option key={status} value={status}>{status.replace("_", " ").toUpperCase()}</option>
                          ))}
                        </select>
                      )}
                      {(isContent || tab === "inquiries" || tab === "applications") && (
                        <button 
                          className="text-xs font-bold text-red-700 hover:bg-red-50 px-2 py-1 rounded transition-colors" 
                          disabled={pending} 
                          onClick={() => void deleteRecord(record)} 
                          type="button"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                  {typeof record.summary === "string" && record.summary && <p className="mt-3 text-sm leading-6 text-brand-ink/70 line-clamp-2">{record.summary}</p>}
                  {typeof record.message === "string" && record.message && <p className="mt-3 whitespace-pre-line text-sm leading-6 text-brand-ink/70 line-clamp-3">{record.message}</p>}
                  <div className="mt-4 flex flex-wrap items-center gap-4 border-t border-brand-purple/5 pt-3">
                    {typeof record.email === "string" && <p className="text-xs text-brand-ink/60 font-medium">{record.email}{typeof record.phone === "string" && record.phone ? ` · ${record.phone}` : ""}</p>}
                    {typeof record.createdAt === "string" && <p className="text-xs text-brand-ink/40">Received: {new Date(record.createdAt).toLocaleDateString()}</p>}
                  </div>
                </article>
              ))}
            </div>
          )}
          {pages > 1 && (
            <div className="flex items-center justify-between border-t border-brand-purple/10 py-6">
              <button 
                className="text-sm font-bold text-brand-purple hover:text-brand-teal disabled:opacity-30 transition-colors" 
                disabled={page <= 1 || loading} 
                onClick={() => setPage((value) => value - 1)} 
                type="button"
              >
                ← Previous
              </button>
              <span className="text-xs font-bold uppercase tracking-widest text-brand-ink/60">Page {page} of {pages}</span>
              <button 
                className="text-sm font-bold text-brand-purple hover:text-brand-teal disabled:opacity-30 transition-colors" 
                disabled={page >= pages || loading} 
                onClick={() => setPage((value) => value + 1)} 
                type="button"
              >
                Next →
              </button>
            </div>
          )}
        </div>

        <aside className="relative">
          {(isContent || tab === "settings") && (
            <div className="sticky top-8 h-fit border border-brand-purple/10 bg-white shadow-sm overflow-hidden">
              <div className="flex items-center justify-between bg-brand-purple p-4 text-white">
                <h3 className="text-sm font-bold uppercase tracking-wider">
                  {tab === "settings" ? "Public settings" : selected ? `Edit ${singular(tab as ContentTab)}` : `New ${singular(tab as ContentTab)}`}
                </h3>
                {selected && (
                  <button 
                    className="text-[10px] font-bold uppercase tracking-widest bg-white/10 hover:bg-white/20 px-2 py-1 transition-colors" 
                    onClick={createNew} 
                    type="button"
                  >
                    Clear
                  </button>
                )}
              </div>
              <div className="p-5">
                <AdminRecordForm
                  key={`${tab}-${selected?.id || "new"}`}
                  tab={tab === "settings" ? "settings" : (tab as ContentTab)}
                  initialData={selected ? withoutServerFields(selected) : (tab === "settings" ? records[0] || {} : newContent[tab as ContentTab])}
                  onSave={saveRecord}
                  onCancel={selected ? () => setSelected(null) : undefined}
                  isPending={pending}
                />
              </div>
            </div>
          )}
        </aside>
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
