"use client";

import { useState, useRef, useEffect } from "react";
import {
  MessageSquare, Send, ChevronDown, ArrowRight, CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Message = { id: number; from: "bot" | "user"; text: string };

type LeadData = {
  problema?: string;
  tieneWeb?: string;
  capturaAutomatica?: string;
  sistemaActual?: string;
  areaAutomatizacion?: string;
  situacion?: string;
  nivelMadurez?: string;
  nombre?: string;
  empresa?: string;
  canalContacto?: string;
  contacto?: string;
};

type Step =
  | "inicio"
  | "ruta1_web"
  | "ruta1_captura"
  | "ruta1_seguimiento"
  | "ruta2_herramienta"
  | "ruta3_area"
  | "ruta4_situacion"
  | "datos_nombre"
  | "datos_empresa"
  | "datos_canal"
  | "datos_contacto"
  | "cierre"
  | "done";

// ─── Options per step ────────────────────────────────────────────────────────

const OPTIONS: Partial<Record<Step, string[]>> = {
  inicio: [
    "Conseguir más oportunidades",
    "Dar mejor seguimiento a prospectos",
    "Automatizar procesos internos",
    "No estoy seguro",
  ],
  ruta1_web: ["Sí", "No"],
  ruta1_captura: ["Sí", "No", "No estoy seguro"],
  ruta1_seguimiento: ["Sí", "No"],
  ruta2_herramienta: ["WhatsApp", "Excel", "CRM", "Varias herramientas"],
  ruta3_area: ["Ventas", "Atención a clientes", "Administración", "Aún no lo tengo claro"],
  ruta4_situacion: [
    "Pierdo consultas o prospectos",
    "Mi equipo dedica demasiado tiempo a tareas manuales",
    "Tengo herramientas pero no trabajan juntas",
    "No estoy seguro",
  ],
  datos_canal: ["Correo electrónico", "WhatsApp"],
};

const FREE_TEXT_STEPS: Step[] = ["datos_nombre", "datos_empresa", "datos_contacto"];

// ─── Bot script ───────────────────────────────────────────────────────────────

function getBotText(step: Step, data: LeadData): string {
  switch (step) {
    case "inicio":
      return "Hola 👋 Soy el asistente de Flujo27.\n\nAyudo a negocios a automatizar su captación y seguimiento para que no pierdan ni una sola oportunidad de venta.\n\nPara darte el consejo adecuado, ¿qué es lo que más te urge resolver hoy?";
    case "ruta1_web":
      return "Perfecto.\n\nMuchas empresas intentan conseguir más visitas cuando el verdadero problema es que no existe un sistema claro para capturar cada oportunidad.\n\n¿Actualmente tienes página web?";
    case "ruta1_captura":
      return "Excelente.\n\n¿Tu página actualmente tiene alguna forma de capturar y organizar automáticamente los contactos que llegan?";
    case "ruta1_seguimiento":
      return "Perfecto.\n\nEntonces el reto ya no es captar más personas, sino lo que ocurre después.\n\n¿Sientes que todos los prospectos reciben seguimiento oportuno?";
    case "ruta2_herramienta":
      return "Entiendo.\n\nCuriosamente muchas empresas no tienen un problema de generación de prospectos.\n\nEl problema aparece después: respuestas tardías, seguimientos olvidados o procesos manuales.\n\n¿Cómo gestionan actualmente esos contactos?";
    case "ruta3_area":
      return "Perfecto.\n\nCuando una empresa crece, muchas tareas empiezan a repetirse diariamente.\n\nLa mayoría de las veces no es necesario cambiar todo el sistema; basta con eliminar algunos puntos de fricción.\n\n¿Qué te gustaría automatizar?";
    case "ruta4_situacion":
      return "No hay problema.\n\nDe hecho, muchas empresas llegan exactamente en ese punto.\n\nSolo saben que algunos procesos toman demasiado tiempo o que ciertas oportunidades se están perdiendo.\n\n¿Cuál de estas situaciones describe mejor tu caso?";
    case "datos_nombre":
      return "Con lo que me compartiste ya tengo una idea bastante clara de dónde podría existir una oportunidad de mejora.\n\n¿Me compartes tu nombre?";
    case "datos_empresa":
      return `Gracias ${data.nombre}.\n\n¿A qué empresa perteneces?`;
    case "datos_canal":
      return "Perfecto.\n\n¿Dónde te gustaría que te enviemos la información?";
    case "datos_contacto":
      return data.canalContacto === "Correo electrónico"
        ? "¿Cuál es tu correo electrónico?"
        : "¿Cuál es tu número de WhatsApp?";
    case "cierre":
      return `Listo, ${data.nombre}.\n\nYa recibí tu información. En breve me comunico contigo por ${data.canalContacto === "Correo electrónico" ? "correo" : "WhatsApp"} para confirmar los detalles de la sesión.\n\n¡Un gusto saludarte! Hablamos muy pronto. 🤝`;
    default:
      return "";
  }
}

function getNextStep(current: Step, chosen: string): Step {
  switch (current) {
    case "inicio":
      if (chosen === "Conseguir más oportunidades") return "ruta1_web";
      if (chosen === "Dar mejor seguimiento a prospectos") return "ruta2_herramienta";
      if (chosen === "Automatizar procesos internos") return "ruta3_area";
      return "ruta4_situacion";
    case "ruta1_web":       return "ruta1_captura";
    case "ruta1_captura":   return chosen === "Sí" ? "ruta1_seguimiento" : "datos_nombre";
    case "ruta1_seguimiento": return "datos_nombre";
    case "ruta2_herramienta": return "datos_nombre";
    case "ruta3_area":      return "datos_nombre";
    case "ruta4_situacion": return "datos_nombre";
    case "datos_nombre":    return "datos_empresa";
    case "datos_empresa":   return "datos_canal";
    case "datos_canal":     return "datos_contacto";
    case "datos_contacto":  return "cierre";
    default:                return "done";
  }
}

// ─── Telegram ────────────────────────────────────────────────────────────────

async function notificarTelegram(data: LeadData): Promise<void> {
  try {
    await fetch("/api/diagnostico", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nombre: data.nombre ?? "—",
        empresa: data.empresa ?? "—",
        whatsapp: data.canalContacto === "WhatsApp" ? (data.contacto ?? "—") : "—",
        correo: data.canalContacto === "Correo electrónico" ? (data.contacto ?? "—") : "—",
        _extra: {
          problema: data.problema,
          tieneWeb: data.tieneWeb,
          capturaAutomatica: data.capturaAutomatica,
          sistemaActual: data.sistemaActual,
          areaAutomatizacion: data.areaAutomatizacion,
          situacion: data.situacion,
          nivelMadurez: data.nivelMadurez,
          canalContacto: data.canalContacto,
          fechaRegistro: new Date().toLocaleString("es-MX", { timeZone: "America/Mexico_City" }),
          fuente: "Chatbot",
        },
      }),
    });
  } catch { /* silent */ }
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [step, setStep] = useState<Step>("inicio");
  const [leadData, setLeadData] = useState<LeadData>({});
  const [freeInput, setFreeInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const msgId = useRef(0);
  const initialized = useRef(false);

  const addMsg = (from: "bot" | "user", text: string) =>
    setMessages((prev) => [...prev, { id: msgId.current++, from, text }]);

  const botSay = (text: string, then?: () => void) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      addMsg("bot", text);
      then?.();
    }, 950);
  };

  // Init on first open
  useEffect(() => {
    if (open && !initialized.current) {
      initialized.current = true;
      botSay(getBotText("inicio", {}));
    }
  }, [open]);

  // Scroll to bottom
  useEffect(() => {
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 80);
  }, [messages, isTyping]);

  // Listen for global openChatbot event
  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener("openChatbot", handler);
    return () => window.removeEventListener("openChatbot", handler);
  }, []);

  const advance = (chosen: string, extraUpdate: LeadData) => {
    const newData = { ...leadData, ...extraUpdate };
    setLeadData(newData);
    const next = getNextStep(step, chosen);
    setStep(next);
    const text = getBotText(next, newData);
    if (!text) return;
    botSay(text, () => {
      if (next === "cierre") {
        notificarTelegram(newData);
        setIsDone(true);
      }
    });
  };

  const handleOption = (chosen: string) => {
    addMsg("user", chosen);
    const update: LeadData = {};
    switch (step) {
      case "inicio":       update.problema = chosen; update.nivelMadurez = "Inicial"; break;
      case "ruta1_web":    update.tieneWeb = chosen; break;
      case "ruta1_captura": update.capturaAutomatica = chosen; break;
      case "ruta1_seguimiento": if (chosen === "No") update.problema = (leadData.problema ?? "") + " + Seguimiento"; break;
      case "ruta2_herramienta": update.sistemaActual = chosen; break;
      case "ruta3_area":   update.areaAutomatizacion = chosen; break;
      case "ruta4_situacion": update.situacion = chosen; break;
      case "datos_canal":  update.canalContacto = chosen; break;
    }
    advance(chosen, update);
  };

  const handleTextSend = () => {
    const trimmed = freeInput.trim();
    if (!trimmed || isTyping) return;
    addMsg("user", trimmed);
    setFreeInput("");
    const update: LeadData = {};
    if (step === "datos_nombre")   update.nombre = trimmed;
    if (step === "datos_empresa")  update.empresa = trimmed;
    if (step === "datos_contacto") update.contacto = trimmed;
    advance(trimmed, update);
  };

  const needsOptions  = !isDone && step in OPTIONS && !isTyping;
  const needsText     = !isDone && FREE_TEXT_STEPS.includes(step) && !isTyping;

  return (
    <>
      {/* Floating trigger */}
      <div className="fixed bottom-5 right-5 z-50" id="chatbot">
        <AnimatePresence>
          {!open && (
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              onClick={() => setOpen(true)}
              className="w-14 h-14 rounded-2xl bg-[#16A34A] text-white flex items-center justify-center shadow-[0_4px_20px_rgba(22,163,74,0.4)] hover:bg-[#15803D] transition-colors"
              aria-label="Abrir asistente"
            >
              <MessageSquare size={22} />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* ── Chat window — FIXED size, never grows ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="fixed z-50 flex flex-col rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.16)] border border-[#E5E7EB] bg-white overflow-hidden"
            style={{ width: "min(375px, calc(100vw - 40px))", height: "min(560px, calc(100vh - 40px))", bottom: 20, right: 20 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-[#111111] flex-shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <div className="w-8 h-8 rounded-full bg-[#16A34A]/20 flex items-center justify-center">
                    <MessageSquare size={15} className="text-[#4ADE80]" />
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#16A34A] border-2 border-[#111111]" />
                </div>
                <div>
                  <p className="text-[13px] font-semibold text-white leading-none mb-0.5">Asistente Flujo27</p>
                  <p className="text-[11px] text-[#6EE7B7]">En línea ahora</p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                aria-label="Cerrar"
              >
                <ChevronDown size={16} />
              </button>
            </div>

            {/* Messages — scrollable, fills remaining space */}
            <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3 bg-[#F8FAFC] min-h-0">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn("flex", msg.from === "user" ? "justify-end" : "justify-start")}
                >
                  <div className={cn(
                    "max-w-[83%] px-3.5 py-2.5 rounded-2xl text-[13px] leading-relaxed whitespace-pre-line",
                    msg.from === "user"
                      ? "bg-[#16A34A] text-white rounded-br-sm"
                      : "bg-white border border-[#E5E7EB] text-[#111111] rounded-bl-sm shadow-sm"
                  )}>
                    {msg.text}
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white border border-[#E5E7EB] rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1 shadow-sm">
                    {[0, 0.2, 0.4].map((d, i) => (
                      <div key={i} className="w-1.5 h-1.5 rounded-full bg-[#9CA3AF] animate-bounce" style={{ animationDelay: `${d}s` }} />
                    ))}
                  </div>
                </div>
              )}

              {/* Option buttons */}
              {needsOptions && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col gap-2 mt-1"
                >
                  {OPTIONS[step]!.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => handleOption(opt)}
                      className="w-full text-left text-[12px] text-[#374151] font-medium bg-white border border-[#E5E7EB] rounded-xl px-3.5 py-2.5 hover:border-[#16A34A] hover:text-[#16A34A] hover:bg-[#F0FDF4] transition-all duration-150"
                    >
                      {opt}
                    </button>
                  ))}
                </motion.div>
              )}

              {/* Success state — no second form, datos already captured */}
              {isDone && !isTyping && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-1 bg-white border border-[#16A34A]/25 rounded-2xl p-4 text-center shadow-sm"
                >
                  <CheckCircle2 size={24} className="text-[#16A34A] mx-auto mb-2" />
                  <p className="text-[12px] text-[#6B7280] leading-relaxed mb-3">
                    ¿Prefieres agendar directamente en calendario para asegurar tu horario?
                  </p>
                  <button
                    onClick={() => setOpen(false)}
                    className="w-full bg-[#16A34A] text-white text-[12px] font-semibold py-2.5 rounded-xl flex items-center justify-center gap-1.5 hover:bg-[#15803D] transition-colors"
                  >
                    <ArrowRight size={13} />
                    Seguir explorando la página
                  </button>
                </motion.div>
              )}

              <div ref={bottomRef} />
            </div>

            {/* Text input — only during free-text steps */}
            {needsText && (
              <div className="border-t border-[#E5E7EB] bg-white px-3 py-3 flex items-center gap-2 flex-shrink-0">
                <input
                  type={
                    step === "datos_contacto" && leadData.canalContacto === "Correo electrónico"
                      ? "email"
                      : step === "datos_contacto"
                      ? "tel"
                      : "text"
                  }
                  value={freeInput}
                  onChange={(e) => setFreeInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleTextSend()}
                  placeholder={
                    step === "datos_nombre"    ? "Tu nombre completo"
                    : step === "datos_empresa" ? "Nombre de tu empresa"
                    : leadData.canalContacto === "Correo electrónico" ? "tu@empresa.com"
                    : "+52 55 1234 5678"
                  }
                  autoFocus
                  className="flex-1 text-[13px] text-[#111111] placeholder:text-[#9CA3AF] bg-transparent outline-none"
                />
                <button
                  onClick={handleTextSend}
                  disabled={!freeInput.trim()}
                  className="w-8 h-8 rounded-lg bg-[#16A34A] flex items-center justify-center text-white disabled:opacity-40 hover:bg-[#15803D] transition-colors"
                >
                  <Send size={13} />
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
