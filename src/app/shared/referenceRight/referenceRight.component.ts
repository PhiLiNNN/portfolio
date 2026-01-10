import { Component, Input, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-referenceRight',
  standalone: true,
  imports: [NgOptimizedImage],
  templateUrl: './referenceRight.component.html',
  styleUrl: './referenceRight.component.scss',
})
export class ReferenceRightComponent {
  @Input() skills = '';
  @Input() name = '';
  @Input() gitHub = '';
  @Input() liveLink = '';
  @Input() refNum = 0;
  @Input() refAll = 0;
  @Input() description = '';
  @Input() imageUrl = '';

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  openGitHub(gitHubLink: string): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const slug = this.name.toLowerCase().replace(/\s+/g, '_');

    window.umami?.track(`open_github_${slug}`);

    window.open(gitHubLink, '_blank');
  }

  openLiveLink(liveLink: string): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const slug = this.name.toLowerCase().replace(/\s+/g, '_');

    window.umami?.track(`open_live_${slug}`);

    window.open(liveLink, '_blank');
  }
}
