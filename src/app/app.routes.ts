import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
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
