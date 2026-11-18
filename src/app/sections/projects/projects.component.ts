import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { RevealDirective } from '../../shared/reveal.directive';

interface Project {
  name: string;
  skills: string[];
  description: string;
  githubLink: string;
  liveLink: string;
  img: string;
}

@Component({
  selector: 'app-projects',
  imports: [RevealDirective, TranslateModule],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectsComponent {
  private readonly translate = inject(TranslateService);
  private readonly raw = toSignal(this.translate.stream('projects.list'), {
    initialValue: [] as Project[],
  });

  get projects(): Project[] {
    const p = this.raw();
    return Array.isArray(p) ? p : [];
  }

  track(name: string, kind: 'github' | 'live'): void {
    window.umami?.track(`project_${kind}`, { name });
  }
}
