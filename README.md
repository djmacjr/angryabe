# Angry Abe Website (Scratch Rebuild)

Dark, single-page storefront for the Angry Abe brand with a data-driven product grid.

## Included

- `/Users/dmacdonald/Documents/New project/index.html` - homepage layout
- `/Users/dmacdonald/Documents/New project/styles.css` - dark theme styling (mobile + desktop)
- `/Users/dmacdonald/Documents/New project/script.js` - renders products and store links
- `/Users/dmacdonald/Documents/New project/data/products.json` - product catalog (edit weekly)
- `/Users/dmacdonald/Documents/New project/assets/AngryAbe_Circle_white.svg` - logo asset
- `/Users/dmacdonald/Documents/New project/assets/AngryAbe_Tall_White.svg` - logo asset
- `/Users/dmacdonald/Documents/New project/assets/AngryAbe_Nape_white.svg` - logo asset

## Weekly update flow

1. Open `/Users/dmacdonald/Documents/New project/data/products.json`
2. Copy one product object
3. Update:
   - `name`
   - `description`
   - `artHeadline`
   - `image` (optional now, recommended)
   - `printfulUrl`
   - optional `price`, `tagline`, `color`, `fit`

## Shirt mockups (styled cards)

The product cards are already styled to make gray-background mockups look intentional on the dark site.

When you send/add PNG files, place them in:

- `/Users/dmacdonald/Documents/New project/assets/products/`

Then set image paths in `/Users/dmacdonald/Documents/New project/data/products.json`, for example:

- `"image": "./assets/products/action-shirt.png"`

## Social links

Update social URLs in `/Users/dmacdonald/Documents/New project/script.js` inside `SOCIAL_LINKS`:

- `facebook`
- `instagram`
- `x`

## Blog workflow

- Feed page: `/Users/dmacdonald/Documents/New project/blog.html`
- Post template: `/Users/dmacdonald/Documents/New project/posts/post-template.html`
- Starter post: `/Users/dmacdonald/Documents/New project/posts/why-character-matters-more-than-reputation.html`

To publish a new post:

1. Copy `posts/post-template.html` to a new file in `posts/`.
2. Update title, metadata, headings, and body.
3. Add a post card link in `blog.html` under `Latest Posts`.
4. Push to GitHub and it is live.

## Local preview

Because the site loads JSON, use a local server (not double-clicking the HTML file):

- `python3 -m http.server`

Then open the local URL shown in the terminal.

## GitHub Pages deploy

1. Push this folder to GitHub
2. Go to repo `Settings` -> `Pages`
3. Set:
   - `Source`: `Deploy from a branch`
   - Branch: `main` (or your default branch)
   - Folder: `/ (root)`
4. Save

## Next improvements (easy additions)

- Add real shirt mockup images to product cards
- Add your custom web domain to metadata + header/footer
- Add social links
- Add category filters as the catalog grows
