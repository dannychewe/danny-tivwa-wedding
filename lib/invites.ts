import { Timestamp } from "firebase/firestore";

export type InviteStatus = "pending" | "accepted" | "rejected";

export type InviteRecord = {
  name: string;
  giftAmount: number;
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

export function toPublicInvite(invite: InviteRecord): PublicInvite {
  return {
    name: invite.name,
    giftAmount: invite.giftAmount,
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
