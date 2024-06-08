import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(),
    provideAnimationsAsync(),
    provideFirebaseApp(() =>
      initializeApp({
        projectId: 'ring-of-fire-862f9',
        appId: '1:680958789371:web:d3853c86bb005a682d525e',
        storageBucket: 'ring-of-fire-862f9.appspot.com',
        apiKey: 'AIzaSyC-rKyIhr8J04gfOLU0bWthP-tRmzGfvXk',
        authDomain: 'ring-of-fire-862f9.firebaseapp.com',
        messagingSenderId: '680958789371',
      })
    ),
    provideFirestore(() => getFirestore()),
  ],
};
