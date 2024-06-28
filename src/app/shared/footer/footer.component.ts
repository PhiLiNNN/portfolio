import { Component, ElementRef, Renderer2 } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent {
  privacyPolicyChecked: boolean = false;
  contactData = {
    name: '',
    email: '',
    message: '',
  };
  constructor(private el: ElementRef, private renderer: Renderer2) {}
  onSubmit(ngForm: NgForm) {
    const mobBtn = this.el.nativeElement.querySelector('.btn-desk');
    const deskBtn = this.el.nativeElement.querySelector('.btn-desk');
    if (ngForm.valid && ngForm.submitted) {
      console.log('Test :>> ');
    } else console.log('Form is invalid or privacy policy not accepted.');
  }
}
