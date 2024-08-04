import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ppActiveService {
  private ppActive = new BehaviorSubject<boolean>(false);
  currentState = this.ppActive.asObservable();

  constructor() {}

  setBool(value: boolean) {
    this.ppActive.next(value);
  }

  getBool() {
    return this.ppActive.getValue();
  }
}
