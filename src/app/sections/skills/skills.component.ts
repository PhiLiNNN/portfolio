import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { InViewDirective } from '../../shared/in-view.directive';

interface Skill {
  icon: string;
  nameKey?: string;
  name?: string;
  /** Fader position in percent. */
  level: number;
}
interface SkillGroup {
  key: string;
  skills: Skill[];
}

@Component({
  selector: 'app-skills',
  imports: [TranslateModule, InViewDirective],
  templateUrl: './skills.component.html',
  styleUrl: './skills.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkillsComponent {
  readonly groups: SkillGroup[] = [
    {
      key: 'frontend',
      skills: [
        { icon: 'angular', name: 'Angular', level: 92 },
        { icon: 'typescript', name: 'TypeScript', level: 88 },
        { icon: 'javascript', name: 'JavaScript', level: 86 },
        { icon: 'html', name: 'HTML', level: 90 },
        { icon: 'css', name: 'CSS', level: 86 },
        { icon: 'material', name: 'Material Design', level: 70 },
      ],
    },
    {
      key: 'backend',
      skills: [
        { icon: 'python', name: 'Python', level: 78 },
        { icon: 'api', name: 'REST API', level: 80 },
        { icon: 'fastapi', name: 'FastAPI', level: 66 },
        { icon: 'django', name: 'Django', level: 60 },
        { icon: 'flask', name: 'Flask', level: 60 },
        { icon: 'firebase', name: 'Firebase', level: 62 },
        { icon: 'plsql', name: 'PL/SQL', level: 50 },
      ],
    },
    {
      key: 'ai',
      skills: [
        { icon: 'claude-code', name: 'Claude Code', level: 90 },
        { icon: 'agents', nameKey: 'skills.aiAgents', level: 80 },
        { icon: 'spec', nameKey: 'skills.aiSpec', level: 78 },
        { icon: 'review', nameKey: 'skills.aiReview', level: 72 },
      ],
    },
    {
      key: 'devops',
      skills: [
        { icon: 'git', name: 'Git', level: 86 },
        { icon: 'docker', name: 'Docker', level: 64 },
        { icon: 'cicd', name: 'CI/CD', level: 58 },
        { icon: 'scrum', name: 'Scrum', level: 70 },
      ],
    },
  ];
}
