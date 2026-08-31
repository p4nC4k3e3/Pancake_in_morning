/* JJ Beauty — Bundled 2026-07-19 */
(function(){
"use strict";

// --- config ---
/* =================================================================
   JJ — Constants, product data, icon library
   ================================================================= */

const MESSENGER_URL = "https://www.messenger.com/t/jeewell.anne.muzares/";

const STORAGE_KEY = "admin_products_v1";
const ORDER_HISTORY_KEY = "jj_order_history";
const HOMEPAGE_KEY = "homepage_content_v1";
const AUTH_STORAGE_KEY = "jj_admin_authenticated";
const ADMIN_PASSWORD_KEY = "jj_admin_password";
const DEFAULT_ADMIN_PASSWORD = "1234";
const LOW_STOCK_THRESHOLD = 12;
const CUSTOM_CATEGORY_STORAGE_KEY = "custom_categories_v1";
const DELETED_CATEGORY_STORAGE_KEY = "deleted_categories_v1";
const BASE_CATEGORY_LABELS = {
  skincare: "Skincare",
  makeup: "Makeup",
  bags: "Bags",
  accessories: "Accessories"
};

function loadCustomCategoriesFromStorage() {
  try {
    const raw = localStorage.getItem(CUSTOM_CATEGORY_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
}

function getMergedCategoryLabels() {
  const labels = { ...BASE_CATEGORY_LABELS };
  const deleted = new Set(loadDeletedCategoriesFromStorage());
  loadCustomCategoriesFromStorage().forEach((item) => {
    if (!item || !item.value || !item.label) return;
    labels[item.value] = item.label;
  });
  Object.keys(labels).forEach((value) => {
    if (deleted.has(value)) delete labels[value];
  });
  return labels;
}

function loadDeletedCategoriesFromStorage() {
  try {
    const raw = localStorage.getItem(DELETED_CATEGORY_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
}

function renderFooterCategoryLinks() {
  const categoryLabels = getMergedCategoryLabels();
  const footerColumns = document.querySelectorAll('.site-footer .footer-col');
  if (!footerColumns[1]) return;
  const list = footerColumns[1].querySelector('ul');
  if (!list) return;
  list.innerHTML = Object.entries(categoryLabels)
    .map(([value, label]) => `<li><a href="products.html?category=${encodeURIComponent(value)}">${label}</a></li>`)
    .join('');
}

const DEFAULT_PRODUCTS = [
  {
    id: 1,
    name: "Rosewater Hydrating Serum",
    category: "skincare",




    icon: "dropper",
    price: 24.00,
    stock: "in",
    quantity: 15,
    salesCount: 0,
    short: "A featherweight serum with rosewater and hyaluronic acid for all-day hydration.",
    description: "Our bestselling serum pairs distilled rosewater with multi-weight hyaluronic acid to flood skin with moisture without ever feeling heavy or sticky. Formulated for daily use under moisturizer, it leaves a soft, dewy finish and helps calm visible redness.",
    bullets: ["Cruelty-free & dermatologist tested", "Fragrance from real rose botanicals only", "Suitable for sensitive skin"]
  },
  {
    id: 2,
    name: "Velvet Clay Cleansing Balm",
    category: "skincare",
    icon: "jar",
    price: 19.50,
    stock: "in",
    quantity: 14,
    salesCount: 0,
    short: "A balm-to-milk cleanser that lifts makeup and impurities without stripping skin.",
    description: "This balm melts on contact with warm skin, dissolving makeup, SPF, and city grime, then emulsifies into a milky rinse with water. Pink clay gently draws out impurities while shea butter keeps the skin barrier soft and comfortable.",
    bullets: ["Removes waterproof makeup", "Leaves no tight, stripped feeling", "150ml — lasts 3+ months"]
  },
  {
    id: 3,
    name: "Satin Whisper Lip Tint",
    category: "makeup",
    icon: "lipstick",
    price: 16.00,
    stock: "low",
    quantity: 6,
    salesCount: 0,
    short: "A buildable, weightless lip tint with a soft-blur satin finish.",
    description: "One swipe gives a natural flush, two builds to full colour — all without the dryness of a typical matte. The satin-blur finish blurs the look of lip lines while a touch of jojoba oil keeps lips comfortable for hours.",
    bullets: ["Transfer-resistant satin finish", "Infused with jojoba & vitamin E", "Available in 6 shades"]
  },
  {
    id: 4,
    name: "Soft Focus Blurring Powder",
    category: "makeup",
    icon: "compact",
    price: 22.00,
    stock: "in",
    quantity: 13,
    salesCount: 0,
    short: "A translucent finishing powder that softens pores and controls shine.",
    description: "Micro-fine silica spheres scatter light across the skin to visibly blur pores and fine lines while absorbing midday shine. Wear it alone for a soft-focus finish or press over makeup to set it for hours without looking cakey.",
    bullets: ["Translucent — suits every skin tone", "Oil-absorbing, shine control", "Talc-free formula"]
  },
  {
    id: 5,
    name: "Gilded Rose Bag",
    category: "bags",
    icon: "pump",
    price: 28.00,
    stock: "in",
    quantity: 13,
    salesCount: 0,
    short: "A refined everyday bag with a polished finish and practical storage.",
    description: "A structured silhouette with soft detailing and room for daily essentials, designed to bring a polished look to every routine. Thoughtful pockets and elegant hardware make it a versatile companion for work, errands, or evenings out.",
    bullets: ["Structured everyday design", "Roomy interior pockets", "Elegant polished finish"]
  },
  {
    id: 6,
    name: "Whipped Leather Tote",
    category: "bags",
    icon: "tub",
    price: 21.00,
    stock: "out",
    quantity: 0,
    salesCount: 0,
    short: "A sleek tote with a soft, sculpted shape and everyday practicality.",
    description: "Crafted with a smooth, luxe finish and generous interior space, this tote blends comfort and style for busy days. Its clean lines and soft structure make it ideal for daily essentials without feeling bulky.",
    bullets: ["Spacious interior", "Soft sculpted silhouette", "Versatile for daily use"]
  },
  {
    id: 7,
    name: "Silk Carry Clutch",
    category: "bags",
    icon: "flacon",
    price: 26.00,
    stock: "in",
    quantity: 13,
    salesCount: 0,
    short: "A compact clutch with a sleek finish for evening essentials.",
    description: "A compact silhouette that holds the essentials with elegance, from cards and lipstick to your phone and keys. The refined shape and polished detailing make it a chic choice for nights out or special occasions.",
    bullets: ["Compact evening-ready design", "Polished detailing", "Fits everyday essentials"]
  },
  {
    id: 8,
    name: "Rosé Mini Crossbody",
    category: "bags",
    icon: "bar",
    price: 14.00,
    stock: "in",
    quantity: 13,
    salesCount: 0,
    short: "A compact crossbody with a lightweight feel and everyday charm.",
    description: "A lightweight crossbody designed for effortless carry, with just enough room for your essentials and a flattering silhouette. Its soft structure and easy strap make it the perfect everyday bag for on-the-go moments.",
    bullets: ["Lightweight everyday carry", "Compact and practical", "Easy-adjust strap"]
  }
];

const CATEGORY_LABELS = {
  skincare: "Skincare",
  makeup: "Makeup",
  bags: "Bags"
};

const STOCK_LABELS = {
  in: "In Stock",
  low: "Low Stock",
  out: "Out of Stock"
};

const ICONS = {
  dropper: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M26 8h12"/><path d="M29 8v10l-9 14a9 9 0 0 0 16.6 6.6A9 9 0 0 0 35 32l-3-4"/><circle cx="32" cy="44" r="2"/><path d="M22 50h20"/></svg>`,
  jar: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="16" y="22" width="32" height="30" rx="6"/><path d="M20 22c0-6 4-10 12-10s12 4 12 10"/><path d="M16 30h32"/></svg>`,
  lipstick: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M26 30 38 18a4 4 0 0 1 6 6L32 36"/><rect x="20" y="34" width="14" height="22" rx="4" transform="rotate(8 27 45)"/></svg>`,
  compact: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="32" cy="38" r="16"/><circle cx="32" cy="38" r="6"/><path d="M20 23 14 12l8-2 6 11"/></svg>`,
  pump: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="18" y="24" width="24" height="32" rx="5"/><path d="M24 24v-6h10v6"/><path d="M29 18V9"/><path d="M29 9h10"/></svg>`,
  tub: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="32" cy="20" rx="17" ry="6"/><path d="M15 20v22c0 4 8 8 17 8s17-4 17-8V20"/></svg>`,
  flacon: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M27 10h10v8h-10z"/><path d="M25 18h14l4 6v26a6 6 0 0 1-6 6H27a6 6 0 0 1-6-6V24z"/><path d="M21 34h22"/></svg>`,
  bar: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="12" y="24" width="40" height="22" rx="11"/><path d="M20 30c4 4 4 6 0 10" /><path d="M44 30c-4 4-4 6 0 10"/></svg>`
};

function getIcon(key) {
  return ICONS[key] || ICONS.jar;
}


// --- utils ---
/* =================================================================
   JJ — Shared utility functions
   ================================================================= */


/* ---------- Stock helpers ---------- */
function getStockFromQuantity(quantity) {
  const value = Number(quantity);
  if (!Number.isFinite(value) || value <= 0) return "out";
  if (value <= LOW_STOCK_THRESHOLD) return "low";
  return "in";
}

function getStatus(quantity) {
  if (!Number.isFinite(quantity) || quantity <= 0) return "out";
  if (quantity <= 5) return "low";
  return "in";
}

function getBadgeClass(status) {
  return status === "in" ? "badge-stock in" : status === "low" ? "badge-stock low" : "badge-stock out";
}

/* ---------- Product Loading ---------- */
function loadProductsFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return null;
    return parsed.map((product) => {
      const quantity = Number(product.quantity);
      const normalizedQuantity = Number.isFinite(quantity) ? quantity : (product.stock === "out" ? 0 : (product.stock === "low" ? 6 : 13));
      const stock = getStockFromQuantity(normalizedQuantity);
      return {
        ...product,
        quantity: normalizedQuantity,
        stock,
        salesCount: Number.isFinite(Number(product.salesCount)) ? Number(product.salesCount) : 0
      };
    });
  } catch (e) {
    return null;
  }
}

function getProducts() {
  const stored = loadProductsFromStorage();
  return Array.isArray(stored) ? stored : DEFAULT_PRODUCTS;
}

function saveProducts(products) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}

window.addEventListener("storage", (event) => {
  if (!event.key || (event.key !== STORAGE_KEY && event.key !== CUSTOM_CATEGORY_STORAGE_KEY && event.key !== DELETED_CATEGORY_STORAGE_KEY && event.key !== CART_STORAGE_KEY)) return;
  const page = window.location.pathname.split("/").pop() || "";
  if (["", "index.html", "products.html", "product-details.html"].includes(page)) {
    if (event.key === STORAGE_KEY) {
      loadCart();
      syncCartWithProducts();
    }
    window.location.reload();
  }
});

/* ---------- Order History Helpers ---------- */
function loadOrderHistory() {
  try {
    const raw = localStorage.getItem(ORDER_HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.warn('Unable to read order history from localStorage.', error);
    return [];
  }
}

function saveOrderHistory(orders) {
  try {
    localStorage.setItem(ORDER_HISTORY_KEY, JSON.stringify(orders));
    return true;
  } catch (error) {
    console.warn('Unable to save order history to localStorage.', error);
    return false;
  }
}

function appendOrderHistory(order) {
  const history = loadOrderHistory();
  history.push(order);
  return saveOrderHistory(history);
}

function formatOrderDate(isoString) {
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return isoString;
  return date.toLocaleString('en-PH', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  });
}

/* ---------- Toast ---------- */
function showToast(message) {
  let toast = document.querySelector(".toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "toast";
    toast.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg><span></span>`;
    document.body.appendChild(toast);
  }
  toast.querySelector("span").textContent = message;
  toast.classList.add("show");
  clearTimeout(toast._t);
  toast._t = setTimeout(() => toast.classList.remove("show"), 2600);
}

/* ---------- Homepage Content Helpers ---------- */
function getDefaultHomepageContent() {
  return {
    navHome: "Home",
    navProducts: "Products",
    navAbout: "About Us",
    navContact: "Contact",
    navCtaText: "Browse Products",
    navOrderHistory: "Order History",
    heroBadge: "Small-Batch Beauty · Est. 2025",
    heroHeading: "Enhance Your",
    heroHighlight: "Natural Beauty",
    heroLead: "JJ is a small-batch beauty studio crafting clean, effective skincare, makeup, and bags — formulated with intention and finished with elegance.",
    heroPrimaryBtn: "Browse Products",
    heroSecondaryBtn: "Learn our story",
    featuredEyebrow: "Our Edit",
    featuredTitle: "Featured Products",
    featuredDescription: "A curated edit from across our skincare, makeup, and bags lines — start your routine here.",
    featuredButton: "View All Products",
    aboutEyebrow: "Why JJ",
    aboutTitle: "Why Choose Us",
    aboutDescription: "Every formula is made in small batches and checked by hand before it reaches you — here's what that means in practice.",
    aboutCard1Title: "Clean, Conscious Formulas",
    aboutCard1Text: "Cruelty-free and dermatologist tested, with every ingredient chosen for skin comfort, not just shelf appeal.",
    aboutCard2Title: "Small-Batch Craftsmanship",
    aboutCard2Text: "Every product is mixed and finished in limited runs, so you're never reaching for something that's sat on a shelf for years.",
    aboutCard3Title: "Real Answers, Real Fast",
    aboutCard3Text: "Questions about a shade, a scent, or a skin type? Message us directly on Messenger and hear back from a real person.",
    aboutCard4Title: "Made For Every Routine",
    aboutCard4Text: "From skincare to bags, our range covers the everyday essentials of a complete beauty routine.",
    contactEyebrow: "Get In Touch",
    contactTitle: "Have a question before you order?",
    contactItem1Title: "Message us on Messenger",
    contactItem1Text: "Fastest way to ask about a product, shade, or order",
    contactItem2Title: "muzaresjeewelanne@gmail.com",
    contactItem2Text: "For wholesale and partnership enquiries",
    contactItem3Title: "Mon – Sat, 10:00 AM – 10:00 PM",
    contactItem3Text: "Replies usually within a few hours",
    contactCardTitle: "Chat with JJ",
    contactCardText: "Ask about availability, ingredients, or place an order — we're one message away.",
    contactButton: "Message Us on Messenger",
    footerIntro: "Clean, small-batch beauty for skin, lips, body and hair — crafted with intention.",
    footerExploreHeading: "Explore",
    footerExploreHome: "Home",
    footerExploreProducts: "Products",
    footerExploreAbout: "About Us",
    footerExploreContact: "Contact",
    footerCategoriesHeading: "Categories",
    footerCategoriesSkincare: "Skincare",
    footerCategoriesMakeup: "Makeup",
    footerCategoriesBags: "Bags",
    footerContactHeading: "Contact",
    footerContactMessenger: "Messenger",
    footerContactEmail: "muzaresjeewelanne@gmail.com",
    footerContactAdmin: "Admin Login",
    footerCopyright: "© 2026 JJ Beauty Studio. All rights reserved.",
    footerTagline: "Crafted with care for clean beauty."
  };
}

function loadHomepageContent() {
  try {
    const stored = JSON.parse(localStorage.getItem(HOMEPAGE_KEY) || "null");
    return stored || getDefaultHomepageContent();
  } catch (e) {
    return getDefaultHomepageContent();
  }
}

function saveHomepageContent(content) {
  localStorage.setItem(HOMEPAGE_KEY, JSON.stringify(content));
}

function escapeHtml(str) {
  return String(str || '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
}

function svgPlaceholder() {
  return `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 8V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h1"/></svg>`;
}

function stockBadge(s) {
  if (s === 'in') return '<span class="badge-stock in"><span class="dot"></span>In Stock</span>';
  if (s === 'low') return '<span class="badge-stock low"><span class="dot"></span>Low Stock</span>';
  return '<span class="badge-stock out"><span class="dot"></span>Out of Stock</span>';
}


// --- navbar ---
/* =================================================================
   JJ — Navbar (scroll state + mobile toggle + page transitions)
   ================================================================= */


/**
 * Initialises the sticky navbar:
 * - Adds `is-solid` class on scroll >30px for backdrop/blur effect
 * - Toggles mobile hamburger menu
 * - Intercepts internal nav link clicks to perform a smooth
 *   crossfade page transition instead of an abrupt hard reload.
 */
function initNavbar() {
  const nav = document.querySelector(".navbar");
  if (!nav) return;

  /* ---------- Scroll state ---------- */
    /* ---------- Dynamic navbar height (CSS variable) ---------- */
  function setNavbarHeight() {
    const h = nav.getBoundingClientRect().height;
    document.documentElement.style.setProperty('--navbar-height', h + 'px');
  }
  setNavbarHeight();
  window.addEventListener("resize", setNavbarHeight);

  /* ---------- Scroll state ---------- */
  const onScroll = () => {
    if (window.scrollY > 30) nav.classList.add("is-solid");
    else nav.classList.remove("is-solid");
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- Mobile toggle ---------- */
  const toggle = document.querySelector(".nav-toggle");
  const menu = document.querySelector(".mobile-menu");
  if (toggle && menu) {
    toggle.addEventListener("click", () => {
      menu.classList.toggle("open");
      toggle.classList.toggle("open");
    });
    menu.querySelectorAll("a").forEach(a =>
      a.addEventListener("click", () => {
        menu.classList.remove("open");
        toggle.classList.remove("open");
      })
    );
  }

  /* ---------- Smooth page transitions ---------- */
  // Create the overlay element once (reused for all navigations)
  if (!document.getElementById("page-transition-overlay")) {
    const overlay = document.createElement("div");
    overlay.id = "page-transition-overlay";
    overlay.setAttribute("aria-hidden", "true");
    document.body.appendChild(overlay);
  }

  // If we arrived via a transition (URL has ?_t=1), fade the overlay out
  if (window.location.search.includes("_t=1")) {
    const overlay = document.getElementById("page-transition-overlay");
    if (overlay) {
      // Clean the transition token from the URL bar without reloading,
      // but preserve any other query params like ?id=123.
      const nextUrl = new URL(window.location.href);
      nextUrl.searchParams.delete("_t");
      const cleanUrl = nextUrl.pathname + nextUrl.search + nextUrl.hash;
      window.history.replaceState({}, "", cleanUrl);
      // Fade out — overlay is already visible covering the page
      requestAnimationFrame(() => {
        overlay.classList.remove("active");
      });
    }
  }

  /**
   * Intercepts same-origin link clicks to perform a fade transition.
   * The overlay fades in (covering the current page), then the browser
   * navigates. The new page loads with the overlay instantly visible,
   * then fades out via the check above.
   */
  document.addEventListener("click", (e) => {
    const link = e.target.closest("a");
    if (!link) return;

    const href = link.getAttribute("href");
    // Only handle internal navigations (same-origin, non-anchor, non-external)
    if (!href
        || href.startsWith("#")
        || href.startsWith("http")
        || href.startsWith("//")
        || href.startsWith("javascript:")
        || link.hasAttribute("target")
        || link.dataset.noTransition === "true") return;

        // Skip same-page anchor links (e.g. products.html#about while on products.html)
    const currentPage = window.location.pathname.split("/").pop() || "index.html";
    if (href.includes("#")) {
      const linkPage = href.split("#")[0];
      if (!linkPage || linkPage === currentPage) return;
    }

        e.preventDefault();

    transitionTo(href);
  });
}

/**
 * Performs the crossfade page transition.
 *
 * 1. Fade overlay in (covers current page).
 * 2. After the fade-in completes (~380ms), navigate to the target URL
 *    with a `_t=1` query param so the destination page knows to fade
 *    the overlay out on load.
 *
 * @param {string} url — The target page URL to navigate to.
 */
function transitionTo(url) {
  const overlay = document.getElementById("page-transition-overlay");
  if (!overlay) {
    window.location.href = url;
    return;
  }

  overlay.classList.add("active");

  // After the fade-in completes, navigate
  setTimeout(() => {
    const separator = url.includes("?") ? "&" : "?";
    window.location.href = url + separator + "_t=1";
  }, 380);
}

// ----------------------------------------------------------------
// Homepage Content — populates all editable text from localStorage
// ----------------------------------------------------------------

/**
 * Reads homepage content from localStorage and applies it to every
 * text-bearing element on the page (nav, hero, featured, about,
 * contact, footer). Falls back to getDefaultHomepageContent() if
 * no saved content exists.
 */
function applyHomepageContent() {
  const content = loadHomepageContent();
  const defaults = getDefaultHomepageContent();

  // Navigation links
  const navMappings = [
    { selector: 'a[href="index.html"]', key: 'navHome' },
    { selector: 'a[href="products.html"]', key: 'navProducts' },
    { selector: 'a[href="index.html#about"]', key: 'navAbout' },
    { selector: 'a[href="index.html#contact"]', key: 'navContact' },
    { selector: 'a[href="order-history.html"]', key: 'navOrderHistory' }
  ];

  navMappings.forEach(({ selector, key }) => {
    document.querySelectorAll(`.nav-links ${selector}, .mobile-menu ${selector}`).forEach(link => {
      link.textContent = content[key] || defaults[key] || '';
    });
  });

  // Nav CTA
  const navCta = document.querySelector('.nav-cta .btn-primary');
  if (navCta) {
    navCta.textContent = content.navCtaText || defaults.navCtaText;
  }

  // Hero section
  const heroLabel = document.querySelector('.hero .hero-label');
  if (heroLabel) {
    heroLabel.innerHTML = `<span class="dot"></span>${content.heroBadge || defaults.heroBadge}`;
  }

  const heroTitle = document.querySelector('.hero h1');
  if (heroTitle) {
    heroTitle.innerHTML = '';
    const headingLine = document.createElement('span');
    headingLine.textContent = content.heroHeading || defaults.heroHeading;
    heroTitle.appendChild(headingLine);
    heroTitle.appendChild(document.createElement('br'));
    const highlight = document.createElement('span');
    highlight.className = 'italic';
    highlight.textContent = content.heroHighlight || defaults.heroHighlight;
    heroTitle.appendChild(highlight);
  }

  const heroLead = document.querySelector('.hero .lead');
  if (heroLead) heroLead.textContent = content.heroLead || defaults.heroLead;

  const heroButtons = document.querySelectorAll('.hero .hero-actions a');
  if (heroButtons.length > 0) {
    heroButtons[0].textContent = content.heroPrimaryBtn || defaults.heroPrimaryBtn;
  }
  const heroSecondary = document.querySelector('.hero .hero-actions .link-arrow');
  if (heroSecondary) {
    heroSecondary.innerHTML = `${content.heroSecondaryBtn || defaults.heroSecondaryBtn} <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M13 6l6 6-6 6"/></svg>`;
  }

  // Featured section
  setText('#featured .section-head .eyebrow', content.featuredEyebrow, defaults.featuredEyebrow);
  setText('#featured .section-head h2', content.featuredTitle, defaults.featuredTitle);
  setText('#featured .section-head p', content.featuredDescription, defaults.featuredDescription);
  setText('#featured .btn-outline', content.featuredButton, defaults.featuredButton);

  // About section
  setText('#about .section-head .eyebrow', content.aboutEyebrow, defaults.aboutEyebrow);
  setText('#about .section-head h2', content.aboutTitle || content.aboutHeading, defaults.aboutTitle);
  setText('#about .section-head p', content.aboutDescription || content.aboutText, defaults.aboutDescription);

  const aboutCards = document.querySelectorAll('#about .why-card');
  const cardTitles = [
    content.aboutCard1Title, content.aboutCard2Title,
    content.aboutCard3Title, content.aboutCard4Title
  ];
  const cardTexts = [
    content.aboutCard1Text, content.aboutCard2Text,
    content.aboutCard3Text, content.aboutCard4Text
  ];
  aboutCards.forEach((card, index) => {
    const title = card.querySelector('h4');
    const text = card.querySelector('p');
    if (title) title.textContent = cardTitles[index] || defaults[`aboutCard${index + 1}Title`] || '';
    if (text) text.textContent = cardTexts[index] || defaults[`aboutCard${index + 1}Text`] || '';
  });

  // Contact section
  setText('#contact .contact-wrap .eyebrow', content.contactEyebrow, defaults.contactEyebrow);
  setText('#contact .contact-wrap h2', content.contactTitle || content.contactHeading, defaults.contactTitle);

  const contactItems = document.querySelectorAll('#contact .contact-item');
  const contactItemTitles = [content.contactItem1Title, content.contactItem2Title, content.contactItem3Title];
  const contactItemTexts = [content.contactItem1Text, content.contactItem2Text, content.contactItem3Text];
  contactItems.forEach((item, index) => {
    const title = item.querySelector('.contact-copy strong');
    const text = item.querySelector('.contact-copy span');
    if (title) title.textContent = contactItemTitles[index] || defaults[`contactItem${index + 1}Title`] || '';
    if (text) text.textContent = contactItemTexts[index] || defaults[`contactItem${index + 1}Text`] || '';
  });

  setText('#contact .contact-card h3', content.contactCardTitle || content.contactTitle, defaults.contactCardTitle);
  setText('#contact .contact-card p', content.contactCardText || content.contactText, defaults.contactCardText);
  setText('#contact .contact-card .btn', content.contactButton, defaults.contactButton);

  // Footer
  setText('.site-footer .footer-grid > div > p', content.footerIntro, defaults.footerIntro);

  const footerColumns = document.querySelectorAll('.site-footer .footer-col');
  if (footerColumns[0]) {
    setTextChild(footerColumns[0], 'h4', content.footerExploreHeading, defaults.footerExploreHeading);
    const exploreLinks = footerColumns[0].querySelectorAll('a');
    const exploreKeys = ['footerExploreHome', 'footerExploreProducts', 'footerExploreAbout', 'footerExploreContact'];
    exploreLinks.forEach((link, i) => {
      if (exploreKeys[i]) link.textContent = content[exploreKeys[i]] || defaults[exploreKeys[i]] || '';
    });
  }
  if (footerColumns[1]) {
    setTextChild(footerColumns[1], 'h4', content.footerCategoriesHeading, defaults.footerCategoriesHeading);
    const catLinks = footerColumns[1].querySelectorAll('a');
    const catKeys = ['footerCategoriesSkincare', 'footerCategoriesMakeup', 'footerCategoriesBags'];
    catLinks.forEach((link, i) => {
      if (catKeys[i]) link.textContent = content[catKeys[i]] || defaults[catKeys[i]] || '';
    });
  }
  if (footerColumns[2]) {
    setTextChild(footerColumns[2], 'h4', content.footerContactHeading, defaults.footerContactHeading);
    const contactLinks = footerColumns[2].querySelectorAll('a');
    const contactKeys = ['footerContactMessenger', 'footerContactEmail', 'footerContactAdmin'];
    contactLinks.forEach((link, i) => {
      if (contactKeys[i]) link.textContent = content[contactKeys[i]] || defaults[contactKeys[i]] || '';
    });
  }

  const footerBottom = document.querySelectorAll('.site-footer .footer-bottom span');
  if (footerBottom[0]) footerBottom[0].textContent = content.footerCopyright || defaults.footerCopyright;
  if (footerBottom[1]) footerBottom[1].textContent = content.footerTagline || defaults.footerTagline;
  renderFooterCategoryLinks();
}

function setText(selector, contentVal, defaultVal) {
  const el = document.querySelector(selector);
  if (el) el.textContent = contentVal || defaultVal || '';
}

function setTextChild(parent, childSelector, contentVal, defaultVal) {
  const el = parent.querySelector(childSelector);
  if (el) el.textContent = contentVal || defaultVal || '';
}


// --- products ---
/* =================================================================
   JJ — Product rendering (cards, featured, products page, details)
   ================================================================= */




/* ---------- Product Card Render ---------- */
function renderProductCard(p, toneIndex, topRank = 0) {
  const tone = toneIndex % 2 === 0 ? "tone-a" : "tone-b";
  const mediaContent = p.image
    ? `<img src="${p.image}" alt="${p.name}" loading="lazy" style="width:100%;height:100%;object-fit:cover;display:block;">`
    : getIcon(p.icon);
  const rankBadge = topRank > 0
    ? `<span class="badge-rank rank-${topRank}"><span class="fire">🔥</span>Top ${topRank}</span>`
    : "";

  const categoryLabels = getMergedCategoryLabels();
  return `
  <article class="card-product" data-id="${p.id}" data-category="${p.category}" data-name="${p.name.toLowerCase()}">
    <a href="./product-details.html?id=${p.id}" class="card-media ${tone}" aria-label="View ${p.name}">
      <span class="badge-cat">${categoryLabels[p.category] || p.category}</span>
      <span class="badge-stock ${p.stock}"><span class="dot"></span>${STOCK_LABELS[p.stock]}</span>
      ${rankBadge}
      ${mediaContent}
    </a>
    <div class="card-body">
      <h4><a href="./product-details.html?id=${p.id}">${p.name}</a></h4>
      <p class="card-desc">${p.short}</p>
            <div class="card-price-row">
        <span class="card-price">${p.discount && p.discount.percentage > 0 ? `<span style="text-decoration:line-through; color:var(--ink-faint); font-size:0.8em;">₱${Number(p.price).toFixed(2)}</span> ₱${Number(p.discount.discountedPrice).toFixed(2)}` : `₱${Number(p.price || 0).toFixed(2)}`}</span>
      </div>
      <div class="card-actions">
        <a class="btn btn-outline" href="./product-details.html?id=${p.id}">View Details</a>
        <button class="btn btn-primary btn-sm add-to-cart-btn" data-id="${p.id}" type="button"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg> Add to Cart</button>
      </div>
    </div>
  </article>`;
}

/* ---------- Top Rank Map ---------- */
function getTopRankMap(products) {
  const sorted = products.slice().filter(Boolean).sort((a, b) => {
    const aCount = Number(a.salesCount || 0);
    const bCount = Number(b.salesCount || 0);
    if (bCount !== aCount) return bCount - aCount;
    return a.name.localeCompare(b.name);
  });
  return sorted.slice(0, 3).reduce((map, product, index) => {
    map[product.id] = index + 1;
    return map;
  }, {});
}

/* ---------- Featured Products (Homepage) ---------- */
function initFeaturedProducts() {
  const grid = document.querySelector("#featured-grid");
  if (!grid) return;

  const products = getProducts();
  const items = products.filter(Boolean);
  if (!items.length) {
    grid.innerHTML = '<div class="empty-state show"><h4>No products yet</h4><p>Add products from the admin dashboard to see them here.</p></div>';
    return;
  }

  const rankMap = getTopRankMap(items);
  const sorted = items.slice().sort((a, b) => {
    const aCount = Number(a.salesCount || 0);
    const bCount = Number(b.salesCount || 0);
    if (bCount !== aCount) return bCount - aCount;
    return a.name.localeCompare(b.name);
  });

  const featured = sorted.slice(0, 6);
  grid.innerHTML = featured.map((p, i) => renderProductCard(p, i, rankMap[p.id] || 0)).join("");
}

/* ---------- Products Page ---------- */
function initProductsPage() {
  const grid = document.querySelector("#products-grid");
  if (!grid) return;

  const products = getProducts();
  const categoryLabels = getMergedCategoryLabels();
  const searchInput = document.querySelector("#product-search");
  const pillsContainer = document.querySelector(".filter-pills");
  const emptyState = document.querySelector(".empty-state");
  const resultsCount = document.querySelector("#results-count");
  const topSellersGrid = document.querySelector("#top-sellers-grid");
  const suggestionBox = document.querySelector("#search-suggestions");

  let activeCategory = "all";

  function renderCategoryPills() {
    if (!pillsContainer) return;
    pillsContainer.innerHTML = `<button class="pill active" data-category="all">All</button>` +
      Object.entries(categoryLabels)
        .map(([value, label]) => `<button class="pill" data-category="${value}">${label}</button>`)
        .join("");
  }

  renderCategoryPills();
  const pills = pillsContainer ? pillsContainer.querySelectorAll(".pill") : [];

  function getSearchMatches(term) {
    const normalized = (term || "").trim().toLowerCase();
    if (!normalized) {
      return products.filter(p => activeCategory === "all" || p.category === activeCategory);
    }
    if (normalized.length === 1) {
      return products.filter(p => {
        const name = (p.name || "").toLowerCase();
        return (activeCategory === "all" || p.category === activeCategory) && name.startsWith(normalized);
      }).sort((a, b) => a.name.localeCompare(b.name));
    }
    const results = products.filter(p => {
      const name = (p.name || "").toLowerCase();
      const short = (p.short || "").toLowerCase();
      return (activeCategory === "all" || p.category === activeCategory) && (name.includes(normalized) || short.includes(normalized));
    });
    const scored = results.map(p => {
      const name = (p.name || "").toLowerCase();
      const short = (p.short || "").toLowerCase();
      let score = 0;
      if (name.startsWith(normalized)) score += 30;
      if (name.includes(normalized)) score += 20;
      if (short.includes(normalized)) score += 10;
      return { p, score };
    });
    scored.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      const aCount = Number(a.p.salesCount || 0);
      const bCount = Number(b.p.salesCount || 0);
      if (bCount !== aCount) return bCount - aCount;
      return a.p.name.localeCompare(b.p.name);
    });
    return scored.map(s => s.p);
  }

  function renderSuggestions(term) {
    if (!suggestionBox) return;
    const normalized = (term || "").trim().toLowerCase();
    if (!normalized || normalized.length < 1) {
      suggestionBox.innerHTML = "";
      suggestionBox.classList.remove("show");
      return;
    }
    const matches = products.filter(p => {
      const name = (p.name || "").toLowerCase();
      return (activeCategory === "all" || p.category === activeCategory) && name.startsWith(normalized);
    }).slice(0, 5);

    if (!matches.length) {
      suggestionBox.innerHTML = "";
      suggestionBox.classList.remove("show");
      return;
    }
    suggestionBox.innerHTML = matches.map(p => `
      <button type="button" class="suggestion-item" data-suggestion="${p.name}" data-product-id="${p.id}">
        <span>${p.name}</span>
        <span>${categoryLabels[p.category] || ""}</span>
      </button>
    `).join("");
    suggestionBox.querySelectorAll(".suggestion-item").forEach(btn => {
      btn.addEventListener("mousedown", (event) => {
        event.preventDefault();
        const productId = btn.dataset.productId;
        searchInput.value = btn.dataset.suggestion || btn.textContent.trim();
        suggestionBox.classList.remove("show");
        if (productId) {
          window.location.href = `./product-details.html?id=${productId}`;
          return;
        }
        paint();
      });
    });
    suggestionBox.classList.add("show");
  }

  function paint() {
    const term = (searchInput.value || "").trim().toLowerCase();
    const filtered = getSearchMatches(term);
    renderSuggestions(term);
    const rankMap = getTopRankMap(products);
    const topSellers = products.slice().filter(Boolean).sort((a, b) => {
      const aCount = Number(a.salesCount || 0);
      const bCount = Number(b.salesCount || 0);
      if (bCount !== aCount) return bCount - aCount;
      return a.name.localeCompare(b.name);
    }).slice(0, 3);
    const topSellerIds = topSellers.map(p => String(p.id));

    grid.innerHTML = filtered
      .filter(p => !topSellerIds.includes(String(p.id)))
      .map((p, i) => renderProductCard(p, i, rankMap[p.id] || 0))
      .join("");

    if (topSellersGrid) {
      topSellersGrid.innerHTML = topSellers.map((p, i) => renderProductCard(p, i, i + 1)).join("");
      bindTopSellerBadgeClicks();
    }
    if (emptyState) emptyState.classList.toggle("show", filtered.length === 0);
    if (resultsCount) resultsCount.innerHTML = `Showing <strong>${filtered.length}</strong> of <strong>${products.length}</strong> products`;
  }

  if (searchInput) {
    searchInput.addEventListener("input", paint);
    searchInput.addEventListener("focus", () => renderSuggestions(searchInput.value));
    searchInput.addEventListener("blur", () => setTimeout(() => suggestionBox?.classList.remove("show"), 140));
  }

  pills.forEach(pill => {
    pill.addEventListener("click", () => {
      pills.forEach(p => p.classList.remove("active"));
      pill.classList.add("active");
      activeCategory = pill.dataset.category;
      paint();
    });
  });

  // Honor ?category= deep link
  const params = new URLSearchParams(window.location.search);
  const cat = params.get("category");
  if (cat && categoryLabels[cat]) {
    activeCategory = cat;
    pills.forEach(p => p.classList.toggle("active", p.dataset.category === cat));
  }

  paint();

  function bindTopSellerBadgeClicks() {
    if (!topSellersGrid) return;
    topSellersGrid.querySelectorAll('.badge-rank').forEach(badge => {
      badge.style.cursor = 'pointer';
      badge.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        const card = badge.closest('.card-product');
        if (!card) return;
        const productId = card.dataset.id;
        if (!productId) return;
        const target = document.querySelector(`#products-grid .card-product[data-id="${productId}"]`);
        if (!target) return;
        target.scrollIntoView({ behavior: 'smooth', block: 'center' });
        target.classList.add('highlighted');
        setTimeout(() => target.classList.remove('highlighted'), 2200);
      });
    });
  }
}

/* ---------- Product Details Page ---------- */
function initProductDetailsPage() {
  const wrap = document.querySelector("#detail-wrap");
  if (!wrap) return;

  const products = getProducts();
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  const product = products.find(p => String(p.id) === String(id)) || products[0];
  if (!product) return;

  const bullets = Array.isArray(product.bullets) ? product.bullets : [];

  document.title = `${product.name} — JJ`;
  const breadcrumb = document.querySelector("#breadcrumb-current");
  if (breadcrumb) breadcrumb.textContent = product.name;

  const media = document.querySelector("#detail-media");
  if (media) {
    media.innerHTML = product.image
      ? `<img src="${product.image}" alt="${product.name}" style="width:100%;height:100%;object-fit:cover;display:block;">`
      : getIcon(product.icon || "jar");
  }

  const detailCategoryLabels = getMergedCategoryLabels();
  setText("#detail-category", detailCategoryLabels[product.category] || product.category);
  setText("#detail-name", product.name);
  const detailPriceEl = document.querySelector("#detail-price");
  if (detailPriceEl) {
    if (product.discount && product.discount.percentage > 0) {
      detailPriceEl.innerHTML = `<span style="text-decoration:line-through; color:var(--ink-faint); font-size:0.8em;">₱${Number(product.price).toFixed(2)}</span> ₱${Number(product.discount.discountedPrice).toFixed(2)} <span style="background:var(--rose-deep); color:white; padding:2px 8px; border-radius:999px; font-size:.7rem; font-weight:700; vertical-align:middle;">-${product.discount.percentage}%</span>`;
    } else {
      detailPriceEl.textContent = `₱${Number(product.price || 0).toFixed(2)}`;
    }
  }

  const stockBadge = document.querySelector("#detail-stock");
  if (stockBadge) {
    stockBadge.className = `badge-stock ${product.stock}`;
    stockBadge.innerHTML = `<span class="dot"></span>${STOCK_LABELS[product.stock] || product.stock}`;
  }

  setText("#detail-description", product.description || product.short || "No description provided.");

  const bulletsEl = document.querySelector("#detail-bullets");
  if (bulletsEl) {
    bulletsEl.innerHTML = bullets.map(b => `
      <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>${b}</li>
    `).join("");
  }

    const orderBtn = document.querySelector("#detail-order-btn");
  if (orderBtn) {
    orderBtn.href = '#';
    orderBtn.dataset.id = product.id;
    orderBtn.classList.add('order-now');
    if (product.stock === "out") orderBtn.textContent = "Ask to Be Notified";
  }

  // Wire detail page "Add to Cart" button
  const detailAddToCart = document.getElementById("detail-add-to-cart-btn");
  if (detailAddToCart) {
    detailAddToCart.addEventListener("click", function(e) {
      e.preventDefault();
      if (product.stock === "out") {
        showToast("This product is currently out of stock.");
        return;
      }
      addToCart(product);
    });
  }

  // Related products (same category, excluding current)
  const related = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 3);
  const relatedGrid = document.querySelector("#related-grid");
  const relatedStrip = document.querySelector(".related-strip");
  const rankMap = getTopRankMap(products);

  if (related.length && relatedGrid) {
    relatedGrid.innerHTML = related.map((p, i) => renderProductCard(p, i, rankMap[p.id] || 0)).join("");
  } else if (relatedStrip) {
    relatedStrip.style.display = "none";
  }
}

function setText(selector, text) {
  const el = document.querySelector(selector);
  if (el) el.textContent = text || '';
}


// --- order ---
/* =================================================================
   JJ — Order receipt modal, order-now handlers, order history page
   ================================================================= */



/* ---------- Create receipt modal (lazy, once) ---------- */
function createReceiptModal() {
  if (document.querySelector('#receipt-modal')) return;

  const wrap = document.createElement('div');
  wrap.id = 'receipt-modal';
  wrap.className = 'modal-overlay';
  wrap.innerHTML = `
    <div class="modal">
      <div class="modal-head">
        <div>
          <h3>Order Receipt</h3>
          <p>Enter your details, quantity, and optional note to prepare your order.</p>
        </div>
        <button class="modal-close" data-receipt-close aria-label="Close">✕</button>
      </div>
      <div style="margin-top:6px;">
        <div class="form-group">
          <label>Messenger Name</label>
          <input id="rcpt-messenger" placeholder="Your Messenger name (e.g. @username)">
        </div>
        <div class="form-group">
          <label>Product</label>
          <input id="rcpt-product" readonly>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Quantity</label>
            <input id="rcpt-quantity" type="number" min="1" value="1">
          </div>
          <div class="form-group">
            <label>Note</label>
            <input id="rcpt-note" placeholder="Optional note">
          </div>
        </div>
        <div class="form-group">
          <label>Total</label>
          <div id="rcpt-total" style="font-weight:700;">₱0.00</div>
        </div>
        <div style="display:flex; gap:10px; margin-top:12px;">
          <button class="btn btn-outline" data-receipt-close>Cancel</button>
          <button class="btn btn-primary" id="rcpt-generate">Generate Receipt</button>
        </div>
        <div style="margin-top:12px; color:var(--ink-soft); font-size:.95rem;">
          <label style="display:block; margin-bottom:6px; font-weight:700;">Prepared Message</label>
                    <textarea id="rcpt-preview-text" rows="6" style="width:100%; padding:10px; border-radius:8px; border:1px solid var(--line); font-family:inherit;" readonly></textarea>
          <p style="margin-top:10px; color:var(--ink-soft); font-size:.9rem;">Review the message above, then confirm to copy it and open Messenger.</p>
          <button class="btn btn-primary btn-block" id="rcpt-open-messenger" style="display:none; margin-top:10px;">Confirm &amp; Open Messenger</button>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(wrap);

  // Close handlers
  wrap.addEventListener('click', (e) => {
    if (e.target === wrap || e.target.closest('[data-receipt-close]')) {
      wrap.classList.remove('open');
    }
  });

    // Quantity change updates total
  document.getElementById('rcpt-quantity').addEventListener('input', () => {
    const pr = parseFloat(document.getElementById('rcpt-product').dataset.price || 0);
    updateTotalDisplay(pr);
  });
}

/* ---------- Open receipt modal for a product ---------- */
function openReceiptModalForProduct(product) {
  if (product.stock === 'out') {
    showToast('This product is out of stock and cannot be ordered.');
    return;
  }
  const wrap = document.querySelector('#receipt-modal');
  if (!wrap) return;

  wrap.classList.add('open');
  document.getElementById('rcpt-product').value = product.name;
  document.getElementById('rcpt-product').dataset.price = product.price || 0;

  const qtyInput = document.getElementById('rcpt-quantity');
  qtyInput.value = 1;
  qtyInput.min = 1;
  qtyInput.max = Number(product.quantity || 1);
  document.getElementById('rcpt-note').value = '';

  // Reset to the "not yet generated" state
  const genBtn = document.getElementById('rcpt-generate');
  const openBtn = document.getElementById('rcpt-open-messenger');
  const previewText = document.getElementById('rcpt-preview-text');
  genBtn.style.display = '';
  genBtn.disabled = false;
  openBtn.style.display = 'none';
  previewText.value = '';

  updateTotalDisplay(product.price || 0);

  genBtn.onclick = function () {
    generateReceipt(product);
  };
  openBtn.onclick = function () {
    confirmSendReceipt(product);
  };
}

/* ---------- Update total display ---------- */
function updateTotalDisplay(price) {
  const qty = parseInt(document.getElementById('rcpt-quantity').value, 10) || 1;
  const total = (price * qty).toFixed(2);
  document.getElementById('rcpt-total').textContent = `₱${total}`;
}

/* ---------- Generate receipt (review step — does NOT open Messenger yet) ---------- */
async function generateReceipt(product) {
  const messenger = (document.getElementById('rcpt-messenger').value || '').trim();
  const qty = parseInt(document.getElementById('rcpt-quantity').value, 10) || 1;
  const note = (document.getElementById('rcpt-note').value || '').trim();

  if (product.stock === 'out') {
    showToast('This product is out of stock and cannot be ordered.');
    return;
  }
  if (!messenger) { showToast('Please enter your Messenger name'); return; }
  if (qty <= 0) { showToast('Please select at least one item'); return; }

  const available = Number(product.quantity || 0);
  if (qty > available) {
    showToast(`Only ${available} item${available === 1 ? '' : 's'} available. Please reduce quantity.`);
    return;
  }

  const unit = product.price || 0;
  const total = (unit * qty).toFixed(2);
  const message = `Hello! I would like to order the following:\n\nMessenger Name:\n${messenger}\n\nProduct:\n${product.name}\n\nQuantity:\n${qty}\n\nNote:\n${note || '-'}\n\nTotal:\n₱${total}\n\nThank you!`;

  const previewText = document.getElementById('rcpt-preview-text');
  if (previewText) previewText.value = message;

  // Update product stock in localStorage
  const products = getProducts();
  const productIndex = products.findIndex((p) => String(p.id) === String(product.id));
  if (productIndex !== -1) {
    const updatedQuantity = Math.max(0, Number(products[productIndex].quantity || 0) - qty);
    products[productIndex].quantity = updatedQuantity;
    products[productIndex].stock = getStockFromQuantity(updatedQuantity);
    products[productIndex].salesCount = (products[productIndex].salesCount || 0) + qty;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    window.dispatchEvent(new Event('products-updated'));
  }

  // Save order history
  const order = {
    orderId: `JJ-${Date.now()}`,
    createdAt: new Date().toISOString(),
    orderDate: new Date().toISOString(),
    status: 'Pending',
    items: [{ productId: product.id, name: product.name, quantity: qty, unitPrice: unit, totalPrice: Number(total) }],
    totalPrice: Number(total)
  };
  appendOrderHistory(order);

  // Reveal the receipt for review — do not redirect yet
  const genBtn = document.getElementById('rcpt-generate');
  const openBtn = document.getElementById('rcpt-open-messenger');
  if (genBtn) genBtn.style.display = 'none';
  if (openBtn) openBtn.style.display = '';
  showToast('Receipt ready — review it, then confirm to open Messenger.');
}

/* ---------- Confirm & send: only runs after the user has reviewed the receipt ---------- */
async function confirmSendReceipt(product) {
  const message = (document.getElementById('rcpt-preview-text')?.value || '').trim();
  if (!message) return;

  try {
    await navigator.clipboard.writeText(message);
    showToast('Message copied to clipboard');
  } catch {
    fallbackSelectAndCopy('rcpt-preview-text');
  }

  window.open(MESSENGER_URL, '_blank');
  const wrap = document.querySelector('#receipt-modal');
  if (wrap) wrap.classList.remove('open');
}

/* ---------- Fallback copy ---------- */
function fallbackSelectAndCopy(textareaId) {
  try {
    const ta = document.getElementById(textareaId);
    ta.focus(); ta.select();
    const ok = document.execCommand('copy');
    if (ok) showToast('Message copied to clipboard');
    else showToast('Copy failed — please select and copy manually');
  } catch (e) {
    showToast('Copy failed — please select and copy manually');
  }
}

/* ---------- Init order-now handlers ---------- */
function initOrderNowHandlers() {
  document.body.addEventListener('click', (e) => {
    const btn = e.target.closest('.order-now');
    if (!btn) return;
    e.preventDefault();

    const art = btn.closest('.card-product');
    let id = art ? art.dataset.id : (btn.dataset.id || null);
    if (!id) id = btn.dataset.id || null;

    const products = getProducts();
    const product = products.find(p => String(p.id) === String(id)) || products[0];
    if (!product) return;

    if (product.stock === 'out') {
      showToast('This product is out of stock and cannot be ordered.');
      return;
    }
    openReceiptModalForProduct(product);
  });
}

/* ---------- Order History Page ---------- */
function initOrderHistoryPage() {
  const wrap = document.querySelector('#order-history-wrap');
  if (!wrap) return;

  const list = wrap.querySelector('#order-history-list');
  const emptyState = wrap.querySelector('.order-history-empty');
  const clearBtn = wrap.querySelector('#clear-order-history-btn');
  const countLabel = wrap.querySelector('#order-history-count');

  function renderHistory() {
    const history = loadOrderHistory().slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    if (countLabel) countLabel.textContent = history.length;

    if (!history.length) {
      if (list) list.innerHTML = '';
      if (emptyState) emptyState.classList.add('show');
      if (clearBtn) clearBtn.disabled = true;
      return;
    }

    if (emptyState) emptyState.classList.remove('show');
    if (clearBtn) clearBtn.disabled = false;

    if (list) {
      list.innerHTML = history.map(order => {
        const itemCount = order.items.length;
        const itemsHTML = order.items.map(item => `
          <div class="order-line order-item-row">
            <div class="order-item-name">${item.name || 'Product'}</div>
            <div class="order-item-qty">${item.quantity || 0} × ₱${Number(item.unitPrice || 0).toFixed(2)}</div>
            <div class="order-item-total">₱${Number(item.totalPrice || 0).toFixed(2)}</div>
          </div>
        `).join('');

        return `
          <details class="order-card">
            <summary class="order-card-head">
              <div>
                <div class="order-id">Order ${order.orderId}</div>
                <div class="order-date">${formatOrderDate(order.orderDate)}</div>
              </div>
              <div class="order-summary">
                <span>${itemCount} item${itemCount === 1 ? '' : 's'}</span>
                <span class="order-total">₱${Number(order.totalPrice || 0).toFixed(2)}</span>
                <span class="order-status">${order.status}</span>
              </div>
            </summary>
            <div class="order-card-body">
              ${itemsHTML}
            </div>
          </details>
        `;
      }).join('');
    }
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (!confirm('Clear your saved order history? This cannot be undone.')) return;
      saveOrderHistory([]);
      renderHistory();
      showToast('Order history cleared.');
    });
  }

  renderHistory();
}


// --- admin-auth ---
/* =================================================================
   JJ — Admin authentication (login, password management, logout)
   ================================================================= */



function initAdminAuth() {
  const shell = document.querySelector(".admin-shell");
  if (!shell) return;

  // Inject login styles
  if (!document.querySelector('#admin-login-style')) {
    const style = document.createElement("style");
    style.id = 'admin-login-style';
    style.textContent = `
      .admin-shell { display: none; }
      .admin-login-overlay {
        position: fixed;
        inset: 0;
        background: rgba(20, 20, 20, 0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
        z-index: 9999;
      }
      .admin-login-card {
        width: min(100%, 360px);
        background: #fff;
        border-radius: 18px;
        box-shadow: 0 18px 45px rgba(0, 0, 0, 0.2);
        padding: 28px;
      }
      .admin-login-card h2 { margin: 0 0 8px; font-size: 1.35rem; color: #222; }
      .admin-login-card p { margin: 0 0 16px; color: #666; font-size: 0.95rem; }
      .admin-login-card input {
        width: 100%; padding: 12px 14px; border: 1px solid #ddd;
        border-radius: 10px; margin-bottom: 10px; font-size: 1rem; box-sizing: border-box;
      }
      .admin-login-card button {
        width: 100%; padding: 12px 14px; border: none; border-radius: 10px;
        background: #BE5777; color: #fff; font-size: 1rem; cursor: pointer;
      }
      .admin-login-error { min-height: 1.2rem; margin-top: 8px; color: #b33939; font-size: 0.9rem; }
    `;
    document.head.appendChild(style);
  }

  function isAuthenticated() {
    return sessionStorage.getItem(AUTH_STORAGE_KEY) === "true";
  }

    function getSavedAdminPassword() {
    try {
      const stored = localStorage.getItem(ADMIN_PASSWORD_KEY);
      if (stored && stored.length >= 4) return stored;
    } catch (e) { /* ignore */ }
    return DEFAULT_ADMIN_PASSWORD;
  }

  const RESET_SECURITY_KEY = "jjcosmetics2026";

  function setSavedAdminPassword(newPassword) {
    localStorage.setItem(ADMIN_PASSWORD_KEY, newPassword);
  }

  // Create login overlay
  const overlay = document.createElement("div");
  overlay.className = "admin-login-overlay";
  overlay.innerHTML = `
    <div class="admin-login-card">
      <h2>Admin Login</h2>
      <p>Enter the password to access the dashboard.</p>
            <form id="admin-login-form">
        <input type="password" id="admin-password" name="password" placeholder="Password" autocomplete="current-password" required>
        <div style="display:flex; gap:8px; margin-top:8px;">
          <button type="button" id="admin-back-btn" class="btn btn-ghost" style="flex:1;">Back</button>
          <button type="submit" class="btn btn-primary" style="flex:1;">Enter</button>
        </div>
                                <div style="margin-top:10px;">
          <button type="button" id="forgot-password-btn" class="btn btn-ghost" style="width:100%;">Forgot Password</button>
        </div>
        <div style="margin-top:8px;">
          <button type="button" id="reset-password-btn" class="btn btn-primary" style="width:100%; background:#f44336;">Reset to Default Password</button>
        </div>
        <div class="admin-login-error" id="admin-login-error"></div>
      </form>
    </div>
  `;
  document.body.prepend(overlay);

  // Password action overlay (change/forgot)
  const passwordOverlay = document.createElement('div');
  passwordOverlay.className = 'admin-login-overlay';
  passwordOverlay.style.display = 'none';
  document.body.appendChild(passwordOverlay);

  function showPasswordModal(mode) {
    passwordOverlay.innerHTML = `
      <div class="admin-login-card">
        <h2>${mode === 'change' ? 'Change Password' : 'Forgot Password'}</h2>
        <p>${mode === 'change' ? 'Enter your current password and choose a new password.' : 'Contact support to reset the admin password.'}</p>
        <form id="admin-password-action-form">
          ${mode === 'change' ? `
            <input type="password" id="current-password" name="currentPassword" placeholder="Current password" autocomplete="current-password" required>
            <input type="password" id="new-password" name="newPassword" placeholder="New password (min 4 chars)" autocomplete="new-password" required>
            <input type="password" id="confirm-password" name="confirmPassword" placeholder="Confirm new password" autocomplete="new-password" required>
                        <div style="display:flex; gap:8px; margin-top:8px;">
              <button type="button" id="password-modal-cancel" class="btn btn-ghost" style="flex:1;">Cancel</button>
              <button type="submit" class="btn btn-primary" style="flex:1;">Save Password</button>
            </div>
          ` : `
            <div style="padding: 12px 0; color:#333;">If you forgot the admin password, please contact the system administrator to reset it.</div>
            <div style="display:flex; gap:8px; margin-top:8px;">
              <button type="button" id="password-modal-cancel" class="btn btn-ghost" style="flex:1;">Close</button>
            </div>
          `}
          <div class="admin-login-error" id="password-action-error"></div>
        </form>
      </div>
    `;
    passwordOverlay.style.display = 'flex';

    const passwordForm = document.getElementById('admin-password-action-form');
    const actionError = document.getElementById('password-action-error');
    const cancelBtn = document.getElementById('password-modal-cancel');

    cancelBtn.addEventListener('click', () => {
      passwordOverlay.style.display = 'none';
      if (actionError) actionError.textContent = '';
    });

    passwordForm.addEventListener('submit', (event) => {
      event.preventDefault();
      if (actionError) actionError.textContent = '';

      if (mode === 'change') {
        const currentPassword = document.getElementById('current-password').value.trim();
        const newPassword = document.getElementById('new-password').value.trim();
        const confirmPassword = document.getElementById('confirm-password').value.trim();

        if (currentPassword !== getSavedAdminPassword() && currentPassword !== RESET_SECURITY_KEY) {
          if (actionError) actionError.textContent = 'Current password is incorrect.';
          return;
        }
        if (newPassword.length < 4) {
          if (actionError) actionError.textContent = 'New password must be at least 4 characters.';
          return;
        }
        if (newPassword !== confirmPassword) {
          if (actionError) actionError.textContent = 'Passwords do not match.';
          return;
        }
        setSavedAdminPassword(newPassword);
        passwordOverlay.style.display = 'none';
        showToast('Password changed successfully.');
      }
    });
  }

  // Expose for sidebar "Change Password" click
  window.openChangePasswordModal = function () {
    if (!isAuthenticated()) {
      showToast('Log in first to change the password.');
      return;
    }
    showPasswordModal('change');
  };

  // Wire sidebar change password
  setTimeout(() => {
    const sidebarChangePassword = document.getElementById('admin-change-password');
    if (sidebarChangePassword) {
      sidebarChangePassword.addEventListener('click', (event) => {
        event.preventDefault();
        window.openChangePasswordModal();
      });
    }
  }, 50);

  
  // Check auth state
  if (!isAuthenticated()) {
    overlay.style.display = "flex";
    shell.style.display = "none";
  } else {
    overlay.remove();
    shell.style.display = "flex";
  }

  // ---- Logout: expose globally and wire sidebar button ----
  // NOTE: This MUST come before the login form wiring below because when
  // already authenticated, the overlay is removed and the form is null.
  window.logoutAdmin = function () {
    try { sessionStorage.removeItem(AUTH_STORAGE_KEY); } catch (e) { /* ignore */ }
    window.location.href = 'index.html';
  };

  // Wire sidebar logout button via DOM listener (more reliable than inline onclick)
  setTimeout(() => {
    const logoutBtn = document.getElementById('admin-logout');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.logoutAdmin();
      });
    }
  }, 50);

  // ---- Login form wiring (only if overlay form is still in the DOM) ----
  const form = document.getElementById("admin-login-form");
  if (form) {
    const passwordInput = document.getElementById("admin-password");
    const error = document.getElementById("admin-login-error");

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const enteredPassword = passwordInput.value.trim();
      if (enteredPassword === getSavedAdminPassword()) {
        sessionStorage.setItem(AUTH_STORAGE_KEY, "true");
        overlay.remove();
        shell.style.display = "flex";
      } else {
        if (error) error.textContent = "Incorrect password. Please try again.";
        passwordInput.value = "";
        passwordInput.focus();
      }
    });

        // Forgot password
    const forgotBtn = document.getElementById('forgot-password-btn');
    if (forgotBtn) {
      forgotBtn.addEventListener('click', () => showPasswordModal('forgot'));
    }

        // Reset to default password — requires security key
        const resetBtn = document.getElementById('reset-password-btn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        const key = prompt('🔐 Enter security key to reset password:');
        if (key === null) return; // user cancelled
        if (key.trim() !== RESET_SECURITY_KEY) {
          if (error) error.textContent = 'Incorrect security key. Reset denied.';
          return;
        }
        localStorage.removeItem(ADMIN_PASSWORD_KEY);
        if (error) error.textContent = 'Password reset to "' + DEFAULT_ADMIN_PASSWORD + '". You can now log in.';
        passwordInput.value = '';
        passwordInput.focus();
      });
    }

    // Change password from overlay — works before login too
    const changePasswordOverlayBtn = document.getElementById('change-password-sidebar-btn');
    if (changePasswordOverlayBtn) {
      changePasswordOverlayBtn.addEventListener('click', () => {
        showPasswordModal('change');
      });
    }

    // Back button
    const backBtn = document.getElementById('admin-back-btn');
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        try {
          if (window.history.length > 1) window.history.back();
          else window.location.href = 'index.html';
        } catch (e) {
          window.location.href = 'index.html';
        }
      });
    }
  }
}

// --- admin-homepage ---
/* =================================================================
   JJ — Admin Homepage Editor
   ================================================================= */


function initHomepageEditor() {
  const homepageForm = document.getElementById('homepage-editor-form');
  if (!homepageForm) return;

  const homepageSaveStatus = document.getElementById('homepage-save-status');

  function populateHomepageForm() {
    const content = loadHomepageContent() || getDefaultHomepageContent();

    const fields = [
      'home-nav-home', 'home-nav-products', 'home-nav-about', 'home-nav-contact',
      'home-nav-cta', 'home-nav-order-history',
      'home-hero-badge', 'home-hero-heading', 'home-hero-highlight', 'home-hero-lead',
      'home-hero-primary-btn', 'home-hero-secondary-btn',
      'home-featured-eyebrow', 'home-featured-title', 'home-featured-description', 'home-featured-button',
      'home-about-eyebrow', 'home-about-title', 'home-about-description',
      'home-about-card-1-title', 'home-about-card-1-text',
      'home-about-card-2-title', 'home-about-card-2-text',
      'home-about-card-3-title', 'home-about-card-3-text',
      'home-about-card-4-title', 'home-about-card-4-text',
      'home-contact-eyebrow', 'home-contact-title',
      'home-contact-item-1-title', 'home-contact-item-1-text',
      'home-contact-item-2-title', 'home-contact-item-2-text',
      'home-contact-item-3-title', 'home-contact-item-3-text',
      'home-contact-card-title', 'home-contact-card-text', 'home-contact-card-button',
      'home-footer-intro',
      'home-footer-explore-heading', 'home-footer-categories-heading', 'home-footer-contact-heading',
      'home-footer-copyright', 'home-footer-tagline',
      'home-footer-explore-home', 'home-footer-explore-products',
      'home-footer-explore-about', 'home-footer-explore-contact',
      'home-footer-categories-skincare', 'home-footer-categories-makeup', 'home-footer-categories-bags',
      'home-footer-contact-messenger', 'home-footer-contact-email', 'home-footer-contact-admin'
    ];

    const keyMapping = {
      'home-nav-home': 'navHome',
      'home-nav-products': 'navProducts',
      'home-nav-about': 'navAbout',
      'home-nav-contact': 'navContact',
      'home-nav-cta': 'navCtaText',
      'home-nav-order-history': 'navOrderHistory',
      'home-hero-badge': 'heroBadge',
      'home-hero-heading': 'heroHeading',
      'home-hero-highlight': 'heroHighlight',
      'home-hero-lead': 'heroLead',
      'home-hero-primary-btn': 'heroPrimaryBtn',
      'home-hero-secondary-btn': 'heroSecondaryBtn',
      'home-featured-eyebrow': 'featuredEyebrow',
      'home-featured-title': 'featuredTitle',
      'home-featured-description': 'featuredDescription',
      'home-featured-button': 'featuredButton',
      'home-about-eyebrow': 'aboutEyebrow',
      'home-about-title': 'aboutTitle',
      'home-about-description': 'aboutDescription',
      'home-about-card-1-title': 'aboutCard1Title',
      'home-about-card-1-text': 'aboutCard1Text',
      'home-about-card-2-title': 'aboutCard2Title',
      'home-about-card-2-text': 'aboutCard2Text',
      'home-about-card-3-title': 'aboutCard3Title',
      'home-about-card-3-text': 'aboutCard3Text',
      'home-about-card-4-title': 'aboutCard4Title',
      'home-about-card-4-text': 'aboutCard4Text',
      'home-contact-eyebrow': 'contactEyebrow',
      'home-contact-title': 'contactTitle',
      'home-contact-item-1-title': 'contactItem1Title',
      'home-contact-item-1-text': 'contactItem1Text',
      'home-contact-item-2-title': 'contactItem2Title',
      'home-contact-item-2-text': 'contactItem2Text',
      'home-contact-item-3-title': 'contactItem3Title',
      'home-contact-item-3-text': 'contactItem3Text',
      'home-contact-card-title': 'contactCardTitle',
      'home-contact-card-text': 'contactCardText',
      'home-contact-card-button': 'contactButton',
      'home-footer-intro': 'footerIntro',
      'home-footer-explore-heading': 'footerExploreHeading',
      'home-footer-categories-heading': 'footerCategoriesHeading',
      'home-footer-contact-heading': 'footerContactHeading',
      'home-footer-copyright': 'footerCopyright',
      'home-footer-tagline': 'footerTagline',
      'home-footer-explore-home': 'footerExploreHome',
      'home-footer-explore-products': 'footerExploreProducts',
      'home-footer-explore-about': 'footerExploreAbout',
      'home-footer-explore-contact': 'footerExploreContact',
      'home-footer-categories-skincare': 'footerCategoriesSkincare',
      'home-footer-categories-makeup': 'footerCategoriesMakeup',
      'home-footer-categories-bags': 'footerCategoriesBags',
      'home-footer-contact-messenger': 'footerContactMessenger',
      'home-footer-contact-email': 'footerContactEmail',
      'home-footer-contact-admin': 'footerContactAdmin'
    };

    fields.forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        const key = keyMapping[id];
        el.value = key ? (content[key] || '') : '';
      }
    });
  }

  populateHomepageForm();

  homepageForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(homepageForm);
    const payload = {};

    // Map form field names to content keys
    const fieldToKey = {
      'navHome': 'navHome',
      'navProducts': 'navProducts',
      'navAbout': 'navAbout',
      'navContact': 'navContact',
      'navCtaText': 'navCtaText',
      'navOrderHistory': 'navOrderHistory',
      'heroBadge': 'heroBadge',
      'heroHeading': 'heroHeading',
      'heroHighlight': 'heroHighlight',
      'heroLead': 'heroLead',
      'heroPrimaryBtn': 'heroPrimaryBtn',
      'heroSecondaryBtn': 'heroSecondaryBtn',
      'featuredEyebrow': 'featuredEyebrow',
      'featuredTitle': 'featuredTitle',
      'featuredDescription': 'featuredDescription',
      'featuredButton': 'featuredButton',
      'aboutEyebrow': 'aboutEyebrow',
      'aboutTitle': 'aboutTitle',
      'aboutDescription': 'aboutDescription',
      'aboutCard1Title': 'aboutCard1Title',
      'aboutCard1Text': 'aboutCard1Text',
      'aboutCard2Title': 'aboutCard2Title',
      'aboutCard2Text': 'aboutCard2Text',
      'aboutCard3Title': 'aboutCard3Title',
      'aboutCard3Text': 'aboutCard3Text',
      'aboutCard4Title': 'aboutCard4Title',
      'aboutCard4Text': 'aboutCard4Text',
      'contactEyebrow': 'contactEyebrow',
      'contactTitle': 'contactTitle',
      'contactItem1Title': 'contactItem1Title',
      'contactItem1Text': 'contactItem1Text',
      'contactItem2Title': 'contactItem2Title',
      'contactItem2Text': 'contactItem2Text',
      'contactItem3Title': 'contactItem3Title',
      'contactItem3Text': 'contactItem3Text',
      'contactCardTitle': 'contactCardTitle',
      'contactCardText': 'contactCardText',
      'contactButton': 'contactButton',
      'footerIntro': 'footerIntro',
      'footerExploreHeading': 'footerExploreHeading',
      'footerCategoriesHeading': 'footerCategoriesHeading',
      'footerContactHeading': 'footerContactHeading',
      'footerCopyright': 'footerCopyright',
      'footerTagline': 'footerTagline',
      'footerExploreHome': 'footerExploreHome',
      'footerExploreProducts': 'footerExploreProducts',
      'footerExploreAbout': 'footerExploreAbout',
      'footerExploreContact': 'footerExploreContact',
      'footerCategoriesSkincare': 'footerCategoriesSkincare',
      'footerCategoriesMakeup': 'footerCategoriesMakeup',
      'footerCategoriesBags': 'footerCategoriesBags',
      'footerContactMessenger': 'footerContactMessenger',
      'footerContactEmail': 'footerContactEmail',
      'footerContactAdmin': 'footerContactAdmin'
    };

    for (const [name, value] of formData.entries()) {
      const key = fieldToKey[name];
      if (key) {
        payload[key] = (value || '').toString().trim();
      }
    }

    saveHomepageContent(payload);
    if (homepageSaveStatus) homepageSaveStatus.textContent = 'Homepage updated.';
    window.location.reload();
  });
}


// --- admin-products ---
/* =================================================================
   JJ — Admin Product CRUD (add, edit, delete, render table)
   ================================================================= */



function initAdminProducts() {
  // Only run on admin.html (not inventory.html)
  if (window.location.pathname.endsWith('inventory.html')) return;

  const addProductBtn = document.getElementById('add-product-btn');
  const productModal = document.getElementById('product-modal');
  const productForm = document.getElementById('product-form');
  const imageInput = document.getElementById('f-image');
  const imagePreview = document.getElementById('f-image-preview');
  const adminTableBody = document.getElementById('admin-table-body');
  const modalTitle = document.getElementById('modal-title');
  const modalSubtitle = document.getElementById('modal-subtitle');
  const confirmModal = document.getElementById('confirm-modal');
  const confirmProductName = document.getElementById('confirm-product-name');
  const confirmDeleteBtn = document.getElementById('confirm-delete-btn');

  if (!productModal || !productForm || !adminTableBody) return;

  let products = loadProducts();
  let editingId = null;

  function loadProducts() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch (e) { return []; }
  }

  function saveProducts() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  }

  function getNextProductId() {
    const numericIds = products.map(p => Number(p.id)).filter(Number.isFinite);
    return numericIds.length ? Math.max(...numericIds) + 1 : 1;
  }

  function getEffectiveStock(product) {
    const quantity = Number(product?.quantity ?? (product?.stock === 'out' ? 0 : product?.stock === 'low' ? 6 : 13));
    if (Number.isFinite(quantity)) return getStockFromQuantity(quantity);
    return product?.stock || 'in';
  }

  function openModal() {
    productModal.classList.add('open');
    productModal.setAttribute('aria-hidden', 'false');
    productModal.style.display = 'flex';
  }

  function closeModal() {
    productModal.classList.remove('open');
    productModal.setAttribute('aria-hidden', 'true');
    productModal.style.display = 'none';
    if (productForm) productForm.reset();
    if (imagePreview) {
      imagePreview.style.display = 'none';
      imagePreview.src = '';
    }
    if (modalTitle) modalTitle.textContent = 'Add Product';
    if (modalSubtitle) modalSubtitle.textContent = 'This is a visual placeholder — nothing is saved to a server.';
    editingId = null;
  }

  // Close modal buttons
  document.querySelectorAll('[data-modal-close]').forEach(btn => btn.addEventListener('click', closeModal));
  document.querySelectorAll('[data-confirm-close]').forEach(b =>
    b.addEventListener('click', () => confirmModal?.classList.remove('open'))
  );

  // Add product button
  if (addProductBtn) {
    addProductBtn.addEventListener('click', () => {
      if (modalTitle) modalTitle.textContent = 'Add Product';
      if (modalSubtitle) modalSubtitle.textContent = 'Add a new product to your catalogue.';
      editingId = null;
      openModal();
    });
  }

  // Image preview
  if (imageInput) {
    imageInput.addEventListener('change', (e) => {
      const f = e.target.files && e.target.files[0];
      if (f) {
        const reader = new FileReader();
        reader.onload = () => {
          if (imagePreview) {
            imagePreview.src = reader.result;
            imagePreview.style.display = 'block';
          }
        };
        reader.readAsDataURL(f);
      } else if (imagePreview) {
        imagePreview.style.display = 'none';
      }
    });
  }

  // Form submit
  if (productForm) {
    productForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const fd = new FormData(productForm);
      const name = (fd.get('name') || '').toString().trim();
      const category = (fd.get('category') || '').toString();
      const price = parseFloat(fd.get('price') || 0) || 0;
      const quantity = parseInt(fd.get('quantity') || 0, 10);
      const shortDesc = (fd.get('short') || '').toString();
      const description = (fd.get('description') || '').toString();
      let imageData = null;
      const file = imageInput?.files && imageInput.files[0];
      if (file) {
        imageData = await new Promise((res) => {
          const r = new FileReader();
          r.onload = () => res(r.result);
          r.onerror = () => res(null);
          r.readAsDataURL(file);
        });
      }
      if (!name) { showToast('Please provide a product name.'); return; }

      const derivedStock = getStockFromQuantity(quantity);

      if (editingId) {
        const idx = products.findIndex(p => String(p.id) === String(editingId));
        if (idx > -1) {
          products[idx] = {
            ...products[idx],
            name, category, price,
            stock: derivedStock, quantity,
            short: shortDesc, description,
            image: imageData || products[idx].image
          };
        }
      } else {
        const id = getNextProductId();
        products.push({
          id, name, category, price,
          stock: derivedStock, quantity,
          short: shortDesc, description,
          image: imageData, icon: 'jar', bullets: []
        });
      }
      saveProducts();
      window.dispatchEvent(new Event('products-updated'));
      renderProducts();
      closeModal();
      showToast('Product saved successfully.');
    });
  }

  function renderProducts() {
    if (!adminTableBody) return;
    adminTableBody.innerHTML = '';
    let total = 0, inCount = 0, lowCount = 0, outCount = 0;

    products.forEach(p => {
      total++;
      const effectiveStock = getEffectiveStock(p);
      if (effectiveStock === 'in') inCount++;
      else if (effectiveStock === 'low') lowCount++;
      else if (effectiveStock === 'out') outCount++;

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>
          <div class="row-thumb">
            ${p.image ? `<img src="${p.image}" alt="${escapeHtml(p.name)}" style="width:44px;height:44px;object-fit:cover;border-radius:8px;">` : svgPlaceholder()}
          </div>
        </td>
        <td>${escapeHtml(p.name)}</td>
        <td>${escapeHtml(String(p.id))}</td>
        <td>${escapeHtml(p.category)}</td>
                <td>${p.discount && p.discount.percentage > 0 ? `<span style="text-decoration:line-through; color:var(--ink-faint);">₱${Number(p.price).toFixed(2)}</span> <strong style="color:var(--rose-deep);">₱${Number(p.discount.discountedPrice).toFixed(2)}</strong>` : `₱${Number(p.price).toFixed(2)}`}</td>
        <td>${Number(p.quantity ?? 0)}</td>
        <td>${stockBadge(effectiveStock)}</td>
        <td>${escapeHtml(p.lastUpdated || '—')}</td>
        <td class="row-actions">
          <button class="btn btn-outline btn-sm" data-edit-id="${p.id}">Edit</button>
          <button class="btn btn-ghost btn-sm" data-delete-id="${p.id}">Delete</button>
        </td>
      `;
      adminTableBody.appendChild(tr);
    });

    // Update stat counts
    const totalEl = document.getElementById('stat-total');
    const inEl = document.getElementById('stat-in');
    const lowEl = document.getElementById('stat-low');
    const outEl = document.getElementById('stat-out');
    if (totalEl) totalEl.textContent = total;
    if (inEl) inEl.textContent = inCount;
    if (lowEl) lowEl.textContent = lowCount;
    if (outEl) outEl.textContent = outCount;

    // Wire delete buttons
    adminTableBody.querySelectorAll('[data-delete-id]').forEach(b => {
      b.addEventListener('click', () => {
        const id = b.getAttribute('data-delete-id');
        const prod = products.find(x => String(x.id) === String(id));
        if (!prod) return;
        if (confirmProductName) confirmProductName.textContent = prod.name;
        if (confirmModal) confirmModal.classList.add('open');
        if (confirmDeleteBtn) {
          confirmDeleteBtn.onclick = () => {
            products = products.filter(x => String(x.id) !== String(id));
            saveProducts();
            window.dispatchEvent(new Event('products-updated'));
            renderProducts();
            if (confirmModal) confirmModal.classList.remove('open');
          };
        }
      });
    });

    // Wire edit buttons
    adminTableBody.querySelectorAll('[data-edit-id]').forEach(b => {
      b.addEventListener('click', () => {
        const id = b.getAttribute('data-edit-id');
        const prod = products.find(x => String(x.id) === String(id));
        if (!prod) return;
        editingId = id;
        if (modalTitle) modalTitle.textContent = 'Edit Product';
        if (modalSubtitle) modalSubtitle.textContent = 'Update product details.';

        const nameField = document.getElementById('f-name');
        const categoryField = document.getElementById('f-category');
        const priceField = document.getElementById('f-price');
        const quantityField = document.getElementById('f-quantity');
        const shortField = document.getElementById('f-short');
        const descField = document.getElementById('f-description');

        if (nameField) nameField.value = prod.name;
        if (categoryField) categoryField.value = prod.category;
        if (priceField) priceField.value = prod.price;
        if (quantityField) quantityField.value = prod.quantity ?? (prod.stock === 'out' ? 0 : prod.stock === 'low' ? 5 : 12);
        if (shortField) shortField.value = prod.short || '';
        if (descField) descField.value = prod.description || '';

        if (prod.image && imagePreview) {
          imagePreview.src = prod.image;
          imagePreview.style.display = 'block';
        } else if (imagePreview) {
          imagePreview.style.display = 'none';
        }
        openModal();
      });
    });
  }

  // Listen for external product updates
  window.addEventListener('products-updated', () => {
    products = loadProducts();
    renderProducts();
  });

  renderProducts();
}

// Also expose to inventory page if needed
function setAdminProducts(prods) {
  // no-op for now
}


// --- scroll-reveal ---
/* Butter-smooth scroll-triggered animations — reveals as elements enter viewport */
function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.06,
    rootMargin: "0px 0px -20px 0px"
  });
  // Check if already in view — mark visible instantly to avoid flash
  function checkAndObserve(el) {
    const rect = el.getBoundingClientRect();
    const winH = window.innerHeight || document.documentElement.clientHeight;
    if (rect.top < winH - 40 && rect.bottom > 40) {
      el.classList.add("visible");
    } else {
      observer.observe(el);
    }
    el.classList.add("observed");
  }
  document.querySelectorAll(".section:not(.observed)").forEach(checkAndObserve);
  document.querySelectorAll(".card-product:not(.observed)").forEach(checkAndObserve);
  document.querySelectorAll(".why-card:not(.observed)").forEach(checkAndObserve);
  document.querySelectorAll(".reveal:not(.observed)").forEach(checkAndObserve);
  // Watch for dynamically added cards
  const mutationObserver = new MutationObserver(() => {
    document.querySelectorAll(".card-product:not(.observed), .why-card:not(.observed), .reveal:not(.observed)").forEach(checkAndObserve);
  });
  mutationObserver.observe(document.body, { childList: true, subtree: true });
}

// --- shopping-cart ---
/* =================================================================
   JJ — Shopping Cart (storefront only, persisted in localStorage)
   ================================================================= */

const CART_STORAGE_KEY = "jj_shopping_cart";

/* Cart state — single source of truth: array of {id, name, price, quantity, image, icon} */
let cartItems = [];

function loadCart() {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    cartItems = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(cartItems)) cartItems = [];
  } catch (e) { cartItems = []; }
}

function saveCart() {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
}

function syncCartWithProducts() {
  const products = getProducts();
  const validIds = new Set(products.map((product) => String(product.id)));
  const beforeLength = cartItems.length;
  cartItems = cartItems.filter((item) => validIds.has(String(item.id)));
  if (cartItems.length !== beforeLength) {
    saveCart();
    updateCartUI();
    renderCartDrawer();
  }
}

function getCartTotal() {
  return cartItems.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 0), 0);
}

function getCartCount() {
  return cartItems.reduce((sum, item) => sum + (item.quantity || 0), 0);
}

function addToCart(product) {
  const existing = cartItems.find(i => String(i.id) === String(product.id));
  if (existing) {
    existing.quantity = (existing.quantity || 0) + 1;
  } else {
    cartItems.push({
      id: product.id,
      name: product.name,
      price: product.price || 0,
      quantity: 1,
      image: product.image || null,
      icon: product.icon || 'jar'
    });
  }
  saveCart();
  updateCartUI();
  showToast('Added to cart');
}

function removeFromCart(productId) {
  cartItems = cartItems.filter(i => String(i.id) !== String(productId));
  saveCart();
  updateCartUI();
  renderCartDrawer();
}

function updateCartQuantity(productId, newQty) {
  const item = cartItems.find(i => String(i.id) === String(productId));
  if (!item) return;
  if (newQty <= 0) {
    removeFromCart(productId);
    return;
  }
  item.quantity = newQty;
  saveCart();
  updateCartUI();
  renderCartDrawer();
}

/* Update cart badge + toggle button text */
function updateCartUI() {
  const badge = document.getElementById("cart-badge");
  if (badge) {
    const count = getCartCount();
    badge.textContent = count;
    badge.classList.toggle("hidden", count === 0);
  }
}

/* ---------- Cart Drawer ---------- */
function initCartDrawer() {
  // Create drawer element if not exists
  if (document.getElementById("cart-drawer")) return;

  const overlay = document.createElement("div");
  overlay.id = "cart-drawer-overlay";
  overlay.className = "modal-overlay";
  overlay.setAttribute("aria-hidden", "true");
  overlay.innerHTML = `
    <div class="modal cart-drawer" id="cart-drawer">
      <div class="modal-head">
        <div>
          <h3>Shopping Cart</h3>
          <p id="cart-count-label">0 items</p>
        </div>
        <button class="modal-close" id="cart-drawer-close" aria-label="Close cart">✕</button>
      </div>
      <div id="cart-drawer-body" style="flex:1; overflow-y:auto; padding:0 4px;">
        <!-- Cart items rendered here -->
      </div>
      <div id="cart-drawer-footer" style="border-top:1px solid var(--line); padding-top:16px; margin-top:8px;">
        <div style="display:flex; justify-content:space-between; font-weight:700; font-size:1.1rem; margin-bottom:12px;">
          <span>Subtotal</span>
          <span id="cart-drawer-total">₱0.00</span>
        </div>
        <button id="cart-send-order-btn" class="btn btn-primary btn-block">Review Order</button>
        <div id="cart-receipt-preview" style="display:none; margin-top:14px;">
          <label style="display:block; margin-bottom:6px; font-weight:700; font-size:.95rem;">Prepared Message</label>
          <textarea id="cart-receipt-text" rows="6" readonly style="width:100%; padding:10px; border-radius:8px; border:1px solid var(--line); font-family:inherit;"></textarea>
          <p style="margin-top:8px; color:var(--ink-soft); font-size:.85rem;">Review the message above, then confirm to copy it and open Messenger.</p>
          <button id="cart-confirm-messenger-btn" class="btn btn-primary btn-block" style="margin-top:8px;">Confirm &amp; Open Messenger</button>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  // Close handlers
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay || e.target.closest("#cart-drawer-close")) {
      overlay.classList.remove("open");
      overlay.setAttribute("aria-hidden", "true");
    }
  });

  // Wire send order button (review step) + confirm button (actual send)
  document.getElementById("cart-send-order-btn").addEventListener("click", reviewCartOrder);
  document.getElementById("cart-confirm-messenger-btn").addEventListener("click", confirmCartMessenger);

  renderCartDrawer();
}

function openCartDrawer() {
  const overlay = document.getElementById("cart-drawer-overlay");
  if (!overlay) return;
  renderCartDrawer();
  overlay.classList.add("open");
  overlay.setAttribute("aria-hidden", "false");
}

function renderCartDrawer() {
  const body = document.getElementById("cart-drawer-body");
  const totalEl = document.getElementById("cart-drawer-total");
  const countLabel = document.getElementById("cart-count-label");
  const sendBtn = document.getElementById("cart-send-order-btn");
  if (!body) return;
  resetCartReviewState();

  if (!cartItems.length) {
    body.innerHTML = '<div class="empty-state show" style="padding:40px 10px;"><h4>Your cart is empty</h4><p>No items added to your shopping cart yet. Browse products and add items to your cart.</p></div>';
    if (totalEl) totalEl.textContent = '₱0.00';
    if (countLabel) countLabel.textContent = '0 items';
    if (sendBtn) sendBtn.disabled = true;
    resetCartReviewState();
    return;
  }

  if (sendBtn) sendBtn.disabled = false;
  if (countLabel) countLabel.textContent = `${getCartCount()} items`;

    body.innerHTML = cartItems.map(item => {
    const thumb = item.image
      ? `<a href="./product-details.html?id=${item.id}" style="flex-shrink:0;"><img src="${item.image}" alt="${item.name}" style="width:56px;height:56px;object-fit:cover;border-radius:10px;display:block;"></a>`
      : `<a href="./product-details.html?id=${item.id}" style="flex-shrink:0;"><div style="width:56px;height:56px;border-radius:10px;background:var(--blush-soft);display:flex;align-items:center;justify-content:center;color:var(--rose-deep);font-size:1.5rem;">${getIcon(item.icon || 'jar')}</div></a>`;
    return `
      <div class="cart-item" data-id="${item.id}" style="display:flex;gap:12px;align-items:center;padding:12px 0;border-bottom:1px solid var(--line);">
        ${thumb}
        <div style="flex:1;min-width:0;">
          <a href="./product-details.html?id=${item.id}" style="font-weight:600;font-size:.92rem;color:var(--ink);text-decoration:none; white-space:nowrap;overflow:hidden;text-overflow:ellipsis;display:block;">${item.name}</a>
          <div style="color:var(--rose-deep);font-weight:700;font-size:.92rem;margin-top:2px;">₱${Number(item.price).toFixed(2)}</div>
        </div>
        <div class="cart-qty-controls" style="display:flex;align-items:center;gap:6px;">
          <button class="btn btn-sm btn-ghost cart-qty-minus" data-id="${item.id}" style="min-width:32px;width:32px;height:32px;padding:0;">−</button>
          <input type="number" class="cart-qty-input" value="${item.quantity}" min="0" max="999" data-id="${item.id}" style="width:44px;height:36px;text-align:center;border:1px solid var(--line);border-radius:8px;font-size:.85rem;padding:0;box-sizing:border-box;">
          <button class="btn btn-sm btn-ghost cart-qty-plus" data-id="${item.id}" style="min-width:32px;width:32px;height:32px;padding:0;">+</button>
          <button class="btn btn-ghost cart-item-remove" data-id="${item.id}" aria-label="Remove" style="min-width:32px;width:32px;height:32px;padding:0;color:var(--ink-faint);">✕</button>
        </div>
      </div>
    `;
  }).join("");

  // Wire quantity controls
  body.querySelectorAll(".cart-qty-minus").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      const item = cartItems.find(i => String(i.id) === String(id));
      if (item) updateCartQuantity(id, item.quantity - 1);
    });
  });
  body.querySelectorAll(".cart-qty-plus").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      const item = cartItems.find(i => String(i.id) === String(id));
      if (item) updateCartQuantity(id, (item.quantity || 0) + 1);
    });
  });
  body.querySelectorAll(".cart-qty-input").forEach(input => {
    input.addEventListener("change", () => {
      const id = input.dataset.id;
      const val = parseInt(input.value, 10);
      if (!isNaN(val) && val >= 0) updateCartQuantity(id, val);
      else renderCartDrawer();
    });
  });
  body.querySelectorAll(".cart-item-remove").forEach(btn => {
    btn.addEventListener("click", () => removeFromCart(btn.dataset.id));
  });

  // Update total
  if (totalEl) totalEl.textContent = `₱${getCartTotal().toFixed(2)}`;
}

function resetCartReviewState() {
  const preview = document.getElementById("cart-receipt-preview");
  const sendBtn = document.getElementById("cart-send-order-btn");
  const textArea = document.getElementById("cart-receipt-text");
  if (preview) preview.style.display = "none";
  if (sendBtn) { sendBtn.style.display = ""; sendBtn.textContent = "Review Order"; }
  if (textArea) textArea.value = "";
}

/* ---------- Review step: build message, save order + stock, show for review ---------- */
function reviewCartOrder() {
  if (!cartItems.length) {
    showToast('Your cart is empty.');
    return;
  }

  const lines = cartItems.map(item => {
    const subtotal = (item.price || 0) * (item.quantity || 0);
    return `${item.name} × ${item.quantity} = ₱${subtotal.toFixed(2)}`;
  });
  const total = getCartTotal().toFixed(2);
  const message = `Hello! I would like to order the following:\n\n${lines.join('\n')}\n\nTotal: ₱${total}\n\nThank you!`;

  // Save order history
  const order = {
    orderId: `JJ-${Date.now()}`,
    createdAt: new Date().toISOString(),
    orderDate: new Date().toISOString(),
    status: 'Pending',
    items: cartItems.map(item => ({
      productId: item.id, name: item.name, quantity: item.quantity,
      unitPrice: item.price || 0, totalPrice: (item.price || 0) * (item.quantity || 0)
    })),
    totalPrice: Number(total)
  };
  appendOrderHistory(order);

  // Decrement stock per item
  const products = getProducts();
  cartItems.forEach(cartItem => {
    const idx = products.findIndex(p => String(p.id) === String(cartItem.id));
    if (idx !== -1) {
      const updatedQuantity = Math.max(0, Number(products[idx].quantity || 0) - (cartItem.quantity || 0));
      products[idx].quantity = updatedQuantity;
      products[idx].stock = getStockFromQuantity(updatedQuantity);
      products[idx].salesCount = (products[idx].salesCount || 0) + (cartItem.quantity || 0);
    }
  });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  window.dispatchEvent(new Event('products-updated'));

  // Show for review
  const textArea = document.getElementById("cart-receipt-text");
  const preview = document.getElementById("cart-receipt-preview");
  const sendBtn = document.getElementById("cart-send-order-btn");
  if (textArea) textArea.value = message;
  if (preview) preview.style.display = "";
  if (sendBtn) sendBtn.style.display = "none";
  showToast('Order ready — review it, then confirm to open Messenger.');
}

/* ---------- Confirm step: only runs after the user has reviewed the receipt ---------- */
async function confirmCartMessenger() {
  const message = (document.getElementById("cart-receipt-text")?.value || '').trim();
  if (!message) return;

  try {
    await navigator.clipboard.writeText(message);
    showToast('Order message copied to clipboard');
  } catch {
    const ta = document.createElement('textarea');
    ta.value = message;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); showToast('Order message copied'); } catch { showToast('Copy failed — please copy manually'); }
    document.body.removeChild(ta);
  }

  window.open(MESSENGER_URL, '_blank');
  cartItems = [];
  saveCart();
  updateCartUI();
  const overlay = document.getElementById("cart-drawer-overlay");
  if (overlay) {
    overlay.classList.remove("open");
    overlay.setAttribute("aria-hidden", "true");
  }
}

// --- background-slideshow ---
/* =================================================================
   JJ — Full-page background image slideshow (site-wide)
   ================================================================= */

function initBackgroundSlideshow() {
  // Respect prefers-reduced-motion: show first image only, no transition
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Image array — relative paths (no leading /) for cross-deployment compatibility
  const images = [
    'background/photo1.jpg',
    'background/photo2.jpg',
    'background/photo4.jpg',
    'background/photo5.jpg',
    'background/photo6.jpg'
  ];

  if (!images.length) return;

  // Create container element (only once)
  if (document.getElementById('bg-slideshow')) return;

  const container = document.createElement('div');
  container.id = 'bg-slideshow';
  // Positioned fixed behind all content
  container.setAttribute('aria-hidden', 'true');
  document.body.prepend(container);

  // Two layers for crossfade
  const layerA = document.createElement('div');
  layerA.className = 'bg-slide-layer';
  layerA.style.opacity = '1';
  container.appendChild(layerA);

  const layerB = document.createElement('div');
  layerB.className = 'bg-slide-layer';
  layerB.style.opacity = '0';
  container.appendChild(layerB);

  // Semi-transparent overlay for legibility
  const overlay = document.createElement('div');
  overlay.className = 'bg-slide-overlay';
  container.appendChild(overlay);

  let currentIndex = 0;
  let nextIndex = 1;
  let isLayerA = true; // true = layerA visible, false = layerB visible
  let intervalId = null;

  function setLayer(el, idx) {
    el.style.backgroundImage = `url(${images[idx]})`;
  }

  // Preload an image into browser cache
  function preload(idx) {
    const img = new Image();
    img.src = images[idx];
  }

  function advance() {
    const visibleLayer = isLayerA ? layerA : layerB;
    const hiddenLayer = isLayerA ? layerB : layerA;

    // Set next image on hidden layer
    setLayer(hiddenLayer, nextIndex);
    hiddenLayer.style.opacity = '0';

    // Force reflow then fade in
    hiddenLayer.offsetHeight; // eslint-disable-line no-unused-expressions
    visibleLayer.style.opacity = '0';
    hiddenLayer.style.opacity = '1';

    // Update indices
    currentIndex = nextIndex;
    nextIndex = (nextIndex + 1) % images.length;
    isLayerA = !isLayerA;

    // Preload the next-next image
    preload((nextIndex + 1) % images.length);
  }

  // Initialize
  setLayer(layerA, 0);
  setLayer(layerB, 1);
  preload(2);
  preload(3);
  preload(4);

  if (prefersReducedMotion) {
    // No animation — just show first image
    layerA.style.opacity = '1';
    layerB.style.opacity = '0';
    return;
  }

  // Start cycling
  intervalId = setInterval(advance, 6000);
}

// --- bootstrap ---
/* Admin sidebar toggle — slides sidebar in/out on tablet & mobile */
function initAdminSidebar() {
  const toggle = document.getElementById("admin-sidebar-toggle");
  const sidebar = document.querySelector(".admin-sidebar");
  const backdrop = document.getElementById("admin-sidebar-backdrop");
  if (!toggle || !sidebar) return;
  function open() {
    sidebar.classList.add("open");
    toggle.classList.add("open");
    if (backdrop) backdrop.classList.add("open");
    document.body.style.overflow = "hidden";
  }
  function close() {
    sidebar.classList.remove("open");
    toggle.classList.remove("open");
    if (backdrop) backdrop.classList.remove("open");
    document.body.style.overflow = "";
  }
  toggle.addEventListener("click", () => {
    if (sidebar.classList.contains("open")) close();
    else open();
  });
  if (backdrop) backdrop.addEventListener("click", close);
        /* Close sidebar when clicking a nav link inside it.
       Use stopImmediatePropagation to prevent initNavbar's document-level
       intercept from calling preventDefault + transitionTo before the
       browser has a chance to paint the sidebar closed state.
       This lets the browser navigate normally — the sidebar closes
       synchronously, and the new page loads with sidebar in default
       (closed) state. */
  sidebar.querySelectorAll("a").forEach(a => a.addEventListener("click", function(e){
    close();
    e.stopImmediatePropagation();
  }));
}
document.addEventListener("DOMContentLoaded", function(){
  // Load cart state from localStorage (storefront only, persisted across pages)
  loadCart();
  syncCartWithProducts();
  initCartDrawer();
  updateCartUI();

  // Wire cart toggle button (storefront pages only;
  // on admin page this element won't exist and the event listener is a no-op)
  const cartToggle = document.getElementById("cart-toggle");
  if (cartToggle) cartToggle.addEventListener("click", openCartDrawer);

  // Wire "Add to Cart" buttons (delegated — handles dynamic cards)
  document.body.addEventListener("click", function(e) {
    const btn = e.target.closest(".add-to-cart-btn");
    if (!btn) return;
    e.preventDefault();
    const id = btn.dataset.id;
    const products = getProducts();
    const product = products.find(p => String(p.id) === String(id));
    if (!product) return;
    // If product is out of stock, don't add
    if (product.stock === "out") {
      showToast("This product is currently out of stock.");
      return;
    }
    addToCart(product);
  });

    // Full-page background slideshow (storefront only)
  if (!document.querySelector(".admin-shell")) {
    initBackgroundSlideshow();
  }

  // ---- Mobile: close admin sidebar on EVERY route change ----
  // Attached at the navigation level, not per nav link.
  // On mobile, any admin sidebar link click triggers close via the
  // sidebar's own handler (stopImmediatePropagation). But we also
  // watch document clicks for sidebar links that might bypass the
  // sidebar handler (e.g., links outside the sidebar that change the page).
  document.addEventListener("click", function(e) {
    const link = e.target.closest("a");
    if (!link) return;
    const sidebar = document.querySelector(".admin-sidebar");
    if (!sidebar) return;
    const toggle = document.getElementById("admin-sidebar-toggle");
    const backdrop = document.getElementById("admin-sidebar-backdrop");
    // Only close if sidebar is open AND we're on a narrow viewport
    if (!sidebar.classList.contains("open")) return;
    if (window.innerWidth > 980) return;

    const href = link.getAttribute("href");
    if (!href || href.startsWith("http") || href.startsWith("#") || href.startsWith("//") || href.startsWith("javascript:")) return;

    // Close sidebar before navigation
    sidebar.classList.remove("open");
    if (toggle) toggle.classList.remove("open");
    if (backdrop) backdrop.classList.remove("open");
    document.body.style.overflow = "";
  });

  applyHomepageContent();
  initNavbar();
  initAdminSidebar();
  createReceiptModal();
  initOrderNowHandlers();
  initFeaturedProducts();
  initProductsPage();
  initProductDetailsPage();
  initOrderHistoryPage();
  initAdminAuth();
  initHomepageEditor();
  initAdminProducts();
  initScrollReveal();
});

})();