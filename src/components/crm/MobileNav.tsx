"use client";

import { useEffect, useState, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import { CRM_NAV } from "./nav-items";
import { cn } from "@/lib/cn";

export default function MobileNav({ isAdmin }: { isAdmin: boolean }) {
  const [open, setOpen] = useState(false);
  const [optimisticHref, setOptimisticHref] = useState<string | null>(null);
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const visible = CRM_NAV.filter((n) => !n.adminOnly || isAdmin);

  // Lock body scroll quando aberto
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // ESC fecha
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Fecha quando o pathname realmente muda
  useEffect(() => {
    if (optimisticHref && optimisticHref === pathname) {
      setOptimisticHref(null);
      setOpen(false);
    }
  }, [pathname, optimisticHref]);

  // Prefetch de todas as rotas no mount
  useEffect(() => {
    visible.forEach((item) => router.prefetch(item.href));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function navigate(href: string) {
    if (href === pathname) {
      setOpen(false);
      return;
    }
    setOptimisticHref(href);
    startTransition(() => {
      router.push(href);
    });
  }

  function isItemActive(href: string): boolean {
    const reference = optimisticHref ?? pathname;
    if (href === "/crm") return reference === "/crm";
    return reference.startsWith(href);
  }

  return (
    <>
      {/* Botão hamburger — só mobile */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Abrir menu"
        aria-expanded={open}
        className="lg:hidden -ml-2 flex flex-col gap-[5px] p-2 cursor-pointer"
      >
        <span className="block w-6 h-px bg-gold" />
        <span className="block w-6 h-px bg-gold" />
        <span className="block w-6 h-px bg-gold" />
      </button>

      {/* Drawer */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-[60]" role="dialog" aria-modal="true">
          {/* Backdrop */}
          <button
            type="button"
            aria-label="Fechar menu"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-navy/85 backdrop-blur-md animate-[fadeIn_240ms_ease-out]"
          />

          {/* Painel lateral */}
          <aside
            className={cn(
              "relative h-full w-72 max-w-[85vw] bg-navy-deep border-r border-cream/10",
              "flex flex-col animate-[drawerIn_320ms_cubic-bezier(0.2,0.7,0.2,1)]"
            )}
          >
            <div className="flex items-baseline justify-between px-7 py-7">
              <div>
                <p className="eyebrow text-gold/80">Vanity Face</p>
                <p className="mt-1 italic-soft text-cream/55 text-sm">CRM interno</p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Fechar menu"
                className="text-cream/55 hover:text-gold w-9 h-9 -mr-2 flex items-center justify-center"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  className="w-5 h-5"
                >
                  <path d="M5 5l14 14M19 5L5 19" strokeLinecap="square" />
                </svg>
              </button>
            </div>

            <nav className="flex-1 px-3 py-2 overflow-y-auto">
              {visible.map((item) => {
                const active = isItemActive(item.href);
                const isLoading = isPending && optimisticHref === item.href;
                return (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={(e) => {
                      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
                      e.preventDefault();
                      navigate(item.href);
                    }}
                    className={cn(
                      "group flex items-center gap-4 px-4 py-4 mb-1 transition-colors duration-150 cursor-pointer relative border-b border-cream/5",
                      active
                        ? "bg-navy-light text-gold"
                        : "text-cream/75 hover:text-cream hover:bg-navy-light/60"
                    )}
                  >
                    <span
                      className={cn(
                        "text-[0.6rem] tabular tracking-widest",
                        active ? "text-gold/80" : "text-cream/35"
                      )}
                    >
                      {item.index}
                    </span>
                    <span className="font-serif text-xl font-light flex-1">
                      {item.label}
                    </span>
                    {isLoading && (
                      <span
                        aria-hidden
                        className="w-3 h-3 border border-gold/70 border-t-transparent rounded-full animate-spin"
                      />
                    )}
                  </a>
                );
              })}
            </nav>

            <p className="px-7 py-5 text-[0.6rem] tabular tracking-widest text-cream/30 border-t border-cream/10">
              v0.1 — interno
            </p>
          </aside>
        </div>
      )}
    </>
  );
}
