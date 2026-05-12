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

export const metadata: Metadata = {
  title: "Vanity Face — Dr. Vitor Fernandes | Cirurgia e Harmonização Facial",
  description:
    "Clínica de cirurgia e harmonização facial em Vitória — ES. Referência em Platismoplastia, Lipo HD de Papada e Deep Neck Lift. Dr. Vitor S. Fernandes, CRO 8723-ES.",
  keywords: [
    "harmonização facial",
    "platismoplastia",
    "lipo de papada",
    "deep neck lift",
    "cirurgia facial",
    "vanity face",
    "dr vitor fernandes",
    "estética facial vitória",
  ],
  openGraph: {
    title: "Vanity Face — Dr. Vitor Fernandes",
    description:
      "Cirurgia e harmonização facial em Vitória — ES. Resultados naturais, discrição e excelência.",
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
      <body className="min-h-[100svh] overflow-x-hidden bg-navy text-cream">
        {children}
      </body>
    </html>
  );
}
