import type { ReactNode } from "react";
import Sidebar from "@/components/crm/Sidebar";
import Topbar from "@/components/crm/Topbar";
import { requireCurrentMember } from "@/lib/dal";

export const metadata = {
  title: "CRM — Vanity Face",
};

// Toda rota dentro de (authed) exige login + member ativo.
export default async function AuthedCrmLayout({ children }: { children: ReactNode }) {
  const member = await requireCurrentMember();

  return (
    <div className="min-h-[100svh] flex bg-navy text-cream">
      <Sidebar isAdmin={member.role === "admin"} />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar member={member} />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
