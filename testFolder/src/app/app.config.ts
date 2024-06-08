import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(),
    provideFirebaseApp(() =>
      initializeApp({
        projectId: 'danotes-161f4',
        appId: '1:129696675505:web:bfecd1a0da3a2e20949490',
        storageBucket: 'danotes-161f4.appspot.com',
        apiKey: 'AIzaSyCLDUNTNtpuZqXF_-Qc2yiOuKEKCRXibGU',
        authDomain: 'danotes-161f4.firebaseapp.com',
        messagingSenderId: '129696675505',
        measurementId: 'G-RR3PB0P3KZ',
      })
    ),
    provideFirestore(() => getFirestore()),
    provideFirebaseApp(() =>
      initializeApp({
        projectId: 'danotes-161f4',
        appId: '1:129696675505:web:bfecd1a0da3a2e20949490',
        storageBucket: 'danotes-161f4.appspot.com',
        apiKey: 'AIzaSyCLDUNTNtpuZqXF_-Qc2yiOuKEKCRXibGU',
        authDomain: 'danotes-161f4.firebaseapp.com',
        messagingSenderId: '129696675505',
        measurementId: 'G-RR3PB0P3KZ',
      })
    ),
    provideFirestore(() => getFirestore()),
  ],
};
