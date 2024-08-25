import { Component, OnInit, OnDestroy } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { imprintActiveService } from '../services/imprintActive.service';

@Component({
  selector: 'app-imprint',
  standalone: true,
  imports: [TranslateModule, RouterModule],
  templateUrl: './imprint.component.html',
  styleUrl: './imprint.component.scss',
})
export class ImprintComponent implements OnInit, OnDestroy {
  /**
   * Initializes a new instance of the ImprintComponent class.
   * Injects the imprintActiveService to manage the imprint active state.
   *
   * @param {imprintActiveService} imprintActiveService - The service used to track whether the imprint page is active.
   */
  constructor(private imprintActiveService: imprintActiveService) {}

  /**
   * Lifecycle hook that is called when the component is initialized.
   * Scrolls the page to the top smoothly and activates the imprint state in the service.
   */
  ngOnInit(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.imprintActiveService.setBool(true);
  }

  /**
   * Lifecycle hook that is called when the component is destroyed.
   * Deactivates the imprint state in the service.
   */
  ngOnDestroy(): void {
    this.imprintActiveService.setBool(false);
  }
}
