"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const navLinks = [
  { label: "O Especialista", href: "#sobre", index: "01" },
  { label: "Procedimentos", href: "#procedimentos", index: "02" },
  { label: "Resultados", href: "#resultados", index: "03" },
  { label: "A Clinica", href: "#clinica", index: "04" },
  { label: "Contato", href: "#contato", index: "05" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const isScrolled = window.scrollY > 60;
      if (isScrolled !== scrolled) setScrolled(isScrolled);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [scrolled]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-navy/92 backdrop-blur-md border-b border-gold/15"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        <div
          className={`flex items-center justify-between transition-all duration-500 ${
            scrolled ? "h-[68px]" : "h-[88px]"
          }`}
        >
          <a
            href="#inicio"
            className="flex-shrink-0 transition-opacity duration-300 hover:opacity-80"
            aria-label="Vanity Face — pagina inicial"
          >
            <Image
              src="/images/logo.webp"
              alt="Vanity Face"
              width={200}
              height={56}
              className={`w-auto transition-all duration-500 ${
                scrolled ? "h-10" : "h-12"
              }`}
              sizes="200px"
              priority
            />
          </a>

          <div className="hidden lg:flex items-center gap-10">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="group relative flex items-center gap-2 text-[0.7rem] font-medium tracking-[0.22em] uppercase text-cream/75 hover:text-gold transition-colors duration-300"
              >
                <span className="text-[0.55rem] tabular tracking-widest text-cream/35">
                  {link.index}
                </span>
                {link.label}
              </a>
            ))}
            <a
              href="https://wa.me/5527995351115?text=Ol%C3%A1%2C%20gostaria%20de%20agendar%20uma%20consulta."
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 inline-flex items-center gap-2 px-6 py-3 bg-gold text-navy text-[0.65rem] font-semibold tracking-[0.28em] uppercase hover:bg-gold-light transition-colors duration-400"
            >
              Agendar
              <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.4">
                <path d="M2 6h8M7 3l3 3-3 3" strokeLinecap="square" />
              </svg>
            </a>
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden flex flex-col gap-[5px] p-2 -mr-2"
            aria-label={mobileOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={mobileOpen}
          >
            <span
              className={`block w-6 h-px bg-gold transition-all duration-400 ${
                mobileOpen ? "rotate-45 translate-y-[6px]" : ""
              }`}
            />
            <span
              className={`block w-6 h-px bg-gold transition-all duration-400 ${
                mobileOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block w-6 h-px bg-gold transition-all duration-400 ${
                mobileOpen ? "-rotate-45 -translate-y-[6px]" : ""
              }`}
            />
          </button>
        </div>
      </div>

      <div
        className={`lg:hidden fixed inset-x-0 top-0 bg-navy transition-all duration-500 ease-out ${
          mobileOpen
            ? "opacity-100 pointer-events-auto translate-y-0"
            : "opacity-0 pointer-events-none -translate-y-4"
        }`}
        style={{ paddingTop: scrolled ? "68px" : "88px" }}
      >
        <div className="px-6 py-10 flex flex-col gap-1 min-h-[100svh]">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="group flex items-baseline justify-between border-b border-cream/10 py-5 transition-colors hover:text-gold"
            >
              <span className="font-serif text-3xl font-light text-cream group-hover:text-gold transition-colors">
                {link.label}
              </span>
              <span className="text-[0.55rem] tabular tracking-widest text-cream/40">
                {link.index}
              </span>
            </a>
          ))}
          <a
            href="https://wa.me/5527995351115?text=Ol%C3%A1%2C%20gostaria%20de%20agendar%20uma%20consulta."
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setMobileOpen(false)}
            className="mt-10 btn-primary"
          >
            Agendar Consulta
          </a>
          <p className="mt-8 text-xs tracking-[0.2em] uppercase text-cream/45">
            +55 27 99535-1115
          </p>
        </div>
      </div>
    </nav>
  );
}
