import { NextRequest, NextResponse } from "next/server";

interface ExtraData {
  problema?: string;
  tieneWeb?: string;
  capturaAutomatica?: string;
  sistemaActual?: string;
  areaAutomatizacion?: string;
  situacion?: string;
  nivelMadurez?: string;
  canalContacto?: string;
  fechaRegistro?: string;
  fuente?: string;
}

interface DiagnosticoPayload {
  nombre: string;
  empresa: string;
  whatsapp: string;
  correo: string;
  honeypot?: string;
  _extra?: ExtraData;
}

async function sendTelegramMessage(token: string, chatId: string, text: string): Promise<void> {
  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: "Markdown" }),
  });
}

async function enviarNotificacion(datos: DiagnosticoPayload): Promise<boolean> {
  const token = process.env.TELEGRAM_TOKEN;
  const chatId = process.env.CHAT_ID;

  if (!token || !chatId) {
    console.warn("[Flujo27] TELEGRAM_TOKEN o CHAT_ID no configurados.");
    return false;
  }

  const extra = datos._extra ?? {};
  const fuente = extra.fuente ?? "Formulario";
  const fecha = extra.fechaRegistro ??
    new Date().toLocaleString("es-MX", { timeZone: "America/Mexico_City" });

  const contactoValor =
    datos.whatsapp && datos.whatsapp !== "—" ? datos.whatsapp : datos.correo;
  const contactoLabel =
    datos.whatsapp && datos.whatsapp !== "—" ? "📞 WhatsApp" : "📧 Correo";

  // ── Mensaje 1: datos del lead ──────────────────────────────────────────────
  const msg1 =
    `🔔 *Nuevo Lead — Flujo27* _(${fuente})_\n\n` +
    `👤 *Nombre:* ${datos.nombre}\n` +
    `🏢 *Empresa:* ${datos.empresa}\n` +
    `${contactoLabel}: \`${contactoValor}\`\n` +
    `🕐 *Fecha:* ${fecha}`;

  // ── Mensaje 2: WhatsApp listo para copiar ──────────────────────────────────
  const msg2 =
    `💬 *Mensaje para WhatsApp — copiar y enviar:*\n\n` +
    `¡Hola ${datos.nombre}\\! Gracias por tu interés en Flujo27\\. ` +
    `Soy Tonatiuh; recibí tu solicitud y me encantaría revisar cómo automatizar ` +
    `los procesos de ${datos.empresa}\\. ` +
    `¿Tienes disponibilidad para una sesión breve esta semana\\? ` +
    `Te comparto mi calendario: \\[TU\\_LINK\\_CALENDLY\\]`;

  // ── Mensaje 3: contexto completo del chatbot ───────────────────────────────
  let contexto = `📋 *Contexto del lead:*\n`;
  if (extra.problema)           contexto += `\n🎯 Objetivo: ${extra.problema}`;
  if (extra.tieneWeb)           contexto += `\n🌐 Tiene web: ${extra.tieneWeb}`;
  if (extra.capturaAutomatica)  contexto += `\n📥 Captura automática: ${extra.capturaAutomatica}`;
  if (extra.sistemaActual)      contexto += `\n🔧 Sistema actual: ${extra.sistemaActual}`;
  if (extra.areaAutomatizacion) contexto += `\n⚙️  Área: ${extra.areaAutomatizacion}`;
  if (extra.situacion)          contexto += `\n📌 Situación: ${extra.situacion}`;
  if (extra.nivelMadurez)       contexto += `\n📊 Madurez: ${extra.nivelMadurez}`;
  if (extra.canalContacto)      contexto += `\n📡 Canal elegido: ${extra.canalContacto}`;

  try {
    await sendTelegramMessage(token, chatId, msg1);
    await new Promise(r => setTimeout(r, 300));
    await sendTelegramMessage(token, chatId, msg2);
    await new Promise(r => setTimeout(r, 300));
    // Only send context if we have chatbot data
    if (Object.keys(extra).length > 2) {
      await sendTelegramMessage(token, chatId, contexto);
    }
    return true;
  } catch (err) {
    console.error("[Flujo27] Error enviando a Telegram:", err);
    return false;
  }
}

export async function POST(req: NextRequest) {
  try {
    const body: DiagnosticoPayload = await req.json();

    if (body.honeypot && body.honeypot.trim() !== "") {
      return NextResponse.json({ ok: true });
    }

    const { nombre, empresa } = body;
    const hasContact =
      (body.whatsapp && body.whatsapp !== "—") ||
      (body.correo && body.correo !== "—");

    if (!nombre || !empresa || !hasContact) {
      return NextResponse.json(
        { ok: false, error: "Faltan datos obligatorios." },
        { status: 400 }
      );
    }

    await enviarNotificacion(body);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[Flujo27] Error en /api/diagnostico:", err);
    return NextResponse.json(
      { ok: false, error: "Error interno del servidor." },
      { status: 500 }
    );
  }
}
