import { AdminDashboard } from "@/components/admin-dashboard";
import { requireAdminSession } from "@/lib/auth/session";

export default async function AdminDashboardPage() {
  const session = await requireAdminSession();
  return <AdminDashboard email={session.email} role={session.role} />;
}
