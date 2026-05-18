import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Sobre from "@/components/Sobre";
import Procedimentos from "@/components/Procedimentos";
import Resultados from "@/components/Resultados";
import Clinica from "@/components/Clinica";
import Contato from "@/components/Contato";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { LeadFormProvider } from "@/components/LeadFormModal";

const SITE_URL = "https://www.vanityface.com.br";
const CLINIC_ID = `${SITE_URL}/#clinic`;
const PHYSICIAN_ID = `${SITE_URL}/#physician`;

const procedures = [
  {
    name: "Platismoplastia",
    description:
      "Cirurgia de definição do contorno cervical e rejuvenescimento do pescoço. Técnica que devolve o ângulo natural entre rosto e mandíbula.",
    procedureType: "https://schema.org/SurgicalProcedure",
  },
  {
    name: "Lipo HD de Papada",
    description:
      "Lipoaspiração de alta definição para remoção precisa da papada. Resultado discreto, com recuperação curta e cicatrizes mínimas.",
    procedureType: "https://schema.org/SurgicalProcedure",
  },
  {
    name: "Deep Neck Lift",
    description:
      "Lifting profundo do pescoço para tratar flacidez avançada. Aborda musculatura, gordura e pele em uma única intervenção.",
    procedureType: "https://schema.org/SurgicalProcedure",
  },
  {
    name: "Blefaroplastia a Laser",
    description:
      "Lifting de pálpebra com laser para rejuvenescimento do olhar. Corrige excesso de pele e bolsas com cicatriz mínima.",
    procedureType: "https://schema.org/SurgicalProcedure",
  },
  {
    name: "Harmonização Full Face",
    description:
      "Plano facial completo combinando técnicas injetáveis e ultrassom focado. Equilíbrio sob medida para a sua face.",
    procedureType: "https://schema.org/TherapeuticProcedure",
  },
  {
    name: "Preenchimento Labial",
    description:
      "Volumização e contorno com ácido hialurônico de última geração. Lábios definidos, com expressão natural.",
    procedureType: "https://schema.org/TherapeuticProcedure",
  },
  {
    name: "Fios de PDO",
    description:
      "Sustentação facial com fios absorvíveis. Efeito tensor imediato e estímulo gradual de colágeno.",
    procedureType: "https://schema.org/TherapeuticProcedure",
  },
  {
    name: "Lipo Facial Localizada",
    description:
      "Refinamento do contorno mandibular e do ângulo cervical por remoção precisa de gordura.",
    procedureType: "https://schema.org/SurgicalProcedure",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "MedicalClinic",
      "@id": CLINIC_ID,
      name: "Vanity Face",
      alternateName: "Clínica Vanity Face",
      url: `${SITE_URL}/`,
      image: `${SITE_URL}/opengraph-image.jpg`,
      logo: `${SITE_URL}/images/logo.webp`,
      telephone: "+55-27-99946-5417",
      priceRange: "$$$",
      address: {
        "@type": "PostalAddress",
        streetAddress:
          "R. Alaor de Queiróz Araújo, 296 — Edifício Bay Center, loja 03 e 04",
        addressLocality: "Vitória",
        addressRegion: "ES",
        postalCode: "29050-245",
        addressCountry: "BR",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: -20.2997,
        longitude: -40.2896,
      },
      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
          ],
          opens: "09:00",
          closes: "19:00",
        },
      ],
      sameAs: ["https://www.instagram.com/drvitorsilvafernandes/"],
      medicalSpecialty: ["PlasticSurgery", "CosmeticSurgery"],
      areaServed: [
        { "@type": "City", name: "Vitória" },
        { "@type": "State", name: "Espírito Santo" },
      ],
      hasMap: "https://maps.google.com/?q=-20.2997,-40.2896",
    },
    {
      "@type": "Physician",
      "@id": PHYSICIAN_ID,
      name: "Dr. Vitor S. Fernandes",
      alternateName: "Dr. Vitor Silva Fernandes",
      identifier: "CRO 8723-ES",
      medicalSpecialty: ["PlasticSurgery", "CosmeticSurgery"],
      worksFor: { "@id": CLINIC_ID },
      affiliation: { "@id": CLINIC_ID },
      image: `${SITE_URL}/images/dr-vitor-portrait.jpg`,
      url: `${SITE_URL}/#sobre`,
      sameAs: ["https://www.instagram.com/drvitorsilvafernandes/"],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: `${SITE_URL}/`,
      name: "Vanity Face",
      inLanguage: "pt-BR",
      publisher: { "@id": CLINIC_ID },
    },
    ...procedures.map((p, i) => ({
      "@type": "MedicalProcedure",
      "@id": `${SITE_URL}/#procedure-${i + 1}`,
      name: p.name,
      description: p.description,
      procedureType: p.procedureType,
      bodyLocation: "Face",
      performedBy: { "@id": PHYSICIAN_ID },
    })),
  ],
};

export default function Home() {
  return (
    <LeadFormProvider>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <main itemScope itemType="https://schema.org/MedicalClinic">
        <Hero />
        <Sobre />
        <Procedimentos />
        <Resultados />
        <Clinica />
        <Contato />
      </main>
      <Footer />
      <WhatsAppButton />
    </LeadFormProvider>
  );
}
