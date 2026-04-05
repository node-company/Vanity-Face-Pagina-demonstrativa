"use client";

import Image from "next/image";
import AnimatedSection from "./AnimatedSection";

export default function Sobre() {
  return (
    <section id="sobre" className="relative py-28 lg:py-36 bg-navy">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <AnimatedSection>
          <div className="flex items-center gap-4 mb-4">
            <span className="h-px w-12 bg-gold/40" />
            <span className="text-gold text-xs tracking-[0.4em] uppercase font-medium">
              Especialista
            </span>
          </div>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light text-cream mb-16 tracking-wide">
            Dr. Vitor <span className="text-gold">Fernandes</span>
          </h2>
        </AnimatedSection>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <AnimatedSection delay={0.1}>
            <div className="relative">
              <div className="relative aspect-[3/4] overflow-hidden">
                <Image
                  src="/images/dr-vitor-1.jpg"
                  alt="Dr. Vitor Fernandes na Clinica Vanity Face"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-48 h-64 border border-gold/20 -z-10" />
              <div className="absolute -top-4 -left-4 w-24 h-24 border-t border-l border-gold/30" />
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <div className="space-y-6">
              <p className="text-cream/70 text-lg leading-relaxed font-light">
                Dr. Vitor S. Fernandes e referencia em <strong className="text-gold font-medium">Harmonizacao e Cirurgia Facial</strong>,
                com mais de 6 anos de experiencia em procedimentos esteticos faciais. Especialista em
                Harmonizacao Orofacial certificado pela FAIPE, e reconhecido como autoridade em
                Platismoplastia e Lipo de Papada HD.
              </p>

              <p className="text-cream/60 leading-relaxed font-light">
                Foi destaque como &ldquo;Personalidade Destaque&rdquo; na revista Danilo Leonel,
                sendo reconhecido como referencia nacional em Platismoplastia. Atua na Clinica
                Vanity Face em Vitoria &mdash; ES, oferecendo procedimentos de excelencia com
                resultados naturais e seguros.
              </p>

              <div className="grid grid-cols-2 gap-6 pt-6 border-t border-cream/10">
                <div>
                  <p className="text-gold font-serif text-3xl font-light">+6</p>
                  <p className="text-cream/50 text-sm tracking-wider uppercase mt-1">Anos de experiencia</p>
                </div>
                <div>
                  <p className="text-gold font-serif text-3xl font-light">CRO</p>
                  <p className="text-cream/50 text-sm tracking-wider uppercase mt-1">8723-ES</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 pt-4">
                <span className="px-4 py-2 border border-gold/20 text-gold/80 text-xs tracking-wider uppercase">
                  Harmonizacao Orofacial
                </span>
                <span className="px-4 py-2 border border-gold/20 text-gold/80 text-xs tracking-wider uppercase">
                  FAIPE
                </span>
                <span className="px-4 py-2 border border-gold/20 text-gold/80 text-xs tracking-wider uppercase">
                  Cirurgia Facial
                </span>
              </div>

              <a
                href="https://www.instagram.com/drvitorsilvafernandes/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 text-gold text-sm tracking-wider uppercase font-medium mt-4 hover:text-gold-light transition-colors group"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
                @drvitorsilvafernandes
                <span className="h-px w-0 bg-gold transition-all duration-300 group-hover:w-8" />
              </a>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
