import { AdminDashboardV2 } from "@/components/admin-dashboard-v2";

export default function AdminInvitesPage() {
  return (
    <main className="min-h-screen py-12 sm:py-16">
      <section className="section-shell">
        <div className="max-w-3xl">
          <p className="eyebrow">Admin</p>
          <h1 className="section-title">Create Invitation Links</h1>
          <p className="section-copy">
            Enter a guest name and gift amount to generate a personalized
            invitation card link.
          </p>
        </div>

        <AdminDashboardV2 />
      </section>
    </main>
  );
}
