"use client";

import { FormEvent, useMemo, useState } from "react";
import { AdminInviteCreator } from "@/components/admin-invite-creator";
import { readJsonResponse } from "@/lib/http";
import type { AdminInvite, InviteStatus, InviteType } from "@/lib/invites";

type InviteListResponse = {
  ok?: boolean;
  message?: string;
  invites?: AdminInvite[];
};

type EditInviteState = {
  token: string;
  name: string;
  giftAmount: string;
  guestCount: string;
  inviteType: InviteType;
  status: InviteStatus;
  phone: string;
};

const statusLabels: Record<InviteStatus, string> = {
  pending: "Pending",
  accepted: "Accepted",
  rejected: "Rejected"
};

const inviteTypeLabels: Record<InviteType, string> = {
  standard: "Standard",
  guestOfHonor: "Guest of Honour"
};

function formatDate(value: string | null) {
  if (!value) {
    return "-";
  }

  return new Intl.DateTimeFormat("en-ZM", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
}

function formatAmount(amount: number) {
  return `ZMW ${amount.toLocaleString()}+`;
}

function formatSeats(count: number) {
  return `${count} ${count === 1 ? "seat" : "seats"}`;
}

export function AdminDashboardV2() {
  const [password, setPassword] = useState("");
  const [activePassword, setActivePassword] = useState("");
  const [invites, setInvites] = useState<AdminInvite[]>([]);
  const [statusFilter, setStatusFilter] = useState<InviteStatus | "all">("all");
  const [attendanceFilter, setAttendanceFilter] = useState<
    "all" | "attended" | "not-attended"
  >("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [editingInvite, setEditingInvite] = useState<EditInviteState | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [noticeMessage, setNoticeMessage] = useState("");

  const counts = useMemo(
    () =>
      invites.reduce(
        (current, invite) => ({
          ...current,
          [invite.status]: current[invite.status] + 1
        }),
        {
          pending: 0,
          accepted: 0,
          rejected: 0
        } satisfies Record<InviteStatus, number>
      ),
    [invites]
  );

  const attendedCount = useMemo(
    () => invites.filter((invite) => invite.attended).length,
    [invites]
  );

  const seatCounts = useMemo(
    () =>
      invites.reduce(
        (current, invite) => {
          const guestCount = invite.guestCount;

          return {
            all: current.all + guestCount,
            pending:
              current.pending + (invite.status === "pending" ? guestCount : 0),
            accepted:
              current.accepted + (invite.status === "accepted" ? guestCount : 0),
            rejected:
              current.rejected + (invite.status === "rejected" ? guestCount : 0),
            attended: current.attended + (invite.attended ? guestCount : 0)
          };
        },
        {
          all: 0,
          pending: 0,
          accepted: 0,
          rejected: 0,
          attended: 0
        }
      ),
    [invites]
  );

  const totals = useMemo(
    () =>
      invites.reduce(
        (current, invite) => ({
          ...current,
          all: current.all + invite.giftAmount,
          [invite.status]: current[invite.status] + invite.giftAmount
        }),
        {
          all: 0,
          pending: 0,
          accepted: 0,
          rejected: 0
        } satisfies Record<InviteStatus | "all", number>
      ),
    [invites]
  );

  const filteredInvites = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return invites.filter((invite) => {
      const matchesStatus =
        statusFilter === "all" || invite.status === statusFilter;
      const matchesAttendance =
        attendanceFilter === "all" ||
        (attendanceFilter === "attended" && invite.attended) ||
        (attendanceFilter === "not-attended" && !invite.attended);
      const matchesSearch =
        !normalizedSearch ||
        invite.name.toLowerCase().includes(normalizedSearch) ||
        invite.token.toLowerCase().includes(normalizedSearch);

      return matchesStatus && matchesAttendance && matchesSearch;
    });
  }, [attendanceFilter, invites, searchTerm, statusFilter]);

  async function loadInvites(passwordToUse = activePassword) {
    setLoading(true);
    setErrorMessage("");
    setNoticeMessage("");

    try {
      const response = await fetch("/api/invites", {
        headers: {
          "x-admin-password": passwordToUse
        }
      });
      const result = await readJsonResponse<InviteListResponse>(response);

      if (!response.ok || !result.ok || !result.invites) {
        throw new Error(result.message || "Failed to load invitations.");
      }

      setActivePassword(passwordToUse);
      setInvites(result.invites);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to load invitations."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleUnlock(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await loadInvites(password);
  }

  async function copyInviteUrl(inviteUrl: string) {
    await navigator.clipboard.writeText(inviteUrl);
    setNoticeMessage("Invite link copied.");
  }

  function startEditing(invite: AdminInvite) {
    setEditingInvite({
      token: invite.token,
      name: invite.name,
      giftAmount: String(invite.giftAmount),
      guestCount: String(invite.guestCount),
      inviteType: invite.inviteType,
      status: invite.status,
      phone: invite.whatsappNumber || invite.phone || ""
    });
    setErrorMessage("");
    setNoticeMessage("");
  }

  async function saveInvite(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!editingInvite) {
      return;
    }

    setSaving(true);
    setErrorMessage("");
    setNoticeMessage("");

    try {
      const response = await fetch(`/api/invites/${editingInvite.token}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": activePassword
        },
        body: JSON.stringify({
          name: editingInvite.name,
          giftAmount: Number(editingInvite.giftAmount),
          guestCount: Number(editingInvite.guestCount),
          inviteType: editingInvite.inviteType,
          status: editingInvite.status,
          phone: editingInvite.phone,
          whatsappNumber: editingInvite.phone
        })
      });
      const result = await readJsonResponse<{
        ok?: boolean;
        message?: string;
      }>(response);

      if (!response.ok || !result.ok) {
        throw new Error(result.message || "Failed to update invitation.");
      }

      setEditingInvite(null);
      setNoticeMessage("Invitation updated.");
      await loadInvites(activePassword);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to update invitation."
      );
    } finally {
      setSaving(false);
    }
  }

  async function deleteInvite(invite: AdminInvite) {
    const confirmed = window.confirm(`Delete invitation for ${invite.name}?`);

    if (!confirmed) {
      return;
    }

    setSaving(true);
    setErrorMessage("");
    setNoticeMessage("");

    try {
      const response = await fetch(`/api/invites/${invite.token}`, {
        method: "DELETE",
        headers: {
          "x-admin-password": activePassword
        }
      });
      const result = await readJsonResponse<{
        ok?: boolean;
        message?: string;
      }>(response);

      if (!response.ok || !result.ok) {
        throw new Error(result.message || "Failed to delete invitation.");
      }

      setNoticeMessage("Invitation deleted.");
      await loadInvites(activePassword);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to delete invitation."
      );
    } finally {
      setSaving(false);
    }
  }

  async function toggleAttendance(invite: AdminInvite) {
    setSaving(true);
    setErrorMessage("");
    setNoticeMessage("");

    try {
      const response = await fetch(`/api/invites/${invite.token}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": activePassword
        },
        body: JSON.stringify({
          attended: !invite.attended
        })
      });
      const result = await readJsonResponse<{
        ok?: boolean;
        message?: string;
      }>(response);

      if (!response.ok || !result.ok) {
        throw new Error(result.message || "Failed to update attendance.");
      }

      setNoticeMessage(
        invite.attended ? "Guest marked as not attended." : "Guest checked in."
      );
      await loadInvites(activePassword);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to update attendance."
      );
    } finally {
      setSaving(false);
    }
  }

  if (!activePassword) {
    return (
      <form
        onSubmit={handleUnlock}
        className="card-surface mt-10 max-w-xl space-y-5 p-6 sm:p-8"
      >
        <label className="block space-y-2">
          <span className="text-sm font-medium text-ink/75">Admin Password</span>
          <input
            required
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-2xl border border-gold/20 bg-cream px-4 py-3 outline-none transition focus:border-gold"
            placeholder="Password"
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="inline-flex min-w-36 items-center justify-center rounded-full bg-ink px-6 py-3 text-sm font-semibold text-cream transition hover:bg-ink/90 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? "Opening..." : "Open Admin"}
        </button>

        {errorMessage ? (
          <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {errorMessage}
          </p>
        ) : null}
      </form>
    );
  }

  return (
    <div className="mt-10 space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <div className="card-surface p-5">
          <p className="text-xs uppercase tracking-[0.25em] text-gold">All Gifts</p>
          <p className="mt-3 text-2xl text-ink">{formatAmount(totals.all)}</p>
          <p className="mt-2 text-sm text-ink/55">
            {invites.length} invite(s), {formatSeats(seatCounts.all)}
          </p>
        </div>
        <div className="card-surface p-5">
          <p className="text-xs uppercase tracking-[0.25em] text-gold">Pending</p>
          <p className="mt-3 text-2xl text-ink">{formatAmount(totals.pending)}</p>
          <p className="mt-2 text-sm text-ink/55">
            {counts.pending} invite(s), {formatSeats(seatCounts.pending)}
          </p>
        </div>
        <div className="card-surface p-5">
          <p className="text-xs uppercase tracking-[0.25em] text-gold">Accepted</p>
          <p className="mt-3 text-2xl text-ink">{formatAmount(totals.accepted)}</p>
          <p className="mt-2 text-sm text-ink/55">
            {counts.accepted} invite(s), {formatSeats(seatCounts.accepted)}
          </p>
        </div>
        <div className="card-surface p-5">
          <p className="text-xs uppercase tracking-[0.25em] text-gold">Rejected</p>
          <p className="mt-3 text-2xl text-ink">{formatAmount(totals.rejected)}</p>
          <p className="mt-2 text-sm text-ink/55">
            {counts.rejected} invite(s), {formatSeats(seatCounts.rejected)}
          </p>
        </div>
        <div className="card-surface p-5">
          <p className="text-xs uppercase tracking-[0.25em] text-gold">Attended</p>
          <p className="mt-3 text-2xl text-ink">{formatSeats(seatCounts.attended)}</p>
          <p className="mt-2 text-sm text-ink/55">
            {attendedCount} invite(s) checked in
          </p>
        </div>
      </div>

      <AdminInviteCreator
        password={activePassword}
        onCreated={() => loadInvites(activePassword)}
      />

      <section className="card-surface overflow-hidden">
        <div className="flex flex-col gap-4 border-b border-gold/15 p-5 sm:p-6 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-gold">
              Guest List
            </p>
            <h2 className="mt-2 text-2xl text-ink sm:text-3xl">
              Invitation Responses
            </h2>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_12rem_12rem_auto] xl:min-w-[60rem]">
            <input
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="w-full rounded-2xl border border-gold/20 bg-cream px-4 py-3 text-sm outline-none transition focus:border-gold"
              placeholder="Search guests"
            />
            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value as InviteStatus | "all")
              }
              className="w-full rounded-2xl border border-gold/20 bg-cream px-4 py-3 text-sm outline-none transition focus:border-gold"
            >
              <option value="all">All statuses</option>
              <option value="pending">Pending</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
            </select>
            <select
              value={attendanceFilter}
              onChange={(event) =>
                setAttendanceFilter(
                  event.target.value as "all" | "attended" | "not-attended"
                )
              }
              className="w-full rounded-2xl border border-gold/20 bg-cream px-4 py-3 text-sm outline-none transition focus:border-gold"
            >
              <option value="all">All attendance</option>
              <option value="attended">Attended</option>
              <option value="not-attended">Not attended</option>
            </select>
            <button
              type="button"
              onClick={() => loadInvites(activePassword)}
              disabled={loading || saving}
              className="inline-flex items-center justify-center rounded-full border border-gold/30 bg-white/60 px-5 py-3 text-sm font-semibold text-ink transition hover:border-gold disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Refreshing..." : "Refresh"}
            </button>
          </div>
        </div>

        {errorMessage ? (
          <div className="p-6">
            <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {errorMessage}
            </p>
          </div>
        ) : null}

        {noticeMessage ? (
          <div className="px-6 pt-6">
            <p className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              {noticeMessage}
            </p>
          </div>
        ) : null}

        <div className="space-y-4 p-5 lg:hidden">
          {filteredInvites.map((invite) => (
            <article
              key={invite.id}
              className="rounded-3xl border border-gold/15 bg-cream/70 p-4"
            >
              <div className="flex flex-col gap-3">
                <div>
                  <h3 className="text-xl leading-tight text-ink">{invite.name}</h3>
                  <p className="mt-1 text-sm text-ink/60">
                    {formatAmount(invite.giftAmount)}
                  </p>
                  <p className="mt-1 text-sm text-ink/60">
                    {formatSeats(invite.guestCount)}
                  </p>
                  <p className="mt-1 text-sm text-ink/60">
                    {inviteTypeLabels[invite.inviteType]}
                  </p>
                </div>

                <div className="grid gap-3 text-sm">
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-gold">
                      WhatsApp / Phone
                    </p>
                    <p className="mt-1 text-ink/70">
                      {invite.whatsappNumber || invite.phone || "-"}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-gold">
                        Status
                      </p>
                      <p className="mt-1 text-ink/70">
                        {statusLabels[invite.status]}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-gold">
                        Attendance
                      </p>
                      <p className="mt-1 text-ink/70">
                        {invite.attended ? "Attended" : "Not attended"}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-gold">
                        Responded
                      </p>
                      <p className="mt-1 text-ink/70">
                        {formatDate(invite.respondedAt)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-gold">
                        Checked In
                      </p>
                      <p className="mt-1 text-ink/70">
                        {formatDate(invite.attendedAt)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => copyInviteUrl(invite.inviteUrl)}
                    className="rounded-full border border-gold/25 px-3 py-2 text-xs font-semibold text-ink transition hover:border-gold"
                  >
                    Copy
                  </button>
                  <a
                    href={invite.inviteUrl}
                    className="rounded-full bg-ink px-3 py-2 text-center text-xs font-semibold text-cream transition hover:bg-ink/90"
                  >
                    Open
                  </a>
                  <button
                    type="button"
                    onClick={() => startEditing(invite)}
                    className="rounded-full border border-gold/25 px-3 py-2 text-xs font-semibold text-ink transition hover:border-gold"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleAttendance(invite)}
                    disabled={saving}
                    className="rounded-full border border-gold/25 px-3 py-2 text-xs font-semibold text-ink transition hover:border-gold disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {invite.attended ? "Undo Check-in" : "Check In"}
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteInvite(invite)}
                    disabled={saving}
                    className="col-span-2 rounded-full border border-rose-200 px-3 py-2 text-xs font-semibold text-rose-700 transition hover:border-rose-300 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="hidden overflow-x-auto lg:block">
          <table className="w-full min-w-[1220px] text-left text-sm">
            <thead className="border-b border-gold/15 bg-cream/70 text-xs uppercase tracking-[0.18em] text-ink/45">
              <tr>
                <th className="px-6 py-4 font-semibold">Guest</th>
                <th className="px-6 py-4 font-semibold">Type</th>
                <th className="px-6 py-4 font-semibold">Gift</th>
                <th className="px-6 py-4 font-semibold">Seats</th>
                <th className="px-6 py-4 font-semibold">WhatsApp / Phone</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Attendance</th>
                <th className="px-6 py-4 font-semibold">Created</th>
                <th className="px-6 py-4 font-semibold">Responded</th>
                <th className="px-6 py-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvites.map((invite) => (
                <tr
                  key={invite.id}
                  className="border-b border-gold/10 align-top last:border-0"
                >
                  <td className="px-6 py-4 font-medium text-ink">{invite.name}</td>
                  <td className="px-6 py-4 text-ink/65">
                    {inviteTypeLabels[invite.inviteType]}
                  </td>
                  <td className="px-6 py-4 text-ink/65">
                    {formatAmount(invite.giftAmount)}
                  </td>
                  <td className="px-6 py-4 text-ink/65">
                    {formatSeats(invite.guestCount)}
                  </td>
                  <td className="px-6 py-4 text-ink/65">
                    {invite.whatsappNumber || invite.phone || "-"}
                  </td>
                  <td className="px-6 py-4">
                    <span className="rounded-full border border-gold/20 bg-cream px-3 py-1 text-xs font-semibold text-ink/70">
                      {statusLabels[invite.status]}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-2">
                      <span className="rounded-full border border-gold/20 bg-cream px-3 py-1 text-xs font-semibold text-ink/70">
                        {invite.attended ? "Attended" : "Not attended"}
                      </span>
                      <p className="text-xs text-ink/50">
                        {formatDate(invite.attendedAt)}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-ink/60">
                    {formatDate(invite.createdAt)}
                  </td>
                  <td className="px-6 py-4 text-ink/60">
                    {formatDate(invite.respondedAt)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => copyInviteUrl(invite.inviteUrl)}
                        className="rounded-full border border-gold/25 px-3 py-2 text-xs font-semibold text-ink transition hover:border-gold"
                      >
                        Copy
                      </button>
                      <a
                        href={invite.inviteUrl}
                        className="rounded-full bg-ink px-3 py-2 text-xs font-semibold text-cream transition hover:bg-ink/90"
                      >
                        Open
                      </a>
                      <button
                        type="button"
                        onClick={() => startEditing(invite)}
                        className="rounded-full border border-gold/25 px-3 py-2 text-xs font-semibold text-ink transition hover:border-gold"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleAttendance(invite)}
                        disabled={saving}
                        className="rounded-full border border-gold/25 px-3 py-2 text-xs font-semibold text-ink transition hover:border-gold disabled:cursor-not-allowed disabled:opacity-70"
                      >
                        {invite.attended ? "Undo Check-in" : "Check In"}
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteInvite(invite)}
                        disabled={saving}
                        className="rounded-full border border-rose-200 px-3 py-2 text-xs font-semibold text-rose-700 transition hover:border-rose-300 disabled:cursor-not-allowed disabled:opacity-70"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredInvites.length === 0 ? (
          <p className="p-5 text-sm leading-7 text-ink/65 sm:p-6">
            No invitations match the current view.
          </p>
        ) : null}
      </section>

      {editingInvite ? (
        <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-ink/35 px-4 py-6 sm:px-5 sm:py-8">
          <form
            onSubmit={saveInvite}
            className="card-surface w-full max-w-xl space-y-5 p-5 shadow-soft sm:p-8"
          >
            <div>
              <p className="eyebrow">Edit Guest</p>
              <h2 className="mt-3 text-3xl text-ink">Invitation Details</h2>
            </div>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-ink/75">Guest Name</span>
              <input
                required
                type="text"
                value={editingInvite.name}
                onChange={(event) =>
                  setEditingInvite((current) =>
                    current ? { ...current, name: event.target.value } : current
                  )
                }
                className="w-full rounded-2xl border border-gold/20 bg-cream px-4 py-3 outline-none transition focus:border-gold"
              />
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-ink/75">Gift Amount</span>
              <div className="flex overflow-hidden rounded-2xl border border-gold/20 bg-cream focus-within:border-gold">
                <span className="border-r border-gold/15 px-4 py-3 text-sm font-semibold text-ink/65">
                  ZMW
                </span>
                <input
                  required
                  min="500"
                  step="50"
                  type="number"
                  value={editingInvite.giftAmount}
                  onChange={(event) =>
                    setEditingInvite((current) =>
                      current
                        ? { ...current, giftAmount: event.target.value }
                        : current
                    )
                  }
                  className="w-full bg-transparent px-4 py-3 outline-none"
                />
              </div>
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-ink/75">
                Guests / Seats
              </span>
              <input
                required
                min="1"
                step="1"
                type="number"
                value={editingInvite.guestCount}
                onChange={(event) =>
                  setEditingInvite((current) =>
                    current
                      ? { ...current, guestCount: event.target.value }
                      : current
                  )
                }
                className="w-full rounded-2xl border border-gold/20 bg-cream px-4 py-3 outline-none transition focus:border-gold"
              />
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-ink/75">Invite Type</span>
              <select
                value={editingInvite.inviteType}
                onChange={(event) =>
                  setEditingInvite((current) =>
                    current
                      ? {
                          ...current,
                          inviteType: event.target.value as InviteType
                        }
                      : current
                  )
                }
                className="w-full rounded-2xl border border-gold/20 bg-cream px-4 py-3 outline-none transition focus:border-gold"
              >
                <option value="standard">Standard Invite</option>
                <option value="guestOfHonor">Guest of Honour</option>
              </select>
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-ink/75">Status</span>
              <select
                value={editingInvite.status}
                onChange={(event) =>
                  setEditingInvite((current) =>
                    current
                      ? {
                          ...current,
                          status: event.target.value as InviteStatus
                        }
                      : current
                  )
                }
                className="w-full rounded-2xl border border-gold/20 bg-cream px-4 py-3 outline-none transition focus:border-gold"
              >
                <option value="pending">Pending</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
              </select>
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-ink/75">
                WhatsApp / Phone Number
              </span>
              <input
                type="tel"
                value={editingInvite.phone}
                onChange={(event) =>
                  setEditingInvite((current) =>
                    current ? { ...current, phone: event.target.value } : current
                  )
                }
                className="w-full rounded-2xl border border-gold/20 bg-cream px-4 py-3 outline-none transition focus:border-gold"
                placeholder="+260..."
              />
            </label>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center justify-center rounded-full bg-ink px-6 py-3 text-sm font-semibold text-cream transition hover:bg-ink/90 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
              <button
                type="button"
                onClick={() => setEditingInvite(null)}
                disabled={saving}
                className="inline-flex items-center justify-center rounded-full border border-gold/30 bg-white/70 px-6 py-3 text-sm font-semibold text-ink transition hover:border-gold disabled:cursor-not-allowed disabled:opacity-70"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </div>
  );
}
