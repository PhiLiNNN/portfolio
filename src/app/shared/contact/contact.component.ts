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
  readonly dialog = inject(MatDialog);
  http = inject(HttpClient);
  privacyPolicyChecked: boolean = false;
  isImprintActive: boolean = false;
  isPpActive: boolean = false;
  mailTest = false;
  private subscriptions: Subscription = new Subscription();
  contactData = {
    name: '',
    email: '',
    message: '',
  };
  constructor(
    private imprintActiveService: imprintActiveService,
    private ppActiveService: ppActiveService
  ) {}

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
    //  else if (ngForm.submitted && ngForm.form.valid && this.mailTest) {
    //   ngForm.resetForm();
    //   this.openDialog();
    // }
  }

  scrollToAot() {
    const element = document.getElementById('aot-section');
    if (element) element.scrollIntoView();
  }

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

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  openDialog() {
    const dialogRef = this.dialog.open(ContactFormPopupComponent);

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }
}
