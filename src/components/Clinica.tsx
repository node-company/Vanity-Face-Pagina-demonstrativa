"use client";

import { useEffect, useRef, useState } from "react";
import AnimatedSection from "./AnimatedSection";

export default function Clinica() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
        const video = videoRef.current;
        if (!video) return;
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="clinica"
      className="relative bg-navy-light py-32 lg:py-48 overflow-hidden"
    >
      <div className="section-rule" />

      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        <AnimatedSection>
          <div className="grid lg:grid-cols-12 gap-y-10 lg:gap-x-16 items-end mb-16 lg:mb-24">
            <div className="lg:col-span-7">
              <div className="flex items-center gap-4 mb-8">
                <span className="text-[0.65rem] tabular tracking-[0.3em] text-gold/70">
                  04
                </span>
                <span className="eyebrow text-gold">A Clínica</span>
              </div>
              <h2 className="font-serif text-[clamp(2.75rem,6vw,5.25rem)] font-light leading-[0.98] tracking-[-0.02em] text-cream text-balance">
                Uma clínica onde
                <br />
                <span className="italic text-gold">cada detalhe</span> conta.
              </h2>
            </div>
            <div className="lg:col-span-4 lg:col-start-9">
              <p className="text-cream/70 text-base lg:text-lg font-light leading-relaxed body-prose">
                Em Vitória — ES, projetamos um ambiente discreto e técnico para
                acolher quem nos procura. Cada sala foi pensada para
                aproximar conforto, segurança e privacidade.
              </p>
            </div>
          </div>
        </AnimatedSection>

        <div className="grid lg:grid-cols-12 gap-y-12 lg:gap-x-12 items-start">
          <AnimatedSection delay={0.1} className="lg:col-span-7">
            <div
              ref={containerRef}
              className="relative aspect-[16/10] overflow-hidden bg-navy"
            >
              <video
                ref={videoRef}
                loop
                muted
                playsInline
                preload="none"
                poster="/images/frente-clinica.jpg"
                className="w-full h-full object-cover"
              >
                {isVisible && (
                  <source src="/images/video-espaco.mp4" type="video/mp4" />
                )}
              </video>
              <div className="absolute inset-0 ring-1 ring-inset ring-gold/15 pointer-events-none" />
            </div>
            <div className="mt-4 flex items-baseline justify-between text-cream/75">
              <span className="italic-soft text-sm">
                R. Alaor de Queiróz Araújo, 296 — Enseada do Suá · Edifício Bay Center, loja 03 e 04
              </span>
              <span className="text-[0.6rem] tabular tracking-widest text-gold/70">VIX</span>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.2} className="lg:col-span-5 lg:pl-4">
            <div className="space-y-10">
              <div>
                <h3 className="font-serif text-3xl text-cream font-light leading-tight">
                  Ambiente <span className="italic text-gold">de excelência</span>
                </h3>
                <p className="mt-5 text-cream/70 body-prose font-light text-[1.02rem] leading-relaxed">
                  Cada decisão de projeto foi tomada para sustentar o trabalho
                  cirúrgico e o bem-estar dos pacientes. Sala de procedimentos
                  com tecnologia atual, recepção reservada e total privacidade.
                </p>
              </div>

              <ul className="space-y-5 border-t border-cream/12 pt-8">
                {[
                  { label: "Recepção reservada", note: "Privacidade total" },
                  { label: "Sala cirúrgica equipada", note: "Padrão hospitalar" },
                  { label: "Sala de avaliação", note: "Análise facial detalhada" },
                  { label: "Estacionamento", note: "No próprio edifício" },
                ].map((item, i) => (
                  <li
                    key={item.label}
                    className="flex items-baseline justify-between gap-4 border-b border-cream/8 pb-4 last:border-b-0"
                  >
                    <div className="flex items-baseline gap-4">
                      <span className="text-[0.6rem] tabular tracking-widest text-gold/70">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="text-cream text-[1rem] font-medium">
                        {item.label}
                      </span>
                    </div>
                    <span className="italic-soft text-sm text-cream/75">
                      {item.note}
                    </span>
                  </li>
                ))}
              </ul>

              <a
                href="#contato"
                className="link-underline text-gold text-sm font-medium tracking-[0.2em] uppercase"
              >
                Visitar a clínica
                <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.4">
                  <path d="M2 6h8M7 3l3 3-3 3" strokeLinecap="square" />
                </svg>
              </a>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
