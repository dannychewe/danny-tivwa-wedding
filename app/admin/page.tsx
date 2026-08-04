import { AdminDashboardV2 } from "@/components/admin-dashboard-v2";

export default function AdminPage() {
  return (
    <main className="min-h-screen py-12 sm:py-16">
      <section className="section-shell">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="eyebrow">Admin</p>
            <h1 className="section-title">Wedding Invitations</h1>
            <p className="section-copy">
              Create personalized invitation links, then send each link directly
              to the invited guest.
            </p>
          </div>

          <a
            href="/"
            className="inline-flex w-fit items-center justify-center rounded-full border border-gold/30 bg-white/60 px-5 py-3 text-sm font-semibold text-ink transition hover:border-gold"
          >
            View Website
          </a>
        </div>

        <AdminDashboardV2 />
      </section>
    </main>
  );
}
