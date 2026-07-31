"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { ArrowRight, Zap } from "lucide-react";
import { OperationalSimulation } from "./OperationalSimulation";
import { useDiagnostico } from "@/lib/DiagnosticoContext";

const SOCIAL_PROOF_SECTORS = [
  "Clínicas",
  "Inmobiliarias",
  "Despachos",
  "Agencias",
  "Consultoras",
];

export function HeroSection() {
  const { openModal } = useDiagnostico();
  return (
    <section className="relative min-h-screen flex items-center pt-16 pb-20 overflow-hidden">
      {/* Subtle background pattern */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 50%, #DCFCE720 0%, transparent 60%), radial-gradient(circle at 80% 20%, #F0FDF420 0%, transparent 50%)",
        }}
      />

      <div className="flujo-container w-full">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12 lg:gap-16 items-center">
          {/* Left column */}
          <div className="flex flex-col gap-6 lg:gap-8">
            {/* Eyebrow badge */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="inline-flex items-center gap-2 bg-[#DCFCE7] text-[#16A34A] text-xs font-medium px-3 py-1.5 rounded-full">
                <Zap size={11} className="fill-[#16A34A]" />
                Automatización gestionada para empresas
              </div>
            </motion.div>

            {/* Main headline */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h1 className="text-[42px] sm:text-[52px] lg:text-[62px] font-bold text-[#111111] leading-[1.08] tracking-[-0.03em]">
                Tu negocio sigue{" "}
                <span className="text-[#16A34A]">avanzando</span>,
                <br className="hidden sm:block" />
                {" "}incluso cuando tu equipo no está conectado.
              </h1>
            </motion.div>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="text-[18px] text-[#6B7280] leading-relaxed max-w-[520px]"
            >
              Implementamos y administramos sistemas que capturan oportunidades,
              automatizan tareas y mantienen procesos funcionando sin que tengas
              que gestionar la tecnología.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-3"
            >
              {/* PRIMARY — opens DiagnosticoModal */}
              <button
                onClick={openModal}
                className="inline-flex items-center justify-center gap-2 bg-[#16A34A] text-white font-semibold text-[15px] px-6 py-3.5 rounded-xl hover:bg-[#15803D] transition-all duration-200 shadow-[0_1px_3px_rgba(22,163,74,0.3)] hover:shadow-[0_4px_12px_rgba(22,163,74,0.35)] hover:-translate-y-0.5 group"
              >
                Agenda un diagnóstico
                <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
              </button>
              {/* SECONDARY ghost — opens chatbot widget */}
              <button
                onClick={() => window.dispatchEvent(new Event("openChatbot"))}
                className="inline-flex items-center justify-center gap-2 border border-[#E5E7EB] bg-transparent text-[#6B7280] font-medium text-[15px] px-6 py-3.5 rounded-xl hover:border-[#D1D5DB] hover:text-[#111111] transition-all duration-200"
              >
                Probar el asistente
              </button>
            </motion.div>

            {/* Social proof — sectors */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="flex flex-col gap-2 pt-2"
            >
              <p className="text-xs text-[#9CA3AF] uppercase tracking-widest font-medium">
                Ideal para
              </p>
              <div className="flex flex-wrap gap-2">
                {SOCIAL_PROOF_SECTORS.map((sector) => (
                  <span
                    key={sector}
                    className="text-xs text-[#6B7280] bg-[#F3F4F6] px-3 py-1 rounded-full"
                  >
                    {sector}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right column — Operational Simulation */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="w-full"
          >
            <OperationalSimulation />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
