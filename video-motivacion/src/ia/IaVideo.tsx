import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { loadFont } from "@remotion/fonts";
import { Mascot, OUT, Tag } from "../pov/Mascot";
import { Confetti, Notebook, Pencil, Spot, Window, ol } from "../pov/PovVideo";
import { Skyline, Sparkle, blobPath } from "../art";
import { FONT, mod, ramp, rnd } from "../utils";

loadFont({
  family: "Montserrat",
  url: staticFile("fonts/Montserrat-Black.ttf"),
  weight: "900",
});

export const IA_FRAMES = 1800; // 60 s
const CX = 620;
const CY = 1390;
const S = 1.15;
const CYAN = "#5ff3ff";

const pop = (f: number, delay: number, len = 10) => {
  const k = Math.max(0, Math.min(1, (f - delay) / len));
  return k === 0 ? 0 : 1 + Math.sin(k * Math.PI) * 0.2 - (1 - k) * 0.3;
};

// --- guion -------------------------------------------------------------------
const SCENES = [
  {
    from: 0,
    dur: 240,
    text: "En 2026, ya no necesitas tener una empresa ni miles de dólares para empezar a construir un negocio. La inteligencia artificial está abriendo oportunidades que antes parecían imposibles.",
  },
  {
    from: 240,
    dur: 300,
    text: "Con herramientas como ChatGPT y generadores de imágenes, puedes crear anuncios para negocios, videos para redes sociales y productos digitales que otras personas necesitan.",
  },
  {
    from: 540,
    dur: 360,
    text: "¿La clave? No se trata de usar la IA por usarla. Se trata de resolver problemas. Busca negocios que necesiten mejores anuncios, crea una muestra de tu trabajo y ofréceles tus servicios.",
  },
  {
    from: 900,
    dur: 390,
    text: "Al principio quizá nadie te contrate. Tendrás que practicar, mejorar y aprender a vender tus habilidades. Pero cada proyecto puede ayudarte a construir experiencia y abrir nuevas oportunidades.",
  },
  {
    from: 1290,
    dur: 360,
    text: "Recuerda: la inteligencia artificial no hará el trabajo por ti. Pero si aprendes a utilizarla con inteligencia, creatividad y disciplina, puedes convertir una habilidad en una oportunidad de negocio.",
  },
  {
    from: 1650,
    dur: 150,
    text: "No esperes a tenerlo todo. Aprende, crea y empieza hoy. Tu primera oportunidad podría estar a un proyecto de distancia.",
  },
];

type Chunk = { from: number; to: number; words: string[] };

/** Parte la narración en frases cortas y les reparte el tiempo de la escena según su largo. */
const buildChunks = (): Chunk[] => {
  const out: Chunk[] = [];
  for (const sc of SCENES) {
    const words = sc.text.split(" ");
    const groups: string[][] = [];
    let cur: string[] = [];
    for (const w of words) {
      cur.push(w);
      const end = /[.,?:]$/.test(w);
      if (cur.length >= 7 || (end && cur.length >= 3)) {
        groups.push(cur);
        cur = [];
      }
    }
    if (cur.length) groups.push(cur);
    const weight = (g: string[]) => g.length + (/[.?]$/.test(g[g.length - 1]) ? 1.2 : 0.4);
    const total = groups.reduce((a, g) => a + weight(g), 0);
    const start = sc.from + 4;
    const span = sc.dur - 8;
    let acc = 0;
    for (const g of groups) {
      const a = start + (acc / total) * span;
      acc += weight(g);
      out.push({ from: a, to: start + (acc / total) * span, words: g });
    }
  }
  return out;
};
const CHUNKS = buildChunks();

// --- utilería nueva ----------------------------------------------------------
const Laptop: React.FC<{ t: number; glow?: number }> = ({ t, glow = 1 }) => (
  <g>
    <path d="M 330 1560 L 910 1560 L 960 1930 L 280 1930 Z" fill={CYAN} opacity={0.12 * glow} />
    <rect x={300} y={1580} width={640} height={380} rx={26} fill="#2b2f45" {...ol} strokeWidth={8} />
    <rect x={300} y={1580} width={640} height={380} rx={26} fill="none" stroke={CYAN} strokeWidth={4} opacity={0.5 + 0.3 * Math.sin(t / 8)} transform="translate(0 -6)" />
    <g transform="translate(620 1740)">
      <path d="M 0 -36 Q 3 -3 36 0 Q 3 3 0 36 Q -3 3 -36 0 Q -3 -3 0 -36 Z" fill="#cfd6ff" opacity={0.8} />
    </g>
  </g>
);

/** Asistente de IA holográfico: cabeza de robot amable que flota y brilla. */
const HoloBot: React.FC<{ x: number; y: number; f: number; t: number; delay?: number }> = ({ x, y, f, t, delay = 20 }) => {
  const k = pop(f, delay, 14);
  return (
    <g transform={`translate(${x} ${y + Math.sin(t / 14) * 12}) scale(${k})`}>
      <path d={blobPath(150, 150, 2, 0.02, 14, t / 20, 0.02)} fill={CYAN} opacity={0.14} />
      <circle r={118} fill="none" stroke={CYAN} strokeWidth={5} strokeDasharray="18 14" transform={`rotate(${t * 1.2})`} opacity={0.7} />
      <line x1={0} y1={-70} x2={0} y2={-104} stroke={OUT} strokeWidth={10} strokeLinecap="round" />
      <line x1={0} y1={-70} x2={0} y2={-104} stroke="#d6faff" strokeWidth={5} strokeLinecap="round" />
      <circle cx={0} cy={-112} r={13} fill={CYAN} {...ol} strokeWidth={5} opacity={0.6 + 0.4 * Math.sin(t / 5)} />
      <rect x={-86} y={-70} width={172} height={136} rx={40} fill="#e9fbff" {...ol} />
      <rect x={-64} y={-46} width={128} height={78} rx={26} fill="#16243a" {...ol} strokeWidth={5} />
      {[-28, 28].map((ex) => (
        <ellipse key={ex} cx={ex} cy={-8} rx={11} ry={t % 80 < 4 ? 2 : 13} fill={CYAN} />
      ))}
      <path d="M -18 16 Q 0 28 18 16" stroke={CYAN} strokeWidth={5} fill="none" strokeLinecap="round" />
      <rect x={-104} y={-24} width={18} height={44} rx={8} fill="#b8dce8" {...ol} strokeWidth={5} />
      <rect x={86} y={-24} width={18} height={44} rx={8} fill="#b8dce8" {...ol} strokeWidth={5} />
      <Sparkle x={-120} y={-100} s={18} t={t} color="#fff" />
      <Sparkle x={130} y={70} s={14} t={t} phase={2} color="#fff" />
    </g>
  );
};

type CardKind = "image" | "video" | "design" | "ebook" | "chat";

const CardContent: React.FC<{ kind: CardKind; t: number }> = ({ kind, t }) => {
  switch (kind) {
    case "image":
      return (
        <g>
          <rect x={-100} y={-50} width={200} height={120} rx={10} fill="#8fd3ff" {...ol} strokeWidth={4} />
          <circle cx={50} cy={-18} r={18} fill="#ffd23f" {...ol} strokeWidth={4} />
          <path d="M -100 70 L -40 0 L 0 40 L 40 10 L 100 70 Z" fill="#3a8f5a" {...ol} strokeWidth={4} />
        </g>
      );
    case "video":
      return (
        <g>
          <rect x={-100} y={-50} width={200} height={120} rx={10} fill="#2a2350" {...ol} strokeWidth={4} />
          <path d="M -22 -20 L 30 10 L -22 40 Z" fill="#ff5a5a" {...ol} strokeWidth={4} />
          <rect x={-86} y={56} width={172} height={6} rx={3} fill="#555" />
          <rect x={-86} y={56} width={172 * ((t % 90) / 90)} height={6} rx={3} fill="#ff5a5a" />
        </g>
      );
    case "design":
      return (
        <g {...ol} strokeWidth={4}>
          <circle cx={-50} cy={0} r={34} fill="#ff6fae" transform={`rotate(${t * 2} -50 0)`} />
          <path d="M 10 40 L 50 -36 L 90 40 Z" fill="#ffd23f" transform={`rotate(${Math.sin(t / 10) * 8} 50 10)`} />
          <rect x={-30} y={20} width={50} height={50} rx={8} fill="#19c3a6" transform={`rotate(${-t} -5 45)`} />
        </g>
      );
    case "ebook":
      return (
        <g {...ol} strokeWidth={4}>
          <path d="M -80 -50 Q -40 -64 0 -46 L 0 70 Q -40 52 -80 66 Z" fill="#fff" />
          <path d="M 80 -50 Q 40 -64 0 -46 L 0 70 Q 40 52 80 66 Z" fill="#f2e6c9" />
          <path
            d={`M 0 -46 Q ${30 + Math.sin(t / 6) * 30} -60 ${70 + Math.sin(t / 6) * 10} -48 L ${70 + Math.sin(t / 6) * 10} 66 Q ${30 + Math.sin(t / 6) * 30} 54 0 70 Z`}
            fill="#ffffff"
            opacity={0.9}
          />
        </g>
      );
    case "chat":
      return (
        <g>
          <rect x={-90} y={-50} width={140} height={44} rx={20} fill="#e9e6ff" {...ol} strokeWidth={4} />
          <rect x={-40} y={6} width={130} height={44} rx={20} fill="#c7f5d9" {...ol} strokeWidth={4} />
          {[0, 1, 2].map((i) => (
            <circle key={i} cx={-60 + i * 22} cy={-28} r={6} fill={OUT} opacity={0.3 + 0.7 * Math.abs(Math.sin(t / 6 + i))} />
          ))}
        </g>
      );
  }
};

/** Pantalla flotante (proyecto digital) con su etiqueta. */
const Card: React.FC<{ x: number; y: number; kind: CardKind; label: string; f: number; t: number; delay: number; rot?: number }> = ({
  x,
  y,
  kind,
  label,
  f,
  t,
  delay,
  rot = 0,
}) => (
  <g transform={`translate(${x} ${y + Math.sin(t / 16 + x) * 10}) rotate(${rot + Math.sin(t / 22 + y) * 2}) scale(${pop(f, delay, 12)})`}>
    <rect x={-138} y={-112} width={276} height={224} rx={22} fill="rgba(0,0,0,0.35)" transform="translate(10 12)" />
    <rect x={-138} y={-112} width={276} height={224} rx={22} fill="#f7f7fb" {...ol} />
    <path d="M -138 -80 L 138 -80" stroke={OUT} strokeWidth={5} />
    {[0, 1, 2].map((i) => (
      <circle key={i} cx={-114 + i * 22} cy={-96} r={6} fill={["#ff5a5a", "#ffd23f", "#2dc26b"][i]} />
    ))}
    <g transform="translate(0 6)">
      <CardContent kind={kind} t={t} />
    </g>
    <g transform="translate(0 150)">
      <rect x={-label.length * 13 - 22} y={-28} width={label.length * 26 + 44} height={52} rx={26} fill={OUT} />
      <text y={12} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={34} fill="#fff">
        {label}
      </text>
    </g>
  </g>
);

const Bubble: React.FC<{ x: number; y: number; text: string; f: number; delay: number; color?: string; tail?: -1 | 1; size?: number }> = ({
  x,
  y,
  text,
  f,
  delay,
  color = "#ffffff",
  tail = 1,
  size = 44,
}) => {
  const w = text.length * size * 0.62 + 60;
  const h = size + 50;
  return (
    <g transform={`translate(${x} ${y}) scale(${pop(f, delay)})`}>
      <path d={`M ${tail * (w / 2 - 50)} ${h / 2 - 4} L ${tail * (w / 2 - 10)} ${h / 2 + 34} L ${tail * (w / 2 - 90)} ${h / 2 - 4} Z`} fill={color} {...ol} />
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={h / 2} fill={color} {...ol} />
      <text y={size * 0.35} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={size} fill={OUT}>
        {text}
      </text>
    </g>
  );
};

const Shop: React.FC<{ t: number }> = ({ t }) => (
  <g>
    <rect x={40} y={560} width={1000} height={1400} fill="#c9b49a" {...ol} />
    {Array.from({ length: 14 }).map((_, r) =>
      Array.from({ length: 6 }).map((__, c) => (
        <rect
          key={`${r}${c}`}
          x={40 + c * 180 + (r % 2) * 90 - 90}
          y={560 + r * 52}
          width={170}
          height={44}
          rx={6}
          fill="#b89f84"
          opacity={0.5}
        />
      )),
    )}
    {/* toldo a rayas */}
    {Array.from({ length: 10 }).map((_, i) => (
      <path
        key={i}
        d={`M ${40 + i * 100} 700 L ${140 + i * 100} 700 L ${140 + i * 100} 790 Q ${90 + i * 100} 830 ${40 + i * 100} 790 Z`}
        fill={i % 2 ? "#ffffff" : "#e0453a"}
        {...ol}
        strokeWidth={5}
      />
    ))}
    <rect x={180} y={580} width={720} height={110} rx={18} fill="#2b3a67" {...ol} />
    <text x={540} y={658} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={64} fill="#ffd23f">
      TIENDA LOCAL
    </text>
    <rect x={60} y={880} width={300} height={260} rx={10} fill="#a8dcef" {...ol} />
    <path d="M 80 900 L 180 900 L 80 1000 Z" fill="#fff" opacity={0.5} />
    <rect x={720} y={880} width={300} height={260} rx={10} fill="#a8dcef" {...ol} />
    {[0, 1, 2].map((i) => (
      <path key={i} transform={`translate(${780 + i * 90} 1080)`} d={blobPath(30, 34, i + 2, 0.2, 8)} fill={["#ff8f6b", "#ffd23f", "#7ed957"][i]} {...ol} strokeWidth={4} />
    ))}
    <Sparkle x={330} y={930} s={14} t={t} color="#fff" />
  </g>
);

/** Anuncio: versión aburrida → versión creada con IA (cambia con un destello). */
const AdPoster: React.FC<{ x: number; y: number; f: number; t: number; at: number }> = ({ x, y, f, t, at }) => {
  const k = ramp(f, at, at + 14);
  const s = 1 + Math.sin(Math.min(1, Math.max(0, (f - at) / 14)) * Math.PI) * 0.12;
  return (
    <g transform={`translate(${x} ${y + Math.sin(t / 18) * 8}) rotate(${-6 + Math.sin(t / 25) * 1.5}) scale(${s})`}>
      <rect x={-150} y={-200} width={300} height={400} rx={14} fill="rgba(0,0,0,0.35)" transform="translate(12 14)" />
      <g opacity={1 - k}>
        <rect x={-150} y={-200} width={300} height={400} rx={14} fill="#d9d9de" {...ol} />
        <text y={-60} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={46} fill="#8a8a94">
          OFERTA
        </text>
        <rect x={-90} y={-20} width={180} height={14} rx={7} fill="#b0b0b8" />
        <rect x={-110} y={10} width={220} height={14} rx={7} fill="#b0b0b8" />
        <rect x={-70} y={40} width={140} height={14} rx={7} fill="#b0b0b8" />
      </g>
      <g opacity={k}>
        <rect x={-150} y={-200} width={300} height={400} rx={14} fill="#ff5a36" {...ol} />
        <path
          d={Array.from({ length: 24 })
            .map((_, i) => {
              const a = (i / 24) * Math.PI * 2 + t / 40;
              const r = i % 2 ? 70 : 110;
              return `${i ? "L" : "M"} ${Math.cos(a) * r} ${-90 + Math.sin(a) * r}`;
            })
            .join(" ") + " Z"}
          fill="#ffd23f"
          {...ol}
          strokeWidth={5}
        />
        <text y={-104} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={44} fill={OUT}>
          ¡GRAN
        </text>
        <text y={-60} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={44} fill={OUT}>
          OFERTA!
        </text>
        <path transform="translate(0 70)" d={blobPath(70, 60, 9, 0.18, 9, t / 20, 0.02)} fill="#7ed957" {...ol} />
        <path d="M -16 20 Q 0 0 16 20" stroke={OUT} strokeWidth={6} fill="none" transform="translate(0 30)" />
        <rect x={-110} y={150} width={220} height={36} rx={18} fill="#fff" {...ol} strokeWidth={4} />
        <text y={178} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={24} fill="#ff5a36">
          SOLO ESTA SEMANA
        </text>
      </g>
      {f > at - 4 && f < at + 30 &&
        Array.from({ length: 8 }).map((_, i) => (
          <Sparkle key={i} x={Math.cos(i * 0.8) * 190} y={Math.sin(i * 0.8) * 230} s={26} t={t} phase={i} color="#fff7c2" />
        ))}
    </g>
  );
};

const Icon: React.FC<{ kind: "play" | "pen" | "monitor" | "image" | "book"; s?: number }> = ({ kind, s = 1 }) => (
  <g transform={`scale(${s})`}>
    <circle r={62} fill="rgba(255,255,255,0.12)" stroke={CYAN} strokeWidth={5} />
    <g {...ol} strokeWidth={5}>
      {kind === "play" && <path d="M -16 -26 L 28 0 L -16 26 Z" fill="#ff5a5a" />}
      {kind === "pen" && <path d="M -24 26 L -14 -4 L 14 -32 L 30 -16 L 2 12 Z M -24 26 L -6 8" fill="#ffd23f" />}
      {kind === "monitor" && (
        <g>
          <rect x={-34} y={-28} width={68} height={44} rx={6} fill="#8fd3ff" />
          <path d="M -12 30 H 12 M 0 16 V 30" fill="none" />
        </g>
      )}
      {kind === "image" && (
        <g>
          <rect x={-32} y={-26} width={64} height={52} rx={6} fill="#c7f5d9" />
          <path d="M -32 26 L -8 0 L 8 14 L 18 4 L 32 26 Z" fill="#3a8f5a" />
        </g>
      )}
      {kind === "book" && <path d="M -30 -24 Q -14 -30 0 -22 Q 14 -30 30 -24 V 26 Q 14 20 0 28 Q -14 20 -30 26 Z M 0 -22 V 28" fill="#fff" />}
    </g>
  </g>
);

const Rocket: React.FC<{ t: number }> = ({ t }) => (
  <g transform={`rotate(35) translate(0 ${Math.sin(t / 5) * 4})`}>
    {[0, 1, 2].map((i) => (
      <path
        key={i}
        d={`M -14 70 Q 0 ${120 + Math.sin(t * 0.9 + i) * 18 + i * 10} 14 70 Z`}
        fill={["#ffd23f", "#ff8f3a", "#ff5a36"][i]}
        transform={`scale(${1 - i * 0.2})`}
      />
    ))}
    <g {...ol}>
      <path d="M -26 40 L -50 74 L -20 64 Z M 26 40 L 50 74 L 20 64 Z" fill="#ff5a36" />
      <path d="M 0 -80 Q 40 -40 28 60 L -28 60 Q -40 -40 0 -80 Z" fill="#f4f4f8" />
      <circle cx={0} cy={-6} r={16} fill="#5fb6ff" />
      <path d="M -24 60 L 24 60 L 18 76 L -18 76 Z" fill="#566080" />
    </g>
  </g>
);

// --- escenas -----------------------------------------------------------------
type P = { f: number; t: number };

const Scene1: React.FC<P> = ({ f, t }) => {
  const lit = ramp(f, 20, 50);
  return (
    <g>
      <rect y={470} width={1080} height={1450} fill="#101a2c" />
      <Window x={790} y={620} sky="#0a1030" moon t={t} />
      <path d="M 540 1600 L 120 760 L 520 760 Z" fill={CYAN} opacity={0.08 * lit} />
      <HoloBot x={250} y={900} f={f} t={t} />
      <Mascot
        cx={CX}
        cy={CY}
        s={S}
        mood={f < 60 ? "tired" : "wow"}
        t={t}
        droop={f < 60 ? 24 : 0}
        look={[-0.7, -0.4]}
        left={{ x: -260, y: 380, rot: 20 }}
        right={{ x: 260, y: 380, rot: -20 }}
        light={{ color: CYAN, op: 0.55 * lit }}
      />
      <Laptop t={t} glow={lit} />
      <Tag x={800} y={1110} text="2026" color="#2d6fd6" f={f} delay={70} size={80} />
    </g>
  );
};

const Scene2: React.FC<P> = ({ f, t }) => {
  const k = ramp(f, 0, 40);
  return (
    <g>
      <rect y={470} width={1080} height={1450} fill="#101a2c" />
      <rect y={470} width={1080} height={1450} fill="#3a2a78" opacity={k} />
      {Array.from({ length: 8 }).map((_, i) => (
        <path
          key={i}
          d={`M ${-100 + i * 180} 1920 L ${200 + i * 180} 470`}
          stroke={i % 2 ? CYAN : "#ff6fae"}
          strokeWidth={4}
          opacity={0.18 * k}
        />
      ))}
      {Array.from({ length: 10 }).map((_, i) => (
        <Sparkle key={i} x={80 + rnd(i) * 920} y={560 + rnd(i + 3) * 900} s={14} t={t} phase={i} />
      ))}
      <Card x={190} y={720} kind="image" label="IMÁGENES" f={f} t={t} delay={30} rot={-6} />
      <Card x={870} y={720} kind="video" label="VIDEOS" f={f} t={t} delay={80} rot={5} />
      <Card x={175} y={1090} kind="design" label="ANUNCIOS" f={f} t={t} delay={130} rot={4} />
      <Card x={870} y={1090} kind="ebook" label="EBOOKS" f={f} t={t} delay={180} rot={-4} />
      <Mascot
        cx={CX}
        cy={CY}
        s={S}
        mood={f < 120 ? "wow" : "happy"}
        t={t}
        look={[Math.sin(f / 30) * 0.8, -0.5]}
        left={{ x: -300, y: 60 + Math.sin(f / 7) * 10, rot: -10 }}
        right={{ x: 300, y: 60 + Math.cos(f / 7) * 10, rot: 10 }}
        light={{ color: "#ff9bf0", op: 0.25 }}
      />
      <Card x={540} y={600} kind="chat" label="CHAT CON IA" f={f} t={t} delay={10} />
    </g>
  );
};

const Scene3: React.FC<P> = ({ f, t }) => {
  const ownerIn = ramp(f, 230, 260);
  const happyOwner = f > 275;
  return (
    <g>
      <Shop t={t} />
      <rect y={470} width={1080} height={1450} fill="#1a1030" opacity={0.25} />
      <Spot color="#fff3c0" op={0.1} />
      <AdPoster x={235} y={1110} f={f} t={t} at={150} />
      <Mascot
        cx={CX - 40 * ownerIn}
        cy={CY}
        s={S}
        mood={f < 150 ? "grit" : "happy"}
        t={t}
        look={f < 230 ? [-0.8, 0] : [0.8, 0]}
        left={f < 230 ? { x: -270, y: -10, rot: -40, point: true } : { x: -290, y: 120, rot: -20 }}
        right={{ x: 250, y: 400, rot: -10 }}
      />
      <g transform={`translate(${1260 - 330 * ownerIn} 0)`}>
        <Mascot
          id="owner"
          cx={0}
          cy={1600}
          s={0.62}
          mood={happyOwner ? "happy" : "wow"}
          t={t + 50}
          cap={["#c0392b", "#8e2a20"]}
          suit="#6b4a2a"
          mustache
          look={[-0.8, 0]}
          left={{ x: -240, y: 60, rot: -10, fist: happyOwner }}
          right={{ x: 230, y: 380, rot: 0 }}
        />
      </g>
      {happyOwner && <Bubble x={780} y={1180} text="¡Me encanta!" f={f} delay={280} tail={1} size={46} />}
      <Tag x={540} y={880} text="RESUELVE PROBLEMAS" color="#e8742a" f={f} delay={70} size={56} rot={-3} />
    </g>
  );
};

const Scene4: React.FC<P> = ({ f, t }) => {
  const phase = f < 120 ? 0 : f < 270 ? 1 : 2;
  const wx = Math.sin(f / 5) * 20;
  const wy = Math.cos(f / 3) * 7;
  return (
    <g>
      <rect y={470} width={1080} height={1450} fill={phase === 2 ? "#1f6a54" : "#261f3f"} />
      <Spot color={phase === 2 ? "#fff3c0" : "#cfe0ff"} op={0.12} />
      {phase === 0 && (
        <>
          <Mascot
            cx={CX}
            cy={CY}
            s={S}
            mood="effort"
            sweat
            t={t}
            look={[0.1, 0.85]}
            left={{ x: -190, y: 350, rot: -6, prop: <g transform="translate(30 -120)"><Notebook f={f} /></g> }}
            right={{ x: 150 + wx, y: 380 + wy, rot: 20, prop: <g transform="translate(0 6)"><Pencil /></g> }}
          />
          <Tag x={260} y={880} text="PRACTICA" color="#2d6fd6" f={f} delay={6} />
          <Tag x={760} y={1020} text="MEJORA" color="#2d9d4b" f={f} delay={50} size={70} rot={4} />
        </>
      )}
      {phase === 1 && (
        <>
          <Mascot
            cx={CX}
            cy={CY}
            s={S}
            mood="tired"
            t={t}
            droop={14}
            look={[-0.6, -0.3]}
            left={{ x: -230, y: 380, rot: 10 }}
            right={{ x: 240, y: 380, rot: -10 }}
          />
          <Bubble x={300} y={700} text="¿Cuánto cobras?" f={f} delay={130} tail={1} />
          <Bubble x={620} y={880} text="Lo voy a pensar..." f={f} delay={175} tail={-1} color="#e9e6ff" />
          <Bubble x={330} y={1060} text="No, gracias" f={f} delay={220} tail={1} color="#ffd6d6" />
        </>
      )}
      {phase === 2 && (
        <>
          <Mascot
            cx={CX}
            cy={CY}
            s={S}
            mood="happy"
            t={t}
            look={[0, -0.2]}
            left={{ x: -320, y: -80 + Math.sin(f / 4) * 14, rot: -14, fist: true }}
            right={{ x: 320, y: -80 + Math.cos(f / 4) * 14, rot: 14, fist: true }}
          />
          <Bubble x={540} y={720} text="¡Te contrato!" f={f} delay={272} tail={1} color="#c7f5d9" size={58} />
          <Tag x={540} y={930} text="PRIMER PROYECTO PAGADO" color="#2d9d4b" f={f} delay={290} size={50} rot={-3} />
          <Confetti f={f - 270} />
        </>
      )}
    </g>
  );
};

const Scene5: React.FC<P> = ({ f, t }) => {
  const icons: ("play" | "pen" | "monitor" | "image" | "book")[] = ["play", "pen", "monitor", "image", "book"];
  return (
    <g>
      <defs>
        <linearGradient id="iaCity" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0d0a2e" />
          <stop offset="0.6" stopColor="#3a1f6e" />
          <stop offset="1" stopColor="#ff5fa8" />
        </linearGradient>
      </defs>
      <rect y={470} width={1080} height={1450} fill="url(#iaCity)" />
      {Array.from({ length: 16 }).map((_, i) => (
        <Sparkle key={i} x={rnd(i) * 1080} y={520 + rnd(i + 9) * 420} s={8} t={t} phase={i} color="#fff" />
      ))}
      <Skyline base={1420} scroll={f * 0.6} seed={3} color="#2a1f5e" rim={CYAN} windows="#7ff6ff" t={t} hScale={1.5} />
      <Skyline base={1560} scroll={f * 1.2} seed={8} color="#170f3a" rim="#ff6fae" windows="#ffd27a" t={t} hScale={1.2} />
      {/* autos voladores */}
      {[0, 1].map((i) => (
        <g key={i} transform={`translate(${mod(f * (6 + i * 3) + i * 600, 1400) - 160} ${700 + i * 160})`}>
          <path d="M -40 0 Q -30 -22 0 -24 Q 30 -22 40 0 Z" fill="#f4f4f8" {...ol} strokeWidth={4} />
          <rect x={-46} y={-2} width={92} height={16} rx={8} fill="#5fb6ff" {...ol} strokeWidth={4} />
          <path d="M -90 6 H -50" stroke={CYAN} strokeWidth={4} strokeLinecap="round" opacity={0.6} />
        </g>
      ))}
      {icons.map((k, i) => {
        const a = (i / icons.length) * Math.PI * 2 + f / 60;
        return (
          <g key={k} transform={`translate(${CX + Math.cos(a) * 400} ${1080 + Math.sin(a) * 200})`}>
            <g transform={`scale(${pop(f, 10 + i * 8)})`}>
              <Icon kind={k} />
            </g>
          </g>
        );
      })}
      <Mascot
        cx={CX}
        cy={CY}
        s={S}
        mood={f < 120 ? "grit" : "happy"}
        t={t}
        look={[0, -0.2]}
        left={{ x: -250, y: 380, rot: 10 }}
        right={{ x: 300, y: 60, rot: 10, fist: true }}
        light={{ color: "#ff6fae", op: 0.25 }}
      />
      <Tag x={250} y={650} text="INTELIGENCIA" color="#2d6fd6" f={f} delay={185} size={52} rot={-5} />
      <Tag x={760} y={760} text="CREATIVIDAD" color="#e8742a" f={f} delay={215} size={52} rot={4} />
      <Tag x={300} y={880} text="DISCIPLINA" color="#2d9d4b" f={f} delay={245} size={52} rot={-3} />
    </g>
  );
};

const Scene6: React.FC<P> = ({ f, t }) => (
  <g>
    <rect y={470} width={1080} height={1450} fill="#ffb347" />
    <g transform={`translate(${CX} ${CY}) rotate(${f * 0.5})`} opacity={0.3}>
      {Array.from({ length: 12 }).map((_, i) => (
        <path key={i} d="M0 0 L -70 -1300 L 70 -1300 Z" fill="#fff6c0" transform={`rotate(${i * 30})`} />
      ))}
    </g>
    <Mascot
      cx={CX + 60}
      cy={CY + 40}
      s={1.05}
      mood="happy"
      t={t}
      look={[0, 0]}
      left={{ x: -300, y: -150, rot: -35, point: true }}
      right={{ x: 240, y: 380, rot: -10 }}
    />
    <g transform={`translate(540 640) scale(${pop(f, 6, 14)}) rotate(-3)`}>
      {["APRENDE A USAR LA IA.", "CREA. EMPRENDE."].map((line, i) => (
        <text
          key={i}
          y={i * 110}
          textAnchor="middle"
          fontFamily={FONT}
          fontWeight={900}
          fontSize={i === 0 ? 78 : 104}
          fill={i === 0 ? "#ffffff" : "#ffd23f"}
          stroke={OUT}
          strokeWidth={16}
          paintOrder="stroke"
          strokeLinejoin="round"
        >
          {line}
        </text>
      ))}
      <g transform="translate(470 -90) scale(0.7)">
        <Rocket t={t} />
      </g>
    </g>
    <g transform={`translate(330 960) scale(${pop(f, 40, 12)})`}>
      <rect x={-290} y={-46} width={580} height={92} rx={46} fill={OUT} />
      <text y={-4} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={30} fill="#fff">
        SÍGUEME PARA MÁS FORMAS
      </text>
      <text y={32} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={30} fill="#ffd23f">
        DE EMPRENDER CON IA
      </text>
    </g>
    <Confetti f={f} />
  </g>
);

const SCENE_COMPONENTS: React.FC<P>[] = [Scene1, Scene2, Scene3, Scene4, Scene5, Scene6];

// --- marco: barra superior con subtítulos tipo karaoke ------------------------
const Subtitles: React.FC = () => {
  const g = useCurrentFrame();
  const c = CHUNKS.find((ch) => g >= ch.from && g < ch.to) ?? CHUNKS.filter((ch) => ch.from <= g).pop();
  if (!c) return null;
  const local = g - c.from;
  const prog = (g - c.from) / (c.to - c.from);
  const active = Math.min(c.words.length - 1, Math.floor(prog * c.words.length));
  const enter = Math.min(1, local / 5);
  return (
    <div
      style={{
        fontFamily: FONT,
        fontWeight: 900,
        fontSize: 60,
        lineHeight: 1.2,
        color: "#fff",
        textAlign: "center",
        opacity: enter,
        transform: `translateY(${(1 - enter) * 16}px)`,
      }}
    >
      {c.words.map((w, i) => (
        <span
          key={i}
          style={{
            display: "inline-block",
            marginRight: 16,
            color: i === active ? "#ffd23f" : i < active ? "#fff" : "rgba(255,255,255,0.75)",
          }}
        >
          {w}
        </span>
      ))}
    </div>
  );
};

const TopBar: React.FC = () => (
  <div
    style={{
      position: "absolute",
      left: 0,
      top: 0,
      width: 1080,
      height: 470,
      background: "#000",
      boxSizing: "border-box",
      padding: "150px 60px 0",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 18,
    }}
  >
    <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 30, letterSpacing: 3, color: "#ffd23f" }}>
      CÓMO GANAR DINERO CON IA
    </div>
    <div style={{ height: 230, display: "flex", alignItems: "center" }}>
      <Subtitles />
    </div>
  </div>
);

const SceneFrame: React.FC<{ from: number; C: React.FC<P> }> = ({ from, C }) => {
  const f = useCurrentFrame();
  const punch = 1 + 0.06 * (1 - ramp(f, 0, 8));
  const flash = 1 - ramp(f, 0, 4);
  return (
    <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute" }}>
      <defs>
        <radialGradient id="iaVig" cx="0.5" cy="0.6" r="0.75">
          <stop offset="0.55" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.55" />
        </radialGradient>
        <filter id="iaGrain" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed={Math.floor((from + f) / 2) % 40} />
          <feColorMatrix type="saturate" values="0" />
        </filter>
      </defs>
      <g transform={`translate(540 1195) scale(${punch}) translate(-540 -1195)`}>
        <C f={f} t={from + f} />
      </g>
      <rect y={470} width={1080} height={1450} fill="url(#iaVig)" />
      <rect y={470} width={1080} height={1450} filter="url(#iaGrain)" opacity={0.09} style={{ mixBlendMode: "overlay" }} />
      <rect y={470} width={1080} height={1450} fill="#fff" opacity={flash * 0.7} />
    </svg>
  );
};

export const IaVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Audio src={staticFile("music-ia.wav")} />
      {SCENES.map((sc, i) => (
        <Sequence key={i} from={sc.from} durationInFrames={sc.dur}>
          <SceneFrame from={sc.from} C={SCENE_COMPONENTS[i]} />
        </Sequence>
      ))}
      <TopBar />
    </AbsoluteFill>
  );
};
