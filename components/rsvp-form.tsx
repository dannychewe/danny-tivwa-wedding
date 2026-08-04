"use client";

import { FormEvent, useMemo, useState } from "react";

type FormState = {
  name: string;
  phone: string;
  attending: "Yes" | "No";
  guestCount: string;
  message: string;
};

const initialState: FormState = {
  name: "",
  phone: "",
  attending: "Yes",
  guestCount: "1",
  message: ""
};

export function RSVPForm() {
  const [formState, setFormState] = useState<FormState>(initialState);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const isDeclining = useMemo(
    () => formState.attending === "No",
    [formState.attending]
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const response = await fetch("/api/rsvp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: formState.name.trim(),
          phone: formState.phone.trim(),
          attending: formState.attending,
          guestCount: isDeclining ? 0 : Number(formState.guestCount),
          message: formState.message.trim()
        })
      });

      const result = (await response.json()) as {
        ok?: boolean;
        message?: string;
      };

      if (!response.ok || !result.ok) {
        throw new Error(result.message || "Failed to submit RSVP");
      }

      setSuccessMessage(
        result.message ||
          "Your RSVP has been received. We cannot wait to celebrate with you."
      );
      setFormState(initialState);
    } catch (error) {
      console.error("Failed to submit RSVP", error);
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "We could not submit your RSVP right now. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm font-medium text-ink/75">Name</span>
          <input
            required
            type="text"
            value={formState.name}
            onChange={(event) =>
              setFormState((current) => ({ ...current, name: event.target.value }))
            }
            className="w-full rounded-2xl border border-gold/20 bg-cream px-4 py-3 outline-none transition focus:border-gold"
            placeholder="Your full name"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium text-ink/75">Phone</span>
          <input
            required
            type="tel"
            value={formState.phone}
            onChange={(event) =>
              setFormState((current) => ({ ...current, phone: event.target.value }))
            }
            className="w-full rounded-2xl border border-gold/20 bg-cream px-4 py-3 outline-none transition focus:border-gold"
            placeholder="Phone number"
          />
        </label>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm font-medium text-ink/75">Attending</span>
          <select
            value={formState.attending}
            onChange={(event) =>
              setFormState((current) => ({
                ...current,
                attending: event.target.value as "Yes" | "No"
              }))
            }
            className="w-full rounded-2xl border border-gold/20 bg-cream px-4 py-3 outline-none transition focus:border-gold"
          >
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium text-ink/75">Number of Guests</span>
          <input
            min="0"
            max="8"
            required={!isDeclining}
            disabled={isDeclining}
            type="number"
            value={isDeclining ? "0" : formState.guestCount}
            onChange={(event) =>
              setFormState((current) => ({
                ...current,
                guestCount: event.target.value
              }))
            }
            className="w-full rounded-2xl border border-gold/20 bg-cream px-4 py-3 outline-none transition disabled:cursor-not-allowed disabled:bg-stone-100 focus:border-gold"
          />
        </label>
      </div>

      <label className="space-y-2">
        <span className="text-sm font-medium text-ink/75">Message</span>
        <textarea
          rows={4}
          value={formState.message}
          onChange={(event) =>
            setFormState((current) => ({ ...current, message: event.target.value }))
          }
          className="w-full rounded-2xl border border-gold/20 bg-cream px-4 py-3 outline-none transition focus:border-gold"
          placeholder="Share a note, blessing, or travel update"
        />
      </label>

      <button
        type="submit"
        disabled={loading}
        className="inline-flex w-full items-center justify-center rounded-full bg-ink px-6 py-3 text-sm font-semibold text-cream transition hover:bg-ink/90 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto sm:min-w-40"
      >
        {loading ? "Sending RSVP..." : "Send RSVP"}
      </button>

      {successMessage ? (
        <p className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {successMessage}
        </p>
      ) : null}

      {errorMessage ? (
        <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {errorMessage}
        </p>
      ) : null}
    </form>
  );
}
