import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-referenceLeft',
  standalone: true,
  imports: [],
  templateUrl: './referenceLeft.component.html',
  styleUrl: './referenceLeft.component.scss',
})
export class ReferenceLeftComponent {
  @Input() skills: string = '';
  @Input() name: string = '';
  @Input() refNum: number = 0;
  @Input() refAll: number = 0;
  @Input() description: string = '';
}
