import { Component, inject, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { imprintActiveService } from '../../services/imprintActive.service';
import { ppActiveService } from '../../services/ppActive.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [FormsModule, CommonModule, TranslateModule, RouterModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
})
export class ContactComponent implements OnInit {
  http = inject(HttpClient);
  privacyPolicyChecked: boolean = false;
  isImprintActive: boolean = false;
  isPpActive: boolean = false;
  mailTest = true;
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
  // onSubmit(ngForm: NgForm) {
  //   if (ngForm.valid && ngForm.submitted) {
  //     console.log('Test :>> ', this.contactData);
  //     ngForm.resetForm();
  //   } else console.log('Form is invalid or privacy policy not accepted.');
  // }

  post = {
    endPoint: 'https://deineDomain.de/sendMail.php',
    body: (payload: any) => JSON.stringify(payload),
    options: {
      headers: {
        'Content-Type': 'text/plain',
        responseType: 'text',
      },
    },
  };

  onSubmit(ngForm: NgForm) {
    if (ngForm.submitted && ngForm.form.valid && !this.mailTest) {
      this.http
        .post(this.post.endPoint, this.post.body(this.contactData))
        .subscribe({
          next: (response) => {
            ngForm.resetForm();
          },
          error: (error) => {
            console.error(error);
          },
          complete: () => console.info('send post complete'),
        });
    } else if (ngForm.submitted && ngForm.form.valid && this.mailTest) {
      ngForm.resetForm();
    }
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
}
