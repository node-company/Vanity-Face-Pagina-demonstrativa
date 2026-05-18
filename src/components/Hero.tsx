"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { OpenLeadFormButton } from "@/components/LeadFormModal";

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [enableVideo, setEnableVideo] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const connection = (
      navigator as Navigator & {
        connection?: { saveData?: boolean; effectiveType?: string };
      }
    ).connection;
    const saveData = !!connection?.saveData;
    const slowNetwork =
      !!connection?.effectiveType &&
      ["slow-2g", "2g"].includes(connection.effectiveType);

    if (prefersReducedMotion || saveData || slowNetwork) return;

    const idle =
      "requestIdleCallback" in window
        ? (window as Window & typeof globalThis).requestIdleCallback
        : (cb: () => void) => window.setTimeout(cb, 400);

    const handle = idle(() => setEnableVideo(true));
    return () => {
      if ("cancelIdleCallback" in window && typeof handle === "number") {
        (window as Window & typeof globalThis).cancelIdleCallback?.(handle);
      } else if (typeof handle === "number") {
        window.clearTimeout(handle);
      }
    };
  }, []);

  useEffect(() => {
    if (!enableVideo) return;
    const v = videoRef.current;
    if (!v) return;

    const onCanPlay = () => setLoaded(true);

    if (v.readyState >= 2) {
      setLoaded(true);
    } else {
      v.addEventListener("loadeddata", onCanPlay);
    }

    v.play().catch(() => {});

    return () => v.removeEventListener("loadeddata", onCanPlay);
  }, [enableVideo]);

  return (
    <section
      id="inicio"
      className="relative min-h-[100svh] overflow-hidden bg-navy-deep"
    >
      <div className="absolute inset-0">
        <Image
          src="/images/frente-clinica.jpg"
          alt=""
          fill
          priority
          fetchPriority="high"
          sizes="100vw"
          className={`object-cover object-center transition-opacity duration-700 ${
            loaded ? "opacity-0" : "opacity-100"
          }`}
        />
        {enableVideo && (
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            poster="/images/frente-clinica.jpg"
            aria-hidden="true"
            className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-1000 ${
              loaded ? "opacity-100" : "opacity-0"
            }`}
          >
            <source src="/images/video-header.mp4" type="video/mp4" />
          </video>
        )}
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-navy/65 via-navy/35 to-navy/95" />
      <div className="absolute inset-0 bg-gradient-to-r from-navy/70 via-transparent to-transparent" />

      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-navy/80 to-transparent pointer-events-none" />

      <div className="relative z-10 min-h-[100svh] flex flex-col">
        <div className="flex-1 flex items-center">
          <div className="w-full max-w-[1440px] mx-auto px-6 lg:px-12 pt-32 pb-24">
            <div className="grid lg:grid-cols-12 gap-8 items-end">
              <div className="lg:col-span-8 xl:col-span-7">
                <div className="flex items-center gap-4 mb-10">
                  <span className="h-px w-12 bg-gold/70" />
                  <span className="eyebrow text-gold">
                    Clínica de Cirurgia Facial
                  </span>
                </div>

                <h1 className="font-serif text-[clamp(3.5rem,9vw,8.5rem)] font-light leading-[0.92] tracking-[-0.02em] text-cream text-balance">
                  Onde você encontra
                  <br />
                  <span className="italic font-light text-gold">
                    a sua melhor versão.
                  </span>
                </h1>

                <p className="mt-10 max-w-xl text-cream/80 text-base md:text-lg font-light leading-relaxed">
                  Cirurgia facial avançada, harmonização e cuidado discreto.
                  Em Vitória — ES, o consultório do Dr. Vitor S. Fernandes recebe
                  pacientes que buscam resultados naturais e duradouros.
                </p>
              </div>

              <div className="lg:col-span-4 xl:col-span-5 flex flex-col gap-4 animate-hero-delayed lg:justify-self-end lg:items-end">
                <OpenLeadFormButton className="btn-primary w-full lg:w-auto">
                  Agendar consulta
                  <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
                    <path d="M2 6h8M7 3l3 3-3 3" strokeLinecap="square" />
                  </svg>
                </OpenLeadFormButton>
                <a href="#sobre" className="btn-ghost w-full lg:w-auto">
                  Conhecer o Dr.
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-cream/10 animate-hero-late">
          <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-6 flex flex-wrap items-center gap-x-10 gap-y-3 text-cream/70">
            <div className="flex items-center gap-3">
              <span className="text-[0.6rem] tabular tracking-widest text-gold/80">01</span>
              <span className="text-xs font-medium tracking-[0.2em] uppercase">
                Platismoplastia
              </span>
            </div>
            <div className="hidden md:block w-px h-3 bg-cream/25" />
            <div className="flex items-center gap-3">
              <span className="text-[0.6rem] tabular tracking-widest text-gold/80">02</span>
              <span className="text-xs font-medium tracking-[0.2em] uppercase">
                Lipo HD de Papada
              </span>
            </div>
            <div className="hidden md:block w-px h-3 bg-cream/25" />
            <div className="flex items-center gap-3">
              <span className="text-[0.6rem] tabular tracking-widest text-gold/80">03</span>
              <span className="text-xs font-medium tracking-[0.2em] uppercase">
                Deep Neck Lift
              </span>
            </div>
            <div className="hidden md:block w-px h-3 bg-cream/25" />
            <div className="flex items-center gap-3">
              <span className="text-[0.6rem] tabular tracking-widest text-gold/80">04</span>
              <span className="text-xs font-medium tracking-[0.2em] uppercase">
                Harmonização Full Face
              </span>
            </div>

            <div className="ml-auto flex items-center gap-3 text-cream/70">
              <span className="italic-soft text-sm">Vitória — ES</span>
              <span className="w-px h-3 bg-cream/30" />
              <span className="text-[0.65rem] tracking-[0.2em] uppercase">
                CRO 8723-ES
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
