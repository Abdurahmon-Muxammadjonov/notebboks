# TS Notebook Shop

Next.js + TypeScript + Tailwind starter for your tech-store UI.

## Quick start

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Supabase

Create `.env.local` in the project root:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

Expected `products` table columns:

- `id`
- `name`
- `price`
- `old_price`
- `image_url`
- `rating`
- `reviews_count`
- `stock_status` with values `in_stock` or `check_availability`

If Supabase env vars or rows are missing, the homepage shows fallback demo products automatically.

## Build

```bash
npm run build
npm run start
```
