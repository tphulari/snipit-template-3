"use client";

import { useState, type CSSProperties, type FormEvent } from "react";

/* ═══════════════════════════════════════════════════════════════════════════
   ✏️  CUSTOMIZE ME — the most common things you'll want to change:

   1. BRAND_NAME and HEADLINE below
   2. WAITLIST_ENDPOINT — paste your Google Apps Script web app URL here
   3. PHOTOS — add your photos to /public/photos/ and list them in the array
   4. CLUSTERS — pick your restaurant names / items / totals
   ═══════════════════════════════════════════════════════════════════════════ */

const BRAND_NAME = "snipit";
const HEADLINE_LINE_1 = "making the most";
const HEADLINE_LINE_2 = "of your";
const HEADLINE_ACCENT = "memories.";
const FOOTER_TAGLINE = "SNAP IT * SHARE IT * SNIPIT";

// Paste your Google Apps Script web app URL here. See README for setup.
const WAITLIST_ENDPOINT =
  "https://script.google.com/macros/s/AKfycbzy_glxZA31xzVN8FCv4cnp33xLEgGIajHy0YagfX2rG7pTAcI11iGN_Rxy86EZHXUQ/exec";

// Add your photos to /public/photos/ and list them here. Leave empty to show
// plain gradient placeholders. You can have any number of photos — they cycle
// through clusters without repeating within the same cluster.
const PHOTOS: string[] = [
  "/photos/photo-01.jpg",
  "/photos/photo-02.jpg",
  "/photos/photo-03.jpg",
  "/photos/photo-04.jpg",
  "/photos/photo-05.jpg",
  "/photos/photo-06.jpg",
  "/photos/photo-07.jpg",
  "/photos/photo-08.jpg",
  "/photos/photo-09.jpg",
  "/photos/photo-10.jpg",
  "/photos/photo-11.jpg",
  "/photos/photo-12.jpg",
  "/photos/photo-13.jpg",
  "/photos/photo-14.jpg",
  "/photos/photo-15.jpg",
  "/photos/photo-16.jpg",
  "/photos/photo-17.jpg",
  "/photos/photo-18.jpg",
  "/photos/photo-19.jpg",
  "/photos/photo-20.jpg",
  "/photos/photo-21.jpg",
  "/photos/photo-22.jpg",
  "/photos/photo-23.jpg",
  "/photos/photo-24.jpg",
];

/* ───────────────────────────────────────────────────────────────────────────
   Style helpers + primitives
   ─────────────────────────────────────────────────────────────────────────── */

const WALL_SHADOW =
  "0 10px 20px -10px rgba(40,28,16,0.22), 0 2px 5px rgba(40,28,16,0.10)";
const PAPER_GRAIN_SIZE = "48px 48px";

type SparkleProps = {
  size?: number;
  color?: string;
  style?: CSSProperties;
  variant?: "8" | "4";
};

function Sparkle({ size = 16, color = "#F4CCD6", style, variant = "8" }: SparkleProps) {
  const pts = "40,6 44,34 72,40 44,46 40,74 36,46 8,40 36,34";
  const small = "40,10 43,37 70,40 43,43 40,70 37,43 10,40 37,37";
  return (
    <svg
      className="landing-sparkle"
      width={size}
      height={size}
      viewBox="0 0 80 80"
      style={style}
      aria-hidden="true"
    >
      {variant === "8" ? (
        <g fill={color}>
          <polygon points={pts} />
          <polygon points={pts} transform="rotate(45 40 40)" />
        </g>
      ) : (
        <polygon fill={color} points={small} />
      )}
    </svg>
  );
}

function Tape({
  color = "rgba(245,236,185,0.78)",
  width = 38,
  tilt = 0,
  top = -8,
  left = "50%",
}: {
  color?: string;
  width?: number;
  tilt?: number;
  top?: number;
  left?: string | number;
}) {
  return (
    <div
      style={{
        position: "absolute",
        left,
        top,
        width,
        height: 14,
        transform: `translateX(-50%) rotate(${tilt}deg)`,
        background: color,
        boxShadow: "0 1px 2px rgba(40,28,16,0.12)",
        mixBlendMode: "multiply",
        opacity: 0.92,
        zIndex: 2,
      }}
    />
  );
}

// Image slot — shows a plain gradient box if no src provided, otherwise
// renders the image with a thermal-print effect (grayscale + contrast +
// multiply-blend into the paper color + grain overlay).
function ImagePlaceholder({
  aspect = "1 / 1",
  src,
}: {
  aspect?: string;
  src?: string;
}) {
  if (!src) {
    return (
      <div
        style={{
          width: "100%",
          aspectRatio: aspect,
          background:
            "linear-gradient(135deg, rgba(42,31,23,0.05), rgba(42,31,23,0.11))",
          boxShadow: "inset 0 0 0 1px rgba(42,31,23,0.08)",
        }}
      />
    );
  }
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        aspectRatio: aspect,
        overflow: "hidden",
        boxShadow: "inset 0 0 6px 1px rgba(42,31,23,0.15)",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url(${src})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "grayscale(1) contrast(1.4) brightness(1.02)",
          mixBlendMode: "multiply",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "url(/grain.png)",
          backgroundSize: PAPER_GRAIN_SIZE,
          mixBlendMode: "multiply",
          opacity: 0.75,
          pointerEvents: "none",
        }}
      />
    </div>
  );
}

/* ───────────────────────────────────────────────────────────────────────────
   Store receipt — white paper, looks like a real receipt
   ─────────────────────────────────────────────────────────────────────────── */

type ReceiptItem = { label: string; price: string };
type ReceiptProps = {
  store: string;
  meta?: string;
  date: string;
  time?: string;
  items: ReceiptItem[];
  subtotal?: string;
  tax?: string;
  total: string;
  no: string;
  footer?: string;
  tape?: string;
  src?: string;
};

function StoreReceipt({
  store,
  meta,
  date,
  time,
  items,
  subtotal,
  tax,
  total,
  footer = "— thank you —",
  tape = "rgba(245,236,185,0.82)",
  src,
}: ReceiptProps) {
  const dashedRule: CSSProperties = {
    height: 1,
    borderTop: "1px dashed rgba(42,31,23,.3)",
    margin: "2px 0",
  };
  const monoRow: CSSProperties = {
    fontFamily: "var(--mono)",
    fontSize: 7.5,
    letterSpacing: ".12em",
    textTransform: "uppercase",
    color: "var(--ink)",
    display: "flex",
    justifyContent: "space-between",
    lineHeight: 1.5,
  };

  return (
    <div
      style={{
        position: "relative",
        width: "calc(var(--col-w) * 1.4)",
        marginLeft: "calc(var(--col-w) * -0.2)",
        marginRight: "calc(var(--col-w) * -0.2)",
        background: "#FFFDF6",
        backgroundImage: "url(/grain.png)",
        backgroundSize: PAPER_GRAIN_SIZE,
        backgroundBlendMode: "multiply",
        padding: "16px 12px 12px",
        boxShadow: WALL_SHADOW,
        display: "flex",
        flexDirection: "column",
        gap: 5,
        boxSizing: "border-box",
      }}
    >
      {tape && <Tape tilt={0} top={-8} width={42} color={tape} />}
      <div
        style={{
          fontFamily: "var(--mono)",
          fontWeight: 600,
          fontSize: 10,
          letterSpacing: ".22em",
          textAlign: "center",
          textTransform: "uppercase",
          color: "var(--ink)",
          lineHeight: 1.2,
        }}
      >
        {store}
      </div>
      {meta && (
        <div
          style={{
            fontFamily: "var(--mono)",
            fontSize: 7,
            letterSpacing: ".2em",
            textAlign: "center",
            textTransform: "uppercase",
            color: "var(--ink-soft)",
            lineHeight: 1.3,
          }}
        >
          {meta}
        </div>
      )}
      <div
        style={{
          ...monoRow,
          fontSize: 7,
          color: "var(--ink-soft)",
          letterSpacing: ".18em",
          paddingBottom: 4,
        }}
      >
        <span>{date}</span>
        {time && <span>{time}</span>}
      </div>

      <div style={dashedRule} />
      <ImagePlaceholder aspect="1 / 1" src={src} />
      <div style={dashedRule} />

      <div style={{ display: "flex", flexDirection: "column", gap: 3, paddingTop: 2 }}>
        {items.map((it, i) => (
          <div key={i} style={monoRow}>
            <span>{it.label}</span>
            <span>{it.price}</span>
          </div>
        ))}
      </div>

      {subtotal && (
        <>
          <div style={dashedRule} />
          <div style={{ ...monoRow, color: "var(--ink-soft)" }}>
            <span>SUBTOTAL</span>
            <span>{subtotal}</span>
          </div>
          {tax && (
            <div style={{ ...monoRow, color: "var(--ink-soft)" }}>
              <span>TAX</span>
              <span>{tax}</span>
            </div>
          )}
        </>
      )}

      <div style={dashedRule} />
      <div style={{ ...monoRow, fontWeight: 600, fontSize: 8.5, letterSpacing: ".16em" }}>
        <span>TOTAL</span>
        <span>{total}</span>
      </div>

      <div
        style={{
          fontFamily: "var(--mono)",
          fontSize: 6.5,
          letterSpacing: ".22em",
          textAlign: "center",
          textTransform: "uppercase",
          color: "var(--ink-mute)",
          paddingTop: 4,
        }}
      >
        {footer}
      </div>
    </div>
  );
}

/* ───────────────────────────────────────────────────────────────────────────
   Thermal strip — pastel colored "roll" with stacked photos
   ─────────────────────────────────────────────────────────────────────────── */

type StripColor = "sky" | "blush" | "butter";
type StripProps = {
  color: StripColor;
  count: number;
  stubNo?: string;
  tape?: string;
  srcs?: string[];
};

const STRIP_PAPER: Record<StripColor, string> = {
  sky: "#C6E0F4",
  blush: "#F4CCD6",
  butter: "#F5ECB9",
};

function ThermalStrip({
  color,
  count,
  stubNo,
  tape = "rgba(245,236,185,0.82)",
  srcs,
}: StripProps) {
  const paper = STRIP_PAPER[color];
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        background: paper,
        backgroundImage: "url(/grain.png)",
        backgroundSize: PAPER_GRAIN_SIZE,
        backgroundBlendMode: "multiply",
        padding: "16px 10px 12px",
        boxShadow: WALL_SHADOW,
        display: "flex",
        flexDirection: "column",
        gap: 6,
        boxSizing: "border-box",
      }}
    >
      {tape && <Tape tilt={0} top={-8} width={38} color={tape} />}
      {stubNo && (
        <div
          style={{
            fontFamily: "var(--mono)",
            fontSize: 7,
            letterSpacing: ".16em",
            textAlign: "center",
            textTransform: "uppercase",
            color: "var(--ink)",
            paddingBottom: 4,
            marginBottom: 2,
            borderBottom: "1px dashed rgba(42,31,23,.25)",
            whiteSpace: "nowrap",
          }}
        >
          {stubNo}
        </div>
      )}
      {Array.from({ length: count }).map((_, i) => (
        <ImagePlaceholder key={i} aspect="1 / 1" src={srcs?.[i]} />
      ))}
    </div>
  );
}

/* ───────────────────────────────────────────────────────────────────────────
   Clusters — each one is a small group, positioned by CENTER (cx, cy)
   Swap stores, prices, colors, counts to make it your own.
   ─────────────────────────────────────────────────────────────────────────── */

type GalleryEntry =
  | { kind: "receipt"; props: ReceiptProps }
  | { kind: "strip"; props: StripProps };

type ClusterPos = { cx: string; cy: string };
type ClusterShape = "3col" | "2col";
type Cluster = {
  pos: ClusterPos;
  shape: ClusterShape;
  items: GalleryEntry[];
};

const TAPE_BUTTER = "rgba(245,236,185,0.82)";

const CLUSTERS: Cluster[] = [
  {
    pos: { cx: "6%", cy: "21%" },
    shape: "3col",
    items: [
      {
        kind: "receipt",
        props: {
          store: "IN-N-OUT",
          meta: "NOT FROZEN · FRESH",
          date: "07.14.25",
          time: "9:42AM",
          items: [
            { label: "CHEESEBURGER", price: "$3.75" },
            { label: "FRIES", price: "$2.15" },
          ],
          total: "$5.90",
          no: "0714",
          tape: TAPE_BUTTER,
        },
      },
      { kind: "strip", props: { color: "butter", count: 3 } },
      { kind: "strip", props: { color: "blush", count: 1 } },
      { kind: "strip", props: { color: "sky", count: 2, tape: TAPE_BUTTER } },
    ],
  },
  {
    pos: { cx: "32%", cy: "8%" },
    shape: "2col",
    items: [
      { kind: "strip", props: { color: "blush", count: 2, tape: TAPE_BUTTER } },
      { kind: "strip", props: { color: "butter", count: 1 } },
    ],
  },
  {
    pos: { cx: "68%", cy: "10%" },
    shape: "2col",
    items: [
      { kind: "strip", props: { color: "butter", count: 1 } },
      { kind: "strip", props: { color: "sky", count: 2, tape: TAPE_BUTTER } },
    ],
  },
  {
    pos: { cx: "7%", cy: "79%" },
    shape: "3col",
    items: [
      {
        kind: "receipt",
        props: {
          store: "LA TRATTORIA",
          meta: "FAMIGLIA ROSSI · SINCE 1962",
          date: "06.22.25",
          time: "4:17PM",
          items: [
            { label: "CARBONARA", price: "$18.00" },
            { label: "BREAD", price: "$4.00" },
            { label: "WINE", price: "$12.00" },
          ],
          subtotal: "$34.00",
          tax: "$2.72",
          total: "$36.72",
          no: "1024",
          tape: TAPE_BUTTER,
        },
      },
      { kind: "strip", props: { color: "sky", count: 2 } },
      { kind: "strip", props: { color: "butter", count: 1 } },
      { kind: "strip", props: { color: "blush", count: 3, tape: TAPE_BUTTER } },
    ],
  },
  {
    pos: { cx: "31%", cy: "93%" },
    shape: "2col",
    items: [
      { kind: "strip", props: { color: "sky", count: 2 } },
      { kind: "strip", props: { color: "blush", count: 1, tape: TAPE_BUTTER } },
    ],
  },
  {
    pos: { cx: "69%", cy: "90%" },
    shape: "2col",
    items: [
      { kind: "strip", props: { color: "butter", count: 2 } },
      { kind: "strip", props: { color: "sky", count: 1, tape: TAPE_BUTTER } },
    ],
  },
  {
    pos: { cx: "94%", cy: "24%" },
    shape: "3col",
    items: [
      {
        kind: "receipt",
        props: {
          store: "IN-N-OUT",
          date: "04.11.26",
          items: [{ label: "DOUBLE-DOUBLE", price: "$5.65" }],
          total: "$5.65",
          no: "0411",
          tape: TAPE_BUTTER,
        },
      },
      { kind: "strip", props: { color: "sky", count: 3 } },
      { kind: "strip", props: { color: "blush", count: 1 } },
      { kind: "strip", props: { color: "butter", count: 2, tape: TAPE_BUTTER } },
    ],
  },
  {
    pos: { cx: "95%", cy: "78%" },
    shape: "3col",
    items: [
      {
        kind: "receipt",
        props: {
          store: "CAVA",
          meta: "MEDITERRANEAN · BOWLS",
          date: "05.03.26",
          time: "2:08PM",
          items: [
            { label: "BOWL", price: "$12.50" },
            { label: "PITA", price: "$1.50" },
            { label: "DRINK", price: "$3.00" },
          ],
          subtotal: "$17.00",
          tax: "$1.36",
          total: "$18.36",
          no: "0881",
          tape: TAPE_BUTTER,
        },
      },
      { kind: "strip", props: { color: "blush", count: 2 } },
      { kind: "strip", props: { color: "butter", count: 3 } },
      { kind: "strip", props: { color: "sky", count: 1 } },
    ],
  },
];

/* ───────────────────────────────────────────────────────────────────────────
   Layout algorithm — tall items go in the middle of each cluster, short
   items fan out to the edges (ring / rounded silhouette)
   ─────────────────────────────────────────────────────────────────────────── */

function itemUnits(entry: GalleryEntry): number {
  if (entry.kind === "strip") return entry.props.count + 0.4;
  let u = 1.8 + entry.props.items.length * 0.2;
  if (entry.props.subtotal) u += 0.2;
  if (entry.props.tax) u += 0.2;
  return u;
}

function buildRingColumns(items: GalleryEntry[], colCount: number): GalleryEntry[][] {
  const sorted = [...items].sort((a, b) => itemUnits(b) - itemUnits(a));
  const cols: GalleryEntry[][] = Array.from({ length: colCount }, () => []);
  if (colCount === 3) {
    cols[1].push(sorted[0]);
    sorted.slice(1).forEach((item, i) => {
      cols[i % 2 === 0 ? 0 : 2].push(item);
    });
  } else {
    sorted.forEach((item, i) => {
      cols[i % 2].push(item);
    });
  }
  return cols.map(arrangeColumnTallMiddle);
}

function arrangeColumnTallMiddle(col: GalleryEntry[]): GalleryEntry[] {
  if (col.length <= 1) return col;
  const sorted = [...col].sort((a, b) => itemUnits(b) - itemUnits(a));
  const n = sorted.length;
  const result: (GalleryEntry | null)[] = new Array(n).fill(null);
  const mid = Math.floor(n / 2);
  result[mid] = sorted[0];
  let offset = 1;
  for (let i = 1; i < n; i++) {
    const up = i % 2 === 1;
    const pos = up ? mid - offset : mid + offset;
    result[pos] = sorted[i];
    if (!up) offset++;
  }
  return result.filter((x): x is GalleryEntry => x !== null);
}

function countSlots(items: GalleryEntry[]): number {
  return items.reduce(
    (sum, it) => sum + (it.kind === "strip" ? it.props.count : 1),
    0,
  );
}

function assignPhotos(items: GalleryEntry[], offset: number): GalleryEntry[] {
  if (PHOTOS.length === 0) return items;
  let idx = offset;
  return items.map((item) => {
    if (item.kind === "strip") {
      const srcs = Array.from({ length: item.props.count }).map(() => {
        const src = PHOTOS[idx % PHOTOS.length];
        idx++;
        return src;
      });
      return { ...item, props: { ...item.props, srcs } };
    }
    const src = PHOTOS[idx % PHOTOS.length];
    idx++;
    return { ...item, props: { ...item.props, src } };
  });
}

function renderEntry(entry: GalleryEntry) {
  switch (entry.kind) {
    case "receipt":
      return <StoreReceipt {...entry.props} />;
    case "strip":
      return <ThermalStrip {...entry.props} />;
  }
}

function ClusterBlock({
  pos,
  shape,
  items,
  photoOffset,
}: Cluster & { photoOffset: number }) {
  const colCount = shape === "2col" ? 2 : 3;
  const itemsWithPhotos = assignPhotos(items, photoOffset);
  const cols = buildRingColumns(itemsWithPhotos, colCount);
  return (
    <div
      className={`landing-cluster landing-cluster--${shape}`}
      style={{ left: pos.cx, top: pos.cy }}
    >
      {cols.map((colItems, i) => (
        <div key={i} className="landing-cluster-col">
          {colItems.map((entry, j) => (
            <div key={j}>{renderEntry(entry)}</div>
          ))}
        </div>
      ))}
    </div>
  );
}

const CLUSTER_PHOTO_OFFSETS: number[] = (() => {
  let running = 0;
  return CLUSTERS.map((c) => {
    const offset = running;
    running += countSlots(c.items);
    return offset;
  });
})();

/* ───────────────────────────────────────────────────────────────────────────
   Page
   ─────────────────────────────────────────────────────────────────────────── */

export default function Landing() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [num] = useState(() => 828 + Math.floor(Math.random() * 80));
  const accent = "#E8A5A0";

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email.includes("@") || submitting) return;

    setSubmitting(true);
    try {
      if (WAITLIST_ENDPOINT) {
        await fetch(WAITLIST_ENDPOINT, {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "text/plain;charset=utf-8" },
          body: JSON.stringify({
            email,
            userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "",
          }),
        });
      }
      setDone(true);
    } catch (err) {
      console.error("Waitlist submit error:", err);
      setDone(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="landing-stage">
      {CLUSTERS.map((c, i) => (
        <ClusterBlock key={i} {...c} photoOffset={CLUSTER_PHOTO_OFFSETS[i]} />
      ))}

      <div
        style={{
          position: "relative",
          zIndex: 3,
          textAlign: "center",
          padding: "0 24px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 28,
          maxWidth: 560,
          width: "var(--center-w)",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            fontFamily: "var(--nimbus)",
            fontStyle: "normal",
            fontWeight: 400,
            fontSize: "clamp(24px, 2.8vw, 36px)",
            lineHeight: 1,
            letterSpacing: "0.01em",
            color: "var(--ink)",
          }}
        >
          {BRAND_NAME}
        </div>

        <h1
          style={{
            fontFamily: "var(--serif)",
            fontStyle: "italic",
            fontWeight: 500,
            fontSize: "clamp(28px, 4.6vw, 60px)",
            lineHeight: 1.02,
            letterSpacing: "-0.03em",
            margin: 0,
            color: "var(--ink)",
            whiteSpace: "nowrap",
          }}
        >
          <div>{HEADLINE_LINE_1}</div>
          <div>
            {HEADLINE_LINE_2}{" "}
            <span style={{ color: accent }}>{HEADLINE_ACCENT}</span>
            <Sparkle
              size={20}
              color="#F4CCD6"
              style={{ marginLeft: 8, verticalAlign: "super" }}
            />
          </div>
        </h1>

        {done ? (
          <div
            style={{
              marginTop: 8,
              padding: "18px 26px",
              background: "var(--paper)",
              boxShadow: "var(--sh-sticker)",
              fontFamily: "var(--serif)",
              fontStyle: "italic",
              fontSize: 22,
              color: "var(--ink)",
              letterSpacing: "-0.01em",
            }}
          >
            you are on the wait list!
          </div>
        ) : (
          <form
            onSubmit={submit}
            className="landing-form"
            style={{
              marginTop: 8,
              display: "flex",
              gap: 8,
              width: "100%",
              maxWidth: 440,
              alignItems: "stretch",
            }}
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="your email"
              style={{
                flex: 1,
                background: "var(--cream)",
                border: "1.5px solid var(--ink)",
                fontFamily: "var(--sans)",
                fontSize: 15,
                color: "var(--ink)",
                padding: "14px 16px",
                outline: "none",
                borderRadius: 0,
                boxSizing: "border-box",
              }}
            />
            <button
              type="submit"
              className="landing-cta"
              disabled={submitting}
              style={{
                background: accent,
                color: "var(--cream)",
                border: "none",
                fontFamily: "var(--sans)",
                fontWeight: 500,
                fontSize: 15,
                padding: "14px 22px",
                cursor: submitting ? "wait" : "pointer",
                boxShadow: "var(--sh-sticker)",
                letterSpacing: "-0.005em",
                transition: "transform .2s, box-shadow .2s",
                opacity: submitting ? 0.75 : 1,
              }}
            >
              {submitting ? "sending…" : "join →"}
            </button>
          </form>
        )}

        <div
          style={{
            fontFamily: "var(--mono)",
            fontSize: 10,
            letterSpacing: ".2em",
            textTransform: "uppercase",
            color: "var(--ink-mute)",
          }}
        >
          {FOOTER_TAGLINE}
        </div>
      </div>
    </main>
  );
}