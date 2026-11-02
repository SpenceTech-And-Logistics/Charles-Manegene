# Charles Muriuki: single-page site

React 19 + Vite 7, plain CSS. Built by SpenceTec and Logistics Limited.

## Edit
- All text, links and image lists: `src/content.js`
- Images: `public/images/`
- Contact details (email, phone, LinkedIn, optional Formspree id) are blank in `contact`; empty ones stay hidden.

## Run and deploy
```bash
npm install
npm run dev
npm run build        # outputs dist/
npx wrangler deploy  # Cloudflare Workers, SPA fallback in wrangler.jsonc
```

Cloudflare's Git builds need no separate build command: `wrangler.jsonc` runs `npm run build` before deploying, and `.node-version` selects Node 22 (Vite 7 does not run on Node 18).

## Motion
No animation library. CSS keyframes are in `src/styles.css`, and `src/motion.jsx` starts them on scroll. Add `data-r` to an element to reveal it on scroll. All motion stops when the device asks for reduced motion.

## Source
Built from Charles's own CV site export (WYSIWYG Web Builder). Nothing was added beyond that content. The Majira Eco figures (500 hectares, 54% carbon reduction) are the company's own claims as given in the source.
