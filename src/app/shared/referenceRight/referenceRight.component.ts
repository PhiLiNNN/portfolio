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
  @Input() refNum: number = 0;
  @Input() refAll: number = 0;
  @Input() description: string = '';
  @Input() imageUrl: string = '';
}
