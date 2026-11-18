import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  PLATFORM_ID,
  Renderer2,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ScrollService } from '../scroll.service';
import { ThemeService } from '../theme.service';

interface NavItem {
  id: string;
  key: string;
}

const LANG_KEY = 'lang';

@Component({
  selector: 'app-header',
  imports: [TranslateModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  readonly theme = inject(ThemeService);
  private readonly translate = inject(TranslateService);
  private readonly scroll = inject(ScrollService);
  private readonly renderer = inject(Renderer2);
  private readonly doc = inject(DOCUMENT);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly burger = viewChild<ElementRef<HTMLButtonElement>>('burger');
  private readonly overlay = viewChild<ElementRef<HTMLElement>>('overlay');

  /** Pills in the desktop bar. */
  readonly primary: NavItem[] = [
    { id: 'home', key: 'nav.home' },
    { id: 'projects', key: 'nav.projects' },
    { id: 'experience', key: 'nav.experience' },
    { id: 'contact', key: 'nav.contact' },
  ];
  /** Full list in the overlay. */
  readonly all: NavItem[] = [
    { id: 'home', key: 'nav.home' },
    { id: 'about', key: 'nav.about' },
    { id: 'offcode', key: 'nav.offcode' },
    { id: 'skills', key: 'nav.skills' },
    { id: 'services', key: 'nav.services' },
    { id: 'experience', key: 'nav.experience' },
    { id: 'projects', key: 'nav.projects' },
    { id: 'contact', key: 'nav.contact' },
  ];

  readonly active = signal('home');
  readonly menuOpen = signal(false);
  readonly lang = signal<'ger' | 'en'>('ger');

  constructor() {
    // German is the default (also for SSR/prerender). English only when the
    // visitor chose it or the browser is not set to German.
    let lang: 'ger' | 'en' = 'ger';
    if (this.isBrowser) {
      let stored: string | null = null;
      try {
        stored = localStorage.getItem(LANG_KEY);
      } catch {}
      if (stored === 'ger' || stored === 'en') lang = stored;
      else if (navigator.language && !navigator.language.toLowerCase().startsWith('de')) lang = 'en';
    }
    this.useLang(lang, false);
  }

  go(event: Event, id: string): void {
    event.preventDefault();
    this.closeMenu();
    void this.scroll.to(id);
  }

  toggleTheme(): void {
    this.theme.toggleTheme();
  }

  toggleLang(): void {
    this.useLang(this.lang() === 'en' ? 'ger' : 'en', true);
  }

  toggleMenu(): void {
    this.menuOpen() ? this.closeMenu() : this.openMenu();
  }

  openMenu(): void {
    this.menuOpen.set(true);
    if (!this.isBrowser) return;
    this.renderer.setStyle(this.doc.body, 'overflow', 'hidden');
    setTimeout(() => {
      this.overlay()?.nativeElement.querySelector<HTMLElement>('a, button')?.focus();
    });
  }

  closeMenu(): void {
    if (!this.menuOpen()) return;
    this.menuOpen.set(false);
    if (!this.isBrowser) return;
    this.renderer.removeStyle(this.doc.body, 'overflow');
    // Return focus to the trigger when the overlay closes (WCAG 2.4.3).
    this.burger()?.nativeElement.focus();
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.closeMenu();
  }

  /** Keep Tab inside the overlay while it is open. */
  @HostListener('document:keydown', ['$event'])
  onTab(event: KeyboardEvent): void {
    if (event.key !== 'Tab' || !this.menuOpen() || !this.isBrowser) return;
    const root = this.overlay()?.nativeElement;
    if (!root) return;
    const focusable = Array.from(
      root.querySelectorAll<HTMLElement>('a[href], button:not([disabled])')
    );
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const current = this.doc.activeElement;
    if (event.shiftKey && current === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && current === last) {
      event.preventDefault();
      first.focus();
    }
  }

  /** Scroll-spy: the section whose top is closest above the nav line is active. */
  @HostListener('window:scroll')
  onScroll(): void {
    if (!this.isBrowser) return;
    const line = 120;
    let current = 'home';
    for (const item of this.all) {
      const el = this.doc.getElementById(item.id);
      if (el && el.getBoundingClientRect().top <= line) current = item.id;
    }
    if (current !== this.active()) this.active.set(current);
  }

  private useLang(lang: 'ger' | 'en', persist: boolean): void {
    this.lang.set(lang);
    this.translate.use(lang);
    this.renderer.setAttribute(this.doc.documentElement, 'lang', lang === 'ger' ? 'de' : 'en');
    if (persist && this.isBrowser) {
      try {
        localStorage.setItem(LANG_KEY, lang);
      } catch {}
    }
  }
}
