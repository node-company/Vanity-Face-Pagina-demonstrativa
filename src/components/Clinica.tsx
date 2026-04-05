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
    <section id="clinica" className="relative py-28 lg:py-36 bg-navy-light">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <AnimatedSection>
          <div className="text-center mb-20">
            <div className="flex items-center justify-center gap-4 mb-4">
              <span className="h-px w-12 bg-gold/40" />
              <span className="text-gold text-xs tracking-[0.4em] uppercase font-medium">
                Nosso Espaco
              </span>
              <span className="h-px w-12 bg-gold/40" />
            </div>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light text-cream tracking-wide">
              A Clinica
            </h2>
          </div>
        </AnimatedSection>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <AnimatedSection delay={0.1}>
            <div ref={containerRef} className="relative aspect-[16/10] overflow-hidden">
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
              <div className="absolute inset-0 border border-gold/10 pointer-events-none" />
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <div className="space-y-6">
              <h3 className="font-serif text-2xl md:text-3xl text-cream font-light tracking-wide">
                Ambiente de <span className="text-gold">Excelencia</span>
              </h3>
              <p className="text-cream/60 leading-relaxed font-light">
                A Clinica Vanity Face foi projetada para oferecer uma experiencia unica de
                conforto e sofisticacao. Cada detalhe do nosso espaco foi pensado para
                transmitir seguranca e acolhimento, desde a recepcao ate as salas de
                procedimento equipadas com tecnologia de ultima geracao.
              </p>
              <p className="text-cream/60 leading-relaxed font-light">
                Localizada em Vitoria &mdash; ES, nossa clinica conta com infraestrutura
                completa para realizar procedimentos de harmonizacao e cirurgia facial com
                total seguranca e conforto para nossos pacientes.
              </p>

              <div className="grid grid-cols-3 gap-6 pt-6 border-t border-cream/10">
                <div className="text-center">
                  <p className="text-gold font-serif text-2xl font-light">100%</p>
                  <p className="text-cream/40 text-xs tracking-wider uppercase mt-1">Equipado</p>
                </div>
                <div className="text-center">
                  <p className="text-gold font-serif text-2xl font-light">Alto</p>
                  <p className="text-cream/40 text-xs tracking-wider uppercase mt-1">Padrao</p>
                </div>
                <div className="text-center">
                  <p className="text-gold font-serif text-2xl font-light">Total</p>
                  <p className="text-cream/40 text-xs tracking-wider uppercase mt-1">Conforto</p>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>

      </div>
    </section>
  );
}
