"use client";

interface PrintButtonProps {
  /** id do elemento a imprimir; se omitido, imprime a página inteira */
  target?: string;
  label?: string;
  className?: string;
}

export default function PrintButton({
  target,
  label = "Imprimir",
  className,
}: PrintButtonProps) {
  function handle() {
    if (target) {
      // marca o body com o id alvo para CSS selecionar
      document.body.setAttribute("data-print-target", target);
      const cleanup = () => {
        document.body.removeAttribute("data-print-target");
        window.removeEventListener("afterprint", cleanup);
      };
      window.addEventListener("afterprint", cleanup);
      window.print();
    } else {
      window.print();
    }
  }

  return (
    <button
      type="button"
      onClick={handle}
      className={
        className ??
        "text-[0.65rem] tracking-[0.22em] uppercase text-cream/65 hover:text-gold transition-colors"
      }
    >
      {label} ⎙
    </button>
  );
}
