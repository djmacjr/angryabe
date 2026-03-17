const productGrid = document.querySelector("#productGrid");
const productStatus = document.querySelector("#productStatus");
const cardTemplate = document.querySelector("#productCardTemplate");
const heroPrincipleName = document.querySelector("#heroPrincipleName");
const heroPrincipleMeaning = document.querySelector("#heroPrincipleMeaning");
const heroPrincipleLink = document.querySelector("#heroPrincipleLink");
const heroQuoteText = document.querySelector("#heroQuoteText");
const heroQuoteAuthor = document.querySelector("#heroQuoteAuthor");
const heroPrincipleCta = document.querySelector("#heroPrincipleCta");
const latestPrincipleLink = document.querySelector("#latestPrincipleLink");
const latestPrincipleTitle = document.querySelector("#latestPrincipleTitle");
const latestPrincipleMeta = document.querySelector("#latestPrincipleMeta");
const emailSignupForm = document.querySelector("#emailSignupForm");
const dropCountLabel = document.querySelector("#dropCountLabel");

const yearEl = document.querySelector("#year");
const printfulCollectionLink = document.querySelector("#printfulCollectionLink");
const printfulTile = document.querySelector("#printfulTile");
const footerPrintfulLink = document.querySelector("#footerPrintfulLink");
const facebookLink = document.querySelector("#facebookLink");
const instagramLink = document.querySelector("#instagramLink");
const xLink = document.querySelector("#xLink");
const footerFacebookLink = document.querySelector("#footerFacebookLink");
const footerInstagramLink = document.querySelector("#footerInstagramLink");
const footerXLink = document.querySelector("#footerXLink");

const STORE_LINKS = {
  printful: "https://angryabe.printful.me/",
};

const SOCIAL_LINKS = {
  facebook: "https://www.facebook.com/share/1Zwvomwfd1/?mibextid=wwXIfr",
  instagram: "https://www.instagram.com/angryabeproductions/",
  x: "https://x.com/abe_angry_pro",
};

const HOMEPAGE_PRINCIPLES = [
  {
    key: "character",
    name: "Character",
    meaning: "Integrity when no one is watching.",
    quote: '"Character is like a tree, and reputation like a shadow."',
    author: "Abraham Lincoln",
    href: "./character.html",
  },
  {
    key: "truth",
    name: "Truth",
    meaning: "Plain speech, honest thinking, and moral clarity.",
    quote: '"No man has a good enough memory to be a successful liar."',
    author: "Abraham Lincoln",
    href: "./truth.html",
  },
  {
    key: "action",
    name: "Action",
    meaning: "Principles proven through conduct.",
    quote: '"Words promise. Actions prove."',
    author: "Angry Abe",
    href: "./action.html",
  },
  {
    key: "resolve",
    name: "Resolve",
    meaning: "Steady courage in difficult times.",
    quote: '"I am a slow walker, but I never walk back."',
    author: "Abraham Lincoln",
    href: "./resolve.html",
  },
  {
    key: "republic",
    name: "The Republic",
    meaning: "A nation of laws sustained by citizens who defend it.",
    quote: '"A republic, if you can keep it."',
    author: "Benjamin Franklin",
    href: "./constitution.html",
  },
];

const BLOG_POSTS = [
  {
    title: "Truth Is The Best Defense",
    href: "./posts/truth-is-the-best-defense.html",
    category: "principles",
    publishedAt: "2026-03-21",
  },
  {
    title: "Actions Reveal What Words Conceal",
    href: "./posts/actions-reveal-what-words-conceal.html",
    category: "principles",
    publishedAt: "2026-03-14",
  },
  {
    title: "The Constitution Was Not a Suggestion",
    href: "./posts/the-constitution-was-written-with-purpose.html",
    category: "american_ideas",
    publishedAt: "2026-03-03",
  },
  {
    title: "Why Character Matters More Than Reputation",
    href: "./posts/why-character-matters-more-than-reputation.html",
    category: "principles",
    publishedAt: "2026-03-04",
  },
];

yearEl.textContent = String(new Date().getFullYear());
applyStoreLinks();
initHomepagePrinciples();
initLatestPrinciple();
initEmailSignup();
loadProducts();

async function loadProducts() {
  try {
    const response = await fetch("./data/products.json");
    if (!response.ok) {
      throw new Error(`Failed to load products (${response.status})`);
    }

    const products = await response.json();
    if (!Array.isArray(products) || products.length === 0) {
      if (dropCountLabel) dropCountLabel.textContent = "0 designs available";
      renderStatus("No products found yet. Add items to data/products.json.");
      return;
    }

    if (dropCountLabel) {
      dropCountLabel.textContent = `${products.length} ${
        products.length === 1 ? "design" : "designs"
      } available`;
    }

    renderProducts(products);
  } catch (error) {
    console.error(error);
    renderStatus(
      "Product data could not load. Preview with a local server or GitHub Pages."
    );
  }
}

function renderProducts(products) {
  productGrid.innerHTML = "";
  productStatus.hidden = true;

  const fragment = document.createDocumentFragment();

  for (const product of products) {
    const card = cardTemplate.content.firstElementChild.cloneNode(true);
    const cardMainLink = card.querySelector(".product-main-link");
    const nameLink = card.querySelector(".product-name-link");
    const printfulBtn = card.querySelector(".product-link-printful");
    const mockup = card.querySelector(".product-mockup");
    const headline = card.querySelector(".art-headline");
    const shirtName = product.name || "Untitled";
    const shirtCollection = slugify(shirtName);

    headline.textContent = product.artHeadline || shirtName || "New Design";
    nameLink.textContent = shirtName;
    const priceEl = card.querySelector(".product-price");
    const priceText = typeof product.price === "string" ? product.price.trim() : "";
    priceEl.textContent = priceText;
    priceEl.hidden = !priceText;
    card.querySelector(".product-tag").textContent =
      product.tagline || "Statement Tee";
    card.querySelector(".product-description").innerHTML = formatDescription(
      product.description || ""
    );
    card.querySelector(".badge-color").textContent = `Color: ${
      product.color || "N/A"
    }`;
    card.querySelector(".badge-fit").textContent = `Fit: ${
      product.fit || "Unisex"
    }`;

    const imageUrl = typeof product.image === "string" ? product.image.trim() : "";
    if (imageUrl) {
      mockup.src = imageUrl;
      mockup.alt = product.imageAlt || `${product.name || "Shirt"} mockup`;
      mockup.hidden = false;
      headline.hidden = true;
      card.classList.add("has-image");
    } else {
      mockup.removeAttribute("src");
      mockup.alt = "";
      mockup.hidden = true;
      headline.hidden = false;
      card.classList.remove("has-image");
    }

    wireProductLink(
      printfulBtn,
      product.printfulUrl,
      "Shop the Collection"
    );
    wireProductLink(
      cardMainLink,
      product.printfulUrl,
      `${shirtName || "Shirt"} printful listing`
    );
    wireProductLink(
      nameLink,
      product.printfulUrl,
      `${shirtName || "Shirt"} printful listing`
    );

    if (printfulBtn) {
      printfulBtn.setAttribute("data-track-store", "");
      printfulBtn.setAttribute("data-store", "printful");
      printfulBtn.addEventListener("click", () => {
        trackEvent("shirt_click", {
          shirt_name: shirtName,
          shirt_collection: shirtCollection,
          button_location: "homepage_buy_button",
        });
        trackEvent("buy_click", {
          shirt_name: shirtName,
          store: "printful",
        });
      });
    }

    cardMainLink.setAttribute("data-track-store", "");
    cardMainLink.setAttribute("data-store", "printful");
    nameLink.setAttribute("data-track-store", "");
    nameLink.setAttribute("data-store", "printful");

    cardMainLink.addEventListener("click", () => {
      trackEvent("shirt_click", {
        shirt_name: shirtName,
        shirt_collection: shirtCollection,
        button_location: "homepage_feature",
      });
      trackEvent("shirt_image_click", {
        shirt_name: shirtName,
        page: "homepage",
      });
    });

    nameLink.addEventListener("click", () => {
      trackEvent("shirt_click", {
        shirt_name: shirtName,
        shirt_collection: shirtCollection,
        button_location: "homepage_title",
      });
    });

    fragment.append(card);
  }

  productGrid.append(fragment);
}

function wireProductLink(anchor, href, label) {
  const url = typeof href === "string" ? href.trim() : "";
  if (!anchor) return;
  if (anchor.classList.contains("btn") && anchor.textContent.trim().length === 0) {
    anchor.textContent = label;
  }

  if (!url) {
    anchor.href = "#";
    anchor.setAttribute("aria-disabled", "true");
    anchor.title = `${label} link not added yet`;
    anchor.classList.add("is-disabled");
    return;
  }

  anchor.href = url;
  anchor.setAttribute("aria-label", label);
  anchor.target = "_blank";
  anchor.rel = "noreferrer";
  anchor.removeAttribute("aria-disabled");
  anchor.removeAttribute("title");
  anchor.classList.remove("is-disabled");
}

function applyStoreLinks() {
  wireStaticLink(printfulCollectionLink, STORE_LINKS.printful);
  wireStaticLink(printfulTile, STORE_LINKS.printful);
  wireStaticLink(footerPrintfulLink, STORE_LINKS.printful);
  wireStaticLink(facebookLink, SOCIAL_LINKS.facebook, "Facebook");
  wireStaticLink(instagramLink, SOCIAL_LINKS.instagram, "Instagram");
  wireStaticLink(xLink, SOCIAL_LINKS.x, "X");
  wireStaticLink(footerFacebookLink, SOCIAL_LINKS.facebook, "Facebook");
  wireStaticLink(footerInstagramLink, SOCIAL_LINKS.instagram, "Instagram");
  wireStaticLink(footerXLink, SOCIAL_LINKS.x, "X");
}

function wireStaticLink(anchor, href, label = "Link") {
  if (!anchor) return;
  const url = typeof href === "string" ? href.trim() : "";
  if (!url) {
    anchor.href = "#";
    anchor.setAttribute("aria-disabled", "true");
    anchor.title = `${label} link coming soon`;
    anchor.classList.add("is-disabled");
    return;
  }
  anchor.href = url;
  anchor.target = "_blank";
  anchor.rel = "noreferrer";
  anchor.removeAttribute("aria-disabled");
  anchor.removeAttribute("title");
  anchor.classList.remove("is-disabled");
}

function renderStatus(message) {
  productGrid.innerHTML = "";
  productStatus.textContent = message;
  productStatus.hidden = false;
}

function initEmailSignup() {
  if (!emailSignupForm) return;

  emailSignupForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(emailSignupForm);
    const email = String(formData.get("email") || "").trim();
    if (!email) return;

    const subject = encodeURIComponent("Angry Abe Weekly Drop Signup");
    const body = encodeURIComponent(
      `Please add this email to weekly drop updates:\n\n${email}`
    );
    trackEvent("newsletter_signup", {
      source_page: "homepage",
      signup_location: "homepage",
    });
    window.location.href = `mailto:angry_abe@macdne.com?subject=${subject}&body=${body}`;
    emailSignupForm.reset();
  });
}

function slugify(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function trackEvent(name, params) {
  window.AAAnalytics?.track?.(name, params);
}

function formatDescription(text) {
  const clean = String(text || "").trim();
  if (!clean) return "";

  const match = clean.match(/^(.*?[.!?])(\s+.*)?$/);
  if (!match) return escapeHtml(clean);

  const lead = escapeHtml(match[1].trim());
  const rest = escapeHtml((match[2] || "").trim());
  return rest ? `<strong>${lead}</strong> ${rest}` : `<strong>${lead}</strong>`;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function initHomepagePrinciples() {
  if (
    !heroPrincipleName ||
    !heroPrincipleMeaning ||
    !heroPrincipleLink ||
    !heroQuoteText ||
    !heroQuoteAuthor ||
    !heroPrincipleCta
  ) {
    return;
  }

  let index = 0;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fadeTargets = [
    heroPrincipleName,
    heroPrincipleMeaning,
    heroPrincipleLink,
    heroQuoteText,
    heroQuoteAuthor,
    heroPrincipleCta,
  ];

  function renderPrinciple(principle) {
    heroPrincipleName.textContent = principle.name;
    heroPrincipleMeaning.textContent = principle.meaning;
    heroQuoteText.textContent = principle.quote;
    heroQuoteAuthor.textContent = principle.author;
    heroPrincipleLink.href = principle.href;
    heroPrincipleLink.setAttribute("data-principle", principle.key);
    heroPrincipleLink.setAttribute(
      "aria-label",
      `Open ${principle.name} principle page`
    );
    heroPrincipleCta.href = principle.href;
    heroPrincipleCta.setAttribute("data-principle", principle.key);
    heroPrincipleCta.textContent = `Enter ${principle.name}`;
  }

  function rotatePrinciple() {
    fadeTargets.forEach((node) => node.classList.add("is-fading"));

    window.setTimeout(() => {
      index = (index + 1) % HOMEPAGE_PRINCIPLES.length;
      renderPrinciple(HOMEPAGE_PRINCIPLES[index]);
      fadeTargets.forEach((node) => node.classList.remove("is-fading"));
    }, 220);
  }

  renderPrinciple(HOMEPAGE_PRINCIPLES[index]);

  if (!reduceMotion) {
    window.setInterval(rotatePrinciple, 6000);
  }
}

function initLatestPrinciple() {
  if (!latestPrincipleLink || !latestPrincipleTitle || !latestPrincipleMeta) {
    return;
  }

  const latestPost = [...BLOG_POSTS].sort((a, b) =>
    b.publishedAt.localeCompare(a.publishedAt)
  )[0];

  if (!latestPost) {
    latestPrincipleLink.href = "./blog.html";
    latestPrincipleTitle.textContent = "Read the latest thinking";
    latestPrincipleMeta.textContent = "Open the blog";
    return;
  }

  latestPrincipleLink.href = latestPost.href;
  latestPrincipleLink.setAttribute("data-post-title", latestPost.title);
  latestPrincipleLink.setAttribute("data-post-category", latestPost.category);
  latestPrincipleTitle.textContent = latestPost.title;
  latestPrincipleMeta.textContent = `Published ${formatPublishedDate(
    latestPost.publishedAt
  )}`;
}

function formatPublishedDate(value) {
  const date = new Date(`${value}T12:00:00`);
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
}
