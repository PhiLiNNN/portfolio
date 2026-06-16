# Portfolio — Philipp Wendschuch

Personal portfolio site built with **Angular 21** (standalone components) and
**Angular SSR** (server-side rendering + hydration).

## Stack

- Angular 21 + Angular Material 21
- SSR via `@angular/ssr` + Express (`server.ts`)
- i18n with `@ngx-translate` (DE/EN, files in `public/assets/i18n/`)
- Self-hosted fonts (Syne, Overpass) — no Google Fonts CDN
- Privacy-friendly, self-hosted [Umami](https://umami.is) analytics
- Contact form posts to a PHP `mail()` endpoint (`src/app/sendMail.php`)

## Development

```bash
npm install
npm start          # ng serve → http://localhost:4200/
```

## Build

```bash
npm run build      # production build into dist/
```

## SSR

```bash
npm run serve:ssr:portfolio   # serves the SSR build from dist/
```

## Tests

```bash
npm test           # Karma + Jasmine
```

## Notes

- The contact form sends mail via `src/app/sendMail.php` on the production host.
  It must be deployed alongside the static build and validated/hardened
  server-side (see project notes on input validation and spam protection).
