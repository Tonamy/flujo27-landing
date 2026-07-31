import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Footer";
import { ChatbotWidget } from "@/components/sections/ChatbotWidget";
import { DiagnosticoProvider } from "@/lib/DiagnosticoContext";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Flujo27 — Tu negocio sigue avanzando, incluso cuando tu equipo no está conectado",
  description:
    "Implementamos y administramos sistemas que capturan oportunidades, automatizan tareas y mantienen procesos funcionando sin que tengas que gestionar la tecnología.",
  keywords: [
    "automatización para PyMEs",
    "asistentes digitales",
    "captación de leads",
    "automatización operativa",
    "integraciones empresariales",
  ],
  openGraph: {
    title: "Flujo27 — Automatización gestionada para empresas",
    description: "Tu negocio sigue avanzando, incluso cuando tu equipo no está conectado.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={`${geist.variable} antialiased bg-white text-[#111111]`}>
        <DiagnosticoProvider>
          <Navbar />
          {children}
          <Footer />
          <ChatbotWidget />
        </DiagnosticoProvider>
      </body>
    </html>
  );
}
