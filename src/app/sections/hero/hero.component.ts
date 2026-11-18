import { isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnInit,
  PLATFORM_ID,
  computed,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { isNightShift } from '../../shared/night-shift';
import { ScrollService } from '../../shared/scroll.service';
import { ThemeService } from '../../shared/theme.service';

/** Default accent (violet) sits at this hue; the dial starts there. */
const DEFAULT_HUE = 262;

@Component({
  selector: 'app-hero',
  imports: [TranslateModule],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroComponent implements OnInit {
  private readonly theme = inject(ThemeService);
  private readonly scroll = inject(ScrollService);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly secret = viewChild<ElementRef<HTMLElement>>('secret');
  private readonly dial = viewChild<ElementRef<HTMLElement>>('dial');

  readonly night = signal(false);
  readonly angle = computed(() => this.theme.hue() ?? DEFAULT_HUE);
  private dragging = false;

  ngOnInit(): void {
    if (this.isBrowser) this.night.set(isNightShift(new Date()));
  }

  toContact(): void {
    void this.scroll.to('contact');
  }
  toProjects(): void {
    void this.scroll.to('projects');
  }

  /* ---- Flashlight: reveal "Coding with Heart" around the pointer ---- */
  onPointerMove(event: PointerEvent): void {
    const el = this.secret()?.nativeElement;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${event.clientX - r.left}px`);
    el.style.setProperty('--my', `${event.clientY - r.top}px`);
  }
  onPointerLeave(): void {
    const el = this.secret()?.nativeElement;
    if (!el) return;
    el.style.setProperty('--mx', '-999px');
    el.style.setProperty('--my', '-999px');
  }

  /* ---- Dial: drag or arrow keys set the accent hue ---- */
  onDialDown(event: PointerEvent): void {
    this.dragging = true;
    (event.target as HTMLElement).setPointerCapture?.(event.pointerId);
    this.theme.setHue(this.angleFrom(event));
  }
  onDialMove(event: PointerEvent): void {
    if (this.dragging) this.theme.setHue(this.angleFrom(event));
  }
  onDialUp(): void {
    if (!this.dragging) return;
    this.dragging = false;
    window.umami?.track('dial_hue', { hue: this.theme.hue() });
  }
  onDialKey(event: KeyboardEvent): void {
    const step =
      event.key === 'ArrowRight' || event.key === 'ArrowUp'
        ? 6
        : event.key === 'ArrowLeft' || event.key === 'ArrowDown'
        ? -6
        : 0;
    if (step === 0) {
      if (event.key === 'Home' || event.key === 'Backspace') {
        event.preventDefault();
        this.theme.resetHue();
      }
      return;
    }
    event.preventDefault();
    this.theme.setHue(this.angle() + step);
  }
  /** Double-click or double-tap returns to the default palette. */
  resetDial(): void {
    this.theme.resetHue();
  }

  private angleFrom(event: PointerEvent): number {
    const el = this.dial()?.nativeElement;
    if (!el) return this.angle();
    const r = el.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    return (Math.atan2(event.clientX - cx, -(event.clientY - cy)) * 180) / Math.PI;
  }
}
