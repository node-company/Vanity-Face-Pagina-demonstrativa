"use client";

import Image from "next/image";

const navLinks = [
  { label: "Inicio", href: "#inicio" },
  { label: "Sobre", href: "#sobre" },
  { label: "Procedimentos", href: "#procedimentos" },
  { label: "Resultados", href: "#resultados" },
  { label: "A Clinica", href: "#clinica" },
  { label: "Contato", href: "#contato" },
];

export default function Footer() {
  return (
    <footer className="relative bg-navy border-t border-cream/5">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
        <div className="grid md:grid-cols-3 gap-12 items-start">
          <div className="space-y-4">
            <Image
              src="/images/logo.png"
              alt="Vanity Face"
              width={160}
              height={44}
              className="h-10 w-auto"
            />
            <p className="text-cream/40 text-sm font-light leading-relaxed">
              Dr. Vitor S. Fernandes &mdash; CRO 8723-ES
              <br />
              Harmonizacao e Cirurgia Facial
            </p>
          </div>

          <div>
            <p className="text-gold text-xs tracking-[0.3em] uppercase font-medium mb-4">
              Navegacao
            </p>
            <nav className="grid grid-cols-2 gap-2">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-cream/40 text-sm hover:text-gold transition-colors duration-300"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          <div className="space-y-4">
            <p className="text-gold text-xs tracking-[0.3em] uppercase font-medium">
              Contato
            </p>
            <div className="space-y-2">
              <a
                href="https://wa.me/5527995351115"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-cream/40 text-sm hover:text-gold transition-colors"
              >
                (27) 99535-1115
              </a>
              <a
                href="https://www.instagram.com/drvitorsilvafernandes/"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-cream/40 text-sm hover:text-gold transition-colors"
              >
                @drvitorsilvafernandes
              </a>
              <p className="text-cream/30 text-sm">
                R. Alaor de Queiroz Araujo, 296
                <br />
                Enseada do Sua, Vitoria &mdash; ES
              </p>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-cream/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-cream/20 text-xs tracking-wider">
            &copy; {new Date().getFullYear()} Vanity Face. Todos os direitos reservados.
          </p>
          <p className="text-cream/20 text-xs tracking-wider">
            Desenvolvido por NodeCompany
          </p>
        </div>
      </div>
    </footer>
  );
}
