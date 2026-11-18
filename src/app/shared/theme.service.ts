import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';

export type Theme = 'light' | 'dark';

const THEME_KEY = 'theme';
const HUE_KEY = 'accent-hue';

/** Normalise any number to the 0–359 hue range. */
export function normalizeHue(hue: number): number {
  const h = Math.round(hue) % 360;
  return h < 0 ? h + 360 : h;
}

/**
 * Theme (light/dark) and accent hue (the dial in the hero).
 * `theme-init.js` applies the stored values before first paint; this service
 * reads them back and keeps <html> attributes + localStorage in sync.
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly doc = inject(DOCUMENT);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  readonly theme = signal<Theme>('dark');
  /** null = default palette, otherwise the user-chosen hue (0–359). */
  readonly hue = signal<number | null>(null);

  constructor() {
    if (!this.isBrowser) return;
    const root = this.doc.documentElement;
    this.theme.set(root.getAttribute('data-theme') === 'light' ? 'light' : 'dark');
    this.syncThemeColor(this.theme());
    const stored = this.read(HUE_KEY);
    if (stored !== null && stored !== '' && !Number.isNaN(Number(stored))) {
      this.hue.set(normalizeHue(Number(stored)));
    }
  }

  toggleTheme(): void {
    this.setTheme(this.theme() === 'dark' ? 'light' : 'dark');
  }

  setTheme(theme: Theme): void {
    this.theme.set(theme);
    this.doc.documentElement.setAttribute('data-theme', theme);
    this.write(THEME_KEY, theme);
    this.syncThemeColor(theme);
  }

  /** Browser chrome (address/tab bars on phones) follows the page background. */
  private syncThemeColor(theme: Theme): void {
    const colour = theme === 'dark' ? '#1e2530' : '#dfe6ef';
    this.doc.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]').forEach((m) => {
      m.removeAttribute('media');
      m.setAttribute('content', colour);
    });
  }

  setHue(hue: number): void {
    const h = normalizeHue(hue);
    this.hue.set(h);
    const root = this.doc.documentElement;
    root.setAttribute('data-hue', '');
    root.style.setProperty('--hue', String(h));
    this.write(HUE_KEY, String(h));
  }

  resetHue(): void {
    this.hue.set(null);
    const root = this.doc.documentElement;
    root.removeAttribute('data-hue');
    root.style.removeProperty('--hue');
    this.remove(HUE_KEY);
  }

  private read(key: string): string | null {
    if (!this.isBrowser) return null;
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  }

  private write(key: string, value: string): void {
    if (!this.isBrowser) return;
    try {
      localStorage.setItem(key, value);
    } catch {}
  }

  private remove(key: string): void {
    if (!this.isBrowser) return;
    try {
      localStorage.removeItem(key);
    } catch {}
  }
}
