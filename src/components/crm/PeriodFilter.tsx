"use client";

import { useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/cn";

const OPTIONS: { key: string; label: string }[] = [
  { key: "7d", label: "7 dias" },
  { key: "30d", label: "30 dias" },
  { key: "90d", label: "90 dias" },
  { key: "year", label: "1 ano" },
  { key: "all", label: "Tudo" },
];

export default function PeriodFilter({
  current,
  paramName = "period",
}: {
  current: string;
  paramName?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  function set(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set(paramName, value);
    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`);
    });
  }

  return (
    <div className="inline-flex items-center gap-px border border-cream/15 bg-navy">
      {OPTIONS.map((opt) => {
        const active = opt.key === current;
        return (
          <button
            key={opt.key}
            type="button"
            onClick={() => set(opt.key)}
            disabled={isPending}
            className={cn(
              "px-3 py-2 text-[0.65rem] tracking-[0.18em] uppercase transition-colors",
              active
                ? "bg-gold text-navy"
                : "text-cream/65 hover:text-gold hover:bg-navy-light/40"
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
