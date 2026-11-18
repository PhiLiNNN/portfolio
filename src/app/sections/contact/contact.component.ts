import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { finalize } from 'rxjs';

interface ContactData {
  name: string;
  email: string;
  message: string;
}

@Component({
  selector: 'app-contact',
  imports: [FormsModule, TranslateModule, RouterModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactComponent {
  private readonly http = inject(HttpClient);
  private readonly sentDialog = viewChild<ElementRef<HTMLDialogElement>>('sent');
  private readonly endPoint = 'https://philipp-wendschuch.dev/sendMail.php';

  contactData: ContactData = { name: '', email: '', message: '' };

  /** Honeypot field: must stay empty for real users; bots tend to fill it. */
  honeypot = '';

  /** True while a submit request is in flight (blocks duplicate sends). */
  readonly isSubmitting = signal(false);
  /** True when the last submit failed (shows a visible error). */
  readonly submitFailed = signal(false);

  onSubmit(ngForm: NgForm): void {
    if (!ngForm.submitted || !ngForm.form.valid || this.isSubmitting()) return;

    this.submitFailed.set(false);
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
          this.sentDialog()?.nativeElement.showModal();
          window.umami?.track('contact_sent');
        },
        error: (error) => {
          console.error(error);
          this.submitFailed.set(true);
        },
      });
  }

  closeSent(): void {
    this.sentDialog()?.nativeElement.close();
  }
}
