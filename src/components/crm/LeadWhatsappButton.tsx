"use client";

import { useState, useTransition } from "react";
import { logWhatsappSent } from "@/app/actions/lead-update";

export default function LeadWhatsappButton({
  leadId,
  whatsapp,
  firstName,
  procedureLabel,
}: {
  leadId: string;
  whatsapp: string;
  firstName: string;
  procedureLabel: string | null;
}) {
  const [isPending, startTransition] = useTransition();
  const [sent, setSent] = useState(false);

  function handle() {
    // Monta a mensagem template
    const greeting =
      `Olá, ${firstName}! Sou da Vanity Face — Dr. Vitor S. Fernandes. ` +
      `Recebi seu cadastro` +
      (procedureLabel ? ` sobre ${procedureLabel.toLowerCase()}` : "") +
      `. Posso te enviar agora algumas informações para começarmos seu plano de tratamento?`;

    const digits = whatsapp.replace(/\D/g, "");
    const e164 = digits.startsWith("55") ? digits : `55${digits}`;
    const url = `https://wa.me/${e164}?text=${encodeURIComponent(greeting)}`;

    // Abre em nova aba ANTES de qualquer await (popup blocker)
    window.open(url, "_blank", "noopener");

    startTransition(async () => {
      await logWhatsappSent(leadId);
      setSent(true);
    });
  }

  return (
    <button
      type="button"
      onClick={handle}
      disabled={isPending}
      className="btn-primary w-full"
      title="Abre o WhatsApp com mensagem pronta"
    >
      {sent ? "Enviado · abrir novamente" : "Enviar WhatsApp"}
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347" />
      </svg>
    </button>
  );
}
