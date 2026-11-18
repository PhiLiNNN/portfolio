import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { Router } from '@angular/router';

/** Smooth-scrolls to a section on the home page, navigating there first if needed. */
@Injectable({ providedIn: 'root' })
export class ScrollService {
  private readonly router = inject(Router);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  async to(id: string): Promise<void> {
    if (!this.isBrowser) return;
    window.umami?.track(`nav_${id}`);

    if (this.router.url.split('#')[0] !== '/') {
      await this.router.navigate(['/']);
      await new Promise((r) => setTimeout(r, 80));
    }
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  top(): void {
    if (!this.isBrowser) return;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
