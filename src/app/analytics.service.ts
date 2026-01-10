import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly router = inject(Router);

  init(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe((e) => {
        window.umami?.track('pageview', {
          url: e.urlAfterRedirects,
        });
      });
  }
}
