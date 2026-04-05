import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Sobre from "@/components/Sobre";
import Procedimentos from "@/components/Procedimentos";
import Resultados from "@/components/Resultados";
import Clinica from "@/components/Clinica";
import Contato from "@/components/Contato";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Sobre />
        <Procedimentos />
        <Resultados />
        <Clinica />
        <Contato />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
