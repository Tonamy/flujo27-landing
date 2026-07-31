import Link from "next/link";
import { Mail, MessageCircle } from "lucide-react";

const NAV_LINKS = [
  { label: "Soluciones", href: "#soluciones" },
  { label: "Cómo funciona", href: "#timeline" },
];

const WA_NUMBER = "527292813321";
const WA_MESSAGE = encodeURIComponent("Hola, me interesa conocer más sobre Flujo27.");
const EMAIL = "tonahina@live.com";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[#E5E7EB] bg-white py-10">
      <div className="flujo-container">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">

          {/* Brand */}
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-[#16A34A] rounded-md flex items-center justify-center">
              <span className="text-white font-bold text-[10px]">F</span>
            </div>
            <span className="font-semibold text-[#111111] text-sm">Flujo27</span>
          </div>

          {/* Nav links */}
          <nav className="flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[13px] text-[#6B7280] hover:text-[#111111] transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Contact buttons */}
          <div className="flex items-center gap-3">
            {/* Email */}
            <a
              href={`mailto:${EMAIL}`}
              className="inline-flex items-center gap-1.5 text-[12px] text-[#6B7280] border border-[#E5E7EB] rounded-lg px-3 py-1.5 hover:text-[#111111] hover:border-[#D1D5DB] transition-all"
            >
              <Mail size={13} />
              {EMAIL}
            </a>

            {/* WhatsApp */}
            <a
              href={`https://wa.me/${WA_NUMBER}?text=${WA_MESSAGE}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[12px] font-medium text-white bg-[#25D366] rounded-lg px-3 py-1.5 hover:bg-[#1ebe5d] transition-colors"
            >
              <MessageCircle size={13} />
              WhatsApp
            </a>
          </div>
        </div>

        {/* Bottom line */}
        <div className="mt-6 pt-5 border-t border-[#F3F4F6] text-center">
          <p className="text-[11px] text-[#9CA3AF]">
            © {year} Flujo27. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
