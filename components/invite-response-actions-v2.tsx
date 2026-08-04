"use client";

import { useState } from "react";
import type { InviteStatus } from "@/lib/invites";

type InviteResponseActionsV2Props = {
  token: string;
  guestName: string;
  giftAmount: number;
  initialStatus: InviteStatus;
  initialPhone?: string;
};

function drawCenteredText(
  context: CanvasRenderingContext2D,
  text: string,
  y: number,
  maxWidth: number
) {
  context.fillText(text, 540, y, maxWidth);
}

function drawRoundRect(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  context.beginPath();
  context.moveTo(x + radius, y);
  context.lineTo(x + width - radius, y);
  context.quadraticCurveTo(x + width, y, x + width, y + radius);
  context.lineTo(x + width, y + height - radius);
  context.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  context.lineTo(x + radius, y + height);
  context.quadraticCurveTo(x, y + height, x, y + height - radius);
  context.lineTo(x, y + radius);
  context.quadraticCurveTo(x, y, x + radius, y);
  context.closePath();
}

function fillRoundRect(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
  fillStyle: string | CanvasGradient
) {
  drawRoundRect(context, x, y, width, height, radius);
  context.fillStyle = fillStyle;
  context.fill();
}

function strokeRoundRect(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
  strokeStyle: string,
  lineWidth: number
) {
  drawRoundRect(context, x, y, width, height, radius);
  context.strokeStyle = strokeStyle;
  context.lineWidth = lineWidth;
  context.stroke();
}

function downloadInviteCard(guestName: string, giftAmount: number) {
  const canvas = document.createElement("canvas");
  canvas.width = 1080;
  canvas.height = 1350;

  const context = canvas.getContext("2d");

  if (!context) {
    return;
  }

  const background = context.createLinearGradient(0, 0, 0, canvas.height);
  background.addColorStop(0, "#fffdf8");
  background.addColorStop(0.45, "#faf1e4");
  background.addColorStop(1, "#f7f2ea");
  context.fillStyle = background;
  context.fillRect(0, 0, canvas.width, canvas.height);

  const glow = context.createRadialGradient(540, 180, 40, 540, 180, 520);
  glow.addColorStop(0, "rgba(200, 169, 106, 0.26)");
  glow.addColorStop(1, "rgba(200, 169, 106, 0)");
  context.fillStyle = glow;
  context.fillRect(0, 0, canvas.width, canvas.height);

  fillRoundRect(context, 70, 70, 940, 1210, 36, "rgba(255, 255, 255, 0.74)");
  strokeRoundRect(context, 70, 70, 940, 1210, 36, "rgba(200, 169, 106, 0.65)", 4);
  strokeRoundRect(context, 98, 98, 884, 1154, 28, "rgba(200, 169, 106, 0.24)", 2);

  context.textAlign = "center";
  context.fillStyle = "#C8A96A";
  context.font = "600 26px Arial, sans-serif";
  context.letterSpacing = "4px";
  drawCenteredText(context, "WEDDING INVITATION", 170, 820);
  context.letterSpacing = "0px";

  context.fillStyle = "#1F1A17";
  context.font = "86px Georgia, serif";
  drawCenteredText(context, "Danny & Filoza", 292, 900);

  context.font = "25px Arial, sans-serif";
  context.fillStyle = "rgba(31, 26, 23, 0.65)";
  drawCenteredText(
    context,
    "Danny Chewe Mulyansalu & Filoza Tivwa Phiri",
    350,
    850
  );

  context.strokeStyle = "rgba(200, 169, 106, 0.65)";
  context.lineWidth = 2;
  context.beginPath();
  context.moveTo(250, 420);
  context.lineTo(830, 420);
  context.stroke();

  fillRoundRect(context, 360, 455, 360, 70, 35, "rgba(200, 169, 106, 0.14)");
  context.fillStyle = "#C8A96A";
  context.font = "600 24px Arial, sans-serif";
  drawCenteredText(context, "20 SEPTEMBER 2026", 500, 330);

  context.fillStyle = "rgba(31, 26, 23, 0.48)";
  context.font = "22px Arial, sans-serif";
  drawCenteredText(context, "DEAR", 600, 700);

  context.fillStyle = "#1F1A17";
  context.font = "64px Georgia, serif";
  drawCenteredText(context, guestName, 690, 860);

  context.fillStyle = "rgba(31, 26, 23, 0.72)";
  context.font = "30px Arial, sans-serif";
  drawCenteredText(
    context,
    "You are warmly invited to celebrate our wedding day",
    795,
    850
  );
  drawCenteredText(context, "with love, faith, and family.", 845, 850);

  fillRoundRect(context, 150, 905, 360, 150, 24, "rgba(250, 249, 246, 0.92)");
  strokeRoundRect(context, 150, 905, 360, 150, 24, "rgba(200, 169, 106, 0.24)", 2);
  fillRoundRect(context, 570, 905, 360, 150, 24, "rgba(250, 249, 246, 0.92)");
  strokeRoundRect(context, 570, 905, 360, 150, 24, "rgba(200, 169, 106, 0.24)", 2);

  context.fillStyle = "#C8A96A";
  context.font = "600 20px Arial, sans-serif";
  context.fillText("CEREMONY", 330, 955, 300);
  context.fillText("MONETARY GIFT", 750, 955, 300);

  context.fillStyle = "#1F1A17";
  context.font = "26px Arial, sans-serif";
  context.fillText("Parkview SDA Church", 330, 995, 310);
  context.fillText(`From ZMW ${giftAmount.toLocaleString()}`, 750, 995, 310);

  context.fillStyle = "rgba(31, 26, 23, 0.58)";
  context.font = "22px Arial, sans-serif";
  context.fillText("08:30", 330, 1030, 300);
  context.fillText("Wedding gift blessing", 750, 1030, 300);

  context.strokeStyle = "rgba(200, 169, 106, 0.35)";
  context.lineWidth = 2;
  context.beginPath();
  context.moveTo(255, 1128);
  context.lineTo(825, 1128);
  context.stroke();

  context.fillStyle = "rgba(31, 26, 23, 0.66)";
  context.font = "24px Arial, sans-serif";
  drawCenteredText(context, "Kindly RSVP before 5 September 2026", 1185, 820);
  drawCenteredText(context, "+260 972 411 995", 1225, 820);

  const link = document.createElement("a");
  link.download = `danny-filoza-invite-${guestName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")}.png`;
  link.href = canvas.toDataURL("image/png");
  link.click();
}

export function InviteResponseActionsV2({
  token,
  guestName,
  giftAmount,
  initialStatus,
  initialPhone = ""
}: InviteResponseActionsV2Props) {
  const [status, setStatus] = useState<InviteStatus>(initialStatus);
  const [phone, setPhone] = useState(initialPhone);
  const [loadingStatus, setLoadingStatus] = useState<InviteStatus | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  async function respond(nextStatus: "accepted" | "rejected") {
    setLoadingStatus(nextStatus);
    setErrorMessage("");

    try {
      const normalizedPhone = phone.trim();

      if (nextStatus === "accepted" && !normalizedPhone) {
        throw new Error("Please enter your WhatsApp / phone number.");
      }

      const response = await fetch(`/api/invites/${token}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          status: nextStatus,
          phone: normalizedPhone,
          whatsappNumber: normalizedPhone
        })
      });

      const result = (await response.json()) as {
        ok?: boolean;
        message?: string;
        invite?: {
          status: InviteStatus;
          phone?: string;
          whatsappNumber?: string;
        };
      };

      if (!response.ok || !result.ok || !result.invite) {
        throw new Error(result.message || "Failed to update invitation.");
      }

      setStatus(result.invite.status);
      setPhone(result.invite.whatsappNumber || result.invite.phone || phone);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Failed to update invitation."
      );
    } finally {
      setLoadingStatus(null);
    }
  }

  const hasResponded = status === "accepted" || status === "rejected";

  return (
    <div className="space-y-4">
      {!hasResponded || status === "accepted" ? (
        <label className="block space-y-2 text-left">
          <span className="text-sm font-medium text-ink/75">
            WhatsApp / Phone Number
          </span>
          <input
            type="tel"
            value={phone}
            disabled={status === "accepted"}
            onChange={(event) => setPhone(event.target.value)}
            className="w-full rounded-2xl border border-gold/20 bg-cream px-4 py-3 outline-none transition disabled:cursor-not-allowed disabled:bg-stone-100 focus:border-gold"
            placeholder="+260..."
          />
        </label>
      ) : null}

      {hasResponded ? (
        <p className="rounded-2xl border border-gold/20 bg-cream px-4 py-3 text-center text-sm font-medium text-ink/75">
          Response recorded: {status === "accepted" ? "Accepted" : "Rejected"}
        </p>
      ) : null}

      {status === "accepted" ? (
        <button
          type="button"
          onClick={() => downloadInviteCard(guestName, giftAmount)}
          className="inline-flex w-full items-center justify-center rounded-full bg-ink px-6 py-3 text-sm font-semibold text-cream transition hover:bg-ink/90"
        >
          Download Invitation Card
        </button>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            disabled={loadingStatus !== null}
            onClick={() => respond("accepted")}
            className="inline-flex items-center justify-center rounded-full bg-ink px-6 py-3 text-sm font-semibold text-cream transition hover:bg-ink/90 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loadingStatus === "accepted" ? "Accepting..." : "Accept Invitation"}
          </button>

          <button
            type="button"
            disabled={loadingStatus !== null}
            onClick={() => respond("rejected")}
            className="inline-flex items-center justify-center rounded-full border border-gold/30 bg-white/70 px-6 py-3 text-sm font-semibold text-ink transition hover:border-gold disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loadingStatus === "rejected" ? "Rejecting..." : "Reject Invitation"}
          </button>
        </div>
      )}

      {errorMessage ? (
        <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {errorMessage}
        </p>
      ) : null}
    </div>
  );
}
