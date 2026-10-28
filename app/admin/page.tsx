import { AdminDashboard } from "@/components/admin-dashboard";
import { AdminLoginForm } from "@/components/admin-login-form";
import { Eyebrow } from "@/components/ui/eyebrow";
import { getAdminSession } from "@/lib/auth/session";

export default async function AdminPage() {
  const session = await getAdminSession();

  if (!session) {
    return (
      <section className="mx-auto flex min-h-[70vh] max-w-content items-center justify-center px-5 py-16 sm:px-8">
        <div className="w-full max-w-md border border-brand-purple/10 bg-white p-8 sm:p-10">
          <Eyebrow>Administration portal</Eyebrow>
          <h1 className="font-display mt-3 text-3xl leading-[1.1] text-brand-purple sm:text-4xl">Admin sign-in</h1>
          <p className="mt-4 text-sm leading-6 text-brand-ink/70">
            Sign in with an administrator account provisioned for this deployment.
          </p>
          <AdminLoginForm />
        </div>
      </section>
    );
  }

  return <AdminDashboard email={session.email} role={session.role} />;
}
