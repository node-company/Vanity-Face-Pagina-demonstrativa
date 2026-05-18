"use client";

import { useEffect, useState } from "react";

export default function WhatsAppButton() {
  const [revealed, setRevealed] = useState(false);
  const [showBalloon, setShowBalloon] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setRevealed(window.scrollY > 500);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    // First appearance at 10s, visible for 4s, repeats every 30s
    const show = () => {
      setShowBalloon(true);
      setTimeout(() => setShowBalloon(false), 4000);
    };
    const initial = setTimeout(show, 10000);
    const interval = setInterval(show, 30000);
    return () => {
      clearTimeout(initial);
      clearInterval(interval);
    };
  }, []);

  return (
    <div
      className={`fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2 transition-all duration-500 ${
        revealed ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-3 pointer-events-none"
      }`}
    >
      {/* Balloon */}
      <div
        role="status"
        aria-live="polite"
        className={`relative bg-navy-lighter border border-gold/50 text-cream text-[0.7rem] tracking-[0.12em] uppercase px-3 py-2 shadow-[0_8px_24px_-6px_rgba(11,21,39,0.8)] max-w-[180px] text-right leading-relaxed transition-all duration-500 ${
          showBalloon ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"
        }`}
      >
        Tire suas dúvidas com nossa equipe
        {/* Tail pointing down-right */}
        <span className="absolute -bottom-[7px] right-5 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[7px] border-t-navy-lighter" />
        <span className="absolute -bottom-[8px] right-5 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[7px] border-t-gold/30" />
      </div>

      <a
        href="https://wa.me/5527999465417?text=Ol%C3%A1%2C%20gostaria%20de%20agendar%20uma%20consulta."
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Conversar pelo WhatsApp"
        className="flex items-center justify-center w-14 h-14 bg-gold text-navy shadow-[0_18px_40px_-12px_rgba(11,21,39,0.6)] hover:bg-gold-light transition-colors duration-300"
      >
        <span className="relative flex items-center justify-center w-7 h-7">
          <span className="absolute inset-0 rounded-full bg-gold/40 animate-ping" />
          <svg className="relative w-6 h-6 text-navy" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
        </span>
      </a>
    </div>
  );
}
