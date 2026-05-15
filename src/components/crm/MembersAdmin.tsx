"use client";

import { useState, useTransition } from "react";
import { useActionState } from "react";
import {
  inviteMember,
  resetMemberPassword,
  setMemberActive,
  updateMember,
  deleteMember,
  type InviteState,
} from "@/app/actions/members";
import type { AccountMember } from "@/lib/supabase/types";
import { cn } from "@/lib/cn";

const initial: InviteState = { status: "idle" };

export default function MembersAdmin({
  members,
  currentMemberId,
}: {
  members: AccountMember[];
  currentMemberId: string;
}) {
  const [invitingOpen, setInvitingOpen] = useState(false);
  const [resetTarget, setResetTarget] = useState<AccountMember | null>(null);
  const [editTarget, setEditTarget] = useState<AccountMember | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AccountMember | null>(null);
  const [, startTransition] = useTransition();
  const [actionError, setActionError] = useState<string | null>(null);

  function toggle(member: AccountMember) {
    setActionError(null);
    startTransition(async () => {
      const res = await setMemberActive(member.id, !member.is_active);
      if (!res.ok) setActionError(res.message ?? "Falhou.");
    });
  }

  return (
    <>
      {actionError && (
        <p className="mb-5 text-sm text-red-300/90 italic-soft">{actionError}</p>
      )}
      <div className="border border-cream/10 mb-8">
        <div className="bg-navy-light/30 px-5 py-3 flex items-center justify-between">
          <h2 className="eyebrow text-cream/70">Equipe</h2>
          <button
            type="button"
            onClick={() => setInvitingOpen(true)}
            className="btn-primary text-[0.6rem] px-4 py-2"
          >
            + Adicionar atendente
          </button>
        </div>
        <table className="w-full text-left">
          <thead>
            <tr className="text-[0.6rem] tracking-[0.22em] uppercase text-cream/45 border-b border-cream/10">
              <th className="px-5 py-3 font-normal">Nome</th>
              <th className="py-3 pr-4 font-normal">E-mail</th>
              <th className="py-3 pr-4 font-normal">Papel</th>
              <th className="py-3 pr-4 font-normal">Último login</th>
              <th className="py-3 pr-4 font-normal">Status</th>
              <th className="py-3 pr-5 font-normal text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {members.map((m) => {
              const isMe = m.id === currentMemberId;
              return (
                <tr key={m.id} className="border-b border-cream/5">
                  <td className="px-5 py-4 text-cream font-serif text-base">
                    {m.name}
                    {isMe && (
                      <span className="ml-2 text-[0.6rem] tabular tracking-widest text-gold/70">
                        (você)
                      </span>
                    )}
                  </td>
                  <td className="py-4 pr-4 text-cream/65 text-sm">{m.email}</td>
                  <td className="py-4 pr-4">
                    <span
                      className={cn(
                        "inline-flex px-2 py-0.5 text-[0.6rem] tracking-[0.18em] uppercase border",
                        m.role === "admin"
                          ? "border-gold/50 text-gold"
                          : "border-cream/20 text-cream/70"
                      )}
                    >
                      {m.role === "admin" ? "Admin" : "Atendente"}
                    </span>
                  </td>
                  <td className="py-4 pr-4 text-cream/45 text-xs tabular">
                    {m.last_login_at
                      ? new Date(m.last_login_at).toLocaleDateString("pt-BR")
                      : "—"}
                  </td>
                  <td className="py-4 pr-4">
                    <span
                      className={cn(
                        "text-[0.65rem] tracking-[0.22em] uppercase",
                        m.is_active ? "text-cream/65" : "text-red-300/70"
                      )}
                    >
                      {m.is_active ? "Ativo" : "Inativo"}
                    </span>
                  </td>
                  <td className="py-4 pr-5 text-right space-x-4">
                    {!isMe && m.role !== "admin" && (
                      <>
                        <button
                          type="button"
                          onClick={() => setEditTarget(m)}
                          className="text-[0.65rem] tracking-[0.2em] uppercase text-cream/55 hover:text-gold"
                        >
                          Editar
                        </button>
                        <button
                          type="button"
                          onClick={() => setResetTarget(m)}
                          className="text-[0.65rem] tracking-[0.2em] uppercase text-cream/55 hover:text-gold"
                        >
                          Redefinir senha
                        </button>
                        <button
                          type="button"
                          onClick={() => toggle(m)}
                          className="text-[0.65rem] tracking-[0.2em] uppercase text-cream/55 hover:text-gold"
                        >
                          {m.is_active ? "Desativar" : "Ativar"}
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(m)}
                          className="text-[0.65rem] tracking-[0.2em] uppercase text-red-300/75 hover:text-red-300"
                        >
                          Excluir
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {invitingOpen && (
        <InviteModal onClose={() => setInvitingOpen(false)} />
      )}
      {resetTarget && (
        <ResetModal
          member={resetTarget}
          onClose={() => setResetTarget(null)}
        />
      )}
      {editTarget && (
        <EditModal
          member={editTarget}
          onClose={() => setEditTarget(null)}
        />
      )}
      {deleteTarget && (
        <DeleteModal
          member={deleteTarget}
          onClose={() => setDeleteTarget(null)}
        />
      )}
    </>
  );
}

function EditModal({
  member,
  onClose,
}: {
  member: AccountMember;
  onClose: () => void;
}) {
  const [name, setName] = useState(member.name);
  const [email, setEmail] = useState(member.email);
  const [err, setErr] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]> | null>(null);
  const [isPending, startTransition] = useTransition();

  function submit() {
    setErr(null);
    setFieldErrors(null);
    startTransition(async () => {
      const res = await updateMember({
        memberId: member.id,
        name: name.trim(),
        email: email.trim().toLowerCase(),
      });
      if (!res.ok) {
        setErr(res.message ?? "Falhou.");
        if (res.fieldErrors) setFieldErrors(res.fieldErrors);
      } else {
        onClose();
      }
    });
  }

  return (
    <Modal title={`Editar — ${member.name}`} onClose={onClose}>
      <div className="space-y-5">
        <Field label="Nome">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-navy border border-cream/15 px-3 py-2 text-cream text-sm"
          />
          <ErrMsg msg={fieldErrors?.name?.[0]} />
        </Field>
        <Field label="E-mail">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-navy border border-cream/15 px-3 py-2 text-cream text-sm"
          />
          <ErrMsg msg={fieldErrors?.email?.[0]} />
        </Field>
        {err && !fieldErrors && (
          <p className="text-sm text-red-300/90">{err}</p>
        )}
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="btn-ghost text-[0.65rem] px-5 py-2"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={submit}
            disabled={isPending || name.trim().length < 2 || email.trim().length < 4}
            className="btn-primary text-[0.65rem] px-5 py-2 disabled:opacity-50"
          >
            {isPending ? "Salvando…" : "Salvar"}
          </button>
        </div>
      </div>
    </Modal>
  );
}

function DeleteModal({
  member,
  onClose,
}: {
  member: AccountMember;
  onClose: () => void;
}) {
  const [confirmText, setConfirmText] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function submit() {
    setErr(null);
    startTransition(async () => {
      const res = await deleteMember({
        memberId: member.id,
        confirm: confirmText.trim().toUpperCase(),
      });
      if (!res.ok) setErr(res.message ?? "Falhou.");
      else onClose();
    });
  }

  return (
    <Modal title={`Excluir — ${member.name}`} onClose={onClose}>
      <div className="space-y-4">
        <p className="text-sm text-cream/75 leading-relaxed">
          Excluir <span className="text-cream font-medium">{member.name}</span>{" "}
          remove definitivamente o acesso ao CRM.{" "}
          <span className="text-red-300/85">Não tem como desfazer.</span>
        </p>
        <p className="text-xs text-cream/55">
          Pra confirmar, digite{" "}
          <code className="px-1 py-0.5 bg-navy-light/60 text-gold tabular text-[0.7rem]">
            EXCLUIR
          </code>{" "}
          abaixo.
        </p>
        <input
          value={confirmText}
          onChange={(e) => setConfirmText(e.target.value)}
          placeholder="EXCLUIR"
          disabled={isPending}
          autoFocus
          className="w-full bg-navy border border-cream/15 px-3 py-2 text-cream text-sm tabular focus:border-red-300/60 outline-none"
        />
        {err && <p className="text-xs text-red-300/90">{err}</p>}
        <div className="flex justify-end gap-3 pt-1">
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="text-[0.65rem] tracking-[0.22em] uppercase text-cream/55 hover:text-cream transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={submit}
            disabled={isPending || confirmText.trim().toUpperCase() !== "EXCLUIR"}
            className={cn(
              "px-4 py-2 text-[0.65rem] tracking-[0.24em] uppercase font-semibold transition-colors",
              "bg-red-400/90 text-navy hover:bg-red-300",
              "disabled:opacity-40 disabled:pointer-events-none"
            )}
          >
            {isPending ? "Excluindo…" : "Excluir definitivamente"}
          </button>
        </div>
      </div>
    </Modal>
  );
}

function InviteModal({ onClose }: { onClose: () => void }) {
  const [state, formAction, pending] = useActionState(inviteMember, initial);
  if (state.status === "ok") {
    setTimeout(onClose, 50);
  }
  return (
    <Modal title="Adicionar atendente" onClose={onClose}>
      <form action={formAction} className="space-y-5">
        <Field label="Nome">
          <input
            name="name"
            required
            className="w-full bg-navy border border-cream/15 px-3 py-2 text-cream text-sm"
          />
          <ErrMsg msg={state.status === "error" ? state.fieldErrors?.name?.[0] : undefined} />
        </Field>
        <Field label="E-mail">
          <input
            type="email"
            name="email"
            required
            className="w-full bg-navy border border-cream/15 px-3 py-2 text-cream text-sm"
          />
          <ErrMsg msg={state.status === "error" ? state.fieldErrors?.email?.[0] : undefined} />
        </Field>
        <Field label="Senha temporária (mín. 8 caracteres)">
          <input
            type="text"
            name="password"
            required
            minLength={8}
            className="w-full bg-navy border border-cream/15 px-3 py-2 text-cream text-sm tabular"
          />
          <ErrMsg msg={state.status === "error" ? state.fieldErrors?.password?.[0] : undefined} />
          <p className="text-[0.65rem] tabular tracking-widest text-cream/35 mt-2">
            O atendente troca no primeiro acesso.
          </p>
        </Field>
        {state.status === "error" && !state.fieldErrors && (
          <p className="text-sm text-red-300/90">{state.message}</p>
        )}
        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={onClose} className="btn-ghost text-[0.65rem] px-5 py-2">
            Cancelar
          </button>
          <button type="submit" disabled={pending} className="btn-primary text-[0.65rem] px-5 py-2">
            {pending ? "Adicionando…" : "Adicionar"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

function ResetModal({
  member,
  onClose,
}: {
  member: AccountMember;
  onClose: () => void;
}) {
  const [pwd, setPwd] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function submit() {
    setErr(null);
    startTransition(async () => {
      const res = await resetMemberPassword({ memberId: member.id, password: pwd });
      if (!res.ok) setErr(res.message ?? "Falhou.");
      else onClose();
    });
  }

  return (
    <Modal title={`Redefinir senha — ${member.name}`} onClose={onClose}>
      <div className="space-y-5">
        <Field label="Nova senha temporária">
          <input
            type="text"
            value={pwd}
            onChange={(e) => setPwd(e.target.value)}
            minLength={8}
            className="w-full bg-navy border border-cream/15 px-3 py-2 text-cream text-sm tabular"
          />
        </Field>
        {err && <p className="text-sm text-red-300/90">{err}</p>}
        <div className="flex justify-end gap-3">
          <button type="button" onClick={onClose} className="btn-ghost text-[0.65rem] px-5 py-2">
            Cancelar
          </button>
          <button
            type="button"
            onClick={submit}
            disabled={isPending || pwd.length < 8}
            className="btn-primary text-[0.65rem] px-5 py-2 disabled:opacity-50"
          >
            {isPending ? "Salvando…" : "Salvar"}
          </button>
        </div>
      </div>
    </Modal>
  );
}

function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-[55] flex items-center justify-center px-4">
      <button
        type="button"
        onClick={onClose}
        aria-label="Fechar"
        className="absolute inset-0 bg-navy/85 backdrop-blur-md"
      />
      <div className="relative w-full max-w-md bg-navy border border-cream/15 p-6">
        <div className="flex items-baseline justify-between mb-5">
          <h3 className="font-display text-xl text-cream pr-4">{title}</h3>
          <button onClick={onClose} className="text-cream/55 hover:text-gold text-sm">
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="eyebrow text-cream/55 mb-2 block">{label}</span>
      {children}
    </label>
  );
}

function ErrMsg({ msg }: { msg?: string }) {
  if (!msg) return null;
  return <p className="mt-1 text-xs text-red-300/90">{msg}</p>;
}
