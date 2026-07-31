"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { DiagnosticoModal } from "@/components/sections/DiagnosticoModal";

interface DiagnosticoContextValue {
  openModal: () => void;
}

const DiagnosticoContext = createContext<DiagnosticoContextValue>({ openModal: () => {} });

export function useDiagnostico() {
  return useContext(DiagnosticoContext);
}

export function DiagnosticoProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  // Also listen for the custom event fired by the chatbot's closing CTA
  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener("openDiagnostico", handler);
    return () => window.removeEventListener("openDiagnostico", handler);
  }, []);

  return (
    <DiagnosticoContext.Provider value={{ openModal: () => setOpen(true) }}>
      {children}
      <DiagnosticoModal open={open} onClose={() => setOpen(false)} />
    </DiagnosticoContext.Provider>
  );
}
