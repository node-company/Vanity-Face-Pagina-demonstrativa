import AnimatedSection from "./AnimatedSection";

export default function Contato() {
  return (
    <section id="contato" className="relative bg-navy py-32 lg:py-48">
      <div className="section-rule" />

      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        <AnimatedSection>
          <div className="grid lg:grid-cols-12 gap-y-8 lg:gap-x-16 items-end mb-16 lg:mb-24">
            <div className="lg:col-span-8">
              <div className="flex items-center gap-4 mb-8">
                <span className="text-[0.65rem] tabular tracking-[0.3em] text-gold/70">
                  05
                </span>
                <span className="eyebrow text-gold">Agendamento</span>
              </div>
              <h2 className="font-serif text-[clamp(2.75rem,6vw,5.25rem)] font-light leading-[0.98] tracking-[-0.02em] text-cream text-balance">
                Comece com uma
                <br />
                <span className="italic text-gold">conversa.</span>
              </h2>
              <p className="mt-8 max-w-xl text-cream/70 text-base lg:text-lg font-light leading-relaxed">
                Toda jornada com a Vanity Face começa por uma avaliação
                cuidadosa. Conte-nos um pouco sobre você e nossa equipe entrará
                em contato.
              </p>
            </div>
          </div>
        </AnimatedSection>

        <div className="grid lg:grid-cols-12 gap-y-12 lg:gap-x-16">
          <AnimatedSection delay={0.1} className="lg:col-span-5">
            <div className="space-y-12">
              <div className="space-y-7 border-t border-cream/15 pt-10">
                <div>
                  <p className="eyebrow text-cream/45 mb-2">WhatsApp</p>
                  <a
                    href="https://wa.me/5527999465417?text=Ol%C3%A1%2C%20gostaria%20de%20agendar%20uma%20consulta."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-serif text-3xl lg:text-4xl text-cream font-light hover:text-gold transition-colors duration-400"
                  >
                    +55 27 99946-5417
                  </a>
                </div>

                <div>
                  <p className="eyebrow text-cream/45 mb-2">Endereço</p>
                  <p className="font-serif text-2xl lg:text-3xl text-cream font-light leading-snug">
                    Edifício Bay Center, nº 296 — loja 03 e 04
                  </p>
                  <p className="italic-soft text-cream/65 mt-1 text-base">
                    Enseada do Suá, Vitória — ES, 29050-245
                  </p>
                </div>

                <div>
                  <p className="eyebrow text-cream/45 mb-2">Instagram</p>
                  <a
                    href="https://www.instagram.com/drvitorsilvafernandes/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-serif text-2xl lg:text-3xl text-cream font-light hover:text-gold transition-colors duration-400"
                  >
                    @drvitorsilvafernandes
                  </a>
                </div>

                <div>
                  <p className="eyebrow text-cream/45 mb-2">Atendimento</p>
                  <p className="text-cream/80 text-base font-light tabular">
                    Segunda a sexta, 9h — 19h
                  </p>
                  <p className="italic-soft text-cream/55 text-sm mt-1">
                    Sábado mediante agendamento
                  </p>
                </div>
              </div>

              <a
                href="https://wa.me/5527999465417?text=Ol%C3%A1%2C%20gostaria%20de%20agendar%20uma%20consulta."
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Iniciar conversa
                <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.4">
                  <path d="M2 6h8M7 3l3 3-3 3" strokeLinecap="square" />
                </svg>
              </a>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.2} className="lg:col-span-7">
            <div className="relative aspect-[5/4] lg:aspect-[4/3] overflow-hidden bg-navy-light">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3741.5!2d-40.2896!3d-20.2997!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sEdif%C3%ADcio+Bay+Center%2C+n%C2%BA+296+-+loja+03+e+04+-+Enseada+do+Su%C3%A1%2C+Vit%C3%B3ria+-+ES%2C+29050-245!5e0!3m2!1spt-BR!2sbr!4v1"
                width="100%"
                height="100%"
                style={{ border: 0, filter: "grayscale(0.3) contrast(0.9) brightness(0.9)" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Localização Clínica Vanity Face"
                className="absolute inset-0"
              />
              <div className="absolute inset-0 pointer-events-none ring-1 ring-inset ring-gold/15" />
            </div>
            <div className="mt-4 flex items-baseline justify-between text-cream/45">
              <span className="italic-soft text-sm">
                Enseada do Suá, Vitória — ES
              </span>
              <span className="text-[0.6rem] tabular tracking-widest text-gold/60">
                -20.2997, -40.2896
              </span>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
