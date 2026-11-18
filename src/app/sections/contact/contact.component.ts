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
import { MailEndpointService } from '../../shared/mail-endpoint.service';
import { PowService } from '../../shared/pow.service';

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
  readonly pow = inject(PowService);
  private readonly endpoint = inject(MailEndpointService);
  private readonly sentDialog = viewChild<ElementRef<HTMLDialogElement>>('sent');

  contactData: ContactData = { name: '', email: '', message: '' };

  /** Honeypot field: must stay empty for real users; bots tend to fill it. */
  honeypot = '';

  /** True while a submit request is in flight (blocks duplicate sends). */
  readonly isSubmitting = signal(false);
  /** True when the last submit failed (shows a visible error). */
  readonly submitFailed = signal(false);

  /** First interaction with the form starts the invisible spam check. */
  onInteract(): void {
    void this.endpoint.resolve().then((url) => this.pow.prepare(url));
  }

  async onSubmit(ngForm: NgForm): Promise<void> {
    if (!ngForm.submitted || !ngForm.form.valid || this.isSubmitting()) return;

    this.submitFailed.set(false);
    this.isSubmitting.set(true);

    // Make sure the proof of work is done (normally finished long before).
    const url = await this.endpoint.resolve();
    const altcha = await this.pow.prepare(url);
    const payload = { ...this.contactData, website: this.honeypot, altcha };

    this.http
      .post(url, JSON.stringify(payload), {
        headers: { 'Content-Type': 'text/plain' },
        responseType: 'text',
      })
      .pipe(finalize(() => this.isSubmitting.set(false)))
      .subscribe({
        next: () => {
          ngForm.resetForm();
          this.pow.reset();
          this.sentDialog()?.nativeElement.showModal();
          window.umami?.track('contact_sent');
        },
        error: (error) => {
          console.error(error);
          this.pow.reset();
          this.submitFailed.set(true);
        },
      });
  }

  closeSent(): void {
    this.sentDialog()?.nativeElement.close();
  }
}
