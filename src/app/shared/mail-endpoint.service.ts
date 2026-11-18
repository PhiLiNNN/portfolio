import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject, isDevMode } from '@angular/core';

export const LIVE_ENDPOINT = 'https://philipp-wendschuch.dev/sendMail.php';
export const LOCAL_ENDPOINT = 'http://127.0.0.1:8787/sendMail.php';

/**
 * Which sendMail.php to talk to. Production always uses the live endpoint.
 * In development (`ng serve`) a local PHP server is used when one answers on
 * port 8787 (`php -S 127.0.0.1:8787 -t public`), otherwise the live one.
 */
@Injectable({ providedIn: 'root' })
export class MailEndpointService {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private resolved?: Promise<string>;

  resolve(): Promise<string> {
    if (!this.isBrowser || !isDevMode()) return Promise.resolve(LIVE_ENDPOINT);
    if (!this.resolved) {
      this.resolved = (async () => {
        try {
          const ctrl = new AbortController();
          const t = setTimeout(() => ctrl.abort(), 800);
          const res = await fetch(`${LOCAL_ENDPOINT}?challenge=1`, { signal: ctrl.signal });
          clearTimeout(t);
          if (res.ok) {
            console.info('[contact] using local sendMail.php on 127.0.0.1:8787');
            return LOCAL_ENDPOINT;
          }
        } catch {}
        return LIVE_ENDPOINT;
      })();
    }
    return this.resolved;
  }
}
