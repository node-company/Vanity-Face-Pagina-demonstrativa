import LoginForm from "./LoginForm";

export const metadata = {
  title: "Acessar CRM — Vanity Face",
};

export default function LoginPage() {
  return (
    <div className="min-h-[100svh] flex items-center justify-center bg-navy px-6 py-16">
      <div className="w-full max-w-md">
        <div className="mb-12">
          <p className="eyebrow text-gold/80 mb-4">Vanity Face · CRM</p>
          <h1 className="font-display text-[clamp(2rem,5vw,3rem)] text-cream">
            Acessar
            <br />
            <span className="italic text-gold">o painel.</span>
          </h1>
          <p className="mt-4 text-cream/65 text-sm font-light leading-relaxed">
            Área restrita à equipe.
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
