# Threadline – Product Catalog

Responsive product catalog built with **React 18, TypeScript, React Router 6 and plain CSS**, using the
[Fake Store API (noksha)](https://fakestoreapi.noksha.dev/api/products).

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm test           # unit tests (Vitest + Testing Library)
npm run build      # type-check + production build
```

Optional: copy `.env.example` to `.env` to change the API base URL.

## Features

**Required**
- Product List page: grid with image, title, price and category (4 per row on desktop, 2 on tablet, 1 on mobile)
- Product Detail page: large image, title, price, description, category, "Back to Products" link
- React Router routes: `/` and `/products/:id` (plus a 404 page)
- Loading states (skeleton grid and skeleton detail) and error states with a "Try again" button
- Responsive at all sizes (breakpoints: under 640px, 640–1023px, 1024px and up; detail page stacks under 768px)

**Bonus**
- Category filter, search (title, brand, type, category) and sorting
- Filters are stored in the URL, so Back to Products keeps your filters
- TypeScript throughout
- Unit tests for utilities, API layer and `ProductCard`

**Extras**
- Fetches every page of the paginated list endpoint and de-duplicates by id
- Request cancellation (AbortController) when navigating away
- Detail page shows cached data instantly and falls back to it if the live request fails
- Image fallback, discount badge, star rating, size selector, stock status
- Accessibility: skip link, visible focus, ARIA labels, reduced-motion support

## Structure

```
src/
  api/          API client, error handling, cache (+ tests)
  components/   ProductCard, FilterBar, PriceTag, Rating, skeletons, status messages
  hooks/        useAsync (loading / error / retry / cancellation)
  pages/        ProductListPage, ProductDetailPage, NotFoundPage
  utils/        formatting, filtering and sorting (+ tests)
  index.css     design tokens and responsive layout
```

## Demo checklist
1. Open the home page.
2. Resize the window: 4, 2 and 1 columns.
3. Click any item.
4. Resize the detail page: two columns, then stacked.

## Notes
- The list API returns `{ data, totalPages, ... }`. The detail response is handled whether it is wrapped in `data` or returned as a bare object (`normalizeProduct`).
- For deployment, `public/_redirects` provides the SPA fallback on Netlify. On Vercel, add a rewrite of all routes to `/index.html`.
