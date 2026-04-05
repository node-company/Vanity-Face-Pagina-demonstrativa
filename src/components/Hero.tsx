"use client";

import Image from "next/image";

export default function Hero() {
  return (
    <section
      id="inicio"
      className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden"
    >
      <Image
        src="/images/frente-clinica.png"
        alt="Fachada da Clinica Vanity Face"
        fill
        className="object-cover object-center"
        priority
      />

      <div className="absolute inset-0 bg-gradient-to-b from-navy/80 via-navy/60 to-navy" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <div className="animate-hero">
          <div className="flex items-center justify-center gap-4 mb-8">
            <span className="h-px w-16 bg-gold/50" />
            <span className="text-gold text-xs tracking-[0.4em] uppercase font-medium">
              Dr. Vitor Fernandes
            </span>
            <span className="h-px w-16 bg-gold/50" />
          </div>

          <h1 className="font-serif text-6xl md:text-8xl lg:text-9xl font-light tracking-wide text-cream mb-6">
            VANITY{" "}
            <span className="text-gold">FACE</span>
          </h1>

          <p className="text-cream/60 text-lg md:text-xl tracking-[0.2em] uppercase font-light mb-4">
            Harmonizacao e Cirurgia Facial
          </p>

          <p className="text-cream/40 text-sm tracking-widest uppercase mb-12">
            CRO 8723-ES &mdash; Vitoria, ES
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-hero-delayed">
          <a
            href="https://wa.me/5527995351115?text=Ol%C3%A1%2C%20gostaria%20de%20agendar%20uma%20consulta."
            target="_blank"
            rel="noopener noreferrer"
            className="group px-10 py-4 bg-gold text-navy font-semibold text-sm tracking-widest uppercase transition-colors duration-300 hover:bg-gold-light"
          >
            Agende sua Consulta
          </a>
          <a
            href="#sobre"
            className="px-10 py-4 border border-cream/20 text-cream/70 font-medium text-sm tracking-widest uppercase transition-colors duration-300 hover:border-gold/50 hover:text-gold"
          >
            Conheca o Dr.
          </a>
        </div>
      </div>
    </section>
  );
}
