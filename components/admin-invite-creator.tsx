"use client";

import { FormEvent, useState } from "react";
import { readJsonResponse } from "@/lib/http";

type CreatedInvite = {
  inviteUrl: string;
  invite: {
    name: string;
    giftAmount: number;
    guestCount: number;
    inviteType: string;
    status: string;
  };
};

type AdminInviteCreatorProps = {
  password: string;
  onCreated?: () => void;
};

export function AdminInviteCreator({ password, onCreated }: AdminInviteCreatorProps) {
  const [name, setName] = useState("");
  const [giftAmount, setGiftAmount] = useState("500");
  const [guestCount, setGuestCount] = useState("1");
  const [inviteType, setInviteType] = useState("standard");
  const [createdInvite, setCreatedInvite] = useState<CreatedInvite | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [copyMessage, setCopyMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setErrorMessage("");
    setCopyMessage("");
    setCreatedInvite(null);

    try {
      const response = await fetch("/api/invites", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name,
          giftAmount: Number(giftAmount),
          guestCount: Number(guestCount),
          inviteType,
          password
        })
      });

      const result = await readJsonResponse<{
        ok?: boolean;
        message?: string;
      } & Partial<CreatedInvite>>(response);

      if (!response.ok || !result.ok || !result.inviteUrl || !result.invite) {
        throw new Error(result.message || "Failed to create invitation.");
      }

      setCreatedInvite({
        inviteUrl: result.inviteUrl,
        invite: result.invite
      });
      setName("");
      setGiftAmount("500");
      setGuestCount("1");
      setInviteType("standard");
      onCreated?.();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to create invitation."
      );
    } finally {
      setLoading(false);
    }
  }

  async function copyInviteUrl() {
    if (!createdInvite) {
      return;
    }

    await navigator.clipboard.writeText(createdInvite.inviteUrl);
    setCopyMessage("Invite link copied.");
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <form onSubmit={handleSubmit} className="card-surface space-y-5 p-5 sm:p-8">
        <label className="block space-y-2">
          <span className="text-sm font-medium text-ink/75">Guest Name</span>
          <input
            required
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="w-full rounded-2xl border border-gold/20 bg-cream px-4 py-3 outline-none transition focus:border-gold"
            placeholder="Full name"
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
              value={giftAmount}
              onChange={(event) => setGiftAmount(event.target.value)}
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
            value={guestCount}
            onChange={(event) => setGuestCount(event.target.value)}
            className="w-full rounded-2xl border border-gold/20 bg-cream px-4 py-3 outline-none transition focus:border-gold"
          />
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-medium text-ink/75">Invite Type</span>
          <select
            value={inviteType}
            onChange={(event) => setInviteType(event.target.value)}
            className="w-full rounded-2xl border border-gold/20 bg-cream px-4 py-3 outline-none transition focus:border-gold"
          >
            <option value="standard">Standard Invite</option>
            <option value="guestOfHonor">Guest of Honour</option>
          </select>
        </label>

        <button
          type="submit"
          disabled={loading}
          className="inline-flex w-full items-center justify-center rounded-full bg-ink px-6 py-3 text-sm font-semibold text-cream transition hover:bg-ink/90 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto sm:min-w-44"
        >
          {loading ? "Creating..." : "Create Invite"}
        </button>

        {errorMessage ? (
          <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {errorMessage}
          </p>
        ) : null}
      </form>

      <div className="card-surface p-5 sm:p-8">
        <p className="text-xs uppercase tracking-[0.22em] text-gold sm:text-sm sm:tracking-[0.3em]">
          Generated Link
        </p>

        {createdInvite ? (
          <div className="mt-6 space-y-5">
            <div>
              <h2 className="text-2xl text-ink sm:text-3xl">
                {createdInvite.invite.name}
              </h2>
              <p className="mt-2 text-sm text-ink/65">
                Gift: ZMW {createdInvite.invite.giftAmount.toLocaleString()}+
              </p>
              <p className="mt-1 text-sm text-ink/65">
                Seats: {createdInvite.invite.guestCount}
              </p>
              <p className="mt-1 text-sm text-ink/65">
                Type:{" "}
                {createdInvite.invite.inviteType === "guestOfHonor"
                  ? "Guest of Honour"
                  : "Standard Invite"}
              </p>
            </div>

            <div className="rounded-2xl border border-gold/15 bg-cream p-4">
              <p className="break-all text-sm leading-6 text-ink/75">
                {createdInvite.inviteUrl}
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={copyInviteUrl}
                className="inline-flex items-center justify-center rounded-full bg-ink px-5 py-3 text-sm font-semibold text-cream transition hover:bg-ink/90"
              >
                Copy Link
              </button>
              <a
                href={createdInvite.inviteUrl}
                className="inline-flex items-center justify-center rounded-full border border-gold/30 bg-white/60 px-5 py-3 text-sm font-semibold text-ink transition hover:border-gold"
              >
                Open Card
              </a>
            </div>

            {copyMessage ? (
              <p className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                {copyMessage}
              </p>
            ) : null}
          </div>
        ) : (
          <p className="mt-6 text-sm leading-7 text-ink/65">
            The personalized invitation link will appear here after creation.
          </p>
        )}
      </div>
    </div>
  );
}
