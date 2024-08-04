import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { imprintActiveService } from '../../services/imprintActive.service';
import { ppActiveService } from '../../services/ppActive.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [FormsModule, CommonModule, TranslateModule, RouterModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
})
export class ContactComponent implements OnInit {
  privacyPolicyChecked: boolean = false;
  isImprintActive: boolean = false;
  isPpActive: boolean = false;
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
  onSubmit(ngForm: NgForm) {
    if (ngForm.valid && ngForm.submitted) console.log('Test :>> ');
    else console.log('Form is invalid or privacy policy not accepted.');
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
