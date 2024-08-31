import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from './shared/header/header.component';
import { MainContentComponent } from './main-content/main-content.component';
import { RouterOutlet } from '@angular/router';
import { MenuComponent } from './shared/footer/menu.component';
import { ContactComponent } from './shared/contact/contact.component';
import { FaviconService } from './services/favicon.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent,
    MenuComponent,
    MainContentComponent,
    ContactComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  // constructor(private faviconService: FaviconService) {}
  // ngOnInit(): void {
  //   const isDarkMode = this.detectDarkMode();
  //   this.faviconService.setFavicon(isDarkMode);
  // }
  // detectDarkMode(): boolean {
  //   console.log('object :>> ', window.matchMedia);
  //   return (
  //     window.matchMedia &&
  //     window.matchMedia('(prefers-color-scheme: dark)').matches
  //   );
  // }
}
