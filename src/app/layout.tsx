import type { Metadata } from "next";
import { Cormorant_Garamond, Montserrat } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-serif",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Vanity Face | Dr. Vitor Fernandes — Harmonizacao e Cirurgia Facial",
  description:
    "Clinica Vanity Face — Referencia em Platismoplastia, Lipo de Papada HD e Harmonizacao Facial. Dr. Vitor S. Fernandes, CRO 8723-ES. Vitoria - ES.",
  keywords: [
    "harmonizacao facial",
    "platismoplastia",
    "lipo de papada",
    "cirurgia facial",
    "vanity face",
    "dr vitor fernandes",
    "estetica facial vitoria",
  ],
  openGraph: {
    title: "Vanity Face | Dr. Vitor Fernandes",
    description:
      "Referencia em Harmonizacao e Cirurgia Facial em Vitoria - ES",
    type: "website",
    locale: "pt_BR",
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
      <body className="min-h-[100dvh] overflow-x-hidden">{children}</body>
    </html>
  );
}
