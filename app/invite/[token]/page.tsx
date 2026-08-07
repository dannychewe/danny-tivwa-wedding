import { notFound } from "next/navigation";
import Image from "next/image";
import { InviteResponseActionsV2 } from "@/components/invite-response-actions-v2";
import { getAdminDb } from "@/lib/firebase-admin";
import { normalizeInviteType, type InviteRecord } from "@/lib/invites";

export const dynamic = "force-dynamic";

type InvitePageProps = {
  params: {
    token: string;
  };
};

const dressCodePalette = [
  { name: "Chocolate", color: "#4A2F24" },
  { name: "Coffee", color: "#6B4A35" },
  { name: "Taupe", color: "#9A806A" },
  { name: "Beige", color: "#E6D6BD" },
  { name: "Champagne", color: "#EFE2C8" },
  { name: "Sand", color: "#D8C4A8" },
  { name: "Camel", color: "#C19A6B" },
  { name: "Mocha", color: "#8B6F5A" },
  { name: "Black", color: "#111111" }
];

function SeatText({ count }: { count: number }) {
  return (
    <>
      {count} {count === 1 ? "guest" : "guests"}
    </>
  );
}

async function getInvite(token: string) {
  const snapshot = await getAdminDb()
    .collection("invites")
    .where("token", "==", token)
    .limit(1)
    .get();
  const inviteDoc = snapshot.docs[0];

  if (!inviteDoc) {
    return null;
  }

  return inviteDoc.data() as InviteRecord;
}

export default async function InvitePage({ params }: InvitePageProps) {
  const invite = await getInvite(params.token);

  if (!invite) {
    notFound();
  }

  const seatCount = invite.guestCount ?? 1;
  const inviteType = normalizeInviteType(invite.inviteType);

  if (inviteType === "guestOfHonor") {
    return (
      <main className="min-h-screen bg-[#17110d] px-4 py-6 text-cream sm:py-12">
        <section className="mx-auto max-w-5xl">
          <div className="overflow-hidden rounded-[2rem] border border-gold/40 bg-[#241914] shadow-[0_30px_90px_rgba(0,0,0,0.35)]">
            <div className="grid lg:grid-cols-[0.95fr_1.05fr]">
              <div className="relative min-h-[30rem] overflow-hidden border-b border-gold/25 lg:border-b-0 lg:border-r">
                <Image
                  src="/gallery-1.jpg"
                  alt="Danny and Filoza portrait"
                  fill
                  priority
                  className="object-cover object-[center_28%]"
                  sizes="(max-width: 1024px) 100vw, 460px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#17110d] via-[#17110d]/30 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                  <p className="text-xs font-semibold uppercase tracking-[0.35em] text-gold">
                    Guest of Honour
                  </p>
                  <h1 className="couple-title mt-4 text-5xl leading-none text-cream sm:text-7xl">
                    Danny
                    <span className="mx-2 inline-block text-gold sm:mx-3">
                      &
                    </span>
                    Filoza
                  </h1>
                  <p className="mt-4 max-w-md text-xs font-medium uppercase leading-6 tracking-[0.14em] text-cream/70 sm:text-sm">
                    Danny Chewe Mulyansalu & Filoza Tivwalenji Phiri
                  </p>
                </div>
              </div>

              <div className="p-6 text-center sm:p-10 lg:p-12">
                <div className="mx-auto max-w-xl">
                  <p className="text-xs font-semibold uppercase tracking-[0.35em] text-gold">
                    Special Invitation
                  </p>
                  <p className="mx-auto mt-8 max-w-lg text-base leading-8 text-cream/78">
                    With deep respect and joyful hearts, the Mulyansalu and
                    Phiri families are honoured to request the presence of
                  </p>
                  <h2 className="couple-title mt-5 text-4xl leading-tight text-cream sm:text-6xl">
                    {invite.name}
                  </h2>
                  <p className="mx-auto mt-5 max-w-lg text-base leading-8 text-cream/78">
                    as Guest of Honour at the wedding ceremony of their children,
                    to be held in Lusaka on Sunday, 20 September 2026.
                  </p>

                  <div className="my-8 h-px bg-gradient-to-r from-transparent via-gold/80 to-transparent" />

                  <div className="grid gap-4 text-left sm:grid-cols-2">
                    <div className="rounded-2xl border border-gold/25 bg-cream/8 p-5">
                      <p className="text-xs uppercase tracking-[0.25em] text-gold">
                        Marriage Blessing
                      </p>
                      <p className="mt-3 text-sm font-medium text-cream">
                        Parkview SDA Church
                      </p>
                      <p className="mt-1 text-sm text-cream/60">08:30 Hrs</p>
                    </div>
                    <div className="rounded-2xl border border-gold/25 bg-cream/8 p-5">
                      <p className="text-xs uppercase tracking-[0.25em] text-gold">
                        Lunch Reception
                      </p>
                      <p className="mt-3 text-sm font-medium text-cream">
                        Daffodils Events
                      </p>
                      <p className="mt-1 text-sm text-cream/60">13:30 Hrs</p>
                    </div>
                  </div>

                  <div className="mt-5 rounded-2xl border border-gold/25 bg-gold/10 p-5">
                    <p className="mx-auto max-w-lg text-base italic leading-8 text-cream/80">
                      "He who finds a wife finds what is good and receives favor
                      from the Lord."
                    </p>
                    <p className="mt-3 text-xs font-medium uppercase tracking-[0.25em] text-gold">
                      Proverbs 18:22
                    </p>
                  </div>

                  <div className="mt-5 rounded-2xl border border-gold/25 bg-cream/8 p-5 text-left">
                      <p className="text-xs uppercase tracking-[0.25em] text-gold">
                        Seats Reserved
                      </p>
                      <p className="mt-2 text-sm font-medium text-cream">
                        <SeatText count={seatCount} />
                      </p>
                  </div>

                  <div className="mt-5 rounded-2xl border border-gold/25 bg-cream/8 p-5 text-left">
                    <p className="text-xs uppercase tracking-[0.25em] text-gold">
                      RSVP
                    </p>
                    <p className="mt-2 text-sm leading-6 text-cream/70">
                      Kindly respond before 5 September 2026. For any inquiries,
                      please contact +260 972 411 995.
                    </p>
                  </div>

                  <div className="mt-6 rounded-2xl bg-cream p-4 text-ink sm:p-5">
                    <InviteResponseActionsV2
                      token={params.token}
                      guestName={invite.name}
                      giftAmount={invite.giftAmount}
                      guestCount={seatCount}
                      inviteType={inviteType}
                      initialStatus={invite.status}
                      initialPhone={invite.whatsappNumber || invite.phone}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-heroGlow py-6 sm:py-14">
      <section className="section-shell">
        <div className="mx-auto max-w-2xl">
          <div className="card-surface relative overflow-hidden p-5 text-center sm:p-10">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />

            <p className="eyebrow">Wedding Invitation</p>
            <h1 className="couple-title mt-5 text-[2.9rem] leading-none text-ink sm:mt-6 sm:text-6xl">
              Danny
              <span className="mx-2 inline-block text-gold sm:mx-3">&</span>
              Filoza
            </h1>
            <p className="mx-auto mt-4 max-w-sm text-xs font-medium uppercase leading-6 tracking-[0.12em] text-ink/55 sm:max-w-none sm:text-sm sm:tracking-[0.18em]">
              Danny Chewe Mulyansalu & Filoza Tivwalenji Phiri
            </p>

            <div className="mx-auto mt-7 max-w-sm overflow-hidden rounded-[1.5rem] border border-gold/15 bg-cream shadow-soft">
              <Image
                src="/gallery-1.jpg"
                alt="Danny and Filoza portrait"
                width={960}
                height={1280}
                priority
                className="aspect-[4/5] w-full object-cover object-[center_28%]"
                sizes="(max-width: 640px) 88vw, 384px"
              />
            </div>

            <div className="gold-divider my-8" />

            <p className="mx-auto max-w-xl text-base leading-8 text-ink/72">
              With joyful hearts, the Mulyansalu and Phiri families request the
              honour of your presence
            </p>
            <h2 className="mt-3 text-3xl leading-tight text-ink sm:text-5xl">
              {invite.name}
            </h2>

            <p className="mx-auto mt-6 max-w-xl text-base leading-8 text-ink/72">
              at the wedding ceremony of their children, to be held in Lusaka on
              Sunday, 20 September 2026.
            </p>

            <div className="my-6 grid gap-5 rounded-3xl border border-gold/15 bg-cream p-5 text-left sm:my-8 sm:grid-cols-2">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-gold">
                  Marriage Blessing
                </p>
                <p className="mt-2 text-sm font-medium text-ink">
                  Parkview SDA Church
                </p>
                <p className="mt-1 text-sm text-ink/60">08:30 Hrs</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-gold">
                  Lunch Reception
                </p>
                <p className="mt-2 text-sm font-medium text-ink">
                  Daffodils Events
                </p>
                <p className="mt-1 text-sm text-ink/60">13:30 Hrs</p>
              </div>
            </div>

            <div className="mb-6 rounded-3xl border border-gold/15 bg-white/60 p-5">
              <p className="mx-auto max-w-lg text-base italic leading-8 text-ink/72">
                "He who finds a wife finds what is good and receives favor from
                the Lord."
              </p>
              <p className="mt-3 text-xs font-medium uppercase tracking-[0.25em] text-gold">
                Proverbs 18:22
              </p>
            </div>

            <div className="mb-6 rounded-3xl border border-gold/15 bg-cream p-5 text-left">
              <p className="text-xs uppercase tracking-[0.25em] text-gold">
                Monetary Gift
              </p>
              <p className="mt-2 text-sm font-medium text-ink">
                ZMW {invite.giftAmount.toLocaleString()} minimum
              </p>
              <p className="mt-1 text-sm leading-6 text-ink/60">
                The families are gratefully accepting gifts in monetary form. A
                gift from this amount will be warmly appreciated as a wedding
                blessing.
              </p>
            </div>

            <div className="mb-6 rounded-3xl border border-gold/15 bg-white/60 p-5 text-left">
              <p className="text-xs uppercase tracking-[0.25em] text-gold">
                Seats Reserved
              </p>
              <p className="mt-2 text-sm font-medium text-ink">
                {seatCount} {seatCount === 1 ? "guest" : "guests"}
              </p>
              <p className="mt-1 text-sm leading-6 text-ink/60">
                This invitation has been reserved for the number of guests shown
                above.
              </p>
            </div>

            <div className="mb-6 rounded-3xl border border-gold/15 bg-white/60 p-5 text-left">
              <p className="text-xs uppercase tracking-[0.25em] text-gold">
                Dress Code
              </p>
              <p className="mt-2 text-sm leading-6 text-ink/70">
                Earth tones, shades of brown, beige, sand, taupe, and black.
                Kindly avoid white garments, as white is reserved for the bride.
              </p>
              <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-9">
                {dressCodePalette.map((swatch) => (
                  <div key={swatch.name} className="min-w-0">
                    <div
                      className="h-8 rounded-full border border-gold/15"
                      style={{ backgroundColor: swatch.color }}
                    />
                    <p className="mt-1 truncate text-center text-[10px] font-medium text-ink/55">
                      {swatch.name}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-6 rounded-3xl border border-gold/15 bg-white/60 p-5 text-left">
              <p className="text-xs uppercase tracking-[0.25em] text-gold">
                RSVP
              </p>
              <p className="mt-2 text-sm leading-6 text-ink/70">
                Kindly respond before 5 September 2026. For any inquiries,
                please contact +260 972 411 995.
              </p>
            </div>

            <InviteResponseActionsV2
              token={params.token}
              guestName={invite.name}
              giftAmount={invite.giftAmount}
              guestCount={seatCount}
              inviteType={inviteType}
              initialStatus={invite.status}
              initialPhone={invite.whatsappNumber || invite.phone}
            />
          </div>

          <p className="mt-6 text-center text-sm text-ink/55">
            Thank you for being part of this new beginning.
          </p>
        </div>
      </section>
    </main>
  );
}
