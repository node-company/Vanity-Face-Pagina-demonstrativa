"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import LeadFormModal from "./modal";
import type { PROCEDURE_OPTIONS } from "@/lib/validators";

type ProcedureKey = (typeof PROCEDURE_OPTIONS)[number];

type LeadFormCtx = {
  open: (opts?: { procedure?: ProcedureKey }) => void;
  close: () => void;
  isOpen: boolean;
  preselectedProcedure?: ProcedureKey;
};

const Ctx = createContext<LeadFormCtx | null>(null);

export function LeadFormProvider({ children }: { children: ReactNode }) {
  const [isOpen, setOpen] = useState(false);
  const [preselectedProcedure, setProcedure] = useState<ProcedureKey | undefined>(
    undefined
  );

  const open = useCallback((opts?: { procedure?: ProcedureKey }) => {
    setProcedure(opts?.procedure);
    setOpen(true);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
  }, []);

  const value = useMemo<LeadFormCtx>(
    () => ({ open, close, isOpen, preselectedProcedure }),
    [open, close, isOpen, preselectedProcedure]
  );

  return (
    <Ctx.Provider value={value}>
      {children}
      <LeadFormModal />
    </Ctx.Provider>
  );
}

export function useLeadForm(): LeadFormCtx {
  const ctx = useContext(Ctx);
  if (!ctx) {
    throw new Error("useLeadForm must be used inside <LeadFormProvider>");
  }
  return ctx;
}
