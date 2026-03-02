const productGrid = document.querySelector("#productGrid");
const productStatus = document.querySelector("#productStatus");
const cardTemplate = document.querySelector("#productCardTemplate");
const heroQuote = document.querySelector("#heroQuote");

const yearEl = document.querySelector("#year");
const printfulCollectionLink = document.querySelector("#printfulCollectionLink");
const etsyShopLink = document.querySelector("#etsyShopLink");
const aboutUsLink = document.querySelector("#aboutUsLink");
const blogLink = document.querySelector("#blogLink");
const printfulTile = document.querySelector("#printfulTile");
const etsyTile = document.querySelector("#etsyTile");
const footerPrintfulLink = document.querySelector("#footerPrintfulLink");
const footerEtsyLink = document.querySelector("#footerEtsyLink");
const facebookLink = document.querySelector("#facebookLink");
const instagramLink = document.querySelector("#instagramLink");
const xLink = document.querySelector("#xLink");
const footerFacebookLink = document.querySelector("#footerFacebookLink");
const footerInstagramLink = document.querySelector("#footerInstagramLink");
const footerXLink = document.querySelector("#footerXLink");

const STORE_LINKS = {
  printful: "https://angryabe.printful.me/",
  etsy: "https://www.etsy.com/shop/AngryAbe",
};

const SOCIAL_LINKS = {
  facebook: "https://www.facebook.com/share/1Zwvomwfd1/?mibextid=wwXIfr",
  instagram: "https://www.instagram.com/angryabeproductions/",
  x: "https://x.com/abe_angry_pro",
};

const BRAND_LINKS = {
  about: "",
  blog: "",
};

const LINCOLN_QUOTES = [
  '"Whatever you are, be a good one."',
  '"I am a slow walker, but I never walk back."',
  '"You cannot escape the responsibility of tomorrow by evading it today."',
  '"Give me six hours to chop down a tree and I will spend the first four sharpening the axe."',
];

yearEl.textContent = String(new Date().getFullYear());
applyStoreLinks();
startHeroQuotes();
loadProducts();

async function loadProducts() {
  try {
    const response = await fetch("./data/products.json");
    if (!response.ok) {
      throw new Error(`Failed to load products (${response.status})`);
    }

    const products = await response.json();
    if (!Array.isArray(products) || products.length === 0) {
      renderStatus("No products found yet. Add items to data/products.json.");
      return;
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
    const mockup = card.querySelector(".product-mockup");
    const headline = card.querySelector(".art-headline");

    headline.textContent = product.artHeadline || product.name || "New Design";
    nameLink.textContent = product.name || "Untitled";
    const priceEl = card.querySelector(".product-price");
    const priceText = typeof product.price === "string" ? product.price.trim() : "";
    priceEl.textContent = priceText;
    priceEl.hidden = !priceText;
    card.querySelector(".product-tag").textContent =
      product.tagline || "Statement Tee";
    card.querySelector(".product-description").textContent =
      product.description || "";
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
      card.querySelector(".product-link-printful"),
      product.printfulUrl,
      "Buy Now"
    );
    wireProductLink(card.querySelector(".product-link-etsy"), product.etsyUrl, "Etsy");
    wireProductLink(
      cardMainLink,
      product.printfulUrl,
      `${product.name || "Shirt"} printful listing`
    );
    wireProductLink(
      nameLink,
      product.printfulUrl,
      `${product.name || "Shirt"} printful listing`
    );

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
  wireStaticLink(etsyShopLink, STORE_LINKS.etsy);
  wireStaticLink(aboutUsLink, BRAND_LINKS.about, "About Us");
  wireStaticLink(blogLink, BRAND_LINKS.blog, "Blog");
  wireStaticLink(printfulTile, STORE_LINKS.printful);
  wireStaticLink(etsyTile, STORE_LINKS.etsy);
  wireStaticLink(footerPrintfulLink, STORE_LINKS.printful);
  wireStaticLink(footerEtsyLink, STORE_LINKS.etsy);
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

function startHeroQuotes() {
  if (!heroQuote) return;
  let index = 0;
  heroQuote.textContent = LINCOLN_QUOTES[index];
  setInterval(() => {
    index = (index + 1) % LINCOLN_QUOTES.length;
    heroQuote.textContent = LINCOLN_QUOTES[index];
  }, 4500);
}
