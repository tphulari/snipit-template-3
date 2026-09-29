"use client";

import {
  memo,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type FormEvent,
} from "react";
import Image from "next/image";

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

// About section (below the fold) — edit these!
const ABOUT_EYEBROW = "WHAT IS SNIPIT";
const ABOUT_HEADLINE_PRE = "what even is the";
const ABOUT_HEADLINE_POST = "camera?";
const ABOUT_PARAGRAPHS: string[] = [
  "Snipit is the digicam that brings you closer to the people who make your memories worth keeping. Designed by young women for young women, it has everything you love about a classic digicam, minus the fuss.",
];
const ABOUT_BULLETS: string[] = [
  "Simple settings and quality flash, so you can focus on looking good",
  "Snipit prints unlimited affordable copies of every picture: give them out to everyone!",
  "USB-C transfer makes it easy to download digitally and post on insta",
  "Print a pic on a receipt from your favorite bar or store to create a sentimental keepsake",
];
const ABOUT_CLOSING = "snap it. share it.";

// Our story / team section (compact, sits between the product about card and
// the socials). ✏️ Edit the story text and team list here.
// Add a photo per person by dropping it in /public/photos/ and setting `photo`;
// without one, a pastel initials badge is shown.
const TEAM_PILL = "OUR STORY";
const TEAM_HEADLINE_PRE = "the people behind";
const TEAM_STORY =
  "What started as a college project quickly grew into something much bigger, a company built by college students who believe the best memories are the ones we create with the people around us.";
// `crop` frames a full-length photo inside the round badge without editing the
// file: fx/fy = where the face is (0–1 across / down the photo), zoom = how far
// in to go (1 = photo fills the badge width), ar = photo width ÷ height.
type TeamCrop = { fx: number; fy: number; zoom: number; ar: number };
type TeamMember = {
  name: string;
  role: string;
  hometown: string;
  majors: string;
  photo?: string;
  crop?: TeamCrop;
};
const TEAM: TeamMember[] = [
  { name: "Makenna Jolley", role: "cofounder & CEO", hometown: "omaha, NE", majors: "computer science, management", photo: "/photos/Makenna.png", crop: { fx: 0.463, fy: 0.44, zoom: 1.62, ar: 0.75 } },
  { name: "Gannett Bishop", role: "cofounder & CPO", hometown: "aurora, IL", majors: "computer science, management", photo: "/photos/Gannett.png", crop: { fx: 0.509, fy: 0.394, zoom: 1.62, ar: 0.75 } },
  { name: "Nina Glick", role: "cofounder & CFO", hometown: "chicago, IL", majors: "computer science, accounting", photo: "/photos/Nina.jpg", crop: { fx: 0.513, fy: 0.408, zoom: 1.1, ar: 0.75 } },
  { name: "Ruby Gutzmann", role: "cofounder & CCO", hometown: "blair, NE", majors: "math, computer engineering, data science", photo: "/photos/Ruby.png" },
  { name: "Caleb Kelly", role: "cofounder & CTO", hometown: "pender, NE", majors: "computer science, math, finance, data science", photo: "/photos/Caleb.png", crop: { fx: 0.555, fy: 0.394, zoom: 1.374, ar: 0.668 } },
  { name: "Tanisha Phulari", role: "cofounder & COO", hometown: "omaha, NE", majors: "computer science, data science", photo: "/photos/Tanisha.png", crop: { fx: 0.521, fy: 0.602, zoom: 1.371, ar: 0.667 } },
];
const TEAM_BADGE_COLORS = ["var(--sky)", "var(--blush)", "var(--butter)"];

// Social links — shown in the "follow along" section near the bottom.
const INSTAGRAM_URL = "https://www.instagram.com/snipitcamera/";
const INSTAGRAM_HANDLE = "@snipitcamera";
const LINKEDIN_URL = "https://www.linkedin.com/company/snipitcamera/home/";
const LINKEDIN_HANDLE = "snipit";
const TIKTOK_URL = "https://www.tiktok.com/@snipitcamera";
const TIKTOK_HANDLE = "@snipitcamera";

// How much FASTER than the page the photos rise as you scroll.
// 0 = scroll with the page only, 0.6 = noticeably faster, 1 = twice as fast.
const PHOTO_RISE_SPEED = 0.6;

// Paste your Google Apps Script web app URL here. See README for setup.
const WAITLIST_ENDPOINT =
  "https://script.google.com/macros/s/AKfycbx-OJLTMOXjK-imiQQ0YtZygWzFemMemQfjJaG6tVCzkpmZKCtphtX4zwpX8lNId5E/exec";

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

// Little taped-up sketch photo — used in the About section to show the
// brand's hand-drawn product sketches (front, screen, USB-C port).
function SketchPhoto({
  src,
  size = "clamp(64px, 7.5vw, 100px)",
  tilt = 0,
}: {
  src: string;
  size?: number | string;
  tilt?: number;
}) {
  return (
    <div
      style={{
        position: "relative",
        width: size,
        transform: `rotate(${tilt}deg)`,
        background: "var(--cream)",
        padding: 8,
        boxShadow: "var(--sh-sticker)",
      }}
    >
      <Tape tilt={tilt < 0 ? 3 : -3} top={-8} width={64} color={TAPE_BUTTER} />
      <div
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: "1 / 1",
          overflow: "hidden",
        }}
      >
        <Image
          src={src}
          alt=""
          fill
          sizes="140px"
          quality={70}
          loading="lazy"
          draggable={false}
          style={{ objectFit: "contain" }}
        />
      </div>
    </div>
  );
}

// Simple outline social icons for the follow-us section.
function InstagramIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" />
    </svg>
  );
}

function LinkedInIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="8" cy="8.5" r="1.15" fill="currentColor" />
      <path d="M8 11.5V17" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path
        d="M11.5 17v-3.2c0-1.4 1-2.3 2.25-2.3S16 12.4 16 13.8V17"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M11.5 11.5V17" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function TikTokIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M14 3v10.6a2.9 2.9 0 1 1-2.4-2.86"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14 3c.3 2.2 1.9 3.9 4 4.2"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M18 7.2V10c-1.5 0-2.9-.4-4-1.2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Image slot — shows a plain gradient box if no src provided, otherwise
// renders a real <img> (next/image) with a thermal-print effect
// (grayscale + contrast + multiply-blend into the paper color).
// Memoized so it never re-renders / reloads on resize.
const ImagePlaceholder = memo(function ImagePlaceholder({
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
      <Image
        src={src}
        alt=""
        fill
        sizes="150px"
        quality={60}
        loading="lazy"
        draggable={false}
        style={{
          objectFit: "cover",
          filter: "grayscale(1) contrast(1.4) brightness(1.02)",
          mixBlendMode: "multiply",
        }}
      />
    </div>
  );
});

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

const StoreReceipt = memo(function StoreReceipt({
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
        backgroundColor: "#FFFDF6",
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
});

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

const ThermalStrip = memo(function ThermalStrip({
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
        backgroundColor: paper,
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
});

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
          store: "SHAKE SHACK",
          meta: "BURGERS · FRIES · SHAKES",
          date: "06.22.25",
          time: "4:17PM",
          items: [
            { label: "SHACKBURGER", price: "$7.99" },
            { label: "FRIES", price: "$3.99" },
            { label: "SHAKE", price: "$6.49" },
          ],
          subtotal: "$18.47",
          tax: "$1.48",
          total: "$19.95",
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
          store: "MELLOW MUSHROOM",
          date: "04.11.26",
          items: [{ label: "PIZZA", price: "$16.50" }],
          total: "$16.50",
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

// Second wall of photos for the About section (bottom of the page).
// Same idea as CLUSTERS above — positions are % of the About section.
const ABOUT_CLUSTERS: Cluster[] = [
  {
    pos: { cx: "6%", cy: "24%" },
    shape: "3col",
    items: [
      {
        kind: "receipt",
        props: {
          store: "BLAZE PIZZA",
          meta: "FAST FIRE'D",
          date: "08.09.25",
          time: "8:15AM",
          items: [
            { label: "BUILD YOUR OWN", price: "$9.95" },
            { label: "GARLIC KNOTS", price: "$4.25" },
          ],
          total: "$14.20",
          no: "0809",
          tape: TAPE_BUTTER,
        },
      },
      { kind: "strip", props: { color: "sky", count: 2 } },
      { kind: "strip", props: { color: "blush", count: 1 } },
      { kind: "strip", props: { color: "butter", count: 3, tape: TAPE_BUTTER } },
    ],
  },
  {
    pos: { cx: "32%", cy: "7%" },
    shape: "2col",
    items: [
      { kind: "strip", props: { color: "butter", count: 2 } },
      { kind: "strip", props: { color: "sky", count: 1, tape: TAPE_BUTTER } },
    ],
  },
  {
    pos: { cx: "68%", cy: "9%" },
    shape: "2col",
    items: [
      { kind: "strip", props: { color: "blush", count: 1 } },
      { kind: "strip", props: { color: "butter", count: 2, tape: TAPE_BUTTER } },
    ],
  },
  {
    pos: { cx: "94%", cy: "30%" },
    shape: "3col",
    items: [
      {
        kind: "receipt",
        props: {
          store: "ZEN COFFEE",
          meta: "THIRD WAVE ROASTERS",
          date: "03.18.26",
          time: "7:30PM",
          items: [
            { label: "MATCHA LATTE", price: "$6.50" },
            { label: "COLD BREW", price: "$5.00" },
          ],
          subtotal: "$11.50",
          tax: "$0.92",
          total: "$12.42",
          no: "0318",
          tape: TAPE_BUTTER,
        },
      },
      { kind: "strip", props: { color: "blush", count: 3 } },
      { kind: "strip", props: { color: "sky", count: 1 } },
      { kind: "strip", props: { color: "butter", count: 2, tape: TAPE_BUTTER } },
    ],
  },
  {
    pos: { cx: "7%", cy: "80%" },
    shape: "3col",
    items: [
      {
        kind: "receipt",
        props: {
          store: "TRADER JOE'S",
          date: "01.27.26",
          time: "5:52PM",
          items: [
            { label: "FLOWERS", price: "$4.99" },
            { label: "TRUFFLE CHIPS", price: "$3.49" },
            { label: "DUMPLINGS", price: "$4.29" },
          ],
          subtotal: "$12.77",
          tax: "$1.02",
          total: "$13.79",
          no: "0127",
          tape: TAPE_BUTTER,
        },
      },
      { kind: "strip", props: { color: "butter", count: 2 } },
      { kind: "strip", props: { color: "sky", count: 3, tape: TAPE_BUTTER } },
      { kind: "strip", props: { color: "blush", count: 1 } },
    ],
  },
  {
    pos: { cx: "31%", cy: "93%" },
    shape: "2col",
    items: [
      { kind: "strip", props: { color: "blush", count: 2, tape: TAPE_BUTTER } },
      { kind: "strip", props: { color: "sky", count: 1 } },
    ],
  },
  {
    pos: { cx: "69%", cy: "91%" },
    shape: "2col",
    items: [
      { kind: "strip", props: { color: "sky", count: 2 } },
      { kind: "strip", props: { color: "butter", count: 1, tape: TAPE_BUTTER } },
    ],
  },
  {
    pos: { cx: "94%", cy: "76%" },
    shape: "3col",
    items: [
      {
        kind: "receipt",
        props: {
          store: "GELATERIA",
          meta: "ARTIGIANALE",
          date: "06.30.26",
          time: "3:45PM",
          items: [
            { label: "PISTACHIO", price: "$5.00" },
            { label: "STRACCIATELLA", price: "$5.00" },
          ],
          total: "$10.00",
          no: "0630",
          tape: TAPE_BUTTER,
        },
      },
      { kind: "strip", props: { color: "sky", count: 1 } },
      { kind: "strip", props: { color: "blush", count: 2 } },
      { kind: "strip", props: { color: "butter", count: 3, tape: TAPE_BUTTER } },
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

function renderEntry(entry: GalleryEntry, key: string) {
  switch (entry.kind) {
    case "receipt":
      return <StoreReceipt key={key} {...entry.props} />;
    case "strip":
      return <ThermalStrip key={key} {...entry.props} />;
  }
}

type BuiltCluster = {
  pos: ClusterPos;
  shape: ClusterShape;
  cols: GalleryEntry[][];
};

// Layout is computed ONCE at module load — never on render — so resizing the
// window can't rebuild the arrays or re-trigger any image loads.
function buildClusters(list: Cluster[], startOffset: number): BuiltCluster[] {
  let running = startOffset;
  return list.map((c) => {
    const offset = running;
    running += countSlots(c.items);
    return {
      pos: c.pos,
      shape: c.shape,
      cols: buildRingColumns(
        assignPhotos(c.items, offset),
        c.shape === "2col" ? 2 : 3,
      ),
    };
  });
}

// The "our story" card is blue, so the photo strips scrolling behind it swap
// their sky-blue paper for blush / butter (never matching a neighbor).
function withoutSky(c: Cluster): Cluster {
  const colorOf = (e?: GalleryEntry) => (e && e.kind === "strip" ? e.props.color : undefined);
  const items: GalleryEntry[] = [];
  c.items.forEach((e, i) => {
    if (e.kind === "strip" && e.props.color === "sky") {
      const avoid = [colorOf(items[i - 1]), colorOf(c.items[i + 1])];
      const pick = (["blush", "butter"] as StripColor[]).find((col) => !avoid.includes(col)) ?? "blush";
      items.push({ ...e, props: { ...e.props, color: pick } });
    } else {
      items.push(e);
    }
  });
  return { ...c, items };
}

const HERO_SLOTS = CLUSTERS.reduce((sum, c) => sum + countSlots(c.items), 0);
const BUILT_CLUSTERS = buildClusters(CLUSTERS, 0);
// Photos continue where the hero left off, so the bottom wall looks different.
// Only the lower half of the about wall ends up next to the "our story" card.
const BUILT_ABOUT_CLUSTERS = buildClusters(
  ABOUT_CLUSTERS.map((c) => (parseFloat(c.pos.cy) >= 50 ? withoutSky(c) : c)),
  HERO_SLOTS,
);

// Third wall of photos — a short section between the hero and the about
// wall. Built exactly like CLUSTERS/ABOUT_CLUSTERS (same pos/shape/items
// shape, same buildClusters + parallax gallery), just shorter, so the wall
// keeps going instead of leaving a blank stretch while you scroll between
// the other two.
const BRIDGE_CLUSTERS: Cluster[] = [
  {
    pos: { cx: "10%", cy: "30%" },
    shape: "2col",
    items: [
      { kind: "strip", props: { color: "sky", count: 2 } },
      { kind: "strip", props: { color: "butter", count: 1, tape: TAPE_BUTTER } },
    ],
  },
  {
    pos: { cx: "32%", cy: "68%" },
    shape: "2col",
    items: [
      {
        kind: "receipt",
        props: {
          store: "CHIPOTLE",
          meta: "MEXICAN GRILL",
          date: "09.02.25",
          time: "7:20AM",
          items: [
            { label: "BURRITO BOWL", price: "$9.75" },
            { label: "CHIPS & GUAC", price: "$4.75" },
          ],
          total: "$14.50",
          no: "0902",
          tape: TAPE_BUTTER,
        },
      },
      { kind: "strip", props: { color: "blush", count: 2 } },
    ],
  },
  {
    pos: { cx: "70%", cy: "70%" },
    shape: "2col",
    items: [
      { kind: "strip", props: { color: "sky", count: 2, tape: TAPE_BUTTER } },
      { kind: "strip", props: { color: "butter", count: 2 } },
    ],
  },
  {
    pos: { cx: "92%", cy: "34%" },
    shape: "2col",
    items: [
      { kind: "strip", props: { color: "blush", count: 1 } },
      { kind: "strip", props: { color: "sky", count: 2, tape: TAPE_BUTTER } },
    ],
  },
];

const ABOUT_SLOTS = ABOUT_CLUSTERS.reduce((sum, c) => sum + countSlots(c.items), 0);
const BUILT_BRIDGE_CLUSTERS = buildClusters(BRIDGE_CLUSTERS, HERO_SLOTS + ABOUT_SLOTS);

// Fourth wall — the page got taller when the "our story" section was added,
// so the photo track needs to get taller too, otherwise the photos would have
// to crawl slower than the page to avoid running out. This wall is the bridge
// layout mirrored left↔right, with fresh photos, so it doesn't look repeated.
const TEAM_WALL_CLUSTERS: Cluster[] = BRIDGE_CLUSTERS.map((c) =>
  withoutSky({
    ...c,
    pos: { cx: `${100 - parseFloat(c.pos.cx)}%`, cy: c.pos.cy },
  }),
);
const BRIDGE_SLOTS = BRIDGE_CLUSTERS.reduce((sum, c) => sum + countSlots(c.items), 0);
const BUILT_TEAM_WALL_CLUSTERS = buildClusters(
  TEAM_WALL_CLUSTERS,
  HERO_SLOTS + ABOUT_SLOTS + BRIDGE_SLOTS,
);

// Extra walls — added on demand. The photo track has to be tall enough that,
// scrolling the whole page, it can keep rising FASTER than the page (see the
// scroll effect in Landing). If the page gets taller (longer text, phones
// where text wraps more) the effect below asks for as many of these as it
// needs so the photos never slow down or stall. Each is the hero layout,
// alternately mirrored / flipped and with fresh photos so nothing looks repeated.
const MAX_EXTRA_WALLS = 6;
const EXTRA_WALL_VARIANTS: BuiltCluster[][] = Array.from(
  { length: MAX_EXTRA_WALLS },
  (_, i) =>
    buildClusters(
      CLUSTERS.map((c) => ({
        ...c,
        pos: {
          cx: i % 2 === 0 ? `${100 - parseFloat(c.pos.cx)}%` : c.pos.cx,
          cy: i % 3 === 1 ? `${100 - parseFloat(c.pos.cy)}%` : c.pos.cy,
        },
      })),
      HERO_SLOTS + ABOUT_SLOTS + BRIDGE_SLOTS + (i + 1) * HERO_SLOTS,
    ),
);

const ClusterBlock = memo(function ClusterBlock({ pos, shape, cols }: BuiltCluster) {
  return (
    <div
      className={`landing-cluster landing-cluster--${shape}`}
      style={{ left: pos.cx, top: pos.cy }}
    >
      {cols.map((colItems, i) => (
        <div key={i} className="landing-cluster-col">
          {colItems.map((entry, j) => renderEntry(entry, `${i}-${j}`))}
        </div>
      ))}
    </div>
  );
});

/* ───────────────────────────────────────────────────────────────────────────
   Page
   ─────────────────────────────────────────────────────────────────────────── */

export default function Landing() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [flippedTeam, setFlippedTeam] = useState<Record<number, boolean>>({});
  const [submitting, setSubmitting] = useState(false);
  const [num] = useState(() => 828 + Math.floor(Math.random() * 80));
  const accent = "#E8A5A0";
  const trackRef = useRef<HTMLDivElement>(null);
  const [extraWalls, setExtraWalls] = useState(0);

  // The photo wall is one tall track inside a fixed, viewport-sized window.
  // Scrolling slides the track up FASTER than the page (the "rising" look).
  // The speed is capped so the track never runs out: its bottom edge reaches
  // the bottom of the screen exactly when the page reaches its end, so there
  // are never blank gaps. Transform-only, straight to the DOM (no re-renders).
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let raf = 0;
    const update = () => {
      raf = 0;
      const vh = track.parentElement?.clientHeight ?? window.innerHeight;
      const maxScroll = Math.max(
        1,
        document.documentElement.scrollHeight - window.innerHeight,
      );
      const wanted = reduced ? 1 : 1 + PHOTO_RISE_SPEED;

      // Make sure the track is tall enough to rise at the wanted speed for the
      // whole page. If not, ask for more walls (100vh each); if we have more
      // than needed, drop the spares.
      const baseHeight = track.offsetHeight - extraWalls * vh;
      const needed = vh + wanted * maxScroll;
      const wallsNeeded = Math.min(
        MAX_EXTRA_WALLS,
        Math.max(0, Math.ceil((needed - baseHeight) / vh)),
      );
      if (wallsNeeded !== extraWalls) setExtraWalls(wallsNeeded);

      const spare = Math.max(0, track.offsetHeight - vh);
      const k = Math.min(wanted, spare / maxScroll);
      const y = Math.min(Math.max(window.scrollY, 0), maxScroll);
      track.style.transform = `translate3d(0, ${-y * k}px, 0)`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    window.addEventListener("load", onScroll);
    // Page height changes when fonts / photos load or text re-wraps.
    const ro =
      typeof ResizeObserver !== "undefined" ? new ResizeObserver(onScroll) : null;
    ro?.observe(document.body);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("load", onScroll);
      ro?.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, [extraWalls]);

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
      <div className="landing-bg" aria-hidden="true" />

      {/* PHOTO WALL — hero, bridge and about walls stacked into one seamless
          track inside a fixed window; page.tsx rises it as you scroll. */}
      <div className="landing-gallery" aria-hidden="true">
        <div ref={trackRef} className="landing-track">
          <div className="landing-wall landing-wall--hero">
            {BUILT_CLUSTERS.map((c, i) => (
              <ClusterBlock key={i} {...c} />
            ))}
          </div>
          <div className="landing-wall landing-wall--bridge">
            {BUILT_BRIDGE_CLUSTERS.map((c, i) => (
              <ClusterBlock key={i} {...c} />
            ))}
          </div>
          <div className="landing-wall landing-wall--about">
            {BUILT_ABOUT_CLUSTERS.map((c, i) => (
              <ClusterBlock key={i} {...c} />
            ))}
          </div>
          <div className="landing-wall landing-wall--team">
            {BUILT_TEAM_WALL_CLUSTERS.map((c, i) => (
              <ClusterBlock key={i} {...c} />
            ))}
          </div>
          {EXTRA_WALL_VARIANTS.slice(0, extraWalls).map((clusters, w) => (
            <div key={`extra-${w}`} className="landing-wall landing-wall--extra">
              {clusters.map((c, i) => (
                <ClusterBlock key={i} {...c} />
              ))}
            </div>
          ))}
        </div>
      </div>


      {/* HERO — headline + form; the photo wall rises behind it. */}
      <section className="landing-hero">
        <div
          style={{
            position: "relative",
            zIndex: 3,
            textAlign: "center",
            padding: "0 24px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
            maxWidth: 560,
            width: "var(--center-w)",
            boxSizing: "border-box",
            marginTop: "-80px",
          }}
        >
          <Image
            src="/logosnipit.png"
            alt={BRAND_NAME}
            width={336}
            height={84}
            priority
            style={{
              height: "clamp(56px, 6vw, 84px)",
              width: "auto",
            }}
          />

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
              you are on the waitlist!
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
                {submitting ? "sending…" : "join the waitlist →"}
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

        <a
          href="#about"
          className="landing-scroll-hint"
          onClick={(e) => {
            const el = document.getElementById("about");
            if (!el) return;
            e.preventDefault();
            // Land so the section's bottom edge (the "our story" button) is
            // fully on screen. If the section is shorter than the screen, this
            // just lines its top up with the top of the screen.
            const top = window.scrollY + el.getBoundingClientRect().top;
            const bottom = window.scrollY + el.getBoundingClientRect().bottom;
            const target = Math.max(top, bottom - window.innerHeight + 8);
            window.scrollTo({ top: target, behavior: "smooth" });
          }}
        >
          about us
          <span className="landing-scroll-hint-arrow" aria-hidden="true">
            ↓
          </span>
        </a>
      </section>

      {/* ABOUT — a wide torn-paper panel echoing the brand's Instagram
          "what even is the snipit camera?" carousel. */}
      <section id="about" className="landing-about">
        <div className="landing-about-card">
          <Tape tilt={-2} top={-8} width={64} color={TAPE_BUTTER} />

          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: 24,
              flexWrap: "wrap",
            }}
          >
            <h2
              style={{
                fontFamily: "var(--serif)",
                margin: "0 0 26px",
                lineHeight: 1.05,
                letterSpacing: "-0.02em",
                color: "var(--ink)",
              }}
            >
              <span
                style={{
                  display: "block",
                  fontStyle: "italic",
                  fontWeight: 500,
                  fontSize: "clamp(21px, 2.7vw, 28px)",
                }}
              >
                {ABOUT_HEADLINE_PRE}
              </span>
              <span style={{ display: "block" }}>
                <Image
                  src="/transparentlogo.png"
                  alt={BRAND_NAME}
                  width={1902}
                  height={827}
                  style={{
                    display: "block",
                    height: "clamp(56px, 7.6vw, 88px)",
                    width: "auto",
                  }}
                />
              </span>
              <span
                style={{
                  display: "block",
                  fontStyle: "italic",
                  fontWeight: 500,
                  fontSize: "clamp(21px, 2.7vw, 28px)",
                  marginTop: 2,
                }}
              >
                {ABOUT_HEADLINE_POST}
              </span>
            </h2>

            <div
              style={{
                display: "flex",
                flexDirection: "row",
                gap: 22,
                flexShrink: 0,
                flexWrap: "wrap",
              }}
            >
              <SketchPhoto src="/photos/front_sketch.png" tilt={-4} size="clamp(67px, 8vw, 106px)" />
              <SketchPhoto src="/photos/screen_sketch.png" tilt={3} size="clamp(67px, 8vw, 106px)" />
              <SketchPhoto src="/photos/USB-C_sketch.png" tilt={-2} size="clamp(67px, 8vw, 106px)" />
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr",
              gap: 20,
              paddingTop: 30,
              borderTop: "1px dashed var(--hairline)",
            }}
          >
            {ABOUT_PARAGRAPHS.map((para, i) => (
              <p
                key={i}
                style={{
                  fontFamily: "var(--sans)",
                  fontSize: 16.5,
                  lineHeight: 1.6,
                  color: "var(--ink-soft)",
                  margin: 0,
                }}
              >
                {para}
              </p>
            ))}
            <ul
              style={{
                listStyle: "none",
                margin: 0,
                padding: 0,
                display: "grid",
                gap: 18,
              }}
            >
              {ABOUT_BULLETS.map((item, i) => (
                <li
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 10,
                    fontFamily: "var(--sans)",
                    fontSize: 16.5,
                    lineHeight: 1.6,
                    color: "var(--ink-soft)",
                  }}
                >
                  <span
                    aria-hidden="true"
                    style={{
                      color: "var(--ink)",
                      flexShrink: 0,
                      fontFamily: "var(--mono)",
                      fontWeight: 600,
                      fontSize: 20,
                      lineHeight: "26px",
                      width: 12,
                      textAlign: "center",
                    }}
                  >
                    *
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 16,
              marginTop: 40,
            }}
          >
            <div
              style={{
                fontFamily: "var(--serif)",
                fontStyle: "italic",
                fontWeight: 500,
                fontSize: "clamp(20px, 2.55vw, 26px)",
                color: "var(--ink)",
              }}
            >
              {ABOUT_CLOSING}{" "}
              <Image
                src="/transparentlogo.png"
                alt={BRAND_NAME}
                width={1902}
                height={827}
                style={{
                  display: "inline-block",
                  height: "1.7em",
                  width: "auto",
                  verticalAlign: "-0.47em",
                }}
              />
            </div>
          </div>
        </div>

        {/* Scroll hint — mirrors the "about us ↓" hint in the hero, so while
            you're reading this card you're nudged to keep scrolling to the
            follow-along / socials section below. */}
        <a href="#team" className="landing-scroll-hint" style={{ bottom: 4 }}>
          our story
          <span className="landing-scroll-hint-arrow" aria-hidden="true">
            ↓
          </span>
        </a>
      </section>

      {/* OUR STORY / TEAM — a compact blush paper card, tilted the opposite
          way from the About card above so the two feel like a sticker-book
          spread. Sits right above the socials. */}
      <section id="team" className="landing-team">
        <div className="landing-team-card">
          <Tape tilt={2} top={-8} width={64} color={TAPE_BUTTER} />

          <div className="landing-about-pill" style={{ background: "var(--sky)" }}>
            {TEAM_PILL}
          </div>

          <p
            style={{
              fontFamily: "var(--sans)",
              fontSize: 15,
              lineHeight: 1.65,
              color: "var(--ink-soft)",
              margin: "14px auto 0",
              maxWidth: 520,
            }}
          >
            {TEAM_STORY}
          </p>

          <h2
            style={{
              fontFamily: "var(--serif)",
              fontStyle: "italic",
              fontWeight: 500,
              fontSize: "clamp(24px, 3.2vw, 32px)",
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              color: "var(--ink)",
              margin: "10px 0 0",
              paddingTop: 10,
              borderTop: "1px dashed var(--hairline)",
            }}
          >
            {TEAM_HEADLINE_PRE}{" "}
            <Image
              src="/transparentlogo.png"
              alt={BRAND_NAME}
              width={1902}
              height={827}
              style={{
                display: "inline-block",
                height: "1.5em",
                width: "auto",
                verticalAlign: "-0.41em",
              }}
            />
          </h2>

          <div className="landing-team-row">
            {TEAM.map((m, i) => (
              <div key={i} className="landing-team-member">
                <button
                  type="button"
                  className="landing-team-avatar"
                  style={{ transform: `rotate(${i % 2 === 0 ? -3 : 3}deg)` }}
                  onClick={() => setFlippedTeam((prev) => ({ ...prev, [i]: !prev[i] }))}
                  aria-pressed={!!flippedTeam[i]}
                  aria-label={`${m.name} — tap to flip`}
                >
                  <span className={`landing-team-flip${flippedTeam[i] ? " is-flipped" : ""}`}>
                    <span
                      className="landing-team-face landing-team-face--front"
                      style={{ background: TEAM_BADGE_COLORS[i % TEAM_BADGE_COLORS.length] }}
                    >
                      {m.photo ? (
                        m.crop ? (
                          <Image
                            src={m.photo}
                            alt={m.name}
                            width={1000}
                            height={Math.round(1000 / m.crop.ar)}
                            sizes="480px"
                            quality={90}
                            draggable={false}
                            style={{
                              position: "absolute",
                              maxWidth: "none",
                              height: "auto",
                              width: `${m.crop.zoom * 100}%`,
                              left: `${(0.5 - m.crop.fx * m.crop.zoom) * 100}%`,
                              top: `${(0.5 - (m.crop.fy * m.crop.zoom) / m.crop.ar) * 100}%`,
                            }}
                          />
                        ) : (
                          <Image
                            src={m.photo}
                            alt={m.name}
                            fill
                            sizes="140px"
                            quality={90}
                            style={{ objectFit: "cover", objectPosition: "50% 30%" }}
                          />
                        )
                      ) : (
                        <span>{m.name.charAt(0).toLowerCase()}</span>
                      )}
                    </span>
                    <span
                      className="landing-team-face landing-team-face--back"
                      style={{ background: TEAM_BADGE_COLORS[i % TEAM_BADGE_COLORS.length] }}
                    >
                      <span className="landing-team-back-label">hometown</span>
                      <span className="landing-team-back-value">{m.hometown}</span>
                      <span className="landing-team-back-label">majors</span>
                      <span className="landing-team-back-value">{m.majors}</span>
                    </span>
                  </span>
                </button>
                <div className="landing-team-name">{m.name}</div>
                <div className="landing-team-role">{m.role}</div>
              </div>
            ))}
          </div>
        </div>

        {/* "follow along ↓" — same hint as before, now closing out the
            team section and leading into the socials. */}
        <a href="#socials" className="landing-scroll-hint" style={{ bottom: 20 }}>
          follow along
          <span className="landing-scroll-hint-arrow" aria-hidden="true">
            ↓
          </span>
        </a>
      </section>

      {/* SOCIALS — follow-along links under the about card (label removed;
          the "follow along ↓" hint above already announces this section). */}
      <section
        id="socials"
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 20,
          padding: "48px 24px 120px",
          textAlign: "center",
          boxSizing: "border-box",
        }}
      >
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap", justifyContent: "center" }}>
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="landing-cta"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              background: "var(--cream)",
              color: "var(--ink)",
              border: "none",
              fontFamily: "var(--sans)",
              fontWeight: 500,
              fontSize: 15,
              padding: "12px 22px",
              textDecoration: "none",
              boxShadow: "var(--sh-sticker)",
              transition: "transform .2s, box-shadow .2s",
            }}
          >
            <InstagramIcon size={18} />
            {INSTAGRAM_HANDLE}
          </a>
          <a
            href={LINKEDIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="landing-cta"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              background: "var(--cream)",
              color: "var(--ink)",
              border: "none",
              fontFamily: "var(--sans)",
              fontWeight: 500,
              fontSize: 15,
              padding: "12px 22px",
              textDecoration: "none",
              boxShadow: "var(--sh-sticker)",
              transition: "transform .2s, box-shadow .2s",
            }}
          >
            <LinkedInIcon size={18} />
            {LINKEDIN_HANDLE}
          </a>
          <a
            href={TIKTOK_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="landing-cta"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              background: "var(--cream)",
              color: "var(--ink)",
              border: "none",
              fontFamily: "var(--sans)",
              fontWeight: 500,
              fontSize: 15,
              padding: "12px 22px",
              textDecoration: "none",
              boxShadow: "var(--sh-sticker)",
              transition: "transform .2s, box-shadow .2s",
            }}
          >
            <TikTokIcon size={18} />
            {TIKTOK_HANDLE}
          </a>
        </div>
      </section>
    </main>
  );
}