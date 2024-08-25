import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-contact-form-popup',
  standalone: true,
  imports: [MatButtonModule, MatDialogModule, TranslateModule],
  templateUrl: './contact-form-popup.component.html',
  styleUrl: './contact-form-popup.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactFormPopupComponent {}
