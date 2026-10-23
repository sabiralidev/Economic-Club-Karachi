import type { ReactNode } from "react";
import { requireAdminSession } from "@/lib/auth/session";

export default async function AdminLayout({ children }: Readonly<{ children: ReactNode }>) {
  await requireAdminSession();
  return <div className="min-h-screen bg-brand-paper">{children}</div>;
}
