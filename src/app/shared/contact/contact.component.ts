import { Component, ElementRef, Renderer2 } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [FormsModule, CommonModule, TranslateModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
})
export class ContactComponent {
  privacyPolicyChecked: boolean = false;
  contactData = {
    name: '',
    email: '',
    message: '',
  };
  constructor(private el: ElementRef, private renderer: Renderer2) {}
  onSubmit(ngForm: NgForm) {
    if (ngForm.valid && ngForm.submitted) console.log('Test :>> ');
    else console.log('Form is invalid or privacy policy not accepted.');
  }

  scrollToAot() {
    const element = document.getElementById('aot-section');
    if (element) element.scrollIntoView();
  }
}