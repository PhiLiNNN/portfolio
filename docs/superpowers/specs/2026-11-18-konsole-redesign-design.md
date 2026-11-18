# Portfolio-Redesign „Konsole" – Design-Spezifikation

Stand: 2026-11-18. Freigegeben von Philipp auf Basis der Vorschau
`docs/design-proposals/konsole.html` (Palette Violett, Material Hybrid).

## Ziel

Komplette visuelle Neugestaltung von philipp-wendschuch.dev im Stil eines
Hardware-Pults: sauberer Neumorphismus (Element in Hintergrundfarbe, Schatten
als dunklerer und hellerer Ton derselben Farbe, großer Blur, kein Rand), Glas
nur für Flächen, matte Bedienelemente. Dunkel ist der Standard, Hell bleibt
als normaler Schalter. Neue Inhalte: Werdegang mit Mitgründer-Einträgen
(Webwerk Leipzig mit Backlink, traudel.app) und ein sichtbarer Abschnitt
„Abseits vom Code" mit persönlichen Fakten. Wenige, selbsterklärende Easter
Eggs.

Nicht Teil des Ziels: Stack-Wechsel. Angular 21 + SSR + Prerender, ngx-translate
(DE/EN), PHP-Mail-Endpunkt, Umami, Syne/Overpass selbst gehostet, strikte CSP
bleiben.

## Design-Tokens

Alle Tokens als CSS Custom Properties in `src/styles/_tokens.scss`, gesetzt auf
`:root` (dunkel) und `:root[data-theme="light"]`. Komponenten verwenden nur
`var(--…)`, keine Hex-Werte.

Dunkel (Violett auf Pflaume):

| Token | Wert | Rolle |
|---|---|---|
| `--bg` | `#26232e` | Hintergrund und Element-Grundfarbe |
| `--lo` | `#1b1921` | dunkler Schattenton |
| `--hi` | `#312d3b` | heller Schattenton |
| `--hi-soft` / `--lo-soft` | `#292631` / `#23202a` | konvexer Verlauf für Bedienelemente |
| `--text` | `#edf0f3` | Text |
| `--muted` | `#9aa4b0` | Nebentext |
| `--accent` | `#b48cff` | LED, Primär-Button, Fokus |
| `--on-accent` | `#1b0f33` | Text auf Akzent |
| `--accent-2` | `#2ee6a6` | zweite Status-LED („im Aufbau") |

Hell:

| Token | Wert |
|---|---|
| `--bg` | `#e6e2f0` |
| `--lo` | `#c1bccf` |
| `--hi` | `#ffffff` |
| `--hi-soft` / `--lo-soft` | `#ede9f5` / `#dfdaea` |
| `--text` | `#1e1b27` |
| `--muted` | `#5e5970` |
| `--accent` | `#7a4df5` |
| `--on-accent` | `#f6f2ff` |
| `--accent-2` | `#0a9a6c` |

Schatten (identisch in beiden Modi, nur die Töne wechseln):

- `--raise`: `10px 10px 28px var(--lo), -10px -10px 28px var(--hi)`
- `--raise-hi` (Hover): `14px 14px 34px …`
- `--raise-sm`: `4px 4px 10px …`
- `--sink`: `inset 6px 6px 14px var(--lo), inset -6px -6px 14px var(--hi)`
- `--sink-soft`: `inset 3px 3px 8px …`
- `--convex`: `linear-gradient(145deg, var(--hi-soft), var(--lo-soft))`

Material Hybrid:

- Flächen (`.plate`): `linear-gradient(145deg, rgba(255,255,255,.09), rgba(255,255,255,.03))`,
  `backdrop-filter: blur(24px) saturate(1.2)`, Schatten `--raise` plus
  `inset 1px 1px 0 rgba(255,255,255,.1)`. Hell: Weißanteile .62/.3, Inset-Kante `#fff`.
- Vertiefungen (`.well`, Eingabefelder, Nav-Aktiv, Chips-aktiv): `rgba(0,0,0,.14)` (hell: `rgba(30,27,39,.05)`), Schatten `--sink`.
- Bedienelemente (Buttons, Schalter, Fader-Knöpfe, Drehknopf): `--convex`, Schatten `--raise`, gedrückt `--sink`.
- Hintergrund-Lichter: drei weiche Radialflecken in `--accent`-Tönen, Deckkraft .45, langsame Drift (30 s), aus bei `prefers-reduced-motion`.

Radien: Karten 22px, Buttons/Chips 16px, Eingaben 16px, runde Icon-Buttons 50 %.
Akzentfarbe ist per Drehknopf überschreibbar (`--hue`, siehe Easter Eggs).

Akzent-Hue-Override: Wenn ein Hue gespeichert ist, setzt ein Attribut
`data-hue` auf `<html>` die Akzent-Tokens auf `hsl(var(--hue) 85% 62%)` (hell:
`hsl(var(--hue) 70% 42%)`); `--accent-2` ist `hue + 160`.

## Typografie

- Display und Überschriften: Syne 800. Hero `clamp(40px, 8.4vw, 118px)`, Zeilenhöhe .98, Laufweite −2 %.
- Abschnittstitel: Syne 800, `clamp(26px, 3vw, 34px)`.
- Kartentitel: Syne 800, `clamp(22px, 2.2vw, 28px)`.
- Fließtext: Overpass 400, 17px / 1.55, max. 62ch. Nebentext 14–15px in `--muted`.
- Keine neuen Fonts.

## Seitenaufbau (Startseite, in dieser Reihenfolge)

1. **Header** (fixiert): Logo „PW" als erhabene Platte (Text, Syne 800, kein Bild), Nav-Pillen Start · Projekte · Werdegang · Kontakt (aktive Position eingelassen, Scroll-Spy), Schalter Hell/Dunkel, Schalter DE/EN, Burger ab 900px, der die Nav als Overlay-Platte öffnet.
2. **Hero** (`id="home"`): LED-Zeile (siehe Nachtschicht), Headline in drei Zeilen: „Full-Stack" / „Developer" (eingeprägt: Farbe `--bg`, Textschatten `2px 2px 2px var(--hi), -2px -2px 2px var(--lo)`) / „aus Leipzig." (EN: „from Leipzig."). Darunter die unsichtbare Zeile „Coding with Heart" (Taschenlampe). Lede-Text, zwei CTAs (Primär „Projekt besprechen" → Kontakt, Sekundär „Meine Arbeit ansehen" → Projekte), rechts der Drehknopf.
3. **Über mich** (`id="about"`): Platte mit Text (bestehender Text, letzter Satz ersetzt durch die Kontakt-Aufforderung), Portrait als eingelassenes, abgerundetes Bild, Button „Lass uns reden".
4. **Abseits vom Code** (`id="offcode"`): sechs Platten mit LED-Label, Titel, Text (Inhalt siehe unten). Das Musik-Modul hat einen Button „Video ansehen".
5. **Skills** (`id="skills"`): drei Platten (Frontend, Backend, DevOps & Tools), je Fader-Liste mit Icon, Name, Fader ohne Zahl. Fader fahren beim ersten Sichtbarwerden von 0 auf Zielwert (eine Animation, 600 ms, gestaffelt 60 ms; bei reduced-motion sofort).
6. **Was ich anbiete** (`id="services"`): drei Platten mit Titel, Text, Tags als eingelassene Chips (Inhalt bleibt).
7. **Werdegang** (`id="experience"`): zwei Platten:
   - LED-Label „Mitgründer" · Titel „Webwerk Leipzig" · Text (DE) „Zu zweit bauen wir schnelle, handgemachte Webseiten für Betriebe in Leipzig, persönlich und lokal." · Link `https://webwerk-leipzig.de` (sichtbarer Text „webwerk-leipzig.de", `rel="noopener"`, kein `nofollow`, neuer Tab).
   - LED-Label (Status-LED `--accent-2`) „Mitgründer, im Aufbau" · Titel „traudel.app" · Text „Nachbarschaft heißt mehr als nebeneinander wohnen. Traudel bringt Nachbarn wieder zusammen: Hilfe, ehrliche Empfehlungen, Verleihen. Läuft im Browser und auf dem Handy." · Chips „Kostenlos", „Keine Werbung", „Geben & Leihen", „Gebaut in Leipzig" · Statuszeile „Noch nicht öffentlich. Mehr, sobald es losgeht."
8. **Projekte** (`id="projects"`): drei Platten (Join, Sharkie, PokéCubes) mit eingelassenem Screenshot, Titel, Skills-Chips, Text, Buttons „GitHub" und „Live" (bestehende Daten aus i18n).
9. **Kontakt** (`id="contact"`): Platte mit Titel, Text, Formular (Name, E-Mail, Nachricht, Datenschutz-Checkbox als eingelassene Box, Honeypot, Spinner, Fehlertext). Logik, Endpunkt und Validierung bleiben unverändert. Erfolg zeigt ein natives `<dialog>` (ersetzt MatDialog).
10. **Footer**: Logo-Platte (Scroll nach oben), „© {Jahr} Philipp Wendschuch, Leipzig", Mail-Link, GitHub/Mail/LinkedIn als runde Buttons, Link Impressum, Link Datenschutz, Kassetten-Symbol (fast unsichtbar).

Impressum und Datenschutz: bestehender Inhalt in einer Platte, gleiche Tokens, Zurück-Button als runder Button.

Mobile: Container-Padding 20px, Hero-Headline `clamp` greift, Drehknopf wandert unter die CTAs, Nav im Overlay, Raster fällt auf eine Spalte. Keine horizontale Scrollbar (`overflow-x: clip` auf `main`).

## Inhalte „Abseits vom Code" (DE; EN sinngemäß)

| LED-Label | Titel | Text |
|---|---|---|
| Klettern & Bouldern | Seit vier Jahren | In der Halle und am Fels. In Leipzig im Bloc, Onyx, No Limit und am Mockauer Turm, draußen in Löbejün und in der Sächsischen Schweiz. Vorstieg bis 7+ (UIAA), Boulder bis 5. |
| Musik (Status-LED) | Schlagzeug bei Empty Handed | Ein paar Jahre lang, heute nicht mehr aktiv. Ein Video gibt es noch. [Button „Video ansehen"] |
| Sport | Klettern ist der Hauptsport | Dazu zwei- bis dreimal die Woche Gym, gelegentlich Padel. Davor 19 Jahre Fußball. |
| Arbeitszeit (Status-LED) | Oft bis spät | Abends ist es ruhig. Da kann ich mich am besten konzentrieren, also arbeite ich dann. |
| Vorher | Logistik, dann Medizinphysik | Zehn Jahre Logistik, danach der Master. Die Abschlussarbeit habe ich bei Positrigo geschrieben, einem Startup mit einem PET-Scanner speziell für Hirnaufnahmen (NeuroLF). Dort habe ich die NEMA-Messungen durchgeführt und ausgewertet. |
| Werdegang (Status-LED) | Ehrgeizig | Was ich anfange, ziehe ich durch. Der Weg dahin überrascht die meisten: Hauptschulabschluss, später der Master in Medizinphysik, heute hauptberuflich Softwareentwickler. Mein Traumberuf. |

Tonalität überall: neutral, professionell, leicht salopp. Keine Wertungen, keine
Pointen, keine Vergleiche zwischen Hobby und Code.

## Easter Eggs (genau diese fünf)

1. **Taschenlampe**: „Coding with Heart" unter der Hero-Headline, Text transparent mit `background-clip: text` und radialem Verlauf an der Zeigerposition (160px Radius). Zeigerposition per `pointermove` auf dem Hero in CSS-Variablen `--mx/--my`. Bei `hover: none` stattdessen ein langsamer Lichtstreifen (5 s Loop). Zeile ist `aria-hidden`.
2. **Drehknopf**: 120px-Knopf im Hero, `role="slider"` (0–360), Drag per Pointer Events, Pfeiltasten ±6°. Setzt `--hue` und `data-hue` auf `<html>`, speichert in `localStorage` (`accent-hue`). Ohne gespeicherten Wert gilt die Standardpalette. `theme-init.js` wendet den gespeicherten Hue vor dem ersten Paint an.
3. **Nachtschicht**: LED-Zeile zeigt zwischen 0 und 5 Uhr Ortszeit (Browser) „Noch wach? Ich meistens auch. Abends arbeite ich am besten." mit Status-LED, sonst „Verfügbar für neue Projekte". Nur im Browser ausgewertet, SSR rendert den Tag-Text.
4. **Kassette**: Button im Footer (Deckkraft .45, auf Hover/Fokus 1, `aria-label` „Empty Handed Video") öffnet dasselbe `<dialog>` wie der Button im Musik-Modul: Titel, ein Satz, Button „Video laden", erst dann `<iframe src="https://www.youtube-nocookie.com/embed/OoIa7-U1SbE">`. CSP: `frame-src https://www.youtube-nocookie.com` in `.htaccess` und `server.ts` ergänzen.
5. **Unter der Haube**: `console.log` beim Start im Browser (zwei Zeilen, siehe Vorschau); HTML-Kommentar oben in `index.html` (zwei Zeilen: Technik und Kontakt); `public/humans.txt` nach humanstxt.org (TEAM, SITE: letztes Update, Sprachen, Standards, Komponenten) und `<link rel="author" href="humans.txt">` im Head.

## Entfernt

- Angular Material und CDK (MatDialog, cdkTrapFocus): ersetzt durch natives `<dialog>` und eigenen Fokus-Trap im Overlay-Menü. Pakete werden aus `package.json` entfernt, `styles.scss` verliert das Material-Theme.
- Pfeil-Komponente, Referenz-Links/Rechts-Komponenten, Burger-SVG-Sequenz, Erdkugel-Sprachmenü, alte Masken-Logik im Hero, Logo-PNGs im Header (Datei bleibt für den Footer-Fallback vorerst, Verwendung entfällt).
- `.autoShow`-Scroll-Animation auf jedem Abschnitt. Einzige Einblend-Animation: Fader beim ersten Sichtbarwerden.

## Technik

- Komponenten (standalone, OnPush): `header`, `hero`, `about`, `off-code`, `skills`, `services`, `experience`, `projects`, `contact`, `footer`, `video-dialog`, `imprint`, `privacy-policy`. Shared: `ThemeService` (Theme + Hue, localStorage, SSR-sicher), `ScrollSpyDirective`, `InViewDirective` (IntersectionObserver, einmalig).
- Routen bleiben: `/`, `/imprint`, `/privacy-policy`, Redirect `/privacyPolicy`.
- i18n: alle neuen Texte in `en.json` und `ger.json`. Keine hartcodierten UI-Texte außer Eigennamen.
- SSR: jeder Zugriff auf `window`, `document`, `localStorage`, `IntersectionObserver` hinter `isPlatformBrowser`. Prerender muss weiterhin durchlaufen.
- CSP bleibt strikt (`script-src 'self' https://c.kunisch.tech`), kein Inline-Script. Zusätzlich `frame-src https://www.youtube-nocookie.com`.
- Budgets in `angular.json`: `anyComponentStyle` auf 20kB Warnung / 32kB Fehler anheben, falls die Token-Nutzung das verlangt; Initial-Budget bleibt.
- A11y: Fokus-Ringe `3px solid var(--accent)`, Skip-Link, `aria-current` auf aktiver Nav, Schalter als `role="switch"`, Overlay-Menü mit Escape und Fokus-Rückgabe, `prefers-reduced-motion` schaltet Drift, Fader-Animation und Lichtstreifen ab. Kontraste: `--muted` auf `--bg` ≥ 4.5:1 in beiden Modi (geprüft: dunkel 6.9:1, hell 5.6:1).
- Tests (Karma/Jasmine, bestehende Konfiguration): `ThemeService` (Theme-Wechsel, Hue-Ableitung, Persistenz), Nachtschicht-Funktion `isNightShift(date)`, Kontaktformular-Guard gegen Doppelsenden (bestehendes Verhalten).

## Abnahme

- `npm run build` ohne Fehler, Prerender der drei Routen läuft durch.
- Dunkel und Hell geprüft auf 1400px und 390px.
- Alle fünf Easter Eggs funktionieren, keine weiteren.
- Backlink auf webwerk-leipzig.de ist ein normaler `<a href>` ohne `nofollow`.
