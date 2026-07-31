"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDiagnostico } from "@/lib/DiagnosticoContext";

const navLinks = [
  { label: "Soluciones", href: "#soluciones" },
  { label: "Cómo funciona", href: "#timeline" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { openModal } = useDiagnostico();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-white/95 backdrop-blur-md border-b border-[#E5E7EB] shadow-sm"
          : "bg-transparent"
      )}
    >
      <div className="flujo-container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-[#16A34A] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs">F</span>
            </div>
            <span className="font-semibold text-[#111111] text-[15px] tracking-tight">Flujo27</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-[#6B7280] hover:text-[#111111] transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => window.dispatchEvent(new Event("openChatbot"))}
              className="text-sm text-[#6B7280] hover:text-[#111111] transition-colors duration-200"
            >
              Probar asistente
            </button>
            <button
              onClick={openModal}
              className="inline-flex items-center gap-1.5 bg-[#16A34A] text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-[#15803D] transition-colors duration-200"
            >
              Agenda un diagnóstico
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-[#6B7280] hover:text-[#111111]"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-b border-[#E5E7EB] px-6 pb-5 pt-2">
          <nav className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-[#6B7280] hover:text-[#111111]"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2 flex flex-col gap-2 border-t border-[#E5E7EB]">
              <button
                onClick={() => { setMobileOpen(false); openModal(); }}
                className="w-full text-center bg-[#16A34A] text-white text-sm font-medium px-4 py-2.5 rounded-lg hover:bg-[#15803D] transition-colors"
              >
                Agenda un diagnóstico
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
