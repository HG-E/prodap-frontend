import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { RegisterExplorer } from "@/components/register-explorer";
import { getRegisterRecords } from "@/lib/prodap";

export const metadata: Metadata = {
  title: "Register — ProDAP",
  description:
    "Search every procurement project this institution has logged, filterable by department, cost, and stage.",
};

export default async function RegisterPage() {
  const { records, isLive } = await getRegisterRecords();

  return (
    <main className="flex-1">
      <SiteHeader active="register" />

      <section className="mx-auto max-w-3xl px-6 pb-8 pt-14 text-center sm:pt-16">
        <h1 className="font-display text-[2rem] font-normal leading-[1.15] tracking-tight text-ink sm:text-[2.4rem]">
          The register
        </h1>
        <p className="mx-auto mt-3 max-w-[52ch] text-[15px] leading-relaxed text-ink-muted">
          Every project this institution has logged, in one searchable list. Filter by
          department, cost, or stage to find what you&apos;re looking for.
        </p>
      </section>

      <div className="perforation mx-auto max-w-3xl" />

      <section className="mx-auto max-w-3xl px-6 py-10">
        {isLive ? (
          <RegisterExplorer records={records} />
        ) : (
          <div className="rounded-[14px] border border-line bg-white px-6 py-10 text-center">
            <p className="text-[14px] font-medium text-ink">The live register is warming up.</p>
            <p className="mt-1 text-[13px] text-ink-muted">
              Render&apos;s free-tier backend can take up to a minute to wake from sleep.
              Refresh this page in a moment.
            </p>
          </div>
        )}
      </section>

      <footer className="border-t border-line py-6 text-center text-[12px] text-ink-faint">
        ProDAP &mdash; public procurement transparency, built on the Public Procurement Act 2007.
      </footer>
    </main>
  );
}
