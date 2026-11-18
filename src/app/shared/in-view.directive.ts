import { isPlatformBrowser } from '@angular/common';
import {
  Directive,
  ElementRef,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  Renderer2,
  inject,
} from '@angular/core';

/**
 * Adds the class `is-in` once the host enters the viewport (used for the one
 * fader animation). Without IntersectionObserver (or on the server) the class
 * is set immediately so nothing stays hidden.
 */
@Directive({ selector: '[appInView]', standalone: true })
export class InViewDirective implements OnInit, OnDestroy {
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly renderer = inject(Renderer2);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private observer?: IntersectionObserver;

  ngOnInit(): void {
    if (!this.isBrowser || typeof IntersectionObserver === 'undefined') {
      this.show();
      return;
    }
    this.observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          this.show();
          this.observer?.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    this.observer.observe(this.el.nativeElement);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }

  private show(): void {
    this.renderer.addClass(this.el.nativeElement, 'is-in');
  }
}
