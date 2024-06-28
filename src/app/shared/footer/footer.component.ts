import { Component } from '@angular/core';
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
  contactData = {
    name: '',
    email: '',
    message: '',
  };
  onSubmit(ngForm: NgForm) {
    if (ngForm.valid && ngForm.submitted)
      console.log('sadasdsadsadsad :>> ', this.contactData);
    else console.log('Form is invalid or privacy policy not accepted.');
  }
}
