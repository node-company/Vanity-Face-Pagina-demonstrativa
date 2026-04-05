"use client";

import { useState } from "react";
import Image from "next/image";
import AnimatedSection from "./AnimatedSection";

const resultados = [
  { src: "/images/resultados-1.jpg", label: "Lifting de Palpebra Inferior a Laser", category: "Lifting" },
  { src: "/images/resultados-2.jpg", label: "Lifting de Palpebra a Laser", category: "Lifting" },
  { src: "/images/resultados-3.jpg", label: "Harmonizacao Full Face", category: "Harmonizacao" },
  { src: "/images/resultados-4.jpg", label: "Preenchimento Labial", category: "Preenchimento" },
  { src: "/images/resultados-5.jpg", label: "Preenchimento Labial", category: "Preenchimento" },
  { src: "/images/resultados-6.jpg", label: "Deep Neck Lift", category: "Cirurgia" },
  { src: "/images/resultados-7.jpg", label: "Platismoplastia", category: "Cirurgia" },
  { src: "/images/resultados-8.jpg", label: "Platismoplastia", category: "Cirurgia" },
  { src: "/images/resultados-9.jpg", label: "Platismoplastia", category: "Cirurgia" },
  { src: "/images/resultados-10.jpg", label: "Lifting de Palpebra a Laser", category: "Lifting" },
];

const categories = ["Todos", "Cirurgia", "Lifting", "Harmonizacao", "Preenchimento"];

export default function Resultados() {
  const [filter, setFilter] = useState("Todos");
  const [lightbox, setLightbox] = useState<number | null>(null);

  const filtered = filter === "Todos" ? resultados : resultados.filter((r) => r.category === filter);

  return (
    <section id="resultados" className="relative py-28 lg:py-36 bg-navy">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <AnimatedSection>
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-4 mb-4">
              <span className="h-px w-12 bg-gold/40" />
              <span className="text-gold text-xs tracking-[0.4em] uppercase font-medium">
                Antes e Depois
              </span>
              <span className="h-px w-12 bg-gold/40" />
            </div>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light text-cream tracking-wide">
              Resultados
            </h2>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.1}>
          <div className="flex flex-wrap items-center justify-center gap-3 mb-14">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-5 py-2 text-xs tracking-widest uppercase font-medium transition-colors duration-300 ${
                  filter === cat
                    ? "bg-gold text-navy"
                    : "border border-cream/15 text-cream/50 hover:border-gold/40 hover:text-gold"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </AnimatedSection>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => (
            <div
              key={item.src}
              className="group relative cursor-pointer"
              onClick={() => setLightbox(resultados.indexOf(item))}
            >
              <div className="relative aspect-square overflow-hidden bg-navy-light">
                <Image
                  src={item.src}
                  alt={`Resultado: ${item.label}`}
                  fill
                  className="object-cover lg:transition-transform lg:duration-500 lg:group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  loading="lazy"
                />
                <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-navy/80 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="text-cream text-xs font-medium tracking-wider uppercase">
                    {item.label}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {lightbox !== null && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-6 right-6 text-cream/60 hover:text-gold transition-colors"
            onClick={() => setLightbox(null)}
          >
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 text-cream/60 hover:text-gold transition-colors p-2"
            onClick={(e) => {
              e.stopPropagation();
              setLightbox(lightbox > 0 ? lightbox - 1 : resultados.length - 1);
            }}
          >
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>

          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 text-cream/60 hover:text-gold transition-colors p-2"
            onClick={(e) => {
              e.stopPropagation();
              setLightbox(lightbox < resultados.length - 1 ? lightbox + 1 : 0);
            }}
          >
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>

          <div
            className="relative max-w-4xl max-h-[85vh] w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={resultados[lightbox].src}
              alt={`Resultado: ${resultados[lightbox].label}`}
              width={1200}
              height={1200}
              className="object-contain w-full h-full max-h-[80vh]"
            />
            <p className="text-center mt-4 text-gold text-sm tracking-widest uppercase">
              {resultados[lightbox].label}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
