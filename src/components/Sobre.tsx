import Image from "next/image";
import AnimatedSection from "./AnimatedSection";
import { OpenLeadFormButton } from "@/components/LeadFormModal";

export default function Sobre() {
  return (
    <section
      id="sobre"
      className="relative bg-navy pt-32 lg:pt-48 pb-28 lg:pb-40 overflow-hidden"
    >
      <div className="section-rule" />

      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        <AnimatedSection>
          <div className="flex items-baseline justify-between gap-6 mb-16 lg:mb-24">
            <div className="flex items-center gap-4">
              <span className="text-[0.65rem] tabular tracking-[0.3em] text-gold/70">
                01
              </span>
              <span className="eyebrow text-gold">O Especialista</span>
            </div>
            <span className="hidden md:block flex-1 h-px bg-cream/10" />
            <span className="hidden md:inline italic-soft text-sm text-cream/75">
              Vitória — ES
            </span>
          </div>
        </AnimatedSection>

        <div className="grid lg:grid-cols-12 gap-y-16 lg:gap-x-16 items-end">
          <div className="lg:col-span-5 lg:sticky lg:top-32">
            <AnimatedSection delay={0.1}>
              <div className="relative">
                <div className="relative aspect-[3/4] w-[82%] overflow-hidden bg-navy-light">
                  <Image
                    src="/images/dr-vitor-action.jpg"
                    alt="Dr. Vitor S. Fernandes"
                    fill
                    className="object-cover object-top"
                    sizes="(max-width: 1024px) 82vw, 36vw"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 ring-1 ring-inset ring-gold/15 pointer-events-none" />
                </div>

                <div
                  className="relative aspect-[4/5] w-[57%] overflow-hidden bg-navy-light ml-auto -mt-[28%]"
                  style={{ boxShadow: "0 0 0 6px var(--color-navy)" }}
                >
                  <Image
                    src="/images/dr-vitor-portrait.jpg"
                    alt="Dr. Vitor Fernandes no centro cirúrgico"
                    fill
                    className="object-cover object-center"
                    sizes="(max-width: 1024px) 57vw, 24vw"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 ring-1 ring-inset ring-gold/15 pointer-events-none" />
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.12}>
              <div className="mt-5 flex items-baseline justify-between text-cream/75">
                <span className="italic-soft text-sm">
                  Dr. Vitor S. Fernandes
                </span>
                <span className="text-[0.6rem] tabular tracking-widest text-gold/70">
                  CRO 8723-ES
                </span>
              </div>
            </AnimatedSection>
          </div>

          <div className="lg:col-span-7 lg:pl-8">
            <AnimatedSection delay={0.15}>
              <h2 className="font-serif text-[clamp(2.75rem,6vw,5.25rem)] font-light leading-[0.98] tracking-[-0.02em] text-cream text-balance">
                Cirurgia facial pensada
                <br />
                como <span className="italic text-gold">arte</span>—
                <br />
                executada como ciência.
              </h2>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <div className="mt-12 space-y-7 text-cream/75 body-prose text-[1.05rem] font-light">
                <p>
                  Dr. Vitor S. Fernandes é referência em{" "}
                  <em className="text-cream not-italic font-normal">Platismoplastia</em>,{" "}
                  <em className="text-cream not-italic font-normal">Lipo HD de Papada</em> e{" "}
                  <em className="text-cream not-italic font-normal">Deep Neck Lift</em>. Mais de seis
                  anos dedicados a entender, antes de tudo, a face de cada
                  paciente — para então desenhar o procedimento que melhor
                  respeita a sua identidade.
                </p>
                <p>
                  Especialista em Harmonização Orofacial pela FAIPE, foi
                  destaque como Personalidade na revista Danilo Leonel e é
                  reconhecido nacionalmente entre os nomes de referência em
                  Platismoplastia.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.25}>
              <div className="mt-14 grid grid-cols-2 sm:grid-cols-3 gap-y-10 gap-x-6 pt-10 border-t border-cream/10">
                <div>
                  <p className="font-serif text-5xl font-light text-gold leading-none tabular">
                    +6
                  </p>
                  <p className="mt-3 text-[0.65rem] font-medium tracking-[0.25em] uppercase text-cream/75">
                    Anos de prática
                  </p>
                </div>
                <div>
                  <p className="font-serif text-5xl font-light text-gold leading-none tabular">
                    8723
                  </p>
                  <p className="mt-3 text-[0.65rem] font-medium tracking-[0.25em] uppercase text-cream/75">
                    CRO — Espírito Santo
                  </p>
                </div>
                <div>
                  <p className="font-serif text-5xl font-light text-gold leading-none">
                    <span className="italic">Faipe</span>
                  </p>
                  <p className="mt-3 text-[0.65rem] font-medium tracking-[0.25em] uppercase text-cream/75">
                    Especialista certificado
                  </p>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.3}>
              <div className="mt-14 flex flex-wrap gap-x-8 gap-y-4 items-center">
                <a
                  href="https://www.instagram.com/drvitorsilvafernandes/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-underline text-gold text-sm font-medium tracking-[0.2em] uppercase"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                  @drvitorsilvafernandes
                </a>
                <span className="hidden sm:block w-px h-4 bg-cream/15" />
                <OpenLeadFormButton className="link-underline text-gold text-sm font-medium tracking-[0.2em] uppercase">
                  Falar com a equipe
                  <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.4">
                    <path d="M2 6h8M7 3l3 3-3 3" strokeLinecap="square" />
                  </svg>
                </OpenLeadFormButton>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </section>
  );
}
