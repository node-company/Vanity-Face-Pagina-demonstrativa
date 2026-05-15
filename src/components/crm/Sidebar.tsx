"use client";

import { useEffect, useState, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/cn";
import { CRM_NAV as NAV } from "./nav-items";

interface SidebarProps {
  isAdmin: boolean;
}

export default function Sidebar({ isAdmin }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [optimisticHref, setOptimisticHref] = useState<string | null>(null);
  const visible = NAV.filter((n) => !n.adminOnly || isAdmin);

  // Prefetch todas as abas no mount para que clicar não dependa de buscar o JS.
  useEffect(() => {
    visible.forEach((item) => router.prefetch(item.href));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function navigate(href: string) {
    if (href === pathname) return;
    setOptimisticHref(href);
    startTransition(() => {
      router.push(href);
    });
  }

  // Quando o pathname real bate com o destino, limpamos o optimistic.
  useEffect(() => {
    if (optimisticHref && optimisticHref === pathname) {
      setOptimisticHref(null);
    }
  }, [pathname, optimisticHref]);

  function isItemActive(href: string): boolean {
    const reference = optimisticHref ?? pathname;
    if (href === "/crm") return reference === "/crm";
    return reference.startsWith(href);
  }

  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 border-r border-cream/10 bg-navy-deep">
      <div className="px-7 py-7">
        <p className="eyebrow text-gold/80">Vanity Face</p>
        <p className="mt-1 italic-soft text-cream/55 text-sm">CRM interno</p>
      </div>

      <nav className="flex-1 px-4 py-2">
        {visible.map((item) => {
          const active = isItemActive(item.href);
          const isLoading = isPending && optimisticHref === item.href;
          return (
            <a
              key={item.href}
              href={item.href}
              onClick={(e) => {
                // permite ctrl/cmd+click abrir em nova aba normalmente
                if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
                e.preventDefault();
                navigate(item.href);
              }}
              className={cn(
                "group flex items-center gap-3 px-3 py-3 mb-1 transition-colors duration-150 cursor-pointer relative",
                active
                  ? "bg-navy-light text-gold"
                  : "text-cream/65 hover:text-cream hover:bg-navy-light/60"
              )}
            >
              <span
                className={cn(
                  "text-[0.55rem] tabular tracking-widest",
                  active ? "text-gold/80" : "text-cream/35"
                )}
              >
                {item.index}
              </span>
              <span className="text-[0.78rem] font-medium tracking-[0.22em] uppercase flex-1">
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

      <p className="px-7 py-6 text-[0.6rem] tabular tracking-widest text-cream/30 border-t border-cream/10">
        v0.1 — interno
      </p>
    </aside>
  );
}
