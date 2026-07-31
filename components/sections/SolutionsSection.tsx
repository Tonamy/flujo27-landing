"use client";

import { motion } from "motion/react";
import { useInView } from "motion/react";
import { useRef } from "react";
import { MessageSquare, TrendingUp, Settings2 } from "lucide-react";

const SOLUTIONS = [
  {
    icon: <MessageSquare size={20} className="text-[#16A34A]" />,
    iconBg: "#DCFCE7",
    tag: "Captura de Leads",
    title: "Convierte visitantes en oportunidades sin perder ninguna consulta.",
    description:
      "Captura información de contacto automáticamente y organiza cada oportunidad desde el primer momento.",
    idealFor: "Empresas que quieren generar y ordenar leads sin depender de seguimiento manual.",
    features: [
      "Formularios y chat integrados",
      "Registro automático en CRM o Sheets",
      "Notificaciones instantáneas al equipo",
    ],
    price: "Desde $4,990 MXN",
    highlight: false,
  },
  {
    icon: <TrendingUp size={20} className="text-[#2563EB]" />,
    iconBg: "#DBEAFE",
    tag: "Conversión de Leads",
    title: "Convierte conversaciones en oportunidades listas para vender.",
    description:
      "Automatiza el seguimiento, la clasificación y la entrega de oportunidades para que tu equipo se enfoque en cerrar ventas.",
    idealFor: "Empresas que ya reciben leads pero necesitan mejorar su conversión.",
    features: [
      "Calificación y clasificación automática",
      "Seguimiento sin intervención manual",
      "Alertas al equipo comercial",
    ],
    price: "Desde $7,990 MXN",
    highlight: true,
  },
  {
    icon: <Settings2 size={20} className="text-[#7C3AED]" />,
    iconBg: "#EDE9FE",
    tag: "Automatización Operativa",
    title: "Reduce tareas repetitivas y mantén tu operación funcionando automáticamente.",
    description:
      "Conecta herramientas, elimina trabajo manual y automatiza procesos internos sin aumentar la carga de tu equipo.",
    idealFor: "Empresas que buscan crecer sin aumentar complejidad operativa.",
    features: [
      "Flujos sin intervención humana",
      "Integraciones con tus herramientas actuales",
      "Reportes y seguimientos automáticos",
    ],
    price: "Desde $6,990 MXN",
    highlight: false,
  },
];

export function SolutionsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="py-24 bg-white" id="soluciones">
      <div className="flujo-container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <p className="text-xs text-[#16A34A] font-semibold uppercase tracking-widest mb-3">
            Soluciones gestionadas
          </p>
          <h2 className="text-[32px] sm:text-[40px] font-bold text-[#111111] leading-tight tracking-tight">
            Soluciones gestionadas para
            <br />
            <span className="text-[#6B7280]">automatizar tu operación.</span>
          </h2>
          <p className="mt-4 text-[17px] text-[#6B7280] max-w-lg mx-auto leading-relaxed">
            Empieza por el área que más impacto tenga hoy. Nosotros nos
            encargamos del resto.
          </p>
        </motion.div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {SOLUTIONS.map((solution, index) => (
            <motion.div
              key={solution.tag}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.15 + index * 0.1 }}
              className={`relative flex flex-col rounded-2xl border p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg ${
                solution.highlight
                  ? "border-[#16A34A]/30 bg-[#F0FDF4] shadow-[0_4px_24px_rgba(22,163,74,0.08)]"
                  : "border-[#E5E7EB] bg-white hover:border-[#D1D5DB]"
              }`}
            >
              {solution.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-[#16A34A] text-white text-[10px] font-semibold px-3 py-1 rounded-full uppercase tracking-wide">
                    Más popular
                  </span>
                </div>
              )}

              {/* Icon + Tag */}
              <div className="flex items-center gap-3 mb-5">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: solution.iconBg }}
                >
                  {solution.icon}
                </div>
                <span className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide">
                  {solution.tag}
                </span>
              </div>

              {/* Title + desc */}
              <h3 className="text-[18px] font-bold text-[#111111] mb-2 leading-snug">
                {solution.title}
              </h3>
              <p className="text-[14px] text-[#6B7280] leading-relaxed mb-3 flex-1">
                {solution.description}
              </p>

              {/* Ideal for */}
              <div className="bg-[#F8FAFC] rounded-lg px-3 py-2 mb-5 border border-[#E5E7EB]">
                <p className="text-[11px] text-[#9CA3AF] font-medium uppercase tracking-wide mb-0.5">Ideal para</p>
                <p className="text-[12px] text-[#6B7280] leading-snug">{solution.idealFor}</p>
              </div>

              {/* Features list */}
              <ul className="flex flex-col gap-2 mb-6">
                {solution.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-[13px] text-[#374151]">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#16A34A] flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              {/* Price + CTA */}
              <div className="border-t border-[#E5E7EB] pt-4 flex items-center justify-between">
                <span className="text-[13px] font-semibold text-[#16A34A]">
                  {solution.price}
                </span>
                <a
                  href="#diagnostico"
                  className="text-[13px] font-medium text-[#111111] hover:text-[#16A34A] transition-colors underline underline-offset-2"
                >
                  Agendar →
                </a>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-10 text-[13px] text-[#9CA3AF] max-w-lg mx-auto leading-relaxed"
        >
          Diagnóstico inicial gratuito. Implementación rápida, acompañamiento continuo y una solución adaptada a la forma en que trabaja tu empresa.
        </motion.p>
      </div>
    </section>
  );
}
