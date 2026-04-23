# Waitlist Landing

A single-page waitlist landing with the "canvas of taped-up photos and receipts" aesthetic. Collects emails into a Google Sheet via a lightweight Apps Script webhook.

## Quick start (local)

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy to Vercel

1. Create a free account at [vercel.com](https://vercel.com)
2. Click **Add New → Project** → **Import** (or drag-and-drop this folder's zip)
3. Framework preset: **Next.js** (auto-detected)
4. Click **Deploy**

That's it. Vercel will give you a URL like `your-site.vercel.app`.

---

## Customize

Everything you'll want to change is at the top of `app/page.tsx`:

```ts
const BRAND_NAME = "your brand";
const HEADLINE_LINE_1 = "making the most";
const HEADLINE_LINE_2 = "of your";
const HEADLINE_ACCENT = "memories.";
const FOOTER_TAGLINE = "SNAP IT * SHARE IT * YOUR BRAND";

const WAITLIST_ENDPOINT = "";      // see "Wire up the waitlist" below
const PHOTOS: string[] = [];        // see "Add your photos" below
```

Further down in `page.tsx` you'll see `CLUSTERS` — these are the 8 groups of taped receipts/strips on the wall. Swap the `store`, `date`, `items`, `price`, `total` etc. to make them yours.

---

## Wire up the waitlist (Google Sheets)

### 1. Create the Google Sheet

- Go to [sheets.new](https://sheets.new)
- Row 1 headers: `Timestamp` | `Email` | `User Agent`
- Name it something like "Waitlist"

### 2. Add the Apps Script

- In the sheet: **Extensions → Apps Script**
- Delete the default code and paste:

```javascript
function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const data = JSON.parse(e.postData.contents);
    sheet.appendRow([
      new Date(),
      data.email || '',
      data.userAgent || '',
    ]);
    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

- Save (`Cmd+S`), name the project

### 3. Deploy as web app

- Top-right **Deploy → New deployment**
- Click the ⚙ gear → **Web app**
- **Execute as**: Me
- **Who has access**: **Anyone** ← must be "Anyone" (not "Anyone with a Google account")
- Click **Deploy** and authorize (you'll get a scary warning — click Advanced → Go to project → Allow)
- Copy the **Web app URL** (ends in `/exec`)

### 4. Paste the URL

In `app/page.tsx`:

```ts
const WAITLIST_ENDPOINT = "https://script.google.com/macros/s/YOUR_ID/exec";
```

Redeploy on Vercel (git push, or drag-drop the new folder). Done — emails now land in your Sheet.

---

## Add your photos

1. Drop `.jpg` or `.jpeg` files into `public/photos/`
2. List them in the `PHOTOS` array in `app/page.tsx`:

```ts
const PHOTOS: string[] = [
  "/photos/photo-01.jpg",
  "/photos/photo-02.jpg",
  "/photos/photo-03.jpg",
];
```

The photos cycle through the 8 clusters and never repeat inside the same cluster. ~24 photos is a good number; fewer is fine too.

Each photo gets a thermal-print effect (grayscale + multiply blended into its paper color), so color photos come through just fine — they get tinted pink/blue/yellow based on which strip they're on.

If `PHOTOS` is empty, items show a plain gradient placeholder. The site still looks good.

---

## Structure

```
.
├── app/
│   ├── layout.tsx       — html wrapper + font imports
│   ├── page.tsx         — the whole landing page + all customization points
│   ├── landing.css      — design tokens (colors, fonts, cluster positioning)
│   └── globals.css      — minimal reset
├── public/
│   ├── grain.png        — paper texture (used on every surface)
│   └── photos/          — drop your photos here
├── package.json
├── tsconfig.json
└── next.config.ts
```

No state management, no backend, no database. One page, one form, one webhook.

---

## Tips

- **Stack**: Next.js 16 App Router, React 19, TypeScript. No Tailwind, no UI library — plain CSS variables.
- **Fonts** are pulled from Google Fonts at the top of `landing.css` (Fraunces for headlines, Inter for body, JetBrains Mono for labels).
- **Colors** live as CSS variables in `landing.css` under `.landing-stage`. Search for `--blush`, `--sky`, `--butter` to change the pastel trio.
- **Mobile**: the big corner clusters hide on <640px width so the page stays clean on phones. Form stacks vertically on mobile.
