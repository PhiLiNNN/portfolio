import {
  Component,
  inject,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { imprintActiveService } from '../../services/imprintActive.service';
import { ppActiveService } from '../../services/ppActive.service';
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
export class ContactComponent implements OnInit {
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
   * Flag indicating whether the privacy policy checkbox is checked.
   * @type {boolean}
   */
  privacyPolicyChecked: boolean = false;

  /**
   * Indicates if the imprint page is currently active.
   * @type {boolean}
   */
  isImprintActive: boolean = false;

  /**
   * Indicates if the privacy policy page is currently active.
   * @type {boolean}
   */
  isPpActive: boolean = false;

  /**
   * Holds subscriptions for cleanup on component destruction.
   * @private
   * @type {Subscription}
   */
  private subscriptions: Subscription = new Subscription();

  /**
   * Data object for storing contact form inputs.
   * @type {{ name: string, email: string, message: string }}
   */
  contactData = {
    name: '',
    email: '',
    message: '',
  };

  constructor(
    private imprintActiveService: imprintActiveService,
    private ppActiveService: ppActiveService
  ) {}

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
   * Scrolls the window to the AOT section by its ID.
   */
  scrollToAot() {
    const element = document.getElementById('aot-section');
    if (element) element.scrollIntoView();
  }

  /**
   * Lifecycle hook that is called after data-bound properties are initialized.
   * Subscribes to the imprint and privacy policy services to update component state.
   */
  ngOnInit(): void {
    this.subscriptions.add(
      this.imprintActiveService.currentState.subscribe(
        (value: boolean) => (this.isImprintActive = value)
      )
    );

    this.subscriptions.add(
      this.ppActiveService.currentState.subscribe(
        (value: boolean) => (this.isPpActive = value)
      )
    );
  }

  /**
   * Lifecycle hook that is called when the component is destroyed.
   * Unsubscribes from all subscriptions to prevent memory leaks.
   */
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
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
