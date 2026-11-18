import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';

const SITE = 'https://philipp-wendschuch.dev';

export interface SeoInput {
  titleKey: string;
  descriptionKey: string;
  /** Path for the canonical URL, defaults to the current router URL. */
  path?: string;
}

/**
 * Title, description, canonical and Open Graph tags per page, following the
 * active language. Also injects the Person JSON-LD once (rendered on the
 * server, so crawlers see it without running JS).
 */
@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly doc = inject(DOCUMENT);
  private readonly translate = inject(TranslateService);
  private current?: SeoInput;
  private jsonLdDone = false;

  constructor() {
    this.translate.onLangChange.subscribe(() => this.apply());
  }

  set(input: SeoInput): void {
    this.current = input;
    this.apply();
  }

  private apply(): void {
    if (!this.current) return;
    const { titleKey, descriptionKey, path } = this.current;
    const title = this.translate.instant(titleKey);
    const description = this.translate.instant(descriptionKey);
    const url = SITE + this.normalise(path ?? this.doc.location?.pathname ?? '/');

    this.title.setTitle(title);
    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:url', content: url });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:locale', content: this.translate.currentLang === 'en' ? 'en_GB' : 'de_DE' });

    let canonical = this.doc.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = this.doc.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      this.doc.head.appendChild(canonical);
    }
    canonical.setAttribute('href', url);

    this.ensureJsonLd();
  }

  private ensureJsonLd(): void {
    if (this.jsonLdDone || this.doc.getElementById('ld-person')) {
      this.jsonLdDone = true;
      return;
    }
    const script = this.doc.createElement('script');
    script.id = 'ld-person';
    script.type = 'application/ld+json';
    script.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: 'Philipp Wendschuch',
      jobTitle: 'Full-Stack Developer',
      url: SITE,
      email: 'mailto:contact@philipp-wendschuch.dev',
      address: { '@type': 'PostalAddress', addressLocality: 'Leipzig', addressCountry: 'DE' },
      knowsAbout: ['Angular', 'TypeScript', 'Python', 'FastAPI', 'Django', 'Docker', 'Claude Code'],
      sameAs: [
        'https://github.com/PhiLiNNN',
        'https://www.linkedin.com/in/philipp-wendschuch-53228129a/',
        'https://webwerk-leipzig.de',
      ],
      worksFor: { '@type': 'Organization', name: 'Webwerk Leipzig', url: 'https://webwerk-leipzig.de' },
    });
    this.doc.head.appendChild(script);
    this.jsonLdDone = true;
  }

  private normalise(path: string): string {
    const p = path.split('?')[0].split('#')[0];
    return p === '/' ? '/' : p.replace(/\/$/, '');
  }
}
