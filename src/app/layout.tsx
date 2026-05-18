import type { Metadata } from "next";
import { Cormorant_Garamond, Montserrat } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-sans",
  display: "swap",
});

const SITE_URL = "https://www.vanityface.com.br";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default:
      "Vanity Face — Cirurgia Facial e Harmonização em Vitória ES | Dr. Vitor Fernandes",
    template: "%s | Vanity Face — Dr. Vitor Fernandes",
  },
  description:
    "Clínica Vanity Face em Vitória — ES. Dr. Vitor S. Fernandes (CRO 8723-ES), referência em Platismoplastia, Lipo HD de Papada, Deep Neck Lift, Blefaroplastia e Harmonização Facial. Agende sua consulta.",
  applicationName: "Vanity Face",
  authors: [{ name: "Dr. Vitor S. Fernandes" }],
  creator: "Vanity Face",
  publisher: "Vanity Face",
  keywords: [
    "vanity face",
    "vanity face vitória",
    "clínica vanity face",
    "dr vitor fernandes",
    "dr vitor silva fernandes",
    "harmonização facial vitória",
    "harmonização facial es",
    "platismoplastia",
    "platismoplastia vitória",
    "lipo de papada vitória",
    "lipo hd papada",
    "deep neck lift",
    "blefaroplastia a laser",
    "preenchimento labial vitória",
    "fios de pdo",
    "cirurgia facial es",
    "clínica de estética facial vitória",
    "harmonização orofacial enseada do suá",
  ],
  category: "Health & Beauty",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: SITE_URL,
    siteName: "Vanity Face",
    title: "Vanity Face — Cirurgia Facial e Harmonização em Vitória ES",
    description:
      "Clínica do Dr. Vitor S. Fernandes em Vitória — ES. Referência em Platismoplastia, Lipo HD de Papada e Deep Neck Lift. Resultados naturais com discrição e excelência.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vanity Face — Cirurgia Facial e Harmonização em Vitória ES",
    description:
      "Clínica do Dr. Vitor S. Fernandes. Platismoplastia, Lipo HD de Papada, Deep Neck Lift e mais.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  formatDetection: {
    telephone: true,
    address: true,
    email: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${cormorant.variable} ${montserrat.variable} antialiased`}
    >
      <body className="min-h-[100svh] overflow-x-hidden bg-navy text-cream">
        {children}
      </body>
    </html>
  );
}
