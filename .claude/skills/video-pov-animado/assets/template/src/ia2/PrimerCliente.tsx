import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { Mascot, OUT, Tag } from "../pov/Mascot";
import { Clock, Confetti, Spot, Window, ol } from "../pov/PovVideo";
import {
  AdPoster,
  Bubble,
  CX,
  CY,
  CYAN,
  Card,
  HoloBot,
  Laptop,
  Rocket,
  S,
  SceneFrame,
  Shop,
  TopBar,
  buildChunks,
  pop,
} from "../ia/IaVideo";
import type { P } from "../ia/IaVideo";
import { Sparkle, blobPath } from "../art";
import { FONT, rnd } from "../utils";

export const CLIENTE_FRAMES = 1800; // 60 s

// --- guion (tiempos estimados; si llega una narración se re-sincroniza) -------
const PHRASES: [number, number, string][] = [
  [0.2, 3.4, "¿Quieres conseguir tu primer cliente con IA?"],
  [3.6, 5.8, "Te lo explico en cinco pasos."],
  [6.2, 8.2, "Paso uno: elige una sola habilidad."],
  [8.4, 14.6, "Por ejemplo, crear anuncios, editar videos o diseñar logos con inteligencia artificial."],
  [15.2, 18.6, "Paso dos: crea tres ejemplos de tu trabajo."],
  [18.8, 23.6, "Así la gente puede ver lo que sabes hacer antes de pagarte."],
  [24.2, 26.4, "Paso tres: busca negocios cerca de ti"],
  [26.6, 32.6, "que tengan redes sociales abandonadas o anuncios poco atractivos."],
  [33.2, 36.6, "Paso cuatro: escríbeles un mensaje corto,"],
  [36.8, 42.6, "muéstrales una idea gratis para su negocio y ofrece ayudarles."],
  [43.2, 45.8, "Paso cinco: cumple a tiempo,"],
  [46.0, 51.6, "pide una reseña y usa ese resultado para conseguir más clientes."],
  [52.2, 55.4, "No necesitas ser experto. Necesitas empezar."],
  [55.6, 59.6, "Guarda este video y sígueme para más ideas con IA."],
];
const CHUNKS = buildChunks(PHRASES);

const SCENES = [
  { from: 0, dur: 180 }, //      0–6   gancho
  { from: 180, dur: 270 }, //    6–15  paso 1
  { from: 450, dur: 270 }, //   15–24  paso 2
  { from: 720, dur: 270 }, //   24–33  paso 3
  { from: 990, dur: 300 }, //   33–43  paso 4
  { from: 1290, dur: 270 }, //  43–52  paso 5
  { from: 1560, dur: 240 }, //  52–60  cierre
];

// --- utilería ----------------------------------------------------------------
const StepBadge: React.FC<{ n: number; f: number; t: number }> = ({ n, f, t }) => (
  <g transform={`translate(190 640) rotate(${-8 + Math.sin(t / 15) * 3}) scale(${pop(f, 2, 12)})`}>
    <path d={blobPath(118, 118, n + 4, 0.06, 12)} fill="rgba(0,0,0,0.4)" transform="translate(10 12)" />
    <path d={blobPath(118, 118, n + 4, 0.06, 12)} fill="#ffd23f" {...ol} strokeWidth={8} />
    <text y={-34} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={40} fill={OUT}>
      PASO
    </text>
    <text y={66} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={120} fill={OUT}>
      {n}
    </text>
  </g>
);

const QuestionMarks: React.FC<{ t: number; op: number }> = ({ t, op }) => (
  <g opacity={op}>
    {[
      [330, 1000, -14, 90],
      [900, 960, 12, 110],
      [780, 820, -6, 70],
    ].map(([x, y, r, s], i) => (
      <text
        key={i}
        x={x}
        y={y + Math.sin(t / 10 + i) * 14}
        transform={`rotate(${r + Math.sin(t / 12 + i) * 6} ${x} ${y})`}
        textAnchor="middle"
        fontFamily={FONT}
        fontWeight={900}
        fontSize={s}
        fill="#ffd23f"
        stroke={OUT}
        strokeWidth={10}
        paintOrder="stroke"
      >
        ?
      </text>
    ))}
  </g>
);

const CheckBadge: React.FC<{ x: number; y: number; f: number; delay: number }> = ({ x, y, f, delay }) => (
  <g transform={`translate(${x} ${y}) scale(${pop(f, delay, 10)})`}>
    <circle r={44} fill="#2dc26b" {...ol} />
    <path d="M -20 0 L -6 16 L 22 -16" stroke="#fff" strokeWidth={11} fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </g>
);

/** Teléfono con un perfil de redes abandonado. */
const Phone: React.FC<{ x: number; y: number; f: number; t: number; delay: number }> = ({ x, y, f, t, delay }) => (
  <g transform={`translate(${x} ${y + Math.sin(t / 16) * 8}) rotate(${-8 + Math.sin(t / 20) * 2}) scale(${pop(f, delay, 12)})`}>
    <rect x={-130} y={-230} width={260} height={460} rx={40} fill="rgba(0,0,0,0.4)" transform="translate(12 14)" />
    <rect x={-130} y={-230} width={260} height={460} rx={40} fill="#2b2f45" {...ol} />
    <rect x={-110} y={-200} width={220} height={400} rx={22} fill="#f4f4f8" {...ol} strokeWidth={4} />
    <circle cx={-62} cy={-150} r={30} fill="#c9cbd8" {...ol} strokeWidth={4} />
    <rect x={-20} y={-166} width={110} height={14} rx={7} fill="#b0b0b8" />
    <rect x={-20} y={-142} width={70} height={12} rx={6} fill="#d0d0d8" />
    {Array.from({ length: 6 }).map((_, i) => (
      <rect
        key={i}
        x={-96 + (i % 3) * 66}
        y={-96 + Math.floor(i / 3) * 70}
        width={58}
        height={62}
        rx={6}
        fill={["#c9cbd8", "#d9d9de", "#bfc1cc"][i % 3]}
      />
    ))}
    <rect x={-96} y={60} width={192} height={52} rx={14} fill="#ffd6d6" {...ol} strokeWidth={4} />
    <text y={95} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={24} fill="#d6342c">
      HACE 8 MESES
    </text>
    <text y={160} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={22} fill="#8a8a94">
      última publicación
    </text>
  </g>
);

const Magnifier: React.FC = () => (
  <g transform="translate(0 -104) rotate(-20)">
    <rect x={-10} y={30} width={20} height={80} rx={8} fill="#7a4a2a" {...ol} />
    <circle r={56} fill="rgba(160,230,255,0.45)" {...ol} strokeWidth={10} />
    <path d="M -30 -18 Q -20 -34 0 -38" stroke="#fff" strokeWidth={7} fill="none" strokeLinecap="round" />
  </g>
);

const Star: React.FC<{ x: number; y: number; f: number; delay: number; t: number }> = ({ x, y, f, delay, t }) => (
  <g transform={`translate(${x} ${y + Math.sin(t / 10 + x) * 6}) rotate(${Math.sin(t / 14 + x) * 8}) scale(${pop(f, delay, 8)})`}>
    <path
      d="M 0 -56 L 16 -18 L 56 -16 L 24 10 L 34 52 L 0 28 L -34 52 L -24 10 L -56 -16 L -16 -18 Z"
      fill="#ffd23f"
      {...ol}
    />
    <path d="M -10 -24 L -2 -38" stroke="#fff6c0" strokeWidth={6} strokeLinecap="round" />
  </g>
);

const BigText: React.FC<{ text: string; y: number; f: number; delay: number; color: string; size: number; rot?: number }> = ({
  text,
  y,
  f,
  delay,
  color,
  size,
  rot = -3,
}) => (
  <g transform={`translate(540 ${y}) rotate(${rot}) scale(${pop(f, delay, 12)})`}>
    <text
      textAnchor="middle"
      fontFamily={FONT}
      fontWeight={900}
      fontSize={size}
      fill={color}
      stroke={OUT}
      strokeWidth={18}
      paintOrder="stroke"
      strokeLinejoin="round"
    >
      {text}
    </text>
  </g>
);

const Sunburst: React.FC<{ f: number; color: string; op?: number }> = ({ f, color, op = 0.28 }) => (
  <g transform={`translate(${CX} ${CY}) rotate(${f * 0.5})`} opacity={op}>
    {Array.from({ length: 12 }).map((_, i) => (
      <path key={i} d="M0 0 L -70 -1300 L 70 -1300 Z" fill={color} transform={`rotate(${i * 30})`} />
    ))}
  </g>
);

// --- escenas -----------------------------------------------------------------
const Hook: React.FC<P> = ({ f, t }) => {
  const knows = f >= 104;
  return (
    <g>
      <rect y={470} width={1080} height={1450} fill="#101a2c" />
      <Window x={790} y={620} sky="#0a1030" moon t={t} />
      <path d="M 540 1600 L 120 760 L 520 760 Z" fill={CYAN} opacity={knows ? 0.08 : 0.03} />
      {knows && <HoloBot x={240} y={900} f={f} t={t} delay={104} />}
      <QuestionMarks t={t} op={knows ? 0 : 1} />
      <Mascot
        cx={CX}
        cy={CY}
        s={S}
        mood={knows ? "wow" : "tired"}
        t={t}
        droop={knows ? 0 : 18}
        look={knows ? [-0.7, -0.4] : [0.3, -0.5]}
        left={{ x: -260, y: 380, rot: 20 }}
        right={{ x: 260, y: 380, rot: -20 }}
        light={{ color: CYAN, op: knows ? 0.5 : 0.2 }}
      />
      <Laptop t={t} glow={knows ? 1 : 0.4} />
      <BigText text="5 PASOS" y={1080} f={f} delay={118} color="#ffd23f" size={130} />
    </g>
  );
};

const Step1: React.FC<P> = ({ f, t }) => {
  const chosen = f >= 205;
  return (
    <g>
      <rect y={470} width={1080} height={1450} fill="#3a2a78" />
      {Array.from({ length: 8 }).map((_, i) => (
        <path key={i} d={`M ${-100 + i * 180} 1920 L ${200 + i * 180} 470`} stroke={i % 2 ? CYAN : "#ff6fae"} strokeWidth={4} opacity={0.16} />
      ))}
      {Array.from({ length: 10 }).map((_, i) => (
        <Sparkle key={i} x={80 + rnd(i) * 920} y={560 + rnd(i + 3) * 900} s={14} t={t} phase={i} />
      ))}
      <StepBadge n={1} f={f} t={t} />
      {f < 96 && <Tag x={680} y={660} text="UNA SOLA HABILIDAD" color="#e8742a" f={f} delay={36} size={50} rot={3} />}
      <g opacity={chosen ? 1 : 1}>
        <Card x={190} y={900} kind="image" label="ANUNCIOS" f={f} t={t} delay={100} rot={-6} />
      </g>
      <g opacity={chosen ? 0.35 : 1}>
        <Card x={540} y={780} kind="video" label="VIDEOS" f={f} t={t} delay={130} rot={3} />
        <Card x={890} y={900} kind="design" label="LOGOS" f={f} t={t} delay={160} rot={6} />
      </g>
      {chosen && <CheckBadge x={300} y={800} f={f} delay={205} />}
      <Mascot
        cx={CX}
        cy={CY + 60}
        s={S}
        mood={chosen ? "happy" : "wow"}
        t={t}
        look={chosen ? [-0.8, -0.6] : [Math.sin(f / 25) * 0.8, -0.6]}
        left={chosen ? { x: -300, y: -60, rot: -40, point: true } : { x: -300, y: 60, rot: -10 }}
        right={{ x: 300, y: 60 + Math.cos(f / 7) * 10, rot: 10 }}
      />
    </g>
  );
};

const Step2: React.FC<P> = ({ f, t }) => (
  <g>
    <rect y={470} width={1080} height={1450} fill="#1b3a4c" />
    <Spot color="#bfe9ff" op={0.12} />
    <StepBadge n={2} f={f} t={t} />
    <Tag x={720} y={650} text="PORTAFOLIO" color="#2d6fd6" f={f} delay={20} size={64} rot={4} />
    <Card x={190} y={940} kind="image" label="EJEMPLO 1" f={f} t={t} delay={66} rot={-6} />
    <Card x={540} y={870} kind="design" label="EJEMPLO 2" f={f} t={t} delay={80} rot={2} />
    <Card x={890} y={940} kind="video" label="EJEMPLO 3" f={f} t={t} delay={94} rot={6} />
    {f > 140 &&
      [0, 1, 2].map((i) => <CheckBadge key={i} x={[300, 650, 1000 - 70][i]} y={[830, 760, 830][i]} f={f} delay={140 + i * 10} />)}
    <Mascot
      cx={CX}
      cy={CY + 80}
      s={S}
      mood="happy"
      t={t}
      look={[Math.sin(f / 30) * 0.6, -0.6]}
      left={{ x: -320, y: -20 + Math.sin(f / 6) * 8, rot: -20 }}
      right={{ x: 300, y: 380, rot: -10 }}
    />
  </g>
);

const Step3: React.FC<P> = ({ f, t }) => (
  <g>
    <Shop t={t} />
    <rect y={470} width={1080} height={1450} fill="#1a1030" opacity={0.35} />
    <StepBadge n={3} f={f} t={t} />
    <Phone x={235} y={1190} f={f} t={t} delay={130} />
    {f > 200 && (
      <g transform="translate(840 940) scale(0.62) translate(-840 -940)">
        <AdPoster x={840} y={940} f={f} t={t} at={99999} />
      </g>
    )}
    {f > 214 && <Tag x={780} y={700} text="POCO ATRACTIVO" color="#d6342c" f={f} delay={214} size={44} rot={4} />}
    <Mascot
      cx={CX + 40}
      cy={CY}
      s={S}
      mood="grit"
      t={t}
      look={f < 130 ? [Math.sin(f / 12) * 0.9, -0.2] : [-0.8, 0.2]}
      left={{ x: -250, y: 380, rot: 10 }}
      right={{
        x: f < 130 ? 220 + Math.sin(f / 10) * 60 : -150,
        y: f < 130 ? -40 + Math.cos(f / 10) * 30 : 40,
        rot: f < 130 ? 10 : -30,
        front: f >= 130,
        prop: <Magnifier />,
      }}
    />
  </g>
);

const Step4: React.FC<P> = ({ f, t }) => {
  const ownerIn = Math.min(1, Math.max(0, (f - 200) / 25));
  const happy = f > 228;
  return (
    <g>
      <rect y={470} width={1080} height={1450} fill="#261f3f" />
      <Spot color="#cfe0ff" op={0.1} />
      <StepBadge n={4} f={f} t={t} />
      <Bubble x={640} y={680} text="¡Hola! Tengo una idea" f={f} delay={24} tail={1} color="#e9e6ff" size={42} />
      <Bubble x={600} y={820} text="para tu negocio" f={f} delay={44} tail={1} color="#e9e6ff" size={42} />
      <g>
        <Card x={220} y={960} kind="image" label="IDEA GRATIS" f={f} t={t} delay={110} rot={-5} />
      </g>
      <Mascot
        cx={CX - 150 * ownerIn}
        cy={CY}
        s={S}
        mood={happy ? "happy" : "grit"}
        t={t}
        look={happy ? [0.8, 0] : [-0.6, -0.4]}
        left={{ x: -260, y: 380, rot: 10 }}
        right={{ x: 260, y: 380, rot: -10 }}
      />
      <g transform={`translate(${1260 - 460 * ownerIn} 0)`}>
        <Mascot
          id="owner"
          cx={0}
          cy={1450}
          s={0.55}
          mood={happy ? "happy" : "wow"}
          t={t + 50}
          cap={["#c0392b", "#8e2a20"]}
          suit="#6b4a2a"
          mustache
          look={[-0.8, 0]}
          left={{ x: -240, y: 60, rot: -10, fist: happy }}
          right={{ x: 230, y: 380, rot: 0 }}
        />
      </g>
      {happy && <Bubble x={720} y={1150} text="¡Me interesa!" f={f} delay={230} tail={1} color="#c7f5d9" size={46} />}
    </g>
  );
};

const Step5: React.FC<P> = ({ f, t }) => {
  const clients = f >= 205;
  return (
    <g>
      <rect y={470} width={1080} height={1450} fill="#1f6a54" />
      <Sunburst f={f} color="#fff3c0" op={0.18} />
      <StepBadge n={5} f={f} t={t} />
      <g transform="translate(860 700) scale(0.75)">
        <Clock x={0} y={0} t={t} />
      </g>
      <Tag x={700} y={880} text="A TIEMPO" color="#2d9d4b" f={f} delay={20} size={56} rot={-3} />
      {[0, 1, 2, 3, 4].map((i) => (
        <Star key={i} x={150 + i * 120} y={1000} f={f} delay={90 + i * 7} t={t} />
      ))}
      <Tag x={330} y={1130} text="RESEÑA" color="#e8742a" f={f} delay={96} size={50} rot={3} />
      <Mascot
        cx={CX + 60}
        cy={CY + 60}
        s={S}
        mood="happy"
        t={t}
        look={[0, -0.3]}
        left={{ x: -320, y: -60 + Math.sin(f / 4) * 12, rot: -14, fist: true }}
        right={{ x: 280, y: 380, rot: -10 }}
      />
      {clients &&
        [
          { x: 170, y: 1420, cap: ["#19c3a6", "#0f8a75"] as [string, string] },
          { x: 900, y: 1150, cap: ["#8b5cf6", "#5b3ab0"] as [string, string] },
          { x: 160, y: 1660, cap: ["#ff6fae", "#c0457f"] as [string, string] },
        ].map((c, i) => (
          <g key={i} transform={`translate(${c.x} ${c.y}) scale(${pop(f, 205 + i * 10, 10)}) translate(${-c.x} ${-c.y})`}>
            <defs>
              <clipPath id={`avatar${i}`}>
                <circle cx={c.x} cy={c.y} r={104} />
              </clipPath>
            </defs>
            <circle cx={c.x + 8} cy={c.y + 10} r={110} fill="rgba(0,0,0,0.35)" />
            <circle cx={c.x} cy={c.y} r={104} fill={c.cap[0]} opacity={0.45} />
            <g clipPath={`url(#avatar${i})`}>
            <Mascot
              id={`cli${i}`}
              cx={c.x}
              cy={c.y + 22}
              s={0.36}
              mood="happy"
              t={t + i * 20}
              cap={c.cap}
              suit="#3a3f52"
              look={[0, 0]}
              left={{ x: -240, y: 380, rot: 0 }}
              right={{ x: 240, y: 380, rot: 0 }}
            />
            </g>
            <circle cx={c.x} cy={c.y} r={104} fill="none" stroke={OUT} strokeWidth={7} />
          </g>
        ))}
      {clients && <Tag x={700} y={1720} text="+ CLIENTES" color="#2d9d4b" f={f} delay={220} size={56} rot={-4} />}
      {clients && <Confetti f={f - 205} />}
    </g>
  );
};

const Closing: React.FC<P> = ({ f, t }) => (
  <g>
    <rect y={470} width={1080} height={1450} fill="#ffb347" />
    <Sunburst f={f} color="#fff6c0" op={0.3} />
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
    <BigText text="NO NECESITAS" y={610} f={f} delay={6} color="#ffffff" size={92} rot={-3} />
    <BigText text="SER EXPERTO." y={710} f={f} delay={14} color="#ffffff" size={92} rot={-3} />
    <BigText text="NECESITAS EMPEZAR." y={840} f={f} delay={52} color="#ffd23f" size={86} rot={2} />
    <g transform="translate(940 520) scale(0.6)">
      <Rocket t={t} />
    </g>
    <g transform={`translate(330 990) scale(${pop(f, 104, 12)})`}>
      <rect x={-290} y={-50} width={580} height={100} rx={50} fill={OUT} />
      <text y={-6} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={34} fill="#ffd23f">
        GUARDA ESTE VIDEO
      </text>
      <text y={32} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={26} fill="#fff">
        Y SÍGUEME PARA MÁS IDEAS CON IA
      </text>
    </g>
    <Confetti f={f} />
  </g>
);

const SCENE_COMPONENTS: React.FC<P>[] = [Hook, Step1, Step2, Step3, Step4, Step5, Closing];

export const PrimerCliente: React.FC = () => (
  <AbsoluteFill style={{ background: "#000" }}>
    <Audio src={staticFile("music-cliente.wav")} volume={0.85} />
    {SCENES.map((sc, i) => (
      <Sequence key={i} from={sc.from} durationInFrames={sc.dur}>
        <SceneFrame from={sc.from} C={SCENE_COMPONENTS[i]} />
      </Sequence>
    ))}
    <TopBar title="TU PRIMER CLIENTE CON IA" chunks={CHUNKS} />
  </AbsoluteFill>
);
