import { Routes } from '@angular/router';
import { MainContentComponent } from './main-content/main-content.component';

export const routes: Routes = [
  { path: '', component: MainContentComponent },
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
