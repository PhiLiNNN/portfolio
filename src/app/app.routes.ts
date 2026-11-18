import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { TOPICS } from './topics/topics';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  // Focus-area pages (SEO landing pages), one static route each so they prerender.
  ...TOPICS.map((t) => ({
    path: t.path,
    loadComponent: () => import('./topics/topic.component').then((m) => m.TopicComponent),
    data: { key: t.key },
  })),
  {
    path: 'imprint',
    loadComponent: () =>
      import('./imprint/imprint.component').then((m) => m.ImprintComponent),
  },
  {
    path: 'privacy-policy',
    loadComponent: () =>
      import('./privacy-policy/privacy-policy.component').then(
        (m) => m.PrivacyPolicyComponent
      ),
  },
  // Keep the old camelCase URL working (may be linked/indexed).
  { path: 'privacyPolicy', redirectTo: 'privacy-policy' },
];
