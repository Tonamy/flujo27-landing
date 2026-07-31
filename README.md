# Flujo27 — Landing Page

> "Tu negocio sigue funcionando aunque nadie esté disponible."

Landing page de alta conversión para Flujo27, construida sobre la base de ChatDeck (ShadcnDeck) con Next.js 15, Tailwind CSS v4, Shadcn/UI y Framer Motion.

---

## Estructura del proyecto

```
flujo27-landing/
├── app/
│   ├── globals.css          # Tokens de marca Flujo27 + variables CSS
│   ├── layout.tsx           # Root layout: Navbar, Footer, ChatbotWidget
│   └── page.tsx             # Página principal: ensambla todas las secciones
│
├── components/
│   └── sections/
│       ├── Navbar.tsx               # Navegación sticky con scroll detection
│       ├── HeroSection.tsx          # Hero principal (columna texto + simulación)
│       ├── OperationalSimulation.tsx # Widget animado: Cliente→Sistema→Equipo
│       ├── ProblemSection.tsx       # Comparación Antes/Después
│       ├── SolutionsSection.tsx     # 3 tarjetas de servicios
│       ├── TimelineSection.tsx      # Timeline operativo animado
│       ├── CtaFinalSection.tsx      # CTA de cierre oscuro
│       ├── ChatbotWidget.tsx        # Chatbot demo flotante
│       └── Footer.tsx               # Footer minimalista
│
├── lib/
│   └── utils.ts             # cn() helper (clsx + tailwind-merge)
│
├── public/                  # Activos estáticos (favicon, og image, etc.)
│
├── package.json
├── tsconfig.json
├── next.config.ts
├── postcss.config.mjs
└── components.json          # Config de shadcn/ui
```

---

## Setup rápido

### 1. Clonar e instalar

```bash
# Opción A: clonar desde cero
git clone https://github.com/ShadcnDeck/chatdeck-shadcn-saas-landing-page-template flujo27-landing
cd flujo27-landing

# Opción B: proyecto nuevo
npx create-next-app@latest flujo27-landing --typescript --tailwind --app --no-src-dir
cd flujo27-landing
```

### 2. Reemplazar archivos con este proyecto

Copia todos los archivos de este proyecto sobre la estructura base.

### 3. Instalar dependencias

```bash
npm install
# o
pnpm install
```

### 4. Instalar componentes de Shadcn que uses

```bash
npx shadcn@latest init
npx shadcn@latest add card badge button dialog accordion
```

### 5. Instalar Motion (Framer Motion)

```bash
npm install motion
```

### 6. Correr en desarrollo

```bash
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000)

---

## Paleta de colores Flujo27

| Token             | Valor     | Uso                          |
|-------------------|-----------|------------------------------|
| `--flujo-green`   | `#16A34A` | Acento principal, CTAs       |
| `--flujo-green-light` | `#DCFCE7` | Fondos de badges, íconos  |
| `--flujo-green-dark` | `#15803D` | Hover de botones verdes    |
| `--foreground`    | `#111111` | Texto principal              |
| `--flujo-gray-text`| `#6B7280` | Texto secundario             |
| `--flujo-bg-soft` | `#F8FAFC` | Fondos de secciones alternas |
| `--flujo-bg-muted`| `#F3F4F6` | Chips, tags, fondos suaves   |
| `--flujo-border`  | `#E5E7EB` | Bordes de tarjetas           |

---

## Decisiones de arquitectura y notas técnicas

### ¿Por qué no hay conflicto con ChatDeck?

ChatDeck usa la misma base técnica (Next.js 15, Tailwind v4, Shadcn, Motion).
La diferencia es que:
- Eliminamos los bloques genéricos (TeamSection, PricingSection con toggle, TestimonialSection)
- Reemplazamos el Hero con una simulación operativa viva en lugar de una imagen estática
- Agregamos el ChatbotWidget como demostración del producto (no como soporte)
- Las secciones siguen el mismo patrón de componentes independientes `/sections/`

### OperationalSimulation

Este es el elemento central de la experiencia. Funciona con un ciclo que:
1. Reinicia el estado (`visibleSteps = []`)
2. Programa timers para cada paso con `step.delay + 300ms`
3. Repite cada 8 segundos con `setInterval`

**Para ajustar la velocidad:** cambia `CYCLE_DURATION` (ms) y los `delay` dentro de `STEPS`.

### ChatbotWidget

- Es un `"use client"` flotante independiente del resto
- Se monta en el layout para estar disponible en toda la página
- El enlace `href="#chatbot"` en los CTAs hace scroll al widget
- Las respuestas simulan un delay de 1200ms para parecer natural
- Para conectar con una API real: sustituye `addBotMessage()` por un `fetch` a tu endpoint

### TimelineSection

Las animaciones de entrada del timeline se disparan con `useInView` de Motion.
Una vez que la sección entra al viewport, se programan timers secuenciales
con 700ms entre cada evento.

### Responsive

- Mobile: stack vertical, simulación debajo del copy
- Desktop: grid 70/30 en el Hero, 50/50 en el Timeline
- El Navbar se colapsa en mobile con un menú deslizable

---

## Cómo conectar el chatbot con un backend real

Busca la función `addBotMessage` en `ChatbotWidget.tsx` y reemplázala:

```typescript
const addBotMessage = async (userMessage: string) => {
  setIsTyping(true);
  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userMessage }),
    });
    const data = await res.json();
    setIsTyping(false);
    setMessages((prev) => [
      ...prev,
      { id: msgCounter.current++, from: "bot", text: data.reply },
    ]);
  } catch {
    setIsTyping(false);
    setMessages((prev) => [
      ...prev,
      { id: msgCounter.current++, from: "bot", text: "Hubo un error. Por favor intenta de nuevo." },
    ]);
  }
};
```

Crea `app/api/chat/route.ts` con tu lógica de IA (OpenAI, Claude, etc.)

---

## Cómo conectar el CTA "Agenda un diagnóstico"

Opciones:

1. **Cal.com** (recomendado para startups): reemplaza `href` con tu link de Cal
2. **Calendly**: embed o link directo
3. **Formulario propio**: abre un `<Dialog>` de Shadcn con un formulario
4. **WhatsApp**: `https://wa.me/52TUNUMERO?text=Quiero%20un%20diagnóstico`

---

## Deploy recomendado

### Vercel (más fácil)

```bash
npm install -g vercel
vercel
```

### Alternativas

- Netlify: conecta tu repo de GitHub
- Railway: `railway up`

---

## Variables de entorno (si conectas backend)

Crea `.env.local`:

```env
# Para el chatbot con IA
OPENAI_API_KEY=sk-...
# o
ANTHROPIC_API_KEY=sk-ant-...

# Para formularios (ej. Resend para correos)
RESEND_API_KEY=re_...

# Para analytics
NEXT_PUBLIC_GA_ID=G-...
```

---

## Próximos pasos sugeridos

1. **[ ] Conectar dominio** → flujo27.com en Vercel
2. **[ ] Agregar og:image** → `/public/og.png` (1200×630px)
3. **[ ] Favicon** → `/public/favicon.ico` con el logo verde
4. **[ ] Analytics** → instalar Vercel Analytics o Google Analytics
5. **[ ] Conectar chatbot** → API con Claude o GPT-4o-mini
6. **[ ] CTA real** → Calendly o Cal.com para el diagnóstico
7. **[ ] WhatsApp Widget** → alternativa o complemento al chat
8. **[ ] A/B test** → titular alternativo: "Sin responder = sin clientes"
9. **[ ] SEO** → agregar metadata dinámica por sección
10. **[ ] Formulario de contacto** → Dialog de Shadcn + Resend

---

## Stack utilizado

| Tecnología         | Versión    | Propósito                    |
|--------------------|------------|------------------------------|
| Next.js            | 15.x       | Framework React, App Router  |
| TypeScript         | 5.x        | Tipado estático              |
| Tailwind CSS       | 4.x        | Estilos utility-first        |
| Shadcn/UI          | latest     | Componentes accesibles       |
| Motion (Framer)    | 12.x       | Animaciones suaves           |
| Geist (next/font)  | built-in   | Tipografía sans-serif moderna|
| Lucide React       | latest     | Íconos limpios               |

---

## Regla de oro (del Brand Book)

> Cada elemento visual debe responder: "¿Ayuda a transmitir que el negocio sigue funcionando aunque nadie esté disponible?"
>
> Si la respuesta es NO — eliminarlo.
