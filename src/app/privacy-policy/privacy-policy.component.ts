import { Component, OnInit, OnDestroy } from '@angular/core';
import { ppActiveService } from '../services/ppActive.service';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-privacy-policy',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './privacy-policy.component.html',
  styleUrl: './privacy-policy.component.scss',
})
export class PrivacyPolicyComponent implements OnInit, OnDestroy {
  /**
   * Initializes a new instance of the PrivacyPolicyComponent class.
   * Injects the ppActiveService to manage the active state of the privacy policy page.
   *
   * @param {ppActiveService} ppActiveService - The service used to track whether the privacy policy page is active.
   */
  constructor(private ppActiveService: ppActiveService) {}

  /**
   * Lifecycle hook that is called when the component is initialized.
   * Scrolls the page to the top smoothly and activates the privacy policy state in the service.
   */
  ngOnInit(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.ppActiveService.setBool(true);
  }

  /**
   * Lifecycle hook that is called when the component is destroyed.
   * Deactivates the privacy policy state in the service.
   */
  ngOnDestroy(): void {
    this.ppActiveService.setBool(false);
  }
}
