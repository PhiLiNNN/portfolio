import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { imprintActiveService } from '../../services/imprintActive.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [FormsModule, CommonModule, TranslateModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
})
export class ContactComponent implements OnInit {
  privacyPolicyChecked: boolean = false;
  isImprintActive: boolean = false;
  private subscription: Subscription = new Subscription();
  contactData = {
    name: '',
    email: '',
    message: '',
  };
  constructor(private imprintActiveService: imprintActiveService) {}
  onSubmit(ngForm: NgForm) {
    if (ngForm.valid && ngForm.submitted) console.log('Test :>> ');
    else console.log('Form is invalid or privacy policy not accepted.');
  }

  scrollToAot() {
    const element = document.getElementById('aot-section');
    if (element) element.scrollIntoView();
  }
  ngOnInit(): void {
    this.subscription = this.imprintActiveService.currentState.subscribe(
      (value: boolean) => {
        this.isImprintActive = value;
        console.log('Imprint active state:', this.isImprintActive);
      }
    );
  }
}
