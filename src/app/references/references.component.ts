import { Component } from '@angular/core';
import { ReferenceLeftComponent } from '../shared/referenceLeft/referenceLeft.component';
import { ReferenceRightComponent } from '../shared/referenceRight/referenceRight.component';

@Component({
  selector: 'app-references',
  standalone: true,
  imports: [ReferenceLeftComponent, ReferenceRightComponent],
  templateUrl: './references.component.html',
  styleUrl: './references.component.scss',
})
export class ReferencesComponent {}
