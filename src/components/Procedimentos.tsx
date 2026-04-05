"use client";

import { motion } from "framer-motion";
import AnimatedSection from "./AnimatedSection";

const procedimentos = [
  {
    title: "Platismoplastia",
    description:
      "Cirurgia para definicao do contorno cervical e rejuvenescimento do pescoco, restaurando a harmonia facial.",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93z" />
      </svg>
    ),
  },
  {
    title: "Lipo de Papada HD",
    description:
      "Lipoaspiracao de alta definicao para remocao da papada, com resultados precisos e naturais.",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
      </svg>
    ),
  },
  {
    title: "Deep Neck Lift",
    description:
      "Lifting profundo do pescoco para rejuvenescimento completo, eliminando flacidez e papada.",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0" />
      </svg>
    ),
  },
  {
    title: "Lifting de Palpebra a Laser",
    description:
      "Blefaroplastia a laser para rejuvenescimento do olhar, corrigindo palpebras caidas com precisao.",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    title: "Harmonizacao Full Face",
    description:
      "Harmonizacao facial completa combinando tecnicas para equilibrio e beleza natural do rosto.",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
      </svg>
    ),
  },
  {
    title: "Preenchimento Labial",
    description:
      "Volumizacao e contorno labial com acido hialuronico, resultando em labios naturalmente definidos.",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
      </svg>
    ),
  },
  {
    title: "Fios de PDO",
    description:
      "Sustentacao facial com fios absorviveis para lifting nao cirurgico, com efeito tensor imediato.",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" />
      </svg>
    ),
  },
  {
    title: "Lipoaspiracao Facial",
    description:
      "Contorno facial por remocao de gordura localizada, definindo mandibula e angulo cervical.",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
];

export default function Procedimentos() {
  return (
    <section id="procedimentos" className="relative py-28 lg:py-36 bg-navy-light">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <AnimatedSection>
          <div className="text-center mb-20">
            <div className="flex items-center justify-center gap-4 mb-4">
              <span className="h-px w-12 bg-gold/40" />
              <span className="text-gold text-xs tracking-[0.4em] uppercase font-medium">
                Especialidades
              </span>
              <span className="h-px w-12 bg-gold/40" />
            </div>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light text-cream tracking-wide">
              Procedimentos
            </h2>
          </div>
        </AnimatedSection>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {procedimentos.map((proc, i) => (
            <AnimatedSection key={proc.title} delay={i * 0.05}>
              <motion.div
                whileHover={{ y: -8 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="group relative p-8 bg-navy border border-cream/5 hover:border-gold/20 transition-all duration-500 h-full"
              >
                <div className="absolute top-0 left-0 w-0 h-px bg-gold transition-all duration-500 group-hover:w-full" />
                <div className="absolute top-0 right-0 w-px h-0 bg-gold transition-all duration-500 group-hover:h-full" />
                <div className="absolute bottom-0 right-0 w-0 h-px bg-gold transition-all duration-500 group-hover:w-full" />
                <div className="absolute bottom-0 left-0 w-px h-0 bg-gold transition-all duration-500 group-hover:h-full" />

                <div className="text-gold/60 group-hover:text-gold transition-colors duration-300 mb-6">
                  {proc.icon}
                </div>

                <h3 className="font-serif text-xl text-cream mb-3 tracking-wide">
                  {proc.title}
                </h3>

                <p className="text-cream/50 text-sm leading-relaxed font-light">
                  {proc.description}
                </p>
              </motion.div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
