import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
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
    CommonModule,
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
  /**
   * MatDialog instance for opening dialog windows.
   * @private
   * @readonly
   * @type {MatDialog}
   */
  readonly dialog = inject(MatDialog);

  /**
   * HttpClient instance for making HTTP requests.
   * @private
   * @readonly
   * @type {HttpClient}
   */
  http = inject(HttpClient);

  /**
   * Data object for storing contact form inputs.
   * @type {{ name: string, email: string, message: string }}
   */
  contactData = {
    name: '',
    email: '',
    message: '',
  };

  constructor() {}

  /**
   * Configuration for the HTTP POST request to send contact form data.
   * @type {{
   *   endPoint: string,
   *   body: (payload: any) => string,
   *   options: {
   *     headers: {
   *       'Content-Type': string,
   *       responseType: string
   *     }
   *   }
   * }}
   */
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

  /**
   * Handles the form submission by posting contact data to the server.
   * If the form is valid and submitted, it sends a POST request and opens a dialog on success.
   *
   * @param {NgForm} ngForm - The Angular form object containing form data and state.
   */
  onSubmit(ngForm: NgForm) {
    if (ngForm.submitted && ngForm.form.valid) {
      this.http
        .post(this.post.endPoint, this.post.body(this.contactData))
        .subscribe({
          next: (response) => {
            ngForm.resetForm();
            this.openDialog();
          },
          error: (error) => {
            console.error(error);
          },
          complete: () => console.info('send post complete'),
        });
    }
  }

  /**
   * Scrolls the window to the top.
   */
  scrollToTop() {
    window.scrollTo(0, 0);
  }

  /**
   * Opens a dialog window with the contact form popup component.
   */
  openDialog() {
    const dialogRef = this.dialog.open(ContactFormPopupComponent);
    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }
}
