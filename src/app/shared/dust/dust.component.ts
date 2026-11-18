import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  PLATFORM_ID,
  inject,
  viewChild,
} from '@angular/core';

interface Mote {
  x: number;
  y: number;
  r: number;
  /** Horizontal speed in px/s (right to left). */
  vx: number;
  /** Vertical wobble: amplitude, frequency, phase. */
  amp: number;
  freq: number;
  phase: number;
  alpha: number;
}

/**
 * Background dust: fine motes drifting slowly from right to left across the
 * whole viewport, with a gentle vertical wobble. Bigger motes move faster
 * (closer to the viewer). Runs outside Angular's zone, pauses when the tab is
 * hidden, and renders a single still frame when the visitor prefers reduced
 * motion.
 */
@Component({
  selector: 'app-dust',
  template: `<canvas #c class="dust" aria-hidden="true"></canvas>`,
  styles: `
    :host { display: contents; }
    .dust { position: fixed; inset: 0; width: 100%; height: 100%; z-index: 0; pointer-events: none; }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DustComponent implements AfterViewInit, OnDestroy {
  private readonly canvas = viewChild.required<ElementRef<HTMLCanvasElement>>('c');
  private readonly zone = inject(NgZone);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  private ctx: CanvasRenderingContext2D | null = null;
  private motes: Mote[] = [];
  private raf = 0;
  private last = 0;
  private w = 0;
  private h = 0;
  private dpr = 1;
  private dark = true;
  private readonly onResize = () => this.resize();
  private readonly onVisibility = () => (document.hidden ? this.stop() : this.start());
  private themeObserver?: MutationObserver;

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;
    const el = this.canvas().nativeElement;
    this.ctx = el.getContext('2d', { alpha: true });
    if (!this.ctx) return;

    this.readTheme();
    this.themeObserver = new MutationObserver(() => this.readTheme());
    this.themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    this.resize();
    window.addEventListener('resize', this.onResize, { passive: true });
    document.addEventListener('visibilitychange', this.onVisibility);

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.draw();
      return;
    }
    this.start();
  }

  ngOnDestroy(): void {
    this.stop();
    if (!this.isBrowser) return;
    window.removeEventListener('resize', this.onResize);
    document.removeEventListener('visibilitychange', this.onVisibility);
    this.themeObserver?.disconnect();
  }

  private readTheme(): void {
    this.dark = document.documentElement.getAttribute('data-theme') !== 'light';
  }

  private resize(): void {
    const el = this.canvas().nativeElement;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.w = window.innerWidth;
    this.h = window.innerHeight;
    el.width = Math.round(this.w * this.dpr);
    el.height = Math.round(this.h * this.dpr);
    this.ctx?.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);

    // Roughly one mote per 9000 px², capped so phones and 4K stay cheap.
    const count = Math.min(220, Math.max(40, Math.round((this.w * this.h) / 9000)));
    this.motes = Array.from({ length: count }, () => this.spawn(true));
  }

  private spawn(anywhere: boolean): Mote {
    const r = 0.5 + Math.pow(Math.random(), 2) * 1.9; // mostly tiny, a few bigger
    const depth = (r - 0.5) / 1.9; // 0 = far, 1 = near
    return {
      x: anywhere ? Math.random() * this.w : this.w + 10 + Math.random() * 40,
      y: Math.random() * this.h,
      r,
      vx: 6 + depth * 18 + Math.random() * 4,
      amp: 4 + Math.random() * 14,
      freq: 0.15 + Math.random() * 0.35,
      phase: Math.random() * Math.PI * 2,
      alpha: 0.12 + depth * 0.3 + Math.random() * 0.1,
    };
  }

  private start(): void {
    if (this.raf || !this.ctx) return;
    this.zone.runOutsideAngular(() => {
      this.last = performance.now();
      const loop = (now: number) => {
        const dt = Math.min(0.05, (now - this.last) / 1000);
        this.last = now;
        this.step(dt, now / 1000);
        this.draw();
        this.raf = requestAnimationFrame(loop);
      };
      this.raf = requestAnimationFrame(loop);
    });
  }

  private stop(): void {
    if (this.raf) cancelAnimationFrame(this.raf);
    this.raf = 0;
  }

  private step(dt: number, t: number): void {
    for (let i = 0; i < this.motes.length; i++) {
      const m = this.motes[i];
      m.x -= m.vx * dt;
      if (m.x < -10) {
        this.motes[i] = this.spawn(false);
        continue;
      }
      // Slow vertical drift so the motes do not run on rails.
      m.y += Math.cos(t * m.freq + m.phase) * m.amp * dt * 0.5;
      if (m.y < -10) m.y = this.h + 10;
      else if (m.y > this.h + 10) m.y = -10;
    }
  }

  private draw(): void {
    const ctx = this.ctx;
    if (!ctx) return;
    ctx.clearRect(0, 0, this.w, this.h);
    const rgb = this.dark ? '237, 240, 243' : '27, 34, 48';
    for (const m of this.motes) {
      ctx.beginPath();
      ctx.fillStyle = `rgba(${rgb}, ${m.alpha})`;
      ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}
