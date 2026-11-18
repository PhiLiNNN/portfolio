# Portfolio — Philipp Wendschuch

Personal portfolio site built with **Angular 21** (standalone components) and
**Angular SSR** (server-side rendering, prerender + hydration).

Design: "Konsole" — clean neumorphism (element in background colour, shadows as
darker/lighter tones of that colour, large blur, no borders), glass plates for
surfaces, matt controls. Dark is the default, light is a normal toggle. The
design spec lives in `docs/superpowers/specs/2026-11-18-konsole-redesign-design.md`,
the design previews in `docs/design-proposals/`.

## Stack

- Angular 21, no UI library (native `<dialog>`, own controls)
- SSR via `@angular/ssr` + Express (`server.ts`), prerendered routes
- i18n with `@ngx-translate` (DE/EN, files in `public/assets/i18n/`)
- Self-hosted fonts (Syne, Overpass) — no Google Fonts CDN
- Privacy-friendly, self-hosted [Umami](https://umami.is) analytics
- Contact form posts to a PHP `mail()` endpoint (`public/sendMail.php`)
- Strict CSP (`public/.htaccess` for the static host, `server.ts` for Node)

## Structure

```
src/styles/_tokens.scss      design tokens (colours, shadows, radii), light theme, hue override
src/styles.scss              fonts, base, shared classes (.plate, .well, .btn, .led, .fader, …)
src/app/sections/*           hero, about, off-code, skills, services, experience, projects, contact
src/app/shared/*             header (nav + overlay), footer, video dialog, theme/scroll services
public/theme-init.js         applies stored theme + accent hue before first paint (CSP-safe)
public/humans.txt            humanstxt.org file, linked via <link rel="author">
```

## SEO

- Four focus-area pages (`src/app/topics/`), content in the i18n files under
  `topics.*`, routes in `topics.ts`. They are prerendered and linked from the
  footer. Add a page: entry in `TOPICS`, texts in both JSON files, URL in
  `public/sitemap.xml`.
- `SeoService` sets title, description, canonical and Open Graph tags per
  route and injects the Person JSON-LD. `robots.txt` and `sitemap.xml` live in
  `public/`.

## Small details worth knowing

- **Flashlight**: "Coding with Heart" under the hero headline is only visible
  around the pointer (`.secret` in `hero.component.scss`).
- **Dial**: the knob in the hero sets the accent hue (`ThemeService.setHue`),
  stored as `accent-hue` in localStorage. Double-click resets it.
- **Night shift**: between 0:00 and 4:59 local time the status line changes
  (`shared/night-shift.ts`).
- **Video**: the Empty-Handed video (footer cassette, "Abseits vom Code") uses
  youtube-nocookie and loads only after an explicit click (`frame-src` in CSP).
- **Spam protection** (no third party): honeypot field `website`, a
  proof-of-work challenge issued by `sendMail.php?challenge=1` and solved in
  the browser (`shared/pow.service.ts`, ALTCHA-compatible scheme), a minimum
  time between challenge and submit, and one-time use of each challenge.
  Set `pow_secret` in `mail-config.php` on the server.
  To test it locally: put a `mail-config.php` next to `public/sendMail.php`
  (any values, see the example file), run `php -S 127.0.0.1:8787 -t public`,
  and start `ng serve`. In dev mode the form uses the local script when it
  answers on port 8787, otherwise the live one.
- **Favicon**: `public/favicon.svg` is the source; the PNGs (32, 180, 192, 512)
  are rendered from it.

## Development

```bash
npm install
npm start          # ng serve → http://localhost:4200/
```

## Build

```bash
npm run build      # production build + prerender into dist/
```

## SSR

```bash
npm run serve:ssr:portfolio   # serves the SSR build from dist/
```

## Tests

```bash
npm test           # Karma + Jasmine (ThemeService, night shift)
```

## Notes

- The contact form sends mail via `public/sendMail.php` on the production host.
  It must be deployed alongside the static build and validated/hardened
  server-side (see project notes on input validation and spam protection).
