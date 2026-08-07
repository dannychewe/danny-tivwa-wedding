import { Timestamp } from "firebase/firestore";

export type InviteStatus = "pending" | "accepted" | "rejected";
export type InviteType = "standard" | "guestOfHonor";

export type InviteRecord = {
  name: string;
  giftAmount: number;
  guestCount?: number;
  inviteType?: InviteType;
  token: string;
  status: InviteStatus;
  phone?: string;
  whatsappNumber?: string;
  attended?: boolean;
  createdAt?: Timestamp;
  respondedAt?: Timestamp;
  attendedAt?: Timestamp;
};

export type PublicInvite = {
  name: string;
  giftAmount: number;
  guestCount: number;
  inviteType: InviteType;
  token: string;
  status: InviteStatus;
  phone?: string;
  whatsappNumber?: string;
  attended: boolean;
};

export type AdminInvite = PublicInvite & {
  id: string;
  inviteUrl: string;
  createdAt: string | null;
  respondedAt: string | null;
  attendedAt: string | null;
};

export function createInviteToken() {
  return crypto.randomUUID().replace(/-/g, "");
}

export function normalizeGiftAmount(value: unknown) {
  const amount = Number(value);

  if (!Number.isFinite(amount)) {
    return null;
  }

  return Math.round(amount);
}

export function normalizeGuestCount(value: unknown) {
  const count = Number(value);

  if (!Number.isFinite(count)) {
    return null;
  }

  return Math.max(1, Math.round(count));
}

export function normalizeInviteType(value: unknown): InviteType {
  return value === "guestOfHonor" ? "guestOfHonor" : "standard";
}

export function toPublicInvite(invite: InviteRecord): PublicInvite {
  return {
    name: invite.name,
    giftAmount: invite.giftAmount,
    guestCount: normalizeGuestCount(invite.guestCount) ?? 1,
    inviteType: normalizeInviteType(invite.inviteType),
    token: invite.token,
    status: invite.status,
    phone: invite.phone,
    whatsappNumber: invite.whatsappNumber,
    attended: invite.attended ?? false
  };
}

export function timestampToIso(timestamp?: Timestamp) {
  return timestamp ? timestamp.toDate().toISOString() : null;
}
