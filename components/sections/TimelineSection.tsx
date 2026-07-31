"use client";

import { motion } from "motion/react";
import { useInView } from "motion/react";
import { useRef, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useDiagnostico } from "@/lib/DiagnosticoContext";

const EVENTS = [
  {
    time: "22:41",
    label: "Cliente escribe",
    detail: "«¿Tienen disponibilidad para mañana?»",
    color: "#6B7280",
    dot: "#9CA3AF",
  },
  {
    time: "22:41",
    label: "Asistente responde",
    detail: "Respuesta enviada en 1.8 segundos",
    color: "#16A34A",
    dot: "#16A34A",
  },
  {
    time: "22:42",
    label: "Lead registrado",
    detail: "Datos guardados en Google Sheets",
    color: "#2563EB",
    dot: "#2563EB",
  },
  {
    time: "22:42",
    label: "Equipo notificado",
    detail: "Alerta enviada por Telegram",
    color: "#7C3AED",
    dot: "#7C3AED",
  },
  {
    time: "22:43",
    label: "Seguimiento programado",
    detail: "Recordatorio para las 09:00 del día siguiente",
    color: "#16A34A",
    dot: "#16A34A",
  },
];

export function TimelineSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [activeIndex, setActiveIndex] = useState(-1);
  const { openModal } = useDiagnostico();

  useEffect(() => {
    if (!isInView) return;
    const timers: ReturnType<typeof setTimeout>[] = [];
    EVENTS.forEach((_, i) => {
      timers.push(setTimeout(() => setActiveIndex(i), 500 + i * 1800));
    });
    return () => timers.forEach(clearTimeout);
  }, [isInView]);

  return (
    <section
      ref={ref}
      className="py-24 bg-[#F8FAFC]"
      id="timeline"
    >
      <div className="flujo-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: copy */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <p className="text-xs text-[#16A34A] font-semibold uppercase tracking-widest mb-3">
              Operación en tiempo real
            </p>
            <h2 className="text-[32px] sm:text-[40px] font-bold text-[#111111] leading-tight tracking-tight mb-5">
              Mientras tu equipo trabaja
              <br />
              en lo importante,
              <br />
              <span className="text-[#16A34A]">los procesos siguen funcionando.</span>
            </h2>
            <p className="text-[17px] text-[#6B7280] leading-relaxed mb-8 max-w-md">
              Cada interacción puede activar procesos automáticos que registran
              información, notifican a tu equipo y mantienen el seguimiento en
              marcha.
            </p>
            <button
              onClick={openModal}
              className="inline-flex items-center gap-2 bg-[#16A34A] text-white font-semibold text-[15px] px-6 py-3.5 rounded-xl hover:bg-[#15803D] transition-all duration-200 shadow-[0_1px_3px_rgba(22,163,74,0.3)] hover:shadow-[0_4px_12px_rgba(22,163,74,0.35)]"
            >
              Quiero automatizar mi operación
            </button>
          </motion.div>

          {/* Right: timeline */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            {/* Vertical line */}
            <div className="absolute left-[19px] top-0 bottom-0 w-px bg-[#E5E7EB]" />

            <div className="flex flex-col gap-5">
              {EVENTS.map((event, index) => {
                const isActive = activeIndex >= index;
                return (
                  <div
                    key={index}
                    className={cn(
                      "relative flex items-start gap-4 pl-10 transition-all duration-500",
                      isActive ? "opacity-100" : "opacity-20"
                    )}
                  >
                    {/* Dot */}
                    <div
                      className={cn(
                        "absolute left-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 z-10",
                        isActive ? "scale-100" : "scale-75"
                      )}
                      style={{
                        backgroundColor: isActive
                          ? event.dot + "18"
                          : "#F3F4F6",
                        border: `2px solid ${isActive ? event.dot : "#E5E7EB"}`,
                      }}
                    >
                      <div
                        className="w-2 h-2 rounded-full transition-all"
                        style={{
                          backgroundColor: isActive ? event.dot : "#D1D5DB",
                        }}
                      />
                    </div>

                    {/* Content */}
                    <div className="bg-white rounded-xl border border-[#E5E7EB] px-4 py-3 flex-1">
                      <div className="flex items-center justify-between gap-3 mb-0.5">
                        <span
                          className="text-[13px] font-semibold"
                          style={{ color: isActive ? event.color : "#9CA3AF" }}
                        >
                          {event.label}
                        </span>
                        <span className="text-[11px] text-[#9CA3AF] font-mono flex-shrink-0">
                          {event.time}
                        </span>
                      </div>
                      <p className="text-[12px] text-[#6B7280]">{event.detail}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Loop indicator */}
            <div
              className={cn(
                "mt-6 pl-10 transition-all duration-500",
                activeIndex >= EVENTS.length - 1 ? "opacity-100" : "opacity-0"
              )}
            >
              <div className="flex items-center gap-2 text-[12px] text-[#9CA3AF]">
                <div className="w-1.5 h-1.5 rounded-full bg-[#16A34A] animate-pulse" />
                Ciclo completado. Repetirá automáticamente para el siguiente mensaje.
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
