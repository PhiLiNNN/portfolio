import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FaviconService {
  private renderer: Renderer2;

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  setFavicon(isDarkMode: boolean): void {
    const favicon = isDarkMode ? 'white.ico' : 'black.ico';
    const head = this.renderer.selectRootElement('head', true);
    let link: HTMLLinkElement | null = this.renderer.selectRootElement(
      'link[rel*="icon"]',
      true
    );
    console.log('Test :>> ', isDarkMode);

    if (!link) {
      link = this.renderer.createElement('link');
      this.renderer.setAttribute(link, 'rel', 'icon');
      this.renderer.appendChild(head, link);
    }

    this.renderer.setAttribute(link, 'href', favicon);
  }
}
