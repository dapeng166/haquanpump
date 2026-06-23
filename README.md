# Haquan Pump — Corporate Website

Production-ready, multilingual marketing site for **Shanghai Haquan Pump Valve
Manufacturing Co., Ltd.** Built with the Next.js App Router, Tailwind CSS and
Framer Motion, with content sourced from a headless WordPress backend via the
REST API (with graceful fallback to a curated seed catalogue).

---

## 1. Tech stack

| Layer        | Choice                                                         |
| ------------ | -------------------------------------------------------------- |
| Framework    | **Next.js 15** (App Router, RSC, ISR) — runs the Next 14 API   |
| Styling      | **Tailwind CSS 3** (custom dark theme, glassmorphism)          |
| Animation    | **Framer Motion 11**                                           |
| Icons        | **lucide-react**                                               |
| i18n         | Custom App-Router dictionary system (EN/ZH/ES/DE/RU/AR + RTL)  |
| Content      | **WordPress REST API** (`haquanpump.com/cms`) → ISR, 1h revalidate |
| Email        | Resend HTTP API (optional) for the inquiry form                |
| Hosting      | **Vercel** (recommended)                                       |

> **About i18n:** `next-i18next` targets the *Pages* Router and is incompatible
> with the App Router used here. We implement the same capability natively — a
> typed dictionary (`lib/i18n/`) behind a React context with cookie persistence
> and automatic RTL for Arabic. The active language is read from a cookie on the
> server so `<html lang/dir>` is correct on first paint. To switch to fully
> localized URLs later, migrate to [`next-intl`](https://next-intl.dev).

---

## 2. Folder structure

```
.
├── app/                          # App Router (routes = folders)
│   ├── layout.tsx                # Root: fonts, metadata, locale cookie, Header/Footer
│   ├── globals.css               # Tailwind layers, glassmorphism, scrollbars
│   ├── page.tsx                  # Home (Hero, TrustBar, Advantages, Products, …)
│   ├── about-us/page.tsx         # About: story, mission/vision, timeline
│   ├── products/
│   │   ├── page.tsx              # Filterable product listing (?series=…)
│   │   └── [slug]/page.tsx       # Product detail: gallery, spec table, brochure
│   ├── news/
│   │   ├── page.tsx              # News grid + pagination
│   │   └── [slug]/page.tsx       # Article
│   ├── support/page.tsx          # FAQ accordion + downloads + support channels
│   ├── contact/page.tsx          # Inquiry form + map + contact details
│   ├── privacy-policy/page.tsx   # Legal (semantic JSX, no Markdown)
│   ├── terms-of-use/page.tsx     # Legal (semantic JSX, no Markdown)
│   ├── api/inquiry/route.ts      # Contact form handler (validate + email)
│   ├── sitemap.ts                # → /sitemap.xml
│   ├── robots.ts                 # → /robots.txt
│   └── not-found.tsx             # 404
│
├── components/
│   ├── layout/                   # Header, Footer, Logo, LanguageSwitcher
│   ├── ui/                       # Button, Primitives, Reveal, PageHero
│   ├── home/                     # Hero, TrustBar, Advantages, ProductPreview, …
│   ├── products/                 # ProductCard, ProductsExplorer, ProductGallery
│   ├── news/                     # NewsGrid (+ pagination)
│   ├── support/                  # FaqAccordion
│   └── contact/                  # InquiryForm
│
├── lib/
│   ├── site.ts                   # Company facts, nav, certifications (single source)
│   ├── types.ts                  # Product / NewsPost / PumpSeries types
│   ├── images.ts                 # Centralised Unsplash imagery (swap freely)
│   ├── wordpress.ts              # REST API fetch + ACF mapping + seed fallback
│   ├── i18n/                     # config, dictionaries, I18nProvider
│   └── data/                     # Seed products, news & editorial content
│
├── wordpress/
│   └── haquan-site-pages.php     # CPT + taxonomy + ACF for functions.php
├── next.config.mjs               # Image domains
├── tailwind.config.ts            # Theme: charcoal/navy + orange accent (#FF6B35)
├── vercel.json                   # Deploy config + security headers
└── .env.local.example            # Copy → .env.local
```

---

## 3. Local development

```bash
npm install
cp .env.local.example .env.local   # then edit values
npm run dev                        # http://localhost:3000
```

Production build / preview:

```bash
npm run build
npm run start
```

### Environment variables

| Variable                  | Purpose                                            |
| ------------------------- | -------------------------------------------------- |
| `NEXT_PUBLIC_WP_API_URL`  | WordPress REST base (default `…/cms/wp-json`)       |
| `NEXT_PUBLIC_SITE_URL`    | Public URL for canonical/sitemap                   |
| `NEXT_PUBLIC_CONTENT_MODE`| `merge` (default) / `live` / `seed` — see below     |
| `RESEND_API_KEY`          | Optional — enables inquiry email delivery          |
| `INQUIRY_TO_EMAIL`        | Where inquiries are sent (default `sales@…`)        |
| `INQUIRY_FROM_EMAIL`      | Verified Resend sender address                      |

If `RESEND_API_KEY` is unset, the form still works in dev — submissions are
validated and logged server-side instead of emailed.

---

## 4. WordPress backend (do not change structure)

The site reads from these endpoints and maps them to typed models in
`lib/wordpress.ts`:

| Data       | Endpoint                                   |
| ---------- | ------------------------------------------ |
| Pumps      | `GET /wp/v2/pump?_embed`                   |
| Series     | `GET /wp/v2/pump_series`                   |
| News       | `GET /wp/v2/posts?_embed` (category `news`)|
| Site Pages | `GET /wp/v2/site_page?_embed`              |

**Required WordPress configuration** for the live data to appear:

1. Register the `pump` CPT and `pump_series` taxonomy with `show_in_rest: true`.
2. Expose ACF fields in REST (ACF Pro ≥ 5.11 "Show in REST API", or the *ACF to
   REST API* plugin). The mapper accepts these field names (tolerant of common
   variants): `flow_rate`, `head`, `power`, `inlet_outlet_diameter`, `material`,
   `certificates`, `pdf_brochure`.
3. Allow CORS for your front-end origin if the CMS is on a different host.

**Until the CPT is populated, the site automatically renders the curated seed
catalogue** in `lib/data/` (real models & specs — never placeholder text), so it
is always presentable. Live CMS data takes precedence the moment it exists.

### Editable pages — the `site_page` system

So that **every page is editable in WP admin "like a product"**, the file
[`wordpress/haquan-site-pages.php`](wordpress/haquan-site-pages.php) registers
(using **ACF FREE only** — no Repeater / Flexible Content / Gallery / Pro):

- **CPT** `site_page` — one record per front-end page
- **Taxonomy** `site_page_category` — `home` · `about` · `support` · `contact`
- **ACF group** "Page Module Fields" attached only to `site_page`, with shared
  fields (`subtitle`, `hero_image`, `cta_text`, `cta_link`) plus conditional
  fields per section (advantages & trust bar for Home; mission/story/factory
  images for About; FAQs & PDF for Support; address/phone/email/map for Contact).

**Install:** paste the file's contents into your theme `functions.php`, or drop
it in `wp-content/mu-plugins/`. Then **Site Pages → Add Page**, choose the *Page
Section*, fill the fields, publish. The taxonomy term is set automatically.

`lib/wordpress.ts → getSitePage(category)` fetches the matching record; each page
falls back to its built-in copy when a field (or the whole record) is empty, so
nothing ever breaks. *Note: ACF FREE has no Gallery field, so the About factory
gallery uses four individual `factory_image_*` Image fields.*

### Content modes (`NEXT_PUBLIC_CONTENT_MODE`)

| Mode             | Behaviour                                                                 |
| ---------------- | ------------------------------------------------------------------------- |
| `merge` *(default)* | Full curated catalogue **+** any extra live CMS items (curated entries are authoritative, so the preview stays complete and well-organised). |
| `live`           | Only WordPress; falls back to seed when the CMS is empty/unreachable. **Use this once your catalogue is fully built in WordPress.** |
| `seed`           | Curated catalogue only — fully static demo, no network.                   |

---

## 5. Deploy to Vercel

### One-click

`vercel.json` is pre-configured (framework, build command, security headers,
regions, redirects). Either:

- **Dashboard:** Import the Git repo at <https://vercel.com/new>, add the env
  vars from the table above, and click **Deploy**.
- **CLI:**
  ```bash
  npm i -g vercel
  vercel            # preview deployment
  vercel --prod     # production deployment
  ```

Set the same environment variables in **Project → Settings → Environment
Variables**. Point your domain `www.haquanpump.com` at the project under
**Settings → Domains**.

---

## 6. Deployment checklist

- [ ] `npm install` and `npm run build` succeed locally.
- [ ] `.env.local` (and Vercel env vars) set: `NEXT_PUBLIC_WP_API_URL`,
      `NEXT_PUBLIC_SITE_URL`, and `RESEND_API_KEY` (+ inquiry emails).
- [ ] WordPress `pump` CPT, `pump_series` taxonomy and ACF fields exposed in REST.
- [ ] Add `wordpress/haquan-site-pages.php` to the theme (registers the
      `site_page` CPT + `site_page_category` taxonomy + ACF group), then create
      one Site Page per section (home / about / support / contact).
- [ ] CORS configured on the CMS for the production domain.
- [ ] Resend domain verified and `INQUIRY_FROM_EMAIL` matches it; send a test
      inquiry and confirm receipt at `sales@haquanpump.com`.
- [ ] Custom domain `www.haquanpump.com` attached in Vercel.
- [ ] Verify `https://www.haquanpump.com/sitemap.xml` and `/robots.txt`.
- [ ] Submit the sitemap in Google Search Console.
- [ ] Spot-check every page on mobile, tablet and desktop.
- [ ] Switch through all six languages; confirm Arabic renders right-to-left.
- [ ] Replace Unsplash imagery (`lib/images.ts`) with real product/factory photos.
- [ ] Run Lighthouse — target 90+ on Performance, SEO and Accessibility.
```
