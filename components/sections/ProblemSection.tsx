"use client";

import { motion } from "motion/react";
import { useInView } from "motion/react";
import { useRef } from "react";
import { X, Check } from "lucide-react";

const BEFORE = [
  "Mensajes sin responder por horas o días",
  "Prospectos perdidos fuera del horario",
  "Seguimientos olvidados o tardíos",
  "Información dispersa en varios lugares",
  "Tareas repetitivas que consumen tiempo",
];

const AFTER = [
  "Atención inmediata las 24 horas del día",
  "Cada prospecto capturado y registrado",
  "Seguimientos automáticos y puntuales",
  "Información centralizada y organizada",
  "Procesos que se ejecutan solos",
];

export function ProblemSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-24 bg-[#F8FAFC]" id="problema">
      <div className="flujo-container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <p className="text-xs text-[#16A34A] font-semibold uppercase tracking-widest mb-3">
            El problema real
          </p>
          <h2 className="text-[32px] sm:text-[40px] font-bold text-[#111111] leading-tight tracking-tight">
            Lo que ocurre cuando los procesos dependen completamente de tu equipo.
          </h2>
          <p className="mt-4 text-[17px] text-[#6B7280] max-w-xl mx-auto leading-relaxed">
            Cada empresa tiene tareas que dependen de seguimiento manual. Eso
            genera retrasos, errores y oportunidades perdidas.
          </p>
        </motion.div>

        {/* Comparison grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {/* Before */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-2xl border border-[#E5E7EB] p-6"
          >
            <div className="flex items-center gap-2 mb-5">
              <div className="w-6 h-6 rounded-full bg-[#FEE2E2] flex items-center justify-center">
                <X size={12} className="text-[#EF4444]" />
              </div>
              <span className="text-sm font-semibold text-[#6B7280] uppercase tracking-wide">
                Sin automatización
              </span>
            </div>
            <ul className="flex flex-col gap-3">
              {BEFORE.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <div className="w-4 h-4 rounded-full bg-[#FEE2E2] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <X size={8} className="text-[#EF4444]" />
                  </div>
                  <span className="text-[14px] text-[#6B7280] leading-snug">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* After */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="bg-white rounded-2xl border border-[#16A34A]/25 p-6 shadow-[0_0_0_1px_rgba(22,163,74,0.1),0_4px_24px_rgba(22,163,74,0.06)]"
          >
            <div className="flex items-center gap-2 mb-5">
              <div className="w-6 h-6 rounded-full bg-[#DCFCE7] flex items-center justify-center">
                <Check size={12} className="text-[#16A34A]" />
              </div>
              <span className="text-sm font-semibold text-[#16A34A] uppercase tracking-wide">
                Con Flujo27
              </span>
            </div>
            <ul className="flex flex-col gap-3">
              {AFTER.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <div className="w-4 h-4 rounded-full bg-[#DCFCE7] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check size={8} className="text-[#16A34A]" />
                  </div>
                  <span className="text-[14px] text-[#111111] leading-snug font-medium">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Bottom label */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-10 text-[13px] text-[#9CA3AF]"
        >
          Implementación rápida. Mejora operativa desde las primeras semanas.
        </motion.p>
      </div>
    </section>
  );
}
