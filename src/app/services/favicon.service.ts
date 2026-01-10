import {
  Injectable,
  Renderer2,
  RendererFactory2,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class FaviconService {
  private renderer: Renderer2;

  constructor(
    rendererFactory: RendererFactory2,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  setFavicon(isDarkMode: boolean): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const favicon = isDarkMode ? 'white.ico' : 'black.ico';

    const head = this.renderer.selectRootElement('head', true);

    let link: HTMLLinkElement | null =
      document.querySelector('link[rel*="icon"]');

    if (!link) {
      link = this.renderer.createElement('link');
      this.renderer.setAttribute(link, 'rel', 'icon');
      this.renderer.appendChild(head, link);
    }

    this.renderer.setAttribute(link, 'href', favicon);
  }
}
