"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import AnimatedSection from "./AnimatedSection";

type Resultado = { src: string; label: string; category: string };

const named: Resultado[] = [
  { src: "/images/resultados-1.jpg", label: "Lifting de Pálpebra Inferior", category: "Lifting" },
  { src: "/images/resultados-2.jpg", label: "Lifting de Pálpebra a Laser", category: "Lifting" },
  { src: "/images/resultados-3.jpg", label: "Harmonização Full Face", category: "Harmonizacao" },
  { src: "/images/resultados-4.jpg", label: "Preenchimento Labial", category: "Preenchimento" },
  { src: "/images/resultados-5.jpg", label: "Preenchimento Labial", category: "Preenchimento" },
  { src: "/images/resultados-6.jpg", label: "Deep Neck Lift", category: "Cirurgia" },
  { src: "/images/resultados-7.jpg", label: "Platismoplastia", category: "Cirurgia" },
  { src: "/images/resultados-8.jpg", label: "Platismoplastia", category: "Cirurgia" },
  { src: "/images/resultados-9.jpg", label: "Platismoplastia", category: "Cirurgia" },
  { src: "/images/resultados-10.jpg", label: "Lifting de Pálpebra a Laser", category: "Lifting" },
];

const editasFiles = [
  "1.jpg", "2.jpg", "3.png", "4.jpg", "5.jpg", "6.jpg", "7.jpg", "8.jpg",
  "9.jpg", "10.jpg", "11.jpg", "12.jpg", "13.jpg", "14.jpg", "15.jpg",
  "16.jpg", "17.jpg", "18.jpg", "19.jpg", "20.ai.jpg", "21.png",
  "22.jpg", "23.jpg", "24.jpg",
];

const editasMeta: { label: string; category: string }[] = [
  { label: "Lifting de Pálpebras",                 category: "Lifting" },
  { label: "Lipo de Papada",                       category: "Cirurgia" },
  { label: "Lifting de Pálpebras",                 category: "Lifting" },
  { label: "Lifting Total de Face",                category: "Lifting" },
  { label: "Lifting Total de Face",                category: "Lifting" },
  { label: "Lifting Total de Face",                category: "Lifting" },
  { label: "Lifting Total de Face",                category: "Lifting" },
  { label: "Lifting Total de Face",                category: "Lifting" },
  { label: "Lifting Total de Face",                category: "Lifting" },
  { label: "Lifting Total de Face",                category: "Lifting" },
  { label: "Lipo de Papada",                       category: "Cirurgia" },
  { label: "Lipo de Papada",                       category: "Cirurgia" },
  { label: "Preenchimento de Olheira",             category: "Preenchimento" },
  { label: "Lifting de Pálpebras",                 category: "Lifting" },
  { label: "Lifting de Face",                      category: "Lifting" },
  { label: "Lifting de Face",                      category: "Lifting" },
  { label: "Line Skin Hard — Peeling de Fenol",    category: "Harmonizacao" },
  { label: "Lifting de Face",                      category: "Lifting" },
  { label: "Lifting Labial e de Pálpebras",        category: "Lifting" },
  { label: "Endoskin",                             category: "Harmonizacao" },
  { label: "Liplifting",                           category: "Lifting" },
  { label: "Glúteo",                               category: "Cirurgia" },
  { label: "Glúteo",                               category: "Cirurgia" },
  { label: "Glúteo",                               category: "Cirurgia" },
];

const editas: Resultado[] = editasFiles.map((file, i) => ({
  src: `/images/editas/${file}`,
  label: editasMeta[i]?.label ?? "",
  category: editasMeta[i]?.category ?? "Cirurgia",
}));

const resultados: Resultado[] = [...named, ...editas];

const categories = [
  { label: "Tudo", value: "Todos" },
  { label: "Cirurgia", value: "Cirurgia" },
  { label: "Lifting", value: "Lifting" },
  { label: "Harmonização", value: "Harmonizacao" },
  { label: "Preenchimento", value: "Preenchimento" },
];

function AnimatedCounter({ value, total }: { value: number; total: number }) {
  const padded = String(value).padStart(2, "0");
  const totalPadded = String(total).padStart(2, "0");
  return (
    <span className="font-serif font-light tabular leading-none flex items-baseline gap-1">
      <span className="text-3xl text-gold flex">
        {padded.split("").map((d, i) => (
          <span
            key={`${d}-${i}-${value}`}
            className="digit-rise inline-block"
            style={{ animationDelay: `${i * 0.06}s` }}
          >
            {d}
          </span>
        ))}
      </span>
      <span className="text-xl text-cream/30">/</span>
      <span className="text-2xl text-cream/55">{totalPadded}</span>
    </span>
  );
}

export default function Resultados() {
  const [filter, setFilter] = useState("Todos");
  const [activeIdx, setActiveIdx] = useState(0);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [entryDone, setEntryDone] = useState(false);
  const [lightboxZoom, setLightboxZoom] = useState({ x: 50, y: 50, active: false });

  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const dragState = useRef({
    pointerId: -1,
    startX: 0,
    scrollStart: 0,
    moved: false,
    isDown: false,
  });

  const filtered =
    filter === "Todos"
      ? resultados
      : resultados.filter((r) => r.category === filter);

  const recalcActive = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const center = track.scrollLeft + track.clientWidth / 2;
    let bestIdx = 0;
    let bestDist = Infinity;
    cardRefs.current.forEach((card, i) => {
      if (!card) return;
      const cardCenter = card.offsetLeft + card.clientWidth / 2;
      const dist = Math.abs(center - cardCenter);
      if (dist < bestDist) {
        bestDist = dist;
        bestIdx = i;
      }
    });
    setActiveIdx(bestIdx);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const onScroll = () => {
      window.requestAnimationFrame(recalcActive);
    };
    track.addEventListener("scroll", onScroll, { passive: true });
    recalcActive();
    return () => track.removeEventListener("scroll", onScroll);
  }, [recalcActive, filtered.length]);

  useEffect(() => {
    if (trackRef.current) {
      trackRef.current.scrollTo({ left: 0, behavior: "auto" });
    }
    setActiveIdx(0);
  }, [filter]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || revealed) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          obs.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    obs.observe(section);
    return () => obs.disconnect();
  }, [revealed]);

  useEffect(() => {
    if (!revealed) return;
    const t = setTimeout(() => setEntryDone(true), 1100);
    return () => clearTimeout(t);
  }, [revealed]);

  useEffect(() => {
    cardRefs.current.forEach((card) => {
      if (!card) return;
      const tilt = card.querySelector<HTMLElement>("[data-tilt]");
      if (tilt) {
        tilt.style.transition = "transform 0.6s cubic-bezier(0.2, 0.7, 0.2, 1)";
        tilt.style.transform = "";
      }
    });
  }, [activeIdx]);

  const scrollToIndex = useCallback((target: number) => {
    const track = trackRef.current;
    if (!track) return;
    const card = cardRefs.current[target];
    if (!card) return;
    track.scrollTo({
      left: card.offsetLeft - track.clientWidth / 2 + card.clientWidth / 2,
      behavior: "smooth",
    });
  }, []);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "touch") return;
    const track = trackRef.current;
    if (!track) return;

    dragState.current = {
      pointerId: e.pointerId,
      startX: e.pageX,
      scrollStart: track.scrollLeft,
      moved: false,
      isDown: true,
    };
    track.style.scrollBehavior = "auto";
    track.setAttribute("data-dragging", "");

    const onMove = (ev: PointerEvent) => {
      if (!dragState.current.isDown) return;
      if (ev.pointerId !== dragState.current.pointerId) return;
      const t = trackRef.current;
      if (!t) return;
      const dx = ev.pageX - dragState.current.startX;
      if (Math.abs(dx) > 6) {
        dragState.current.moved = true;
        ev.preventDefault();
      }
      t.scrollLeft = dragState.current.scrollStart - dx;
    };

    const onUp = (ev: PointerEvent) => {
      if (ev.pointerId !== dragState.current.pointerId) return;
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerup", onUp);
      document.removeEventListener("pointercancel", onUp);

      const t = trackRef.current;
      if (!t) {
        dragState.current.isDown = false;
        return;
      }
      t.style.scrollBehavior = "";
      const wasMoved = dragState.current.moved;
      dragState.current.isDown = false;

      // Re-enable transitions before snap so the final position animates
      t.removeAttribute("data-dragging");

      if (wasMoved) {
        const center = t.scrollLeft + t.clientWidth / 2;
        let bestIdx = 0;
        let bestDist = Infinity;
        cardRefs.current.forEach((card, i) => {
          if (!card) return;
          const cardCenter = card.offsetLeft + card.clientWidth / 2;
          const dist = Math.abs(center - cardCenter);
          if (dist < bestDist) {
            bestDist = dist;
            bestIdx = i;
          }
        });
        const card = cardRefs.current[bestIdx];
        if (card) {
          t.scrollTo({
            left:
              card.offsetLeft -
              t.clientWidth / 2 +
              card.clientWidth / 2,
            behavior: "smooth",
          });
        }
      }

      window.setTimeout(() => {
        dragState.current.moved = false;
      }, 50);
    };

    document.addEventListener("pointermove", onMove);
    document.addEventListener("pointerup", onUp);
    document.addEventListener("pointercancel", onUp);
  };

  const handleTiltMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;
    const target = e.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    target.style.transition = "transform 0.15s linear";
    target.style.transform = `perspective(1200px) rotateY(${x * 8}deg) rotateX(${-y * 6}deg)`;
  };

  const handleTiltLeave = (e: React.PointerEvent<HTMLDivElement>) => {
    const target = e.currentTarget as HTMLElement;
    target.style.transition = "transform 0.6s cubic-bezier(0.2, 0.7, 0.2, 1)";
    target.style.transform = "";
  };

  const handleKeyNav = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      scrollToIndex(Math.min(filtered.length - 1, activeIdx + 1));
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      scrollToIndex(Math.max(0, activeIdx - 1));
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      const item = filtered[activeIdx];
      if (item) setLightbox(resultados.indexOf(item));
    }
  };

  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
      if (e.key === "ArrowRight") {
        setLightbox((c) => (c === null ? null : (c + 1) % resultados.length));
      }
      if (e.key === "ArrowLeft") {
        setLightbox((c) =>
          c === null ? null : (c - 1 + resultados.length) % resultados.length
        );
      }
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightbox]);

  const onLightboxImgMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setLightboxZoom({ x, y, active: true });
  };

  const onLightboxImgLeave = () => {
    setLightboxZoom({ x: 50, y: 50, active: false });
  };

  return (
    <section
      id="resultados"
      ref={sectionRef}
      className="relative bg-navy py-32 lg:py-48 overflow-hidden"
    >
      <div className="section-rule" />

      <div className="relative max-w-[1440px] mx-auto px-6 lg:px-12">
        <AnimatedSection>
          <div className="grid lg:grid-cols-12 gap-y-8 lg:gap-x-16 items-end mb-16 lg:mb-20">
            <div className="lg:col-span-7">
              <div className="flex items-center gap-4 mb-8">
                <span className="text-[0.65rem] tabular tracking-[0.3em] text-gold/70">
                  03
                </span>
                <span className="eyebrow text-gold">Antes & depois</span>
              </div>
              <h2 className="font-serif text-[clamp(2.75rem,6vw,5.25rem)] font-light leading-[0.98] tracking-[-0.02em] text-cream text-balance">
                Resultados que
                <br />
                <span className="italic text-gold">passam despercebidos</span>
                <br />
                — exceto para a paciente.
              </h2>
            </div>

            <div className="lg:col-span-4 lg:col-start-9">
              <p className="text-cream/65 text-base lg:text-lg font-light leading-relaxed body-prose">
                Cada caso é fotografado em condições consistentes e divulgado
                somente com autorização. Arraste, use as setas do teclado ou
                toque em uma imagem para ampliar.
              </p>
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.1}>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-3 mb-10 border-t border-b border-cream/15 py-5">
            <span className="eyebrow text-cream/45 mr-3">Filtrar</span>
            {categories.map((cat) => {
              const active = filter === cat.value;
              return (
                <button
                  key={cat.value}
                  onClick={() => setFilter(cat.value)}
                  className={`relative px-4 py-2 text-[0.7rem] font-medium tracking-[0.2em] uppercase transition-colors duration-300 ${
                    active ? "text-gold" : "text-cream/45 hover:text-cream/85"
                  }`}
                >
                  <span>{cat.label}</span>
                  <span
                    className={`absolute left-3 right-3 -bottom-px h-px transition-transform duration-500 ${
                      active ? "bg-gold scale-x-100" : "bg-cream/30 scale-x-0"
                    }`}
                    style={{ transformOrigin: "left" }}
                  />
                </button>
              );
            })}
            <span className="ml-auto italic-soft text-sm text-cream/40 tabular">
              {String(filtered.length).padStart(2, "0")} casos
            </span>
          </div>
        </AnimatedSection>
      </div>

      <AnimatedSection delay={0.15}>
        <div className="relative">
          <div
            ref={trackRef}
            tabIndex={0}
            onKeyDown={handleKeyNav}
            className="carousel-track scrollbar-hide flex gap-4 sm:gap-6 lg:gap-10 overflow-x-auto cursor-grab active:cursor-grabbing select-none focus:outline-none focus-visible:ring-1 focus-visible:ring-gold/40"
            style={{
              paddingLeft: "max(1.5rem, calc(50vw - 11rem))",
              paddingRight: "max(1.5rem, calc(50vw - 11rem))",
              paddingBlock: "2rem",
            }}
            onPointerDown={onPointerDown}
          >
            {filtered.map((item, i) => {
              const distance = Math.abs(i - activeIdx);
              const isActive = distance === 0;
              const scale =
                distance === 0 ? 1 : distance === 1 ? 0.88 : 0.82;
              const opacity =
                distance === 0
                  ? 1
                  : distance === 1
                    ? 0.6
                    : distance === 2
                      ? 0.32
                      : 0.18;
              const arcY = distance === 0 ? 0 : Math.min(distance, 3) * 14;
              const originalIdx = resultados.indexOf(item);
              const revealDelay = `${Math.min(i, 12) * 0.07}s`;

              return (
                <button
                  key={item.src}
                  ref={(el) => {
                    cardRefs.current[i] = el;
                  }}
                  type="button"
                  onClick={(e) => {
                    if (dragState.current.moved) {
                      e.preventDefault();
                      dragState.current.moved = false;
                      return;
                    }
                    if (i !== activeIdx) {
                      scrollToIndex(i);
                      return;
                    }
                    setLightbox(originalIdx);
                  }}
                  className="group relative flex-shrink-0 text-left will-change-transform focus:outline-none"
                  style={{
                    width: "min(22rem, 80vw)",
                    transform: revealed
                      ? `translateY(${arcY}px) scale(${scale})`
                      : "translateY(80px) scale(0.92)",
                    opacity: revealed ? opacity : 0,
                    transition: entryDone
                      ? "transform 0.3s cubic-bezier(0.2, 0.7, 0.2, 1), opacity 0.3s ease"
                      : revealed
                        ? `transform 0.85s cubic-bezier(0.2, 0.7, 0.2, 1) ${revealDelay}, opacity 0.85s ease ${revealDelay}`
                        : "none",
                  }}
                  aria-label={`Ver caso ${item.label || i + 1}`}
                  aria-current={isActive ? "true" : undefined}
                >
                  <div
                    data-tilt
                    onPointerMove={isActive ? handleTiltMove : undefined}
                    onPointerLeave={isActive ? handleTiltLeave : undefined}
                    className="tilt-3d"
                  >
                    <div className="relative aspect-[4/5] overflow-hidden bg-navy-light">
                      <Image
                        src={item.src}
                        alt={item.label || `Caso ${i + 1}`}
                        fill
                        className={`object-cover pointer-events-none transition-transform duration-[1.4s] ease-out ${
                          isActive ? "scale-100" : "scale-110"
                        }`}
                        sizes="(max-width: 640px) 80vw, 22rem"
                        loading={Math.abs(i - activeIdx) <= 2 ? "eager" : "lazy"}
                        draggable={false}
                      />
                      <div
                        className={`absolute inset-0 transition-opacity duration-700 ${
                          isActive ? "opacity-0" : "opacity-100 bg-navy/40"
                        }`}
                      />
                      <div
                        className={`absolute inset-0 ring-1 ring-inset transition-colors duration-500 ${
                          isActive ? "ring-gold/45" : "ring-cream/8"
                        }`}
                      />

                      <div
                        className={`absolute top-4 left-4 px-3 py-1 text-[0.55rem] tabular tracking-[0.2em] uppercase transition-all duration-500 ${
                          isActive
                            ? "bg-gold text-navy"
                            : "bg-navy/70 text-cream/70"
                        }`}
                      >
                        {String(originalIdx + 1).padStart(2, "0")} / {String(resultados.length).padStart(2, "0")}
                      </div>

                      <div
                        className={`absolute top-4 right-4 w-10 h-10 rounded-full backdrop-blur-md flex items-center justify-center transition-all duration-500 ${
                          isActive
                            ? "bg-gold text-navy opacity-100 scale-100"
                            : "bg-navy/40 text-cream/70 opacity-0 scale-50"
                        }`}
                      >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                          <circle cx="11" cy="11" r="6" />
                          <path d="M16 16l4 4" strokeLinecap="square" />
                        </svg>
                      </div>

                      <div
                        className={`absolute bottom-0 inset-x-0 p-5 bg-gradient-to-t from-navy/95 via-navy/50 to-transparent transition-all duration-700 ${
                          isActive
                            ? "opacity-100 translate-y-0"
                            : "opacity-0 translate-y-4"
                        }`}
                      >
                        {item.label && (
                          <p className="italic-soft text-base text-cream label-rise" key={`lbl-${activeIdx}-${i}`}>
                            {item.label}
                          </p>
                        )}
                        <p className="mt-1 text-[0.6rem] tracking-[0.25em] uppercase text-gold/85">
                          Toque para ampliar
                        </p>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => scrollToIndex(Math.max(0, activeIdx - 1))}
            disabled={activeIdx === 0}
            aria-label="Anterior"
            className="hidden md:flex group absolute left-4 lg:left-10 top-1/2 -translate-y-1/2 w-14 h-14 items-center justify-center bg-navy/70 backdrop-blur-md border border-cream/15 text-cream hover:text-navy hover:bg-gold hover:border-gold transition-all duration-500 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-navy/70 disabled:hover:text-cream disabled:hover:border-cream/15 z-20 hover:scale-110 active:scale-95"
          >
            <span className="absolute inset-0 bg-gold/0 group-hover:bg-gold/10 transition-colors duration-500 blur-md" />
            <svg className="relative w-5 h-5 transition-transform duration-500 group-hover:-translate-x-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
              <path d="M14 6l-6 6 6 6" strokeLinecap="square" />
            </svg>
          </button>

          <button
            type="button"
            onClick={() =>
              scrollToIndex(Math.min(filtered.length - 1, activeIdx + 1))
            }
            disabled={activeIdx === filtered.length - 1}
            aria-label="Proximo"
            className="hidden md:flex group absolute right-4 lg:right-10 top-1/2 -translate-y-1/2 w-14 h-14 items-center justify-center bg-navy/70 backdrop-blur-md border border-cream/15 text-cream hover:text-navy hover:bg-gold hover:border-gold transition-all duration-500 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-navy/70 disabled:hover:text-cream disabled:hover:border-cream/15 z-20 hover:scale-110 active:scale-95"
          >
            <span className="absolute inset-0 bg-gold/0 group-hover:bg-gold/10 transition-colors duration-500 blur-md" />
            <svg className="relative w-5 h-5 transition-transform duration-500 group-hover:translate-x-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
              <path d="M10 6l6 6-6 6" strokeLinecap="square" />
            </svg>
          </button>
        </div>
      </AnimatedSection>

      <div className="relative max-w-[1440px] mx-auto px-6 lg:px-12 mt-12 lg:mt-16">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="flex items-center gap-4 min-w-0">
            <AnimatedCounter
              value={activeIdx + 1}
              total={filtered.length}
            />
            <span
              className="italic-soft text-sm text-cream/55 truncate label-rise"
              key={`active-label-${activeIdx}`}
            >
              {filtered[activeIdx]?.label}
            </span>
          </div>

          <div className="flex-1 sm:max-w-md w-full sm:mx-8">
            <div className="relative h-[2px] bg-cream/12 overflow-hidden">
              <div
                className="absolute inset-y-0 left-0 bg-gold transition-[width] duration-500 ease-out"
                style={{
                  width:
                    filtered.length <= 1
                      ? "100%"
                      : `${((activeIdx + 1) / filtered.length) * 100}%`,
                }}
              />
              <div
                className="absolute inset-y-0 left-0 bg-gold/40 blur-sm transition-[width] duration-700 ease-out"
                style={{
                  width:
                    filtered.length <= 1
                      ? "100%"
                      : `${((activeIdx + 1) / filtered.length) * 100}%`,
                }}
              />
            </div>
          </div>

          <p className="hidden lg:flex items-center gap-2 text-[0.65rem] tracking-[0.25em] uppercase text-cream/40">
            <kbd className="px-1.5 py-0.5 border border-cream/15 text-[0.55rem] tabular tracking-normal">←</kbd>
            <kbd className="px-1.5 py-0.5 border border-cream/15 text-[0.55rem] tabular tracking-normal">→</kbd>
            navegar
          </p>
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-2 max-w-full overflow-hidden">
          {filtered.map((item, i) => (
            <button
              key={`dot-${item.src}`}
              type="button"
              onClick={() => scrollToIndex(i)}
              aria-label={`Ir para caso ${i + 1}`}
              className={`h-1 transition-all duration-500 ${
                i === activeIdx
                  ? "bg-gold w-10"
                  : "bg-cream/15 hover:bg-cream/35 w-4"
              }`}
            />
          ))}
        </div>
      </div>

      {lightbox !== null && (
        <div
          className="fixed inset-0 z-[100] bg-navy/97 backdrop-blur-sm flex items-center justify-center p-6 animate-hero"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-6 right-6 w-12 h-12 flex items-center justify-center text-cream/70 hover:text-gold transition-colors"
            onClick={() => setLightbox(null)}
            aria-label="Fechar"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center text-cream/60 hover:text-gold transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              setLightbox(
                lightbox > 0 ? lightbox - 1 : resultados.length - 1
              );
            }}
            aria-label="Anterior"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <path d="M14 6l-6 6 6 6" strokeLinecap="square" />
            </svg>
          </button>

          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center text-cream/60 hover:text-gold transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              setLightbox(
                lightbox < resultados.length - 1 ? lightbox + 1 : 0
              );
            }}
            aria-label="Proximo"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <path d="M10 6l6 6-6 6" strokeLinecap="square" />
            </svg>
          </button>

          <div
            className="relative max-w-4xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="relative w-full overflow-hidden cursor-zoom-in"
              onMouseMove={onLightboxImgMove}
              onMouseLeave={onLightboxImgLeave}
              style={{ maxHeight: "80vh" }}
            >
              <Image
                src={resultados[lightbox].src}
                alt={resultados[lightbox].label || `Caso ${lightbox + 1}`}
                width={1200}
                height={1500}
                className="object-contain w-full h-auto max-h-[80vh] transition-transform duration-300 ease-out pointer-events-none"
                style={{
                  transform: lightboxZoom.active ? "scale(1.6)" : "scale(1)",
                  transformOrigin: `${lightboxZoom.x}% ${lightboxZoom.y}%`,
                }}
              />
            </div>
            <div className="mt-6 flex items-baseline justify-between min-h-[1.75rem]">
              {resultados[lightbox].label ? (
                <p className="italic-soft text-lg text-cream label-rise" key={`lb-${lightbox}`}>
                  {resultados[lightbox].label}
                </p>
              ) : (
                <span />
              )}
              <p className="text-[0.65rem] tabular tracking-widest text-gold/70 uppercase">
                {String(lightbox + 1).padStart(2, "0")} / {String(resultados.length).padStart(2, "0")}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
