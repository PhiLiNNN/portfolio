import { Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-aboutMe',
  standalone: true,
  imports: [NgOptimizedImage, TranslateModule],
  templateUrl: './aboutMe.component.html',
  styleUrl: './aboutMe.component.scss',
})
export class AboutMeComponent {
  constructor() {}

  scrollToContact() {
    const element = document.getElementById('contact-section');
    if (element) element.scrollIntoView();
  }
}
