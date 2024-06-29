import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-referenceRight',
  standalone: true,
  imports: [],
  templateUrl: './referenceRight.component.html',
  styleUrl: './referenceRight.component.scss',
})
export class ReferenceRightComponent {
  @Input() skills: string = '';
  @Input() name: string = '';
  @Input() gitHub: string = '';
  @Input() liveLink: string = '';
  @Input() refNum: number = 0;
  @Input() refAll: number = 0;
  @Input() description: string = '';
  @Input() imageUrl: string = '';

  openGitHub(gitHubLink: string) {
    window.open(gitHubLink, '_blank');
  }
  openLiveLink(liveLink: string) {
    window.open(liveLink, '_blank');
  }
}
