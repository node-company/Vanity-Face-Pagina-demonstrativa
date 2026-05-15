"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import AnimatedSection from "./AnimatedSection";
import { OpenLeadFormButton } from "@/components/LeadFormModal";
import type { PROCEDURE_OPTIONS } from "@/lib/validators";

type ProcedureKey = (typeof PROCEDURE_OPTIONS)[number];

type Procedimento = {
  index: string;
  title: string;
  description: string;
  image: string;
  duration: string;
  highlight?: string;
  formKey: ProcedureKey;
};

const procedimentos: Procedimento[] = [
  {
    index: "01",
    title: "Platismoplastia",
    description:
      "Cirurgia de definição do contorno cervical e rejuvenescimento do pescoço. Técnica que devolve o ângulo natural entre rosto e mandíbula.",
    image: "/images/procedures/platismoplastia.png",
    duration: "Cirurgia",
    highlight: "Especialidade da clínica",
    formKey: "facelift",
  },
  {
    index: "02",
    title: "Lipo HD de Papada",
    description:
      "Lipoaspiração de alta definição para remoção precisa da papada. Resultado discreto, com recuperação curta e cicatrizes mínimas.",
    image: "/images/procedures/lipo-hd-papada.png",
    duration: "Procedimento",
    formKey: "lipo_papada",
  },
  {
    index: "03",
    title: "Deep Neck Lift",
    description:
      "Lifting profundo do pescoço para tratar flacidez avançada. Aborda musculatura, gordura e pele em uma única intervenção.",
    image: "/images/procedures/deep-neck-lift.png",
    duration: "Cirurgia",
    formKey: "facelift",
  },
  {
    index: "04",
    title: "Blefaroplastia a Laser",
    description:
      "Lifting de pálpebra com laser para rejuvenescimento do olhar. Corrige excesso de pele e bolsas com cicatriz mínima.",
    image: "/images/procedures/blefaroplastia.png",
    duration: "Cirurgia",
    formKey: "palpebra",
  },
  {
    index: "05",
    title: "Harmonização Full Face",
    description:
      "Plano facial completo combinando técnicas injetáveis e ultrassom focado. Equilíbrio sob medida para a sua face.",
    image: "/images/procedures/harmonizacao-full-face.png",
    duration: "Sessão",
    formKey: "bioestimulador",
  },
  {
    index: "06",
    title: "Preenchimento Labial",
    description:
      "Volumização e contorno com ácido hialurônico de última geração. Lábios definidos, com expressão natural.",
    image: "/images/procedures/preenchimento-labial.png",
    duration: "Sessão",
    formKey: "bioestimulador",
  },
  {
    index: "07",
    title: "Fios de PDO",
    description:
      "Sustentação facial com fios absorvíveis. Efeito tensor imediato e estímulo gradual de colágeno.",
    image: "/images/procedures/fios-de-pdo.png",
    duration: "Procedimento",
    formKey: "bioestimulador",
  },
  {
    index: "08",
    title: "Lipo Facial Localizada",
    description:
      "Refinamento do contorno mandibular e do ângulo cervical por remoção precisa de gordura.",
    image: "/images/procedures/lipo-facial.png",
    duration: "Procedimento",
    formKey: "lipo_papada",
  },
];

export default function Procedimentos() {
  const [activeIndex, setActiveIndex] = useState(0);
  const itemRefs = useRef<(HTMLElement | null)[]>([]);
  const mobileBlockRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    let raf = 0;

    const compute = () => {
      const isMobile = window.matchMedia("(max-width: 1023px)").matches;
      const refs = isMobile ? mobileBlockRefs.current : itemRefs.current;
      if (!refs.length) return;
      const targetY = isMobile
        ? window.innerHeight * 0.55
        : window.innerHeight / 2;
      let bestIdx = -1;
      let bestDist = Infinity;
      refs.forEach((el, i) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        if (rect.height === 0) return;
        const elCenter = rect.top + rect.height / 2;
        const dist = Math.abs(elCenter - targetY);
        if (dist < bestDist) {
          bestDist = dist;
          bestIdx = i;
        }
      });
      if (bestIdx >= 0) setActiveIndex(bestIdx);
    };

    const onScroll = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(() => {
        compute();
        raf = 0;
      });
    };

    compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      if (raf) window.cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <section
      id="procedimentos"
      className="relative bg-navy-light py-32 lg:py-48"
    >
      <div className="section-rule" />

      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        <AnimatedSection>
          <div className="grid lg:grid-cols-12 gap-y-10 lg:gap-x-16 items-end mb-20 lg:mb-32">
            <div className="lg:col-span-5">
              <div className="flex items-center gap-4 mb-8">
                <span className="text-[0.65rem] tabular tracking-[0.3em] text-gold/70">
                  02
                </span>
                <span className="eyebrow text-gold">Procedimentos</span>
              </div>
              <h2 className="font-serif text-[clamp(2.75rem,6vw,5.25rem)] font-light leading-[0.98] tracking-[-0.02em] text-cream text-balance">
                Um portfolio
                <br />
                <span className="italic text-gold">cirúrgico e estético</span>
                <br />
                completo.
              </h2>
            </div>

            <div className="lg:col-span-6 lg:col-start-7">
              <p className="text-cream/70 text-base lg:text-lg font-light leading-relaxed body-prose">
                Do refinamento sutil ao gesto cirúrgico, cada procedimento é
                desenhado a partir de uma análise detalhada da sua face — nunca
                de um catálogo. A seguir, role para conhecer cada técnica.
              </p>
            </div>
          </div>
        </AnimatedSection>

        <div className="grid lg:grid-cols-12 lg:gap-x-16 relative">
          <div className="lg:col-span-7">
            <div className="lg:hidden">
              <div className="sticky top-[68px] z-10 -mx-6 mb-2">
                <div className="relative h-[32vh] overflow-hidden bg-navy">
                  {procedimentos.map((p, i) => (
                    <div
                      key={p.image}
                      className={`absolute inset-0 transition-opacity duration-700 ease-out ${
                        activeIndex === i ? "opacity-100" : "opacity-0"
                      }`}
                    >
                      <Image
                        src={p.image}
                        alt={p.title}
                        fill
                        className="object-cover"
                        sizes="100vw"
                        priority={i === 0}
                        loading={i === 0 ? "eager" : "lazy"}
                      />
                    </div>
                  ))}

                  <div className="absolute inset-0 bg-gradient-to-b from-navy/40 via-transparent to-navy/70 pointer-events-none" />

                  <div className="absolute top-4 left-5 right-5 flex items-baseline justify-between text-cream pointer-events-none">
                    <span className="italic-soft text-base">
                      {procedimentos[activeIndex]?.title}
                    </span>
                    <span className="text-[0.65rem] tabular tracking-widest text-gold">
                      {procedimentos[activeIndex]?.index} / {String(procedimentos.length).padStart(2, "0")}
                    </span>
                  </div>

                  <div className="absolute bottom-0 inset-x-0 h-1 bg-cream/10 pointer-events-none">
                    <div
                      className="h-full bg-gold transition-[width] duration-500 ease-out"
                      style={{
                        width: `${((activeIndex + 1) / procedimentos.length) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              <div>
                {procedimentos.map((p, i) => {
                  const isActive = activeIndex === i;
                  return (
                    <article
                      key={p.index}
                      ref={(el) => {
                        mobileBlockRefs.current[i] = el;
                      }}
                      className="min-h-[55vh] flex flex-col justify-center py-10"
                    >
                      <div
                        className={`flex items-baseline gap-3 mb-4 transition-colors duration-500 ${
                          isActive ? "" : "opacity-70"
                        }`}
                      >
                        <span
                          className={`font-serif text-3xl font-light tabular leading-none transition-colors duration-500 ${
                            isActive ? "text-gold" : "text-gold/40"
                          }`}
                        >
                          {p.index}
                        </span>
                        <span className="h-px flex-1 bg-cream/15" />
                        <span className="text-[0.6rem] tabular tracking-[0.25em] uppercase text-cream/45">
                          {p.duration}
                        </span>
                      </div>

                      <h3
                        className={`font-serif text-[2rem] font-light leading-tight tracking-[-0.01em] transition-colors duration-500 ${
                          isActive ? "text-cream" : "text-cream/60"
                        }`}
                      >
                        {p.title}
                      </h3>

                      <p
                        className={`mt-4 text-[0.95rem] font-light leading-relaxed body-prose transition-colors duration-500 ${
                          isActive ? "text-cream/75" : "text-cream/55"
                        }`}
                      >
                        {p.description}
                      </p>

                      <OpenLeadFormButton
                        procedure={p.formKey}
                        className={`link-underline mt-6 w-fit text-sm font-medium tracking-[0.2em] uppercase transition-colors duration-500 ${
                          isActive ? "text-gold" : "text-gold/60"
                        }`}
                      >
                        Conversar sobre
                        <svg
                          className="w-3 h-3"
                          viewBox="0 0 12 12"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.4"
                        >
                          <path d="M2 6h8M7 3l3 3-3 3" strokeLinecap="square" />
                        </svg>
                      </OpenLeadFormButton>
                    </article>
                  );
                })}
              </div>
            </div>

            <div className="hidden lg:block">
              {procedimentos.map((p, i) => (
                <article
                  key={p.index}
                  ref={(el) => {
                    itemRefs.current[i] = el;
                  }}
                  className="min-h-[80vh] flex flex-col justify-center py-12"
                >
                  <div
                    className={`transition-all duration-700 ease-out ${
                      activeIndex === i
                        ? "opacity-100 translate-y-0"
                        : "opacity-40 translate-y-2"
                    }`}
                  >
                    <div className="flex items-baseline gap-4 mb-6">
                      <span
                        className={`font-serif text-5xl font-light tabular leading-none transition-colors duration-500 ${
                          activeIndex === i ? "text-gold" : "text-cream/30"
                        }`}
                      >
                        {p.index}
                      </span>
                      <span className="h-px flex-1 bg-cream/15" />
                      <span className="text-[0.6rem] tabular tracking-[0.25em] uppercase text-cream/45">
                        {p.duration}
                      </span>
                    </div>

                    <h3
                      className={`font-serif text-[clamp(2.5rem,4.5vw,4rem)] font-light leading-[1.02] tracking-[-0.015em] transition-colors duration-500 ${
                        activeIndex === i ? "text-cream" : "text-cream/55"
                      }`}
                    >
                      {p.title}
                    </h3>

                    <p
                      className={`mt-6 text-cream/75 text-[1.05rem] font-light leading-relaxed body-prose max-w-lg transition-opacity duration-500 ${
                        activeIndex === i ? "opacity-100" : "opacity-50"
                      }`}
                    >
                      {p.description}
                    </p>

                    {p.highlight && activeIndex === i && (
                      <p className="mt-6 italic-soft text-gold/80 text-sm tracking-wide">
                        {p.highlight}
                      </p>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="hidden lg:block lg:col-span-5">
            <div className="sticky top-24 h-[calc(100vh-7rem)] flex items-center justify-center">
              <div
                className="relative aspect-[4/5] overflow-hidden bg-navy"
                style={{ height: "min(78vh, 36rem)", width: "auto" }}
              >
                {procedimentos.map((p, i) => (
                  <div
                    key={p.image}
                    className={`absolute inset-0 transition-all duration-1000 ease-out ${
                      activeIndex === i
                        ? "opacity-100 scale-100"
                        : "opacity-0 scale-[1.04]"
                    }`}
                  >
                    <Image
                      src={p.image}
                      alt={p.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 40vw"
                      priority={i === 0}
                      loading={i === 0 ? "eager" : "lazy"}
                    />
                  </div>
                ))}

                <div className="absolute inset-0 pointer-events-none ring-1 ring-inset ring-gold/15" />

                <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-navy/60 to-transparent pointer-events-none" />

                <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between text-cream/80 pointer-events-none">
                  <span className="italic-soft text-base">
                    {procedimentos[activeIndex].title}
                  </span>
                  <span className="text-[0.65rem] tabular tracking-widest text-gold">
                    {procedimentos[activeIndex].index} / {String(procedimentos.length).padStart(2, "0")}
                  </span>
                </div>
              </div>

              <div className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 hidden xl:flex flex-col items-center gap-2">
                {procedimentos.map((p, i) => (
                  <button
                    key={p.index}
                    onClick={() => {
                      itemRefs.current[i]?.scrollIntoView({
                        behavior: "smooth",
                        block: "center",
                      });
                    }}
                    aria-label={`Ir para ${p.title}`}
                    className={`block w-px transition-all duration-500 ${
                      activeIndex === i
                        ? "h-10 bg-gold"
                        : "h-5 bg-cream/25 hover:bg-cream/60"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <AnimatedSection>
          <div className="mt-24 lg:mt-40 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8 border-t border-cream/12 pt-12">
            <p className="italic-soft text-lg text-cream/70 max-w-md">
              Nem todo procedimento é indicado a todos. A consulta inicial define o caminho.
            </p>
            <OpenLeadFormButton className="btn-primary">
              Agendar Consulta
              <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.4">
                <path d="M2 6h8M7 3l3 3-3 3" strokeLinecap="square" />
              </svg>
            </OpenLeadFormButton>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
