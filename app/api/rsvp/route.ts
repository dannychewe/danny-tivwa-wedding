import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { getAdminDb } from "@/lib/firebase-admin";

type RSVPRequest = {
  name?: unknown;
  phone?: unknown;
  attending?: unknown;
  guestCount?: unknown;
  message?: unknown;
};

function readText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
  let body: RSVPRequest;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, message: "Invalid RSVP request." },
      { status: 400 }
    );
  }

  const name = readText(body.name);
  const phone = readText(body.phone);
  const attending = body.attending === "No" ? "No" : "Yes";
  const message = readText(body.message);
  const guestCount =
    attending === "No" ? 0 : Number.parseInt(String(body.guestCount), 10);

  if (!name || !phone) {
    return NextResponse.json(
      { ok: false, message: "Name and phone are required." },
      { status: 400 }
    );
  }

  if (
    attending === "Yes" &&
    (!Number.isInteger(guestCount) || guestCount < 1 || guestCount > 8)
  ) {
    return NextResponse.json(
      { ok: false, message: "Guest count must be between 1 and 8." },
      { status: 400 }
    );
  }

  try {
    await getAdminDb().collection("rsvps").add({
      name,
      phone,
      attending,
      guestCount,
      message,
      createdAt: FieldValue.serverTimestamp()
    });

    return NextResponse.json({
      ok: true,
      message: "Your RSVP has been received. We cannot wait to celebrate with you."
    });
  } catch (error) {
    console.error("Failed to submit RSVP", error);

    return NextResponse.json(
      {
        ok: false,
        message:
          "We could not submit your RSVP right now. Please try again after checking your Firebase configuration."
      },
      { status: 500 }
    );
  }
}
