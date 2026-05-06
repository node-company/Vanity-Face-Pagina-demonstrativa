import Image from "next/image";

const navLinks = [
  { label: "O Especialista", href: "#sobre" },
  { label: "Procedimentos", href: "#procedimentos" },
  { label: "Resultados", href: "#resultados" },
  { label: "A Clinica", href: "#clinica" },
  { label: "Contato", href: "#contato" },
];

export default function Footer() {
  return (
    <footer className="relative bg-navy-deep border-t border-cream/10">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 pt-20 lg:pt-24 pb-10">
        <div className="grid lg:grid-cols-12 gap-y-14 lg:gap-x-16">
          <div className="lg:col-span-5 space-y-8">
            <a href="#inicio" className="block">
              <Image
                src="/images/logo.webp"
                alt="Vanity Face"
                width={200}
                height={56}
                className="h-12 w-auto"
                sizes="200px"
                loading="lazy"
              />
            </a>
            <p className="italic-soft text-lg text-cream/65 leading-snug max-w-md">
              Cirurgia e harmonizacao facial com discricao, tecnica e estetica
              autoral.
            </p>
            <div className="flex items-baseline gap-3 text-cream/45">
              <span className="text-[0.6rem] tabular tracking-widest">
                Dr. Vitor S. Fernandes
              </span>
              <span className="w-px h-3 bg-cream/20" />
              <span className="text-[0.6rem] tabular tracking-widest text-gold/70">
                CRO 8723-ES
              </span>
            </div>
          </div>

          <div className="lg:col-span-3">
            <p className="eyebrow text-cream/45 mb-6">Navegar</p>
            <nav className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-cream/70 text-[0.95rem] font-light hover:text-gold transition-colors duration-300 w-fit"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <p className="eyebrow text-cream/45">Contato</p>
            <div className="space-y-4">
              <a
                href="https://wa.me/5527995351115"
                target="_blank"
                rel="noopener noreferrer"
                className="block font-serif text-2xl text-cream font-light hover:text-gold transition-colors duration-400"
              >
                +55 27 99535-1115
              </a>
              <a
                href="https://www.instagram.com/drvitorsilvafernandes/"
                target="_blank"
                rel="noopener noreferrer"
                className="block italic-soft text-base text-cream/70 hover:text-gold transition-colors"
              >
                @drvitorsilvafernandes
              </a>
              <p className="text-cream/55 text-sm font-light leading-relaxed">
                R. Alaor de Queiroz Araujo, 296
                <br />
                Enseada do Sua, Vitoria — ES
              </p>
            </div>
          </div>
        </div>

        <div className="mt-20 pt-8 border-t border-cream/10 flex flex-col md:flex-row items-baseline justify-between gap-4">
          <p className="text-cream/35 text-[0.7rem] tracking-[0.2em] uppercase">
            &copy; {new Date().getFullYear()} Vanity Face — Todos os direitos reservados
          </p>
          <p className="text-cream/35 text-[0.7rem] tracking-[0.2em] uppercase">
            Estudio digital por{" "}
            <a
              href="https://www.nodecompany.com.br/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold/80 hover:text-gold transition-colors duration-300"
            >
              NodeCompany
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
