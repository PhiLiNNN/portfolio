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
  constructor(private imprintActiveService: imprintActiveService) {}
  ngOnInit(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.imprintActiveService.setBool(true);
    console.log(
      'this.imprintActiveService.setBool :>> ',
      this.imprintActiveService.getBool()
    );
  }
  ngOnDestroy(): void {
    this.imprintActiveService.setBool(false);
  }
}
