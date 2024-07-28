import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class imprintActiveService {
  private imprintActive = new BehaviorSubject<boolean>(false);
  currentState = this.imprintActive.asObservable();

  constructor() {}

  setBool(value: boolean) {
    this.imprintActive.next(value);
  }

  getBool() {
    return this.imprintActive.getValue();
  }
}
