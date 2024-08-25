import { Component, OnInit, OnDestroy } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { imprintActiveService } from '../../services/imprintActive.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [TranslateModule, RouterModule, CommonModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
})
export class MenuComponent implements OnInit, OnDestroy {
  /**
   * Indicates if the imprint page is currently active.
   * @type {boolean}
   */
  isImprintActive: boolean = false;

  /**
   * Subscription object used to manage the lifecycle of the imprint active state subscription.
   * @private
   * @type {Subscription}
   */
  private subscription: Subscription = new Subscription();

  /**
   * Constructor that injects the ImprintActiveService for accessing the imprint active state.
   *
   * @param {ImprintActiveService} imprintActiveService - Service for managing the imprint active state.
   */
  constructor(private imprintActiveService: imprintActiveService) {}

  /**
   * Lifecycle hook that is called after data-bound properties are initialized.
   * Subscribes to the imprint active state from the ImprintActiveService and updates the component state.
   */
  ngOnInit(): void {
    this.subscription = this.imprintActiveService.currentState.subscribe(
      (value: boolean) => {
        this.isImprintActive = value;
      }
    );
  }

  /**
   * Lifecycle hook that is called when the component is destroyed.
   * Unsubscribes from the imprint active state subscription to prevent memory leaks.
   */
  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
  }
}
