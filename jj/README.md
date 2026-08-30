# JJ Beauty Studio

A small-batch beauty e-commerce platform — clean, fast, and framework-free.

### Quick Start

```bash
# Install dependencies (back-end only — front-end is static)
npm install

# Build the front-end bundle
node build.js

# Serve locally (pick one)
npx serve .
python -m http.server 8080
```

Open `http://localhost:8080` in your browser.

---

## Architecture Overview

```
jj-beauty-studio-deploy/
├── index.html              # Homepage
├── products.html           # Product catalogue + search/filter
├── product-details.html    # Single product view
├── product-old.html        # Legacy product page (keep for reference)
├── order-history.html      # Customer order history
├── admin.html              # Admin dashboard (homepage editor)
├── inventory.html          # Inventory management + analytics
├── style.css               # Master stylesheet (~1170 lines)
├── dist/
│   ├── bundle.js           # Production JS bundle (IIFE, ~79KB)
│   └── style.css           # Copy of master stylesheet
├── assets/
│   ├── favicon.svg         # Browser tab icon
│   ├── logo.svg            # Brand logo
│   ├── hero.jpg            # Hero background image
│   └── pictures/           # 31 product photographs
├── README.md
└── package.json            # Express back-end (unused by front-end)
```

## Technology Stack

| Layer | Technology | Notes |
|---|---|---|
| **Front-end** | Vanilla JS (ES6+) + CSS3 + HTML5 | No framework, no build tooling beyond `build.js` |
| **Bundle** | Custom Node.js script | Concatenates ES modules → IIFE (works with `file://`) |
| **Styling** | CSS custom properties | Design tokens in `:root` — palette, fonts, radius, shadows |
| **Storage** | `localStorage` | Products, orders, homepage content, auth |
| **Auth** | `sessionStorage` + `localStorage` | No server — password stored client-side |
| **Charts** | Chart.js (CDN) | Only on `inventory.html` |
| **Back-end** | Express + Google OAuth (`app.js`) | **Not used by front-end** — available for future server deployment |

## Key Design Decisions

### 1. No Framework — Vanilla JS
The site uses pure JavaScript with ES modules for development, bundled into an IIFE for production. This eliminates dependency overhead and keeps the bundle size under 80KB.

### 2. IIFE Bundle (not ES modules in production)
ES modules require `type="module"` which doesn't work with `file://` protocol. The build script (`build.js`) concatenates all modules, strips `import`/`export` statements, and wraps everything in an IIFE for universal compatibility.

### 3. localStorage as Data Store
All data (products, orders, homepage content) is stored in `localStorage`. This means:
- Zero server dependencies for core features
- Data persists across sessions
- **Data is per-browser** — not shared between devices
- Admin adds products once and they appear instantly

### 4. CSS Custom Properties (Design Tokens)
All colours, fonts, radii, and shadows are defined as CSS variables in `:root`. This makes theming consistent and easy to change.

---

## Project Structure — Source (`cosmetics/`)

```
cosmetics/
├── js/                    # Modular source files (8 modules)
│   ├── config.js          # Constants, product data, SVG icon library
│   ├── utils.js           # Shared utilities (storage, helpers, toast)
│   ├── navbar.js          # Navbar scroll state, mobile menu, page transitions
│   ├── products.js        # Product cards, featured grid, search, details
│   ├── order.js           # Receipt modal, order-now handlers, order history
│   ├── admin-auth.js      # Admin login, password management, logout
│   ├── admin-homepage.js  # Homepage content editor form
│   └── admin-products.js  # Product CRUD table
├── build.js               # Build script — concatenates modules → IIFE bundle
├── style.css              # Source stylesheet (authoritative)
├── dist/
│   ├── bundle.js          # Generated bundle
│   └── style.css          # Copied from style.css
├── app.js                 # Express back-end (future use)
├── package.json
├── javascript.js          # Legacy monolithic file (keep for reference)
├── script.js              # Legacy monolithic file (keep for reference)
└── *.html                 # Same 7 HTML pages
```

### Module Responsibilities

| Module | Exports | Role |
|---|---|---|
| `config.js` | `MESSENGER_URL`, `STORAGE_KEY`, `DEFAULT_PRODUCTS`, `ICONS`, `getIcon()` | Constants & data |
| `utils.js` | `getProducts()`, `saveProducts()`, `loadOrderHistory()`, `showToast()`, `escapeHtml()`, `stockBadge()`, etc. | Shared helpers |
| `navbar.js` | `initNavbar()`, `applyHomepageContent()` | Navbar + page content population |
| `products.js` | `renderProductCard()`, `initFeaturedProducts()`, `initProductsPage()`, `initProductDetailsPage()` | Product display |
| `order.js` | `createReceiptModal()`, `openReceiptModalForProduct()`, `initOrderNowHandlers()`, `initOrderHistoryPage()` | Order flow |
| `admin-auth.js` | `initAdminAuth()` | Login overlay + password management |
| `admin-homepage.js` | `initHomepageEditor()` | Admin homepage form |
| `admin-products.js` | `initAdminProducts()` | Admin product CRUD table |

---

## Build Process

```bash
node build.js
```

This does two things:
1. Reads all 8 modules from `js/`, strips `import`/`export` statements, wraps in IIFE, writes to `dist/bundle.js`
2. Copies `style.css` → `dist/style.css`

**Run this after every change to `js/*.js` or `style.css`.**

Always edit source files in `cosmetics/`, then rebuild and copy to `jj-beauty-studio-deploy/`:

```bash
cd cosmetics
node build.js
cp dist/bundle.js ../jj-beauty-studio-deploy/dist/bundle.js
cp dist/style.css ../jj-beauty-studio-deploy/dist/style.css
cp style.css ../jj-beauty-studio-deploy/style.css
```

---

## Data Flow

### Products
1. Admin adds/edits products via `admin.html` (stored in `localStorage` under `admin_products_v1`)
2. Products page (`products.html`) reads from the same key
3. Orders decrement stock and save to `jj_order_history`
4. `window.dispatchEvent(new Event('products-updated'))` keeps all tabs in sync

### Homepage Content
1. Admin edits text fields on `admin.html`
2. Saved to `localStorage` under `homepage_content_v1`
3. Every page calls `applyHomepageContent()` on load to apply custom text

### Authentication
- Default password: `1234` (stored in `localStorage` under `jj_admin_password`)
- Login state is in `sessionStorage` (cleared on browser close)
- Password can be changed from the admin login overlay

---

## Page Transition System

When you click a nav link, instead of an abrupt page reload:
1. A full-screen overlay fades in (ivory background + subtle blur)
2. After 380ms the browser navigates to the new URL with `?_t=1`
3. The new page detects `_t=1`, fades the overlay out
4. The overlay element is created once by `navbar.js` and reused

**CSS:** `#page-transition-overlay` in `style.css`
**JS:** `transitionTo()` function in `js/navbar.js`

---

## Animation System

### Scroll-Reveal (`js/navbar.js` via `build.js`)
- Uses `IntersectionObserver` with `threshold: 0.06` and `rootMargin: '0px 0px -20px 0px'`
- Elements already in the viewport on load get `.visible` immediately (no flash)
- All reveal transitions use `0.9s cubic-bezier(0.25, 0.46, 0.45, 0.94)` for smoothness

### CSS Animations (`style.css`)
- **Hero:** Staggered fade-in-up for all hero elements, blob morphing for the background shape, floating seal
- **Scroll sections:** `.section`, `.card-product`, `.why-card` — opacity + translateY transition
- **Hover states:** Product cards lift -8px with deeper shadow, shimmer sweep on buttons
- **Mobile menu:** Hamburger-to-X transform with smooth open/close
- **Modals:** Fade in overlay, scale in modal

---

## Responsive Breakpoints

| Breakpoint | Target |
|---|---|
| `> 1180px` | Desktop max-width |
| `≤ 980px` | Tablet landscape — 2-col grids, stacked hero, sidebar hidden |
| `≤ 930px` | Small tablet — mobile nav triggers, narrower padding |
| `≤ 720px` | Mobile — single-column grids, full-width elements |
| `≤ 560px` | Small phone — compact modals and forms |

---

## Pages Reference

| Page | Features |
|---|---|
| `index.html` | Hero with animated badge, featured products grid (top 6), About/Why Us (4 cards), Contact form card, Footer |
| `products.html` | Full catalogue with search (live suggestions), filter pills by category, top sellers section, rank badges |
| `product-details.html` | Single product view with media, bullets, related products; `?id=N` param |
| `order-history.html` | Saved orders from localStorage, clear history button |
| `admin.html` | Login overlay, homepage content editor (50+ editable fields), product CRUD table |
| `inventory.html` | Stock monitoring dashboard, sales bar charts, Chart.js integration, alert list |

---

## Future Considerations

1. **Back-end integration** — `app.js` has Express + Google OAuth ready. Connect `admin-auth.js` to hit the server instead of using localStorage.
2. **PNG favicon** — Only SVG is provided. Add `.ico`/`.png` fallback for IE/older browsers.
3. **Dark mode** — Add `prefers-color-scheme: dark` media query in `style.css`.
4. **`product-old.html`** — Legacy page; remove or redirect if no longer needed.
5. **Testing** — No automated tests exist.
6. **Pagination** — The product catalogue loads all items at once. For 50+ products, add pagination or infinite scroll.

---

## Colour Palette

| Token | Hex | Usage |
|---|---|---|
| `--ivory` | `#FFF9F6` | Page background |
| `--blush-soft` | `#FBEEF1` | Subtle accents, card gradients |
| `--blush` | `#F4DCE3` | Hero gradient, section backgrounds |
| `--rose` | `#E0879C` | Secondary rose |
| `--rose-deep` | `#BE5777` | Primary brand colour — buttons, links |
| `--rose-gold` | `#B8876F` | Logo gradient, hover states |
| `--ink` | `#3B2A2D` | Body text, headings |
| `--ink-soft` | `#7A6669` | Secondary text |
| `--sage` | `#748C73` | Success/in-stock indicators |
| `--line` | `#EFDEE2` | Borders, dividers |

## Typography

- **Headings:** `Fraunces` (serif, 300–700 weight)
- **Body:** `Manrope` (sans-serif, 400–800 weight)
- Both loaded via Google Fonts at the top of `style.css`
