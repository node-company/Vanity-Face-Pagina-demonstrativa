"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
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
                className={`px-5 py-2 text-xs tracking-widest uppercase font-medium transition-all duration-300 ${
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

        <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filtered.map((item, i) => (
              <motion.div
                key={item.src}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: i * 0.03 }}
                className="group relative cursor-pointer"
                onClick={() => setLightbox(resultados.indexOf(item))}
              >
                <div className="relative aspect-square overflow-hidden bg-navy-light">
                  <Image
                    src={item.src}
                    alt={`Resultado: ${item.label}`}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                    <p className="text-cream text-sm font-medium tracking-wider uppercase">
                      {item.label}
                    </p>
                  </div>
                </div>
                <div className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-gold/0 group-hover:bg-gold transition-all duration-300 opacity-0 group-hover:opacity-100">
                  <svg className="w-4 h-4 text-navy" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                  </svg>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
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

            <motion.div
              key={lightbox}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
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
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
