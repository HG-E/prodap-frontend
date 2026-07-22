import Link from "next/link";

export function SiteHeader({ active }: { active?: "register" }) {
  return (
    <header className="border-b border-line">
      <nav className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-[6px] bg-seal-dark text-[13px] font-medium text-seal-tint">
            P
          </div>
          <span className="text-[15px] font-medium tracking-tight text-ink">ProDAP</span>
        </Link>
        <div className="flex items-center gap-6 text-[13px] text-ink-muted">
          <Link href="/#how-it-works" className="hover:text-ink">
            How it works
          </Link>
          <Link
            href="/register"
            className={active === "register" ? "font-medium text-ink" : "hover:text-ink"}
          >
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
  );
}
