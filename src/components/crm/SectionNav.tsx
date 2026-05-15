"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";

interface SectionNavProps {
  sections: { id: string; label: string }[];
}

export default function SectionNav({ sections }: SectionNavProps) {
  const [active, setActive] = useState<string>(sections[0]?.id ?? "");

  useEffect(() => {
    const elements = sections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => el !== null);
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Pega a entrada mais "no topo" entre as visíveis
        const visibleEntries = entries.filter((e) => e.isIntersecting);
        if (visibleEntries.length === 0) return;
        const topMost = visibleEntries.reduce((a, b) =>
          a.boundingClientRect.top < b.boundingClientRect.top ? a : b
        );
        setActive(topMost.target.id);
      },
      {
        rootMargin: "-30% 0px -55% 0px",
        threshold: 0,
      }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [sections]);

  function jump(id: string) {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <nav
      className="sticky top-0 z-20 -mx-6 lg:-mx-10 px-6 lg:px-10 py-4 bg-navy/95 backdrop-blur-sm border-b border-cream/10 reports-no-print"
      aria-label="Seções do relatório"
    >
      <div className="flex flex-wrap gap-2">
        {sections.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => jump(s.id)}
            aria-current={active === s.id ? "true" : undefined}
            className={cn(
              "px-3 py-1.5 text-[0.65rem] tracking-[0.2em] uppercase transition-colors border",
              active === s.id
                ? "border-gold text-gold bg-navy-light/60"
                : "border-transparent text-cream/55 hover:text-cream hover:border-cream/15"
            )}
          >
            {s.label}
          </button>
        ))}
      </div>
    </nav>
  );
}
