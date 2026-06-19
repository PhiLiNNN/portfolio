import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-services-offer',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './services-offer.component.html',
  styleUrl: './services-offer.component.scss',
})
export class ServicesOfferComponent {
  cards = ['card1', 'card2', 'card3'];
}
