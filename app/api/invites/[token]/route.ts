import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { getAdminDb } from "@/lib/firebase-admin";
import {
  normalizeGiftAmount,
  toPublicInvite,
  type InviteRecord,
  type InviteStatus
} from "@/lib/invites";

type RouteContext = {
  params: {
    token: string;
  };
};

type RespondRequest = {
  status?: unknown;
  name?: unknown;
  giftAmount?: unknown;
  phone?: unknown;
  whatsappNumber?: unknown;
  attended?: unknown;
};

function validateAdminPassword(password: string | null) {
  const adminPassword = process.env.ADMIN_INVITE_PASSWORD;

  return Boolean(adminPassword && password === adminPassword);
}

function readPhone(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Unknown server error.";
}

function firestoreErrorResponse(action: string, error: unknown) {
  console.error(`Failed to ${action}`, error);

  return NextResponse.json(
    {
      ok: false,
      message: `Failed to ${action}. ${getErrorMessage(error)}`
    },
    { status: 500 }
  );
}

async function findInviteByToken(token: string) {
  const snapshot = await getAdminDb()
    .collection("invites")
    .where("token", "==", token)
    .limit(1)
    .get();
  const inviteDoc = snapshot.docs[0];

  if (!inviteDoc) {
    return null;
  }

  return {
    ref: inviteDoc.ref,
    invite: inviteDoc.data() as InviteRecord
  };
}

export async function GET(_request: Request, { params }: RouteContext) {
  let result: Awaited<ReturnType<typeof findInviteByToken>>;

  try {
    result = await findInviteByToken(params.token);
  } catch (error) {
    return firestoreErrorResponse("load invitation", error);
  }

  if (!result) {
    return NextResponse.json(
      { ok: false, message: "Invite was not found." },
      { status: 404 }
    );
  }

  return NextResponse.json({
    ok: true,
    invite: toPublicInvite(result.invite)
  });
}

export async function PATCH(request: Request, { params }: RouteContext) {
  let body: RespondRequest;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, message: "Invalid response request." },
      { status: 400 }
    );
  }

  const isAdminRequest = validateAdminPassword(
    request.headers.get("x-admin-password")
  );

  if (
    body.status !== undefined &&
    body.status !== "pending" &&
    body.status !== "accepted" &&
    body.status !== "rejected"
  ) {
    return NextResponse.json(
      { ok: false, message: "Invite status is invalid." },
      { status: 400 }
    );
  }

  if (!isAdminRequest && body.status !== "accepted" && body.status !== "rejected") {
    return NextResponse.json(
      { ok: false, message: "Invite response must be accepted or rejected." },
      { status: 400 }
    );
  }

  let result: Awaited<ReturnType<typeof findInviteByToken>>;

  try {
    result = await findInviteByToken(params.token);
  } catch (error) {
    return firestoreErrorResponse("load invitation", error);
  }

  if (!result) {
    return NextResponse.json(
      { ok: false, message: "Invite was not found." },
      { status: 404 }
    );
  }

  if (isAdminRequest) {
    const updates: Record<string, unknown> = {};

    if (typeof body.name === "string") {
      const name = body.name.trim();

      if (!name) {
        return NextResponse.json(
          { ok: false, message: "Guest name is required." },
          { status: 400 }
        );
      }

      updates.name = name;
    }

    if (body.phone !== undefined || body.whatsappNumber !== undefined) {
      const phone = readPhone(body.whatsappNumber || body.phone);

      if (!phone) {
        updates.phone = FieldValue.delete();
        updates.whatsappNumber = FieldValue.delete();
      } else {
        updates.phone = phone;
        updates.whatsappNumber = phone;
      }
    }

    if (body.attended !== undefined) {
      const attended = body.attended === true;
      updates.attended = attended;
      updates.attendedAt = attended
        ? FieldValue.serverTimestamp()
        : FieldValue.delete();
    }

    if (body.giftAmount !== undefined) {
      const giftAmount = normalizeGiftAmount(body.giftAmount);

      if (giftAmount === null || giftAmount < 500) {
        return NextResponse.json(
          { ok: false, message: "Gift amount must be at least ZMW 500." },
          { status: 400 }
        );
      }

      updates.giftAmount = giftAmount;
    }

    if (body.status) {
      updates.status = body.status;
      updates.respondedAt =
        body.status === "pending"
          ? FieldValue.delete()
          : FieldValue.serverTimestamp();
    }

    try {
      await result.ref.update(updates);
    } catch (error) {
      return firestoreErrorResponse("update invitation", error);
    }

    return NextResponse.json({
      ok: true,
      invite: toPublicInvite({
        ...result.invite,
        name: (updates.name as string | undefined) ?? result.invite.name,
        giftAmount:
          (updates.giftAmount as number | undefined) ?? result.invite.giftAmount,
        status: (updates.status as InviteStatus | undefined) ?? result.invite.status,
        phone: (updates.phone as string | undefined) ?? result.invite.phone,
        whatsappNumber:
          (updates.whatsappNumber as string | undefined) ??
          result.invite.whatsappNumber,
        attended:
          (updates.attended as boolean | undefined) ??
          (result.invite.attended ?? false)
      })
    });
  }

  const status: "accepted" | "rejected" =
    body.status === "accepted" ? "accepted" : "rejected";
  const phone = readPhone(body.whatsappNumber || body.phone);

  if (status === "accepted" && !phone) {
    return NextResponse.json(
      { ok: false, message: "Please enter your WhatsApp / phone number." },
      { status: 400 }
    );
  }

  try {
    await result.ref.update({
      status,
      ...(status === "accepted"
        ? {
            phone,
            whatsappNumber: phone
          }
        : {}),
      respondedAt: FieldValue.serverTimestamp()
    });
  } catch (error) {
    return firestoreErrorResponse("submit invitation response", error);
  }

  return NextResponse.json({
    ok: true,
    invite: toPublicInvite({
      ...result.invite,
      status,
      ...(status === "accepted"
        ? {
            phone,
            whatsappNumber: phone
          }
        : {})
    })
  });
}

export async function DELETE(request: Request, { params }: RouteContext) {
  if (!validateAdminPassword(request.headers.get("x-admin-password"))) {
    return NextResponse.json(
      { ok: false, message: "Invalid admin password." },
      { status: 401 }
    );
  }

  let result: Awaited<ReturnType<typeof findInviteByToken>>;

  try {
    result = await findInviteByToken(params.token);
  } catch (error) {
    return firestoreErrorResponse("load invitation", error);
  }

  if (!result) {
    return NextResponse.json(
      { ok: false, message: "Invite was not found." },
      { status: 404 }
    );
  }

  try {
    await result.ref.delete();
  } catch (error) {
    return firestoreErrorResponse("delete invitation", error);
  }

  return NextResponse.json({
    ok: true
  });
}
