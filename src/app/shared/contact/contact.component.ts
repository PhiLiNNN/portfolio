import {
  Component,
  inject,
  ChangeDetectionStrategy,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';

import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ContactFormPopupComponent } from '../contact-form-popup/contact-form-popup.component';

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

  contactData = {
    name: '',
    email: '',
    message: '',
  };

  post = {
    endPoint: 'https://philipp-wendschuch.dev/sendMail.php',
    body: (payload: any) => JSON.stringify(payload),
    options: {
      headers: {
        'Content-Type': 'text/plain',
        responseType: 'text',
      },
    },
  };

  onSubmit(ngForm: NgForm): void {
    if (!ngForm.submitted || !ngForm.form.valid) return;

    this.http
      .post(this.post.endPoint, this.post.body(this.contactData))
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
    const dialogRef = this.dialog.open(ContactFormPopupComponent);

    dialogRef.afterClosed().subscribe();
  }
}
