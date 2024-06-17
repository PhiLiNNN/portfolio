import { Component } from '@angular/core';
import { ReferenceComponent } from '../shared/reference/reference.component';

@Component({
  selector: 'app-references',
  standalone: true,
  imports: [ReferenceComponent],
  templateUrl: './references.component.html',
  styleUrl: './references.component.scss',
})
export class ReferencesComponent {}
