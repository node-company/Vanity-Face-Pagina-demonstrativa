import { requireCurrentMember } from "@/lib/dal";
import ChangePasswordForm from "./ChangePasswordForm";

export const dynamic = "force-dynamic";

export default async function ChangePasswordPage() {
  const member = await requireCurrentMember();
  return (
    <div className="px-6 lg:px-10 py-10 lg:py-14 max-w-xl">
      <header className="mb-10">
        <p className="eyebrow text-gold/80 mb-3">Conta</p>
        <h1 className="font-display text-[clamp(1.75rem,3.5vw,2.5rem)] text-cream">
          Trocar senha
        </h1>
        <p className="mt-3 text-cream/55 text-sm">
          Logada como <span className="text-cream">{member.email}</span>.
        </p>
      </header>

      <ChangePasswordForm needsChange={member.must_change_password} />
    </div>
  );
}
