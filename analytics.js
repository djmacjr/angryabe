(function () {
  "use strict";

  const MEASUREMENT_ID = "G-X154CZFXZ1";
  const CONSENT_KEY = "aa_cookie_consent";
  const SCROLL_MARKERS = [25, 50, 75, 90];
  const firedScrollMarkers = new Set();

  let gaReady = false;

  function getPageName() {
    const path = window.location.pathname;
    if (path.endsWith("/blog.html")) return "blog";
    if (path.endsWith("/about.html")) return "about";
    if (path.endsWith("/action.html")) return "action";
    if (path.endsWith("/character.html")) return "character";
    if (path.endsWith("/constitution.html")) return "constitution";
    return "homepage";
  }

  function getPageType() {
    const page = getPageName();
    if (page === "blog") return "blog";
    if (page === "homepage") return "homepage";
    return "content";
  }

  function addUtmParams(url, medium) {
    try {
      const parsed = new URL(url, window.location.origin);
      if (!parsed.hostname.includes("angryabe.printful.me") && !parsed.hostname.includes("etsy.com")) {
        return parsed.toString();
      }
      if (!parsed.searchParams.has("utm_source")) parsed.searchParams.set("utm_source", "site");
      if (!parsed.searchParams.has("utm_medium")) parsed.searchParams.set("utm_medium", medium);
      if (!parsed.searchParams.has("utm_campaign")) parsed.searchParams.set("utm_campaign", "homepage");
      return parsed.toString();
    } catch {
      return url;
    }
  }

  function loadGa() {
    if (gaReady) return;

    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() {
      window.dataLayer.push(arguments);
    };

    window.gtag("js", new Date());
    window.gtag("config", MEASUREMENT_ID, {
      anonymize_ip: true,
      page_path: window.location.pathname,
      page_title: document.title,
    });

    gaReady = true;
    bindAutoEvents();
  }

  function track(name, params) {
    if (!gaReady || typeof window.gtag !== "function") return;
    window.gtag("event", name, params || {});
  }

  function bindAutoEvents() {
    document.addEventListener("click", (event) => {
      const storeAnchor = event.target.closest("[data-track-store]");
      if (storeAnchor) {
        const store = storeAnchor.getAttribute("data-store") || "unknown";
        const href = storeAnchor.getAttribute("href");
        if (href && href !== "#") {
          storeAnchor.href = addUtmParams(href, "store_link");
        }
        track("store_click", {
          store,
          page: getPageName(),
        });
      }

      const socialAnchor = event.target.closest("[data-track-social]");
      if (socialAnchor) {
        const platform = socialAnchor.getAttribute("data-platform") || "unknown";
        track("social_click", {
          platform,
          page: getPageName(),
        });
      }

      const principleCard = event.target.closest("[data-track-principle]");
      if (principleCard) {
        const principle = principleCard.getAttribute("data-principle") || "unknown";
        track("principle_click", {
          principle,
        });
      }

      const blogPostAnchor = event.target.closest("[data-track-blog-post]");
      if (blogPostAnchor) {
        track("blog_post_open", {
          post_title: blogPostAnchor.getAttribute("data-post-title") || "unknown",
          category: blogPostAnchor.getAttribute("data-post-category") || "general",
        });
      }
    });

    window.addEventListener(
      "scroll",
      () => {
        const doc = document.documentElement;
        const maxScroll = doc.scrollHeight - window.innerHeight;
        if (maxScroll <= 0) return;

        const percent = Math.round((window.scrollY / maxScroll) * 100);
        for (const marker of SCROLL_MARKERS) {
          if (percent >= marker && !firedScrollMarkers.has(marker)) {
            firedScrollMarkers.add(marker);
            track("scroll_depth", {
              percent: marker,
              page_type: getPageType(),
            });
          }
        }
      },
      { passive: true }
    );
  }

  function createConsentBanner() {
    if (document.querySelector(".aa-consent-banner")) return;

    const style = document.createElement("style");
    style.textContent = `
      .aa-consent-banner {
        position: fixed;
        left: 1rem;
        right: 1rem;
        bottom: 1rem;
        z-index: 9999;
        border: 1px solid rgba(255,255,255,0.14);
        background: rgba(6, 8, 13, 0.96);
        color: #f2f5fb;
        border-radius: 14px;
        padding: 0.9rem;
        display: grid;
        gap: 0.7rem;
        box-shadow: 0 24px 60px rgba(0,0,0,0.45);
      }
      .aa-consent-copy {
        margin: 0;
        line-height: 1.45;
        color: rgba(242,245,251,0.9);
        font-size: 0.92rem;
      }
      .aa-consent-actions {
        display: flex;
        gap: 0.55rem;
        flex-wrap: wrap;
      }
      .aa-consent-actions button {
        min-height: 2.3rem;
        border-radius: 999px;
        border: 1px solid rgba(255,255,255,0.16);
        background: rgba(255,255,255,0.05);
        color: #f2f5fb;
        padding: 0 0.85rem;
        font-weight: 700;
        cursor: pointer;
      }
      .aa-consent-actions .aa-accept {
        border-color: rgba(240, 208, 107, 0.4);
        background: linear-gradient(180deg, rgba(240, 208, 107, 0.3), rgba(240, 208, 107, 0.08));
      }
      @media (max-width: 720px) {
        .aa-consent-actions button {
          width: 100%;
        }
      }
    `;
    document.head.appendChild(style);

    const banner = document.createElement("section");
    banner.className = "aa-consent-banner";
    banner.setAttribute("aria-label", "Cookie consent");
    banner.innerHTML = `
      <p class="aa-consent-copy">
        Angry Abe uses analytics cookies to understand shirt clicks and improve the site.
      </p>
      <div class="aa-consent-actions">
        <button class="aa-accept" type="button">Accept analytics cookies</button>
        <button class="aa-decline" type="button">Decline</button>
      </div>
    `;

    banner.querySelector(".aa-accept").addEventListener("click", () => {
      localStorage.setItem(CONSENT_KEY, "accepted");
      banner.remove();
      loadGa();
    });

    banner.querySelector(".aa-decline").addEventListener("click", () => {
      localStorage.setItem(CONSENT_KEY, "declined");
      banner.remove();
    });

    document.body.appendChild(banner);
  }

  function initConsent() {
    const saved = localStorage.getItem(CONSENT_KEY);
    if (saved === "accepted") {
      loadGa();
      return;
    }
    if (saved === "declined") {
      return;
    }
    createConsentBanner();
  }

  window.AAAnalytics = {
    track,
    isReady() {
      return gaReady;
    },
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initConsent);
  } else {
    initConsent();
  }
})();
