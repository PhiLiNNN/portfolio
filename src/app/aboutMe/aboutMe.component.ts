import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, NgOptimizedImage } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-aboutMe',
  standalone: true,
  imports: [NgOptimizedImage, TranslateModule],
  templateUrl: './aboutMe.component.html',
  styleUrl: './aboutMe.component.scss',
})
export class AboutMeComponent {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  scrollToContact(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    document
      .getElementById('contact-section')
      ?.scrollIntoView({ behavior: 'smooth' });
  }
}
