import { isPlatformBrowser } from '@angular/common';
import {
  Directive,
  ElementRef,
  Injectable,
  OnDestroy,
  PLATFORM_ID,
  afterNextRender,
  inject,
} from '@angular/core';

/**
 * Remembers which reveal animations have already played during this page
 * visit. Lives as long as the app, so in-app navigation (topic page and back)
 * does not replay anything; a full reload starts fresh.
 */
@Injectable({ providedIn: 'root' })
export class RevealState {
  private readonly done = new Set<string>();
  /** True once per key: the first caller gets `true`, later callers `false`. */
  claim(key: string): boolean {
    if (this.done.has(key)) return false;
    this.done.add(key);
    return true;
  }
  has(key: string): boolean {
    return this.done.has(key);
  }
}

const TARGETS = '.section-head, .plate';

/**
 * Put on a section: its heads and plates slide in once they scroll into view,
 * staggered in document order. Elements already on screen when the page
 * loads, or anything revealed earlier in this visit, show immediately.
 * Without JavaScript nothing is hidden (the hiding attribute is set at runtime).
 */
@Directive({ selector: '[appReveal]', standalone: true })
export class RevealDirective implements OnDestroy {
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly state = inject(RevealState);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private observer?: IntersectionObserver;

  constructor() {
    afterNextRender(() => this.setup());
  }

  private setup(): void {
    if (!this.isBrowser) return;
    const root = this.el.nativeElement;
    const id = root.id || root.tagName.toLowerCase();
    const targets = Array.from(root.querySelectorAll<HTMLElement>(TARGETS)).filter(
      (t) => t.parentElement?.closest(TARGETS) === null
    );
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const io = typeof IntersectionObserver !== 'undefined';
    const H = window.innerHeight;
    let i = 0;
    for (const t of targets) {
      const key = `${id}:${i++}`;
      const r = t.getBoundingClientRect();
      const onScreen = r.top < H * 0.9 && r.bottom > 0;
      if (reduced || !io || this.state.has(key) || onScreen) {
        this.state.claim(key);
        t.classList.add('is-in');
        continue;
      }
      t.dataset['reveal'] = key;
      t.style.setProperty('--i', String(i % 4));
    }
    const pending = targets.filter((t) => t.dataset['reveal']);
    if (!pending.length) return;
    this.observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const t = e.target as HTMLElement;
          this.state.claim(t.dataset['reveal'] ?? '');
          t.classList.add('is-in');
          this.observer?.unobserve(t);
        }
      },
      { threshold: 0, rootMargin: '0px 0px -10% 0px' }
    );
    pending.forEach((t) => this.observer?.observe(t));
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
