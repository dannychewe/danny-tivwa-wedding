"use client";

import { useState } from "react";
import { readJsonResponse } from "@/lib/http";
import type { InviteStatus, InviteType } from "@/lib/invites";

type InviteResponseActionsV2Props = {
  token: string;
  guestName: string;
  giftAmount: number;
  guestCount: number;
  inviteType: InviteType;
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

function getDisplayFont() {
  return (
    getComputedStyle(document.documentElement)
      .getPropertyValue("--font-playfair")
      .trim() || '"Playfair Display"'
  );
}

function drawCoupleNamesTitle(
  context: CanvasRenderingContext2D,
  y: number,
  displayFont: string
) {
  const nameFont = `86px ${displayFont}, "Playfair Display", Georgia, serif`;
  const parts = [
    { text: "Danny", color: "#1F1A17" },
    { text: " & ", color: "#C8A96A" },
    { text: "Filoza", color: "#1F1A17" }
  ];

  context.font = nameFont;
  context.textAlign = "left";

  const width = parts.reduce(
    (currentWidth, part) => currentWidth + context.measureText(part.text).width,
    0
  );
  let x = 540 - width / 2;

  parts.forEach((part) => {
    context.fillStyle = part.color;
    context.fillText(part.text, x, y);
    x += context.measureText(part.text).width;
  });

  context.textAlign = "center";
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

async function downloadInviteCard(
  guestName: string,
  giftAmount: number,
  guestCount: number,
  inviteType: InviteType
) {
  await document.fonts.ready;

  if (inviteType === "guestOfHonor") {
    downloadGuestOfHonorCard(guestName, guestCount);
    return;
  }

  const canvas = document.createElement("canvas");
  canvas.width = 1080;
  canvas.height = 1350;

  const context = canvas.getContext("2d");

  if (!context) {
    return;
  }

  const displayFont = getDisplayFont();
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

  drawCoupleNamesTitle(context, 292, displayFont);

  context.font = "25px Arial, sans-serif";
  context.fillStyle = "rgba(31, 26, 23, 0.65)";
  drawCenteredText(
    context,
    "Danny Chewe Mulyansalu & Filoza Tivwalenji Phiri",
    350,
    850
  );

  context.strokeStyle = "rgba(200, 169, 106, 0.65)";
  context.lineWidth = 2;
  context.beginPath();
  context.moveTo(250, 420);
  context.lineTo(830, 420);
  context.stroke();

  context.fillStyle = "rgba(31, 26, 23, 0.72)";
  context.font = "27px Arial, sans-serif";
  drawCenteredText(context, "The Mulyansalu and Phiri families request", 470, 840);
  drawCenteredText(context, "the honour of your presence", 510, 840);

  context.fillStyle = "#1F1A17";
  context.font = `58px ${displayFont}, "Playfair Display", Georgia, serif`;
  drawCenteredText(context, guestName, 600, 860);

  context.fillStyle = "rgba(31, 26, 23, 0.72)";
  context.font = "26px Arial, sans-serif";
  drawCenteredText(context, "at the wedding ceremony of their children", 665, 850);

  fillRoundRect(context, 360, 705, 360, 66, 33, "rgba(200, 169, 106, 0.14)");
  context.fillStyle = "#C8A96A";
  context.font = "600 23px Arial, sans-serif";
  drawCenteredText(context, "20 SEPTEMBER 2026", 747, 330);

  fillRoundRect(context, 150, 805, 360, 150, 24, "rgba(250, 249, 246, 0.92)");
  strokeRoundRect(context, 150, 805, 360, 150, 24, "rgba(200, 169, 106, 0.24)", 2);
  fillRoundRect(context, 570, 805, 360, 150, 24, "rgba(250, 249, 246, 0.92)");
  strokeRoundRect(context, 570, 805, 360, 150, 24, "rgba(200, 169, 106, 0.24)", 2);

  context.fillStyle = "#C8A96A";
  context.font = "600 20px Arial, sans-serif";
  context.fillText("MARRIAGE BLESSING", 330, 855, 300);
  context.fillText("LUNCH RECEPTION", 750, 855, 300);

  context.fillStyle = "#1F1A17";
  context.font = "26px Arial, sans-serif";
  context.fillText("Parkview SDA Church", 330, 895, 310);
  context.fillText("Daffodils Events", 750, 895, 310);

  context.fillStyle = "rgba(31, 26, 23, 0.58)";
  context.font = "22px Arial, sans-serif";
  context.fillText("08:30 Hrs", 330, 930, 300);
  context.fillText("13:30 Hrs", 750, 930, 300);

  context.fillStyle = "rgba(31, 26, 23, 0.72)";
  context.font = `italic 26px ${displayFont}, "Playfair Display", Georgia, serif`;
  drawCenteredText(
    context,
    "He who finds a wife finds what is good",
    1010,
    820
  );
  drawCenteredText(context, "and receives favor from the Lord.", 1050, 820);

  context.fillStyle = "#C8A96A";
  context.font = "600 20px Arial, sans-serif";
  drawCenteredText(context, "PROVERBS 18:22", 1090, 600);

  context.strokeStyle = "rgba(200, 169, 106, 0.35)";
  context.lineWidth = 2;
  context.beginPath();
  context.moveTo(255, 1130);
  context.lineTo(825, 1130);
  context.stroke();

  context.fillStyle = "rgba(31, 26, 23, 0.66)";
  context.font = "22px Arial, sans-serif";
  if (inviteType === "standard") {
    drawCenteredText(
      context,
      `Monetary gifts from ZMW ${giftAmount.toLocaleString()} are warmly appreciated.`,
      1175,
      850
    );
  } else {
    drawCenteredText(
      context,
      "Your honoured presence will be warmly appreciated.",
      1175,
      850
    );
  }
  drawCenteredText(
    context,
    `Seats reserved: ${guestCount} ${guestCount === 1 ? "guest" : "guests"}`,
    1215,
    820
  );
  drawCenteredText(context, "Kindly RSVP before 5 September 2026", 1255, 820);
  drawCenteredText(context, "+260 972 411 995", 1295, 820);

  const link = document.createElement("a");
  link.download = `danny-filoza-invite-${guestName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")}.png`;
  link.href = canvas.toDataURL("image/png");
  link.click();
}

function drawGuestOfHonorCardContent(
  context: CanvasRenderingContext2D,
  guestName: string,
  guestCount: number
) {
  const displayFont = getDisplayFont();
  const background = context.createLinearGradient(0, 0, 0, 1350);
  background.addColorStop(0, "#120d0a");
  background.addColorStop(0.52, "#241813");
  background.addColorStop(1, "#0f0b08");
  context.fillStyle = background;
  context.fillRect(0, 0, 1080, 1350);

  const glow = context.createRadialGradient(540, 190, 40, 540, 190, 600);
  glow.addColorStop(0, "rgba(200, 169, 106, 0.32)");
  glow.addColorStop(0.55, "rgba(200, 169, 106, 0.08)");
  glow.addColorStop(1, "rgba(200, 169, 106, 0)");
  context.fillStyle = glow;
  context.fillRect(0, 0, 1080, 1350);

  fillRoundRect(context, 70, 70, 940, 1210, 42, "rgba(255, 253, 248, 0.045)");
  strokeRoundRect(context, 70, 70, 940, 1210, 42, "rgba(200, 169, 106, 0.86)", 4);
  strokeRoundRect(context, 105, 105, 870, 1140, 32, "rgba(200, 169, 106, 0.28)", 2);

  context.textAlign = "center";
  context.fillStyle = "#C8A96A";
  context.font = "600 25px Arial, sans-serif";
  context.letterSpacing = "5px";
  drawCenteredText(context, "SPECIAL INVITATION", 165, 820);
  context.letterSpacing = "0px";

  context.fillStyle = "rgba(255, 253, 248, 0.75)";
  context.font = "25px Arial, sans-serif";
  drawCenteredText(context, "The Mulyansalu and Phiri families", 245, 850);
  drawCenteredText(context, "are honoured to request the presence of", 285, 850);

  context.fillStyle = "#FFFDF8";
  context.font = `62px ${displayFont}, "Playfair Display", Georgia, serif`;
  drawCenteredText(context, guestName, 385, 850);

  fillRoundRect(context, 270, 440, 540, 86, 43, "rgba(200, 169, 106, 0.16)");
  strokeRoundRect(context, 270, 440, 540, 86, 43, "rgba(200, 169, 106, 0.42)", 2);
  context.fillStyle = "#C8A96A";
  context.font = "600 27px Arial, sans-serif";
  context.letterSpacing = "4px";
  drawCenteredText(context, "GUEST OF HONOUR", 494, 640);
  context.letterSpacing = "0px";

  context.fillStyle = "rgba(255, 253, 248, 0.76)";
  context.font = "26px Arial, sans-serif";
  drawCenteredText(context, "at the wedding ceremony of their children", 590, 850);

  drawCoupleNamesTitle(context, 715, displayFont);

  context.fillStyle = "rgba(255, 253, 248, 0.62)";
  context.font = "24px Arial, sans-serif";
  drawCenteredText(
    context,
    "Danny Chewe Mulyansalu & Filoza Tivwalenji Phiri",
    770,
    850
  );

  context.strokeStyle = "rgba(200, 169, 106, 0.5)";
  context.lineWidth = 2;
  context.beginPath();
  context.moveTo(250, 825);
  context.lineTo(830, 825);
  context.stroke();

  fillRoundRect(context, 150, 875, 360, 150, 24, "rgba(255, 253, 248, 0.075)");
  strokeRoundRect(context, 150, 875, 360, 150, 24, "rgba(200, 169, 106, 0.32)", 2);
  fillRoundRect(context, 570, 875, 360, 150, 24, "rgba(255, 253, 248, 0.075)");
  strokeRoundRect(context, 570, 875, 360, 150, 24, "rgba(200, 169, 106, 0.32)", 2);

  context.fillStyle = "#C8A96A";
  context.font = "600 19px Arial, sans-serif";
  context.fillText("MARRIAGE BLESSING", 330, 925, 300);
  context.fillText("LUNCH RECEPTION", 750, 925, 300);

  context.fillStyle = "#FFFDF8";
  context.font = "25px Arial, sans-serif";
  context.fillText("Parkview SDA Church", 330, 965, 310);
  context.fillText("Daffodils Events", 750, 965, 310);

  context.fillStyle = "rgba(255, 253, 248, 0.62)";
  context.font = "22px Arial, sans-serif";
  context.fillText("08:30 Hrs", 330, 1000, 300);
  context.fillText("13:30 Hrs", 750, 1000, 300);

  context.fillStyle = "rgba(255, 253, 248, 0.72)";
  context.font = `italic 26px ${displayFont}, "Playfair Display", Georgia, serif`;
  drawCenteredText(context, "He who finds a wife finds what is good", 1090, 820);
  drawCenteredText(context, "and receives favor from the Lord.", 1130, 820);

  context.fillStyle = "#C8A96A";
  context.font = "600 19px Arial, sans-serif";
  drawCenteredText(context, "PROVERBS 18:22", 1170, 600);

  context.fillStyle = "rgba(255, 253, 248, 0.66)";
  context.font = "22px Arial, sans-serif";
  drawCenteredText(
    context,
    `Seats reserved: ${guestCount} ${guestCount === 1 ? "guest" : "guests"}`,
    1225,
    820
  );
  drawCenteredText(context, "Kindly RSVP before 5 September 2026", 1262, 820);
  drawCenteredText(context, "+260 972 411 995", 1298, 820);
}

function downloadGuestOfHonorCard(guestName: string, guestCount: number) {
  const canvas = document.createElement("canvas");
  canvas.width = 1080;
  canvas.height = 1350;

  const context = canvas.getContext("2d");

  if (!context) {
    return;
  }

  drawGuestOfHonorCardContent(context, guestName, guestCount);

  const link = document.createElement("a");
  link.download = `guest-of-honour-danny-filoza-${guestName
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
  guestCount,
  inviteType,
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

      const result = await readJsonResponse<{
        ok?: boolean;
        message?: string;
        invite?: {
          status: InviteStatus;
          phone?: string;
          whatsappNumber?: string;
        };
      }>(response);

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
          onClick={() =>
            downloadInviteCard(guestName, giftAmount, guestCount, inviteType)
          }
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
