const productGrid = document.querySelector("#productGrid");
const productStatus = document.querySelector("#productStatus");
const cardTemplate = document.querySelector("#productCardTemplate");
const heroProductCount = document.querySelector("#heroProductCount");

const yearEl = document.querySelector("#year");
const printfulCollectionLink = document.querySelector("#printfulCollectionLink");
const etsyShopLink = document.querySelector("#etsyShopLink");
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
  facebook: "https://facebook.com/angryabe",
  instagram: "https://instagram.com/angryabe",
  x: "",
};

yearEl.textContent = String(new Date().getFullYear());
applyStoreLinks();
loadProducts();

async function loadProducts() {
  try {
    const response = await fetch("./data/products.json");
    if (!response.ok) {
      throw new Error(`Failed to load products (${response.status})`);
    }

    const products = await response.json();
    if (!Array.isArray(products) || products.length === 0) {
      heroProductCount.textContent = "0";
      renderStatus("No products found yet. Add items to data/products.json.");
      return;
    }

    heroProductCount.textContent = String(products.length);
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
    const mockup = card.querySelector(".product-mockup");
    const headline = card.querySelector(".art-headline");

    headline.textContent = product.artHeadline || product.name || "New Design";
    card.querySelector(".product-name").textContent = product.name || "Untitled";
    card.querySelector(".product-price").textContent = product.price || "";
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

    fragment.append(card);
  }

  productGrid.append(fragment);
}

function wireProductLink(anchor, href, label) {
  const url = typeof href === "string" ? href.trim() : "";
  anchor.textContent = label;

  if (!url) {
    anchor.href = "#";
    anchor.setAttribute("aria-disabled", "true");
    anchor.title = `${label} link not added yet`;
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

function applyStoreLinks() {
  wireStaticLink(printfulCollectionLink, STORE_LINKS.printful);
  wireStaticLink(etsyShopLink, STORE_LINKS.etsy);
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
