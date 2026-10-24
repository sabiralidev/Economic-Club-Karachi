import { redirect } from "next/navigation";
import { AdminLoginForm } from "@/components/admin-login-form";
import { getAdminSession } from "@/lib/auth/session";

export default async function AdminLoginPage() {
  if (await getAdminSession()) redirect("/admin");
  return (
    <section className="mx-auto max-w-lg px-5 py-20">
      <h1 className="text-3xl font-semibold text-brand-purple">Admin sign-in</h1>
      <p className="mt-4 leading-7 text-brand-ink/70">
        Sign in with an administrator account provisioned for this deployment.
      </p>
      <AdminLoginForm />
    </section>
  );
}
