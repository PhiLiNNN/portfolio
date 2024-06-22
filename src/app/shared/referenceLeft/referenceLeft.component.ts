import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-referenceLeft',
  standalone: true,
  imports: [],
  templateUrl: './referenceLeft.component.html',
  styleUrl: './referenceLeft.component.scss',
})
export class ReferenceLeftComponent {
  @Input() skills: string[] = [];

  get skillsList(): string {
    return this.skills.join(' | ');
  }
}
