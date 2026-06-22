import {
  Component,
  inject,
  signal,
  ChangeDetectionStrategy,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';

import { finalize } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ContactFormPopupComponent } from '../contact-form-popup/contact-form-popup.component';

interface ContactData {
  name: string;
  email: string;
  message: string;
}

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [
    FormsModule,
    TranslateModule,
    RouterModule,
    MatButtonModule,
    MatDialogModule,
  ],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactComponent {
  readonly dialog = inject(MatDialog);
  private readonly http = inject(HttpClient);

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  contactData: ContactData = {
    name: '',
    email: '',
    message: '',
  };

  /** Honeypot field — must stay empty for real users; bots tend to fill it. */
  honeypot = '';

  /** True while a submit request is in flight — blocks duplicate sends. */
  readonly isSubmitting = signal(false);

  private readonly endPoint = 'https://philipp-wendschuch.dev/sendMail.php';

  onSubmit(ngForm: NgForm): void {
    // Guard against double-submits (rapid clicks while the request is pending).
    if (!ngForm.submitted || !ngForm.form.valid || this.isSubmitting()) return;

    this.isSubmitting.set(true);
    const payload = { ...this.contactData, website: this.honeypot };

    this.http
      .post(this.endPoint, JSON.stringify(payload), {
        headers: { 'Content-Type': 'text/plain' },
        responseType: 'text',
      })
      .pipe(finalize(() => this.isSubmitting.set(false)))
      .subscribe({
        next: () => {
          ngForm.resetForm();
          this.openDialog();
        },
        error: (error) => console.error(error),
      });
  }

  scrollToTop(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  openDialog(): void {
    this.dialog.open(ContactFormPopupComponent, {
      ariaLabelledBy: 'email-sent-title',
    });
  }
}
