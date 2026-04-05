"use client";

import { motion } from "framer-motion";
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
        quality={90}
      />

      <div className="absolute inset-0 bg-gradient-to-b from-navy/80 via-navy/60 to-navy" />

      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23c9a84c' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }} />

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
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
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a
            href="https://wa.me/5527995351115?text=Ol%C3%A1%2C%20gostaria%20de%20agendar%20uma%20consulta."
            target="_blank"
            rel="noopener noreferrer"
            className="group px-10 py-4 bg-gold text-navy font-semibold text-sm tracking-widest uppercase transition-all duration-300 hover:bg-gold-light hover:shadow-lg hover:shadow-gold/20"
          >
            Agende sua Consulta
          </a>
          <a
            href="#sobre"
            className="px-10 py-4 border border-cream/20 text-cream/70 font-medium text-sm tracking-widest uppercase transition-all duration-300 hover:border-gold/50 hover:text-gold"
          >
            Conheca o Dr.
          </a>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-5 h-8 border border-cream/30 rounded-full flex justify-center pt-2"
        >
          <div className="w-1 h-1.5 bg-gold rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
}
