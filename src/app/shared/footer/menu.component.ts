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
  isImprintActive: boolean = false;
  private subscription: Subscription = new Subscription();
  constructor(private imprintActiveService: imprintActiveService) {}
  ngOnInit(): void {
    this.subscription = this.imprintActiveService.currentState.subscribe(
      (value: boolean) => {
        this.isImprintActive = value;
      }
    );
  }

  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
  }
}
