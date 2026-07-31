"use client";

import { useState, useEffect, useRef } from "react";
import { X, ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

interface FormData {
  nombre: string;
  empresa: string;
  whatsapp: string;
  correo: string;
  honeypot: string; // anti-bot, always empty for real users
}

type Status = "idle" | "loading" | "success" | "error";

// ─── Props ────────────────────────────────────────────────────────────────────

interface DiagnosticoModalProps {
  open: boolean;
  onClose: () => void;
}

// ─── Field config ─────────────────────────────────────────────────────────────

const FIELDS = [
  {
    id: "nombre",
    label: "Nombre completo",
    type: "text",
    placeholder: "Tu nombre",
    autoComplete: "name",
  },
  {
    id: "empresa",
    label: "Empresa",
    type: "text",
    placeholder: "Nombre de tu empresa",
    autoComplete: "organization",
  },
  {
    id: "whatsapp",
    label: "WhatsApp",
    type: "tel",
    placeholder: "+52 55 1234 5678",
    autoComplete: "tel",
  },
  {
    id: "correo",
    label: "Correo electrónico",
    type: "email",
    placeholder: "tu@empresa.com",
    autoComplete: "email",
  },
] as const;

// ─── Component ────────────────────────────────────────────────────────────────

export function DiagnosticoModal({ open, onClose }: DiagnosticoModalProps) {
  const [form, setForm] = useState<FormData>({
    nombre: "",
    empresa: "",
    whatsapp: "",
    correo: "",
    honeypot: "",
  });
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const firstInputRef = useRef<HTMLInputElement>(null);

  // Focus first input when modal opens
  useEffect(() => {
    if (open) {
      setTimeout(() => firstInputRef.current?.focus(), 150);
    }
  }, [open]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  // Prevent body scroll while open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const handleChange = (id: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [id]: e.target.value }));
    if (errorMsg) setErrorMsg("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "loading") return;

    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/diagnostico", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        setStatus("error");
        setErrorMsg(data.error ?? "Hubo un problema al enviar. Intenta de nuevo.");
        return;
      }

      setStatus("success");
    } catch {
      setStatus("error");
      setErrorMsg("Error de conexión. Verifica tu internet e intenta de nuevo.");
    }
  };

  const handleClose = () => {
    if (status === "loading") return;
    onClose();
    // Reset after transition
    setTimeout(() => {
      setStatus("idle");
      setErrorMsg("");
      setForm({ nombre: "", empresa: "", whatsapp: "", correo: "", honeypot: "" });
    }, 300);
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            onClick={handleClose}
          />

          {/* Modal panel */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              className="w-full max-w-md bg-white rounded-2xl shadow-[0_24px_80px_rgba(0,0,0,0.18)] overflow-hidden pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-start justify-between px-6 pt-6 pb-0">
                <div>
                  <div className="inline-flex items-center gap-1.5 bg-[#DCFCE7] text-[#16A34A] text-[11px] font-semibold px-2.5 py-1 rounded-full mb-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]" />
                    Diagnóstico gratuito
                  </div>
                  <h2 className="text-[20px] font-bold text-[#111111] leading-snug">
                    Cuéntanos sobre tu empresa
                  </h2>
                  <p className="text-[13px] text-[#6B7280] mt-1 leading-relaxed">
                    En 30 minutos identificamos oportunidades concretas de automatización para tu operación.
                  </p>
                </div>
                <button
                  onClick={handleClose}
                  className="p-1.5 rounded-lg hover:bg-[#F3F4F6] text-[#9CA3AF] hover:text-[#6B7280] transition-colors flex-shrink-0 ml-4"
                  aria-label="Cerrar"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Content */}
              <div className="px-6 pb-6 pt-5">
                <AnimatePresence mode="wait">
                  {status === "success" ? (
                    // ── Success state ──
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      className="text-center py-6"
                    >
                      <div className="w-14 h-14 bg-[#DCFCE7] rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle2 size={28} className="text-[#16A34A]" />
                      </div>
                      <h3 className="text-[17px] font-bold text-[#111111] mb-3">
                        ¡Todo listo!
                      </h3>
                      <p className="text-[14px] text-[#6B7280] leading-relaxed">
                        Ya recibimos tu solicitud para el diagnóstico. En un momento
                        te contacto por WhatsApp para confirmar los detalles de nuestra
                        sesión y ver cómo podemos simplificar tus procesos.
                        <br /><br />
                        <span className="font-medium text-[#111111]">
                          ¡Un gusto saludarte! Hablamos muy pronto.
                        </span>
                      </p>
                      <button
                        onClick={handleClose}
                        className="mt-6 w-full py-2.5 rounded-xl border border-[#E5E7EB] text-[14px] text-[#6B7280] hover:bg-[#F8FAFC] transition-colors"
                      >
                        Cerrar
                      </button>
                    </motion.div>
                  ) : (
                    // ── Form state ──
                    <motion.form
                      key="form"
                      onSubmit={handleSubmit}
                      initial={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col gap-4"
                    >
                      {/* Honeypot — invisible for real users */}
                      <input
                        type="text"
                        name="website"
                        value={form.honeypot}
                        onChange={handleChange("honeypot")}
                        tabIndex={-1}
                        autoComplete="off"
                        className="absolute opacity-0 pointer-events-none h-0 w-0 overflow-hidden"
                        aria-hidden="true"
                      />

                      {/* Fields */}
                      {FIELDS.map((field, index) => (
                        <div key={field.id} className="flex flex-col gap-1.5">
                          <label
                            htmlFor={field.id}
                            className="text-[13px] font-medium text-[#374151]"
                          >
                            {field.label}
                            <span className="text-[#EF4444] ml-0.5">*</span>
                          </label>
                          <input
                            ref={index === 0 ? firstInputRef : undefined}
                            id={field.id}
                            type={field.type}
                            placeholder={field.placeholder}
                            autoComplete={field.autoComplete}
                            value={form[field.id as keyof FormData]}
                            onChange={handleChange(field.id as keyof FormData)}
                            required
                            className={cn(
                              "w-full px-3.5 py-2.5 rounded-xl border text-[14px] text-[#111111] placeholder:text-[#C4C9D4]",
                              "outline-none transition-all duration-150",
                              "focus:border-[#16A34A] focus:ring-2 focus:ring-[#16A34A]/15",
                              "bg-white border-[#E5E7EB] hover:border-[#D1D5DB]"
                            )}
                          />
                        </div>
                      ))}

                      {/* Error message */}
                      {status === "error" && errorMsg && (
                        <p className="text-[12px] text-[#EF4444] bg-[#FEF2F2] border border-[#FECACA] rounded-lg px-3 py-2">
                          {errorMsg}
                        </p>
                      )}

                      {/* Submit */}
                      <button
                        type="submit"
                        disabled={status === "loading"}
                        className={cn(
                          "mt-1 w-full flex items-center justify-center gap-2",
                          "bg-[#16A34A] text-white font-semibold text-[15px] py-3.5 rounded-xl",
                          "hover:bg-[#15803D] transition-all duration-200",
                          "shadow-[0_1px_3px_rgba(22,163,74,0.3)] hover:shadow-[0_4px_12px_rgba(22,163,74,0.35)]",
                          "disabled:opacity-60 disabled:cursor-not-allowed"
                        )}
                      >
                        {status === "loading" ? (
                          <>
                            <Loader2 size={16} className="animate-spin" />
                            Enviando…
                          </>
                        ) : (
                          <>
                            Solicitar diagnóstico
                            <ArrowRight size={16} />
                          </>
                        )}
                      </button>

                      <p className="text-center text-[11px] text-[#9CA3AF]">
                        Sin costo · Sin compromiso · Te contactamos por WhatsApp
                      </p>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
