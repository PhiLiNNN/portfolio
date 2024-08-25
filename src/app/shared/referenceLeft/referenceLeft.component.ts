import { Component, Input } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-referenceLeft',
  standalone: true,
  imports: [NgOptimizedImage],
  templateUrl: './referenceLeft.component.html',
  styleUrl: './referenceLeft.component.scss',
})
export class ReferenceLeftComponent {
  @Input() skills: string = '';
  @Input() name: string = '';
  @Input() gitHub: string = '';
  @Input() liveLink: string = '';
  @Input() refNum: number = 0;
  @Input() refAll: number = 0;
  @Input() description: string = '';
  @Input() imageUrl: string = '';

  /**
   * Opens the GitHub link in a new tab.
   *
   * @param {string} gitHubLink - The URL to open in a new tab.
   */
  openGitHub(gitHubLink: string) {
    window.open(gitHubLink, '_blank');
  }

  /**
   * Opens the live link in a new tab.
   *
   * @param {string} liveLink - The URL to open in a new tab.
   */
  openLiveLink(liveLink: string) {
    window.open(liveLink, '_blank');
  }
}
