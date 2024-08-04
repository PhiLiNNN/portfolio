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
  constructor(private ppActiveService: ppActiveService) {}
  ngOnInit(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.ppActiveService.setBool(true);
  }
  ngOnDestroy(): void {
    this.ppActiveService.setBool(false);
  }
}
