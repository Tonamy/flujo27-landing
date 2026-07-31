"use client";

import { motion } from "motion/react";
import { useInView } from "motion/react";
import { useRef } from "react";
import { ArrowRight, CalendarCheck } from "lucide-react";
import { useDiagnostico } from "@/lib/DiagnosticoContext";

export function CtaFinalSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const { openModal } = useDiagnostico();

  return (
    <section ref={ref} className="py-24 bg-white">
      <div className="flujo-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="relative overflow-hidden rounded-3xl bg-[#111111] px-8 py-16 sm:px-16 text-center"
        >
          {/* Subtle green glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(ellipse at 50% 120%, rgba(22,163,74,0.2) 0%, transparent 60%)" }}
          />

          <div className="flex justify-center mb-6">
            <div className="w-12 h-12 rounded-2xl bg-[#16A34A]/20 flex items-center justify-center">
              <CalendarCheck size={22} className="text-[#4ADE80]" />
            </div>
          </div>

          <h2 className="text-[28px] sm:text-[38px] font-bold text-white leading-tight tracking-tight mb-4">
            Obtén un plan claro de automatización
            <br />
            <span className="text-[#4ADE80]">para tu empresa.</span>
          </h2>

          <p className="text-[16px] text-[#9CA3AF] mb-8 max-w-lg mx-auto leading-relaxed">
            En una sesión de 30 minutos revisamos tu operación e identificamos
            oportunidades para ahorrar tiempo, reducir tareas repetitivas y
            generar más oportunidades de negocio.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {/* PRIMARY */}
            <button
              onClick={openModal}
              className="inline-flex items-center justify-center gap-2 bg-[#16A34A] text-white font-semibold text-[15px] px-7 py-3.5 rounded-xl hover:bg-[#15803D] transition-all duration-200 shadow-[0_1px_3px_rgba(22,163,74,0.4)] hover:shadow-[0_4px_16px_rgba(22,163,74,0.4)] hover:-translate-y-0.5 group"
            >
              Agenda un diagnóstico
              <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
            {/* SECONDARY ghost */}
            <button
              onClick={() => window.dispatchEvent(new Event("openChatbot"))}
              className="inline-flex items-center justify-center gap-2 border border-white/20 bg-transparent text-white/70 font-medium text-[15px] px-7 py-3.5 rounded-xl hover:bg-white/5 hover:border-white/30 hover:text-white transition-all duration-200"
            >
              Probar el asistente primero
            </button>
          </div>

          <p className="mt-6 text-[12px] text-[#6B7280]">
            Diagnóstico gratuito. Recomendaciones personalizadas. Un plan claro para avanzar.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
