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

  /**
   * Scrolls the page to the contact section when called.
   * It locates the HTML element with the ID 'contact-section' and triggers the scrollIntoView() method.
   *
   * @returns {void}
   */
  scrollToContact() {
    const element = document.getElementById('contact-section');
    if (element) element.scrollIntoView();
  }
}
