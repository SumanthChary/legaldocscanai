# LegalDocsCan AI

> AI-native legal intelligence workspace for scanning, summarizing, and collaborating on complex documents.

## Overview

LegalDocsCan AI is a modern SaaS experience that fuses legal expertise with automation. The product was conceived, assembled, and refined with a no-code + AI toolkit (Lovable, design copilots, and prompt-driven workflows), then polished manually inside this repo. The result is a production-ready React/Vite application with enterprise-grade UI patterns, Supabase integrations, and mobile-friendly layouts aimed at legal teams that need accurate document insight fast.

## Key Capabilities

- End-to-end document analysis, summaries, and redlines powered by AI backends.
- Dashboard, gallery, and chat-style review surfaces optimized for both desktop and mobile.
- Supabase + Whop integrations for auth, billing, and invitation flows.
- Rich marketing site (pricing, features, blog, FAQs) rendered with shadcn-ui primitives and Tailwind themes that mirror the LegalDeep aesthetic.
- Mobile-ready experience with custom hooks (`use-mobile`, `use-auto-scroll`) and safe-area utilities.

## Built With No-Code + AI

- Initial scaffolding, component generation, and asset sourcing were orchestrated through Lovable (a no-code/low-code AI builder).
- Visual system, typography, and layout refinements leveraged AI design copilots for fast iteration.
- This repository captures the final hand-tuned code so teams can audit, extend, and self-host while still benefiting from the rapid build cycle provided by AI tooling.

## Tech Stack

| Layer | Details |
| --- | --- |
| Framework | Vite + React 18 + TypeScript |
| UI System | shadcn-ui, Tailwind CSS, custom motion utilities |
| State/Data | Supabase integrations, custom hooks, local context providers |
| Mobile | Responsive layouts, Capacitor-ready structure, safe-area helpers |
| Tooling | ESLint, PostCSS, tsconfig paths, Lovable automation workflows |

## Getting Started

You'll need Node.js 18+ (recommend installing via [nvm](https://github.com/nvm-sh/nvm#installing-and-updating)) and npm.

```bash
# 1. Clone
git clone https://github.com/SumanthChary/legaldocscanai.git
cd legaldocscanai

# 2. Install dependencies
npm install

# 3. Run the development server
npm run dev
```

Visit `http://localhost:5173` to explore the app. Hot reload is enabled by default.

### Useful Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | Production build (Vite + TypeScript checks) |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint across the project |

### Environment Variables

Supabase keys, Whop tokens, and third-party credentials live under the `/supabase` directory and environment files. Create a `.env` based on any provided `.env.example` (or coordinate with the infra team) before running backend-connected features.

## Design & Product Notes

- Typography follows Host Grotesk + Instrument Serif pairings to mirror the LegalDeep reference brand.
- Color tokens are defined in `src/index.css` and consumed via Tailwind CSS variables for easy theming.
- Components live in `src/components` by domain (dashboard, chat, document-analysis, etc.) while routed views live in `src/pages`.
- Mobile experiences have dedicated screens (`src/pages/Mobile*`) and share logic via hooks in `src/hooks`.

## Deployment

1. **Lovable Publish (No-Code Path)**  
   Open the [Lovable project](https://lovable.dev/projects/23c234e7-6ce5-45ea-922e-e53a2fe9f5fe), hit **Share → Publish**, and the AI builder will redeploy the hosted experience automatically.

2. **Manual Deploy (Self-Host)**  
   - Run `npm run build` to generate the static assets in `dist/`.
   - Deploy the contents of `dist/` to your host (Netlify, Vercel, Cloudflare Pages, etc.).
   - Wire up Supabase, Whop, and any serverless functions (see `/supabase/functions`) to match your environment.

## Contributing

1. Fork / clone the repo.
2. Create a feature branch (`git checkout -b feature/my-update`).
3. Make changes + run `npm run lint` and `npm run build`.
4. Submit a PR with screenshots or Loom links for UI changes.

Issues and feature ideas are welcome via GitHub issues or through the Lovable prompt UI.

## Support & Contact

- Product questions: raise an issue or ping the team owner.
- Infrastructure/Supabase: see `/supabase/README` (if present) or contact the platform engineer.
- Lovable-specific help: review [Lovable docs](https://docs.lovable.dev/) or reach out via their support channel.

## Acknowledgements

- Built with the help of Lovable’s no-code automation platform and multiple AI copilots.
- Thanks to the open-source community behind Vite, shadcn-ui, and Supabase for the foundational tooling.
