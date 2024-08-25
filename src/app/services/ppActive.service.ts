import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

/**
 * Service to manage the active state of the privacy policy page.
 * It provides methods to set and get the current state using a BehaviorSubject.
 * The service is provided in the root, making it available throughout the entire application.
 *
 * @Injectable({
 *   providedIn: 'root',
 * })
 */
@Injectable({
  providedIn: 'root',
})
export class ppActiveService {
  /**
   * BehaviorSubject that holds the current active state of the privacy policy page.
   * The default value is set to `false`.
   * @private
   * @type {BehaviorSubject<boolean>}
   */
  private ppActive = new BehaviorSubject<boolean>(false);
  /**
   * Observable to expose the current state of the privacy policy page.
   * Components can subscribe to this observable to get the latest state updates.
   * @type {Observable<boolean>}
   */
  currentState = this.ppActive.asObservable();

  constructor() {}

  /**
   * Updates the active state of the privacy policy page.
   * This method triggers a new value for all subscribers.
   *
   * @param {boolean} value - The new state to be set (true for active, false for inactive).
   */
  setBool(value: boolean) {
    this.ppActive.next(value);
  }

  /**
   * Returns the current active state of the privacy policy page.
   *
   * @returns {boolean} - The current state (true if active, false if inactive).
   */
  getBool() {
    return this.ppActive.getValue();
  }
}
