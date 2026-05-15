"use client";

import type { ButtonHTMLAttributes, MouseEvent } from "react";
import { useLeadForm } from "./provider";
import type { PROCEDURE_OPTIONS } from "@/lib/validators";

type ProcedureKey = (typeof PROCEDURE_OPTIONS)[number];

interface OpenLeadFormButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type"> {
  procedure?: ProcedureKey;
}

/**
 * Botão genérico que abre o formulário multi-step.
 * Aceita as mesmas classes (.btn-primary, .btn-ghost, etc.) que os <a> originais usavam.
 * Se o usuário passar onClick, ele roda ANTES de abrir o modal (útil para fechar menus).
 */
export default function OpenLeadFormButton({
  procedure,
  onClick,
  children,
  ...rest
}: OpenLeadFormButtonProps) {
  const { open } = useLeadForm();

  function handleClick(e: MouseEvent<HTMLButtonElement>) {
    if (onClick) onClick(e);
    if (!e.defaultPrevented) open({ procedure });
  }

  return (
    <button type="button" onClick={handleClick} {...rest}>
      {children}
    </button>
  );
}
