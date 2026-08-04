import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { getAdminDb } from "@/lib/firebase-admin";
import {
  createInviteToken,
  normalizeGiftAmount,
  timestampToIso,
  toPublicInvite,
  type InviteRecord
} from "@/lib/invites";

type CreateInviteRequest = {
  name?: unknown;
  giftAmount?: unknown;
  password?: unknown;
};

function getSiteUrl(request: Request) {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL;

  if (configuredUrl && !configuredUrl.includes("localhost")) {
    return configuredUrl.replace(/\/$/, "");
  }

  return new URL(request.url).origin;
}

function validateAdminPassword(password: string | null) {
  const adminPassword = process.env.ADMIN_INVITE_PASSWORD;

  if (!adminPassword) {
    return {
      ok: false,
      status: 500,
      message: "ADMIN_INVITE_PASSWORD is not configured."
    };
  }

  if (password !== adminPassword) {
    return {
      ok: false,
      status: 401,
      message: "Invalid admin password."
    };
  }

  return {
    ok: true,
    status: 200,
    message: ""
  };
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Unknown server error.";
}

export async function GET(request: Request) {
  const auth = validateAdminPassword(request.headers.get("x-admin-password"));

  if (!auth.ok) {
    return NextResponse.json(
      {
        ok: false,
        message: auth.message
      },
      { status: auth.status }
    );
  }

  try {
    const snapshot = await getAdminDb().collection("invites").get();
    const siteUrl = getSiteUrl(request);
    const invites = snapshot.docs
      .map((inviteDoc) => {
        const invite = inviteDoc.data() as InviteRecord;

        return {
          id: inviteDoc.id,
          ...toPublicInvite(invite),
          inviteUrl: `${siteUrl}/invite/${invite.token}`,
          createdAt: timestampToIso(invite.createdAt),
          respondedAt: timestampToIso(invite.respondedAt),
          attendedAt: timestampToIso(invite.attendedAt)
        };
      })
      .sort((a, b) => {
        if (!a.createdAt) {
          return 1;
        }

        if (!b.createdAt) {
          return -1;
        }

        return b.createdAt.localeCompare(a.createdAt);
      });

    return NextResponse.json({
      ok: true,
      invites
    });
  } catch (error) {
    console.error("Failed to load invites", error);

    return NextResponse.json(
      {
        ok: false,
        message: `Failed to load invitations. ${getErrorMessage(error)}`
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  let body: CreateInviteRequest;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, message: "Invalid invite request." },
      { status: 400 }
    );
  }

  const auth = validateAdminPassword(
    typeof body.password === "string" ? body.password : null
  );

  if (!auth.ok) {
    return NextResponse.json(
      {
        ok: false,
        message: auth.message
      },
      { status: auth.status }
    );
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const giftAmount = normalizeGiftAmount(body.giftAmount);

  if (!name) {
    return NextResponse.json(
      { ok: false, message: "Guest name is required." },
      { status: 400 }
    );
  }

  if (giftAmount === null || giftAmount < 500) {
    return NextResponse.json(
      { ok: false, message: "Gift amount must be at least ZMW 500." },
      { status: 400 }
    );
  }

  const invite: InviteRecord = {
    name,
    giftAmount,
    token: createInviteToken(),
    status: "pending"
  };

  try {
    await getAdminDb().collection("invites").add({
      ...invite,
      createdAt: FieldValue.serverTimestamp()
    });
  } catch (error) {
    console.error("Failed to create invite", error);

    return NextResponse.json(
      {
        ok: false,
        message: `Failed to create invitation. ${getErrorMessage(error)}`
      },
      { status: 500 }
    );
  }

  const inviteUrl = `${getSiteUrl(request)}/invite/${invite.token}`;

  return NextResponse.json({
    ok: true,
    invite: toPublicInvite(invite),
    inviteUrl
  });
}
