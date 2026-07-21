import Link from "next/link";
import { getRegisterStats } from "@/lib/prodap";

const steps = [
  {
    n: "1",
    title: "Search a project",
    body: "By department, cost, or current stage.",
  },
  {
    n: "2",
    title: "See its full history",
    body: "Every stage, every change, permanently on record.",
  },
  {
    n: "3",
    title: "Flag what looks wrong",
    body: "Costs that don't add up get surfaced, not buried.",
  },
];

export default async function Home() {
  const registerStats = await getRegisterStats();

  const stats = [
    {
      value: registerStats.totalValueLabel,
      label: "tracked in this institution's contracts",
    },
    {
      value: String(registerStats.totalProjects),
      label: "projects with full audit history",
    },
    { value: "0", label: "status changes ever deleted" },
  ];

  return (
    <main className="flex-1">
      {/* NAV */}
      <header className="border-b border-line">
        <nav className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-[6px] bg-seal-dark text-[13px] font-medium text-seal-tint">
              P
            </div>
            <span className="text-[15px] font-medium tracking-tight">ProDAP</span>
          </div>
          <div className="flex items-center gap-6 text-[13px] text-ink-muted">
            <Link href="#how-it-works" className="hover:text-ink">
              How it works
            </Link>
            <Link href="#register" className="hover:text-ink">
              Register
            </Link>
            <Link
              href="/staff/login"
              className="rounded-[6px] bg-ink px-3.5 py-1.5 font-medium text-paper hover:bg-seal-dark"
            >
              Staff login
            </Link>
          </div>
        </nav>
      </header>

      {/* HERO */}
      <section className="relative mx-auto max-w-3xl px-6 pb-14 pt-16 text-center sm:pt-20">
        <div className="mb-6 inline-flex items-center gap-1.5 rounded-full bg-seal-tint px-3 py-1 text-[12px] font-medium text-seal">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M12 3l7 3v5c0 4.5-3 8.2-7 9.5-4-1.3-7-5-7-9.5V6l7-3z"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
          </svg>
          Public Procurement Portal
        </div>

        <h1 className="relative mx-auto max-w-[19ch] font-display text-[2.5rem] font-normal leading-[1.12] tracking-tight text-ink sm:text-[3.1rem]">
          Every contract this institution has ever awarded.{" "}
          <span className="italic">In the open.</span>
        </h1>

        {/* signature stamp element */}
        <div
          aria-hidden="true"
          className="stamp-enter pointer-events-none absolute right-2 top-2 hidden -rotate-[8deg] items-center justify-center rounded-full border-[1.5px] border-dashed border-seal/70 font-ledger text-[10px] font-medium uppercase tracking-[0.14em] text-seal sm:flex"
          style={{ width: 108, height: 108 }}
        >
          <span className="text-center leading-[1.5]">
            Verified
            <br />
            record
            <br />
            &middot; immutable &middot;
          </span>
        </div>

        <p className="mx-auto mt-6 max-w-[44ch] text-[16px] leading-relaxed text-ink-muted">
          From the first budget line to the final payment — see exactly what
          was bought, who approved it, and where the money went. Updated the
          moment it happens.
        </p>

        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="#register"
            className="rounded-[8px] bg-seal-dark px-6 py-3 text-[14px] font-medium text-seal-tint hover:bg-ink"
          >
            Search the register &rarr;
          </Link>
          <Link
            href="#how-it-works"
            className="rounded-[8px] border border-line px-6 py-3 text-[14px] font-medium text-ink hover:border-ink"
          >
            See how it works
          </Link>
        </div>
        <p className="mt-3 text-[12px] text-ink-faint">
          Open to the public. Always current.
        </p>
      </section>

      {/* LEDGER STAT BAND */}
      <section className="mx-auto max-w-3xl px-6">
        <div className="grid grid-cols-3 gap-px overflow-hidden rounded-[14px] bg-line">
          {stats.map((s) => (
            <div key={s.label} className="bg-seal-dark px-4 py-6 text-seal-tint">
              <div className="font-ledger font-tabular text-[1.6rem] font-medium sm:text-[1.8rem]">
                {s.value}
              </div>
              <div className="mt-1 text-[12px] leading-snug opacity-75">
                {s.label}
              </div>
            </div>
          ))}
        </div>
        {!registerStats.isLive && (
          <p className="mt-2 text-center text-[11px] text-ink-faint">
            Live figures are warming up — showing recent numbers.
          </p>
        )}
      </section>

      <div className="perforation mx-auto mt-16 max-w-3xl" />

      {/* AGITATION */}
      <section className="mx-auto max-w-2xl px-6 py-14 text-center">
        <h2 className="font-display text-[1.6rem] font-normal italic text-ink">
          Silence is where procurement fraud lives.
        </h2>
        <p className="mx-auto mt-4 max-w-[54ch] text-[15px] leading-relaxed text-ink-muted">
          Contracts get awarded quietly. Costs balloon without explanation. By
          the time anyone asks a question, the money is gone. This portal
          closes that gap — every plan, bid, award, and payment this
          institution makes is logged the moment it happens, and visible the
          moment it&apos;s logged.
        </p>
      </section>

      <div className="perforation mx-auto max-w-3xl" />

      {/* SEQUENCE */}
      <section id="how-it-works" className="mx-auto max-w-3xl px-6 py-14">
        <h2 className="mb-10 text-center font-display text-[1.4rem] font-normal text-ink">
          Three clicks to the truth
        </h2>
        <ol className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          {steps.map((step) => (
            <li key={step.n} className="text-center">
              <div className="mx-auto mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-seal-tint font-ledger text-[13px] font-medium text-seal">
                {step.n}
              </div>
              <p className="text-[14px] font-medium text-ink">{step.title}</p>
              <p className="mt-1.5 text-[13px] leading-relaxed text-ink-muted">
                {step.body}
              </p>
            </li>
          ))}
        </ol>
      </section>

      {/* CREDIBILITY STRIP */}
      <section className="border-y border-line py-5 text-center">
        <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-ink-faint">
          Built to the standard of
        </p>
        <p className="mt-1 text-[14px] font-medium text-ink">
          Public Procurement Act 2007 &middot; Open Contracting Data Standard
          &middot; NOCOPO-aligned
        </p>
      </section>

      {/* FINAL CTA */}
      <section className="mx-auto max-w-3xl px-6 py-16">
        <div className="rounded-[16px] bg-seal-dark px-8 py-10 text-center text-seal-tint">
          <h2 className="font-display text-[1.5rem] font-normal italic">
            This is public money. This is the record.
          </h2>
          <p className="mx-auto mt-3 max-w-[38ch] text-[14px] opacity-80">
            Checking a project takes less time than reading this sentence
            twice.
          </p>
          <Link
            href="#register"
            id="register"
            className="mt-6 inline-block rounded-[8px] bg-seal-tint px-6 py-3 text-[14px] font-medium text-seal-dark hover:bg-white"
          >
            Search the register now &rarr;
          </Link>
        </div>
      </section>

      <footer className="border-t border-line py-6 text-center text-[12px] text-ink-faint">
        ProDAP &mdash; public procurement transparency, built on the Public
        Procurement Act 2007.
      </footer>
    </main>
  );
}
