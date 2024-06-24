import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [FormsModule],
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
  }
}
