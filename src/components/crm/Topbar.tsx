import Link from "next/link";
import LogoutButton from "./LogoutButton";
import MobileNav from "./MobileNav";
import type { AccountMember } from "@/lib/supabase/types";

export default function Topbar({ member }: { member: AccountMember }) {
  return (
    <header className="h-16 border-b border-cream/10 flex items-center justify-between px-6 lg:px-10 bg-navy">
      <div className="flex items-center gap-3 min-w-0">
        <MobileNav isAdmin={member.role === "admin"} />
        <div className="min-w-0">
          <p className="text-[0.65rem] tracking-[0.24em] uppercase text-cream/45">
            {member.role === "admin" ? "Administrador" : "Atendente"}
          </p>
          <p className="font-serif text-cream text-lg leading-none mt-1 truncate">
            {member.name}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4 sm:gap-6">
        <span className="hidden md:block italic-soft text-sm text-cream/45">
          {member.email}
        </span>
        <Link
          href="/crm/senha"
          className="hidden sm:inline text-[0.65rem] tracking-[0.24em] uppercase text-cream/55 hover:text-gold transition-colors"
        >
          Trocar senha
        </Link>
        <LogoutButton />
      </div>
    </header>
  );
}
