"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, MessageSquare, User, Bell, UserCheck } from "lucide-react";
import { cn } from "@/lib/utils";

type Step = {
  id: number;
  icon: React.ReactNode;
  label: string;
  sublabel: string;
  badge?: string;
  color: string;
  delay: number;
  timeOffset: number; // minutes offset from base time
};

const STEPS: Step[] = [
  {
    id: 1,
    icon: <User size={14} />,
    label: "Cliente escribe",
    sublabel: "«Quiero información sobre sus servicios»",
    badge: "Mensaje entrante",
    color: "#6B7280",
    delay: 0,
    timeOffset: 0,
  },
  {
    id: 2,
    icon: <MessageSquare size={14} />,
    label: "Asistente responde",
    sublabel: "Respuesta en menos de 3 segundos",
    badge: "IA",
    color: "#16A34A",
    delay: 1400,
    timeOffset: 0,
  },
  {
    id: 3,
    icon: <CheckCircle2 size={14} />,
    label: "Lead registrado",
    sublabel: "Guardado en Google Sheets automáticamente",
    badge: "CRM",
    color: "#2563EB",
    delay: 2800,
    timeOffset: 1,
  },
  {
    id: 4,
    icon: <Bell size={14} />,
    label: "Equipo notificado",
    sublabel: "Alerta enviada a Telegram",
    badge: "Notificación",
    color: "#7C3AED",
    delay: 4200,
    timeOffset: 1,
  },
  {
    id: 5,
    icon: <UserCheck size={14} />,
    label: "Seguimiento programado",
    sublabel: "Recordatorio en 24 horas",
    badge: "Automático",
    color: "#16A34A",
    delay: 5600,
    timeOffset: 2,
  },
];

const CYCLE_DURATION = 8000;

// Fixed display times — no Date(), no hydration mismatch
const BASE_DISPLAY = "22:41";
const TIME_OFFSETS = ["22:41", "22:41", "22:42", "22:42", "22:43"];

export function OperationalSimulation() {
  const [visibleSteps, setVisibleSteps] = useState<number[]>([]);
  // Only show the clock after mount to avoid SSR/client mismatch
  const [mounted, setMounted] = useState(false);
  const [displayTime, setDisplayTime] = useState(BASE_DISPLAY);

  useEffect(() => {
    setMounted(true);
    // Set actual current time only on client
    const now = new Date();
    setDisplayTime(
      `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`
    );
  }, []);

  useEffect(() => {
    let timeouts: ReturnType<typeof setTimeout>[] = [];

    const runCycle = () => {
      setVisibleSteps([]);
      timeouts = STEPS.map((step) =>
        setTimeout(() => {
          setVisibleSteps((prev) => [...prev, step.id]);
        }, step.delay + 300)
      );
    };

    runCycle();
    const interval = setInterval(runCycle, CYCLE_DURATION);

    return () => {
      timeouts.forEach(clearTimeout);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="relative bg-[#F8FAFC] rounded-2xl border border-[#E5E7EB] p-5 overflow-hidden select-none">
      {/* Header bar */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse" />
          <span className="text-xs font-medium text-[#6B7280] uppercase tracking-wide">
            Sistema activo
          </span>
        </div>
        {/* Render a stable placeholder on server, real time on client */}
        <span className="text-xs text-[#9CA3AF] font-mono">
          {mounted ? displayTime : BASE_DISPLAY}
        </span>
      </div>

      {/* Steps */}
      <div className="flex flex-col gap-3">
        {STEPS.map((step, index) => {
          const isVisible = visibleSteps.includes(step.id);
          return (
            <div
              key={step.id}
              className={cn(
                "flex items-start gap-3 transition-all duration-500",
                isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-3"
              )}
            >
              {/* Icon + connector line */}
              <div className="flex flex-col items-center">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300"
                  style={{
                    backgroundColor: isVisible ? step.color + "18" : "#F3F4F6",
                    color: isVisible ? step.color : "#9CA3AF",
                    border: `1.5px solid ${isVisible ? step.color + "40" : "#E5E7EB"}`,
                  }}
                >
                  {step.icon}
                </div>
                {index < STEPS.length - 1 && (
                  <div
                    className={cn(
                      "w-px mt-1 mb-1 transition-all duration-700",
                      isVisible ? "h-5 bg-[#E5E7EB]" : "h-0"
                    )}
                  />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 pt-0.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[13px] font-medium text-[#111111]">
                    {step.label}
                  </span>
                  {step.badge && isVisible && (
                    <span
                      className="text-[10px] font-medium px-1.5 py-0.5 rounded-full"
                      style={{
                        backgroundColor: step.color + "14",
                        color: step.color,
                      }}
                    >
                      {step.badge}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-[#9CA3AF] mt-0.5 leading-relaxed">
                  {step.sublabel}
                </p>
              </div>

              {/* Fixed display time — no Date() call, no hydration risk */}
              <span className="text-[10px] text-[#C4C9D4] font-mono pt-1 flex-shrink-0">
                {TIME_OFFSETS[index]}
              </span>
            </div>
          );
        })}
      </div>

      {/* Bottom status bar */}
      <div className="mt-5 pt-4 border-t border-[#E5E7EB]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-[#16A34A]" />
            <span className="text-[11px] text-[#6B7280]">Funcionando 24/7</span>
          </div>
          <span className="text-[11px] text-[#16A34A] font-medium">
            Sin intervención humana
          </span>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-[#F8FAFC] to-transparent pointer-events-none" />
    </div>
  );
}
