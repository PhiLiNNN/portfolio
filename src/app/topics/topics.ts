/** Focus-area landing pages: one route each, content from i18n `topics.<key>`. */
export interface Topic {
  key: 'angular' | 'python' | 'websites' | 'ai';
  path: string;
  /** Show the Webwerk Leipzig link on this page. */
  webwerk?: boolean;
}

export const TOPICS: Topic[] = [
  { key: 'angular', path: 'angular-entwicklung-leipzig' },
  { key: 'python', path: 'python-backend-entwicklung' },
  { key: 'websites', path: 'webseiten-fuer-unternehmen-leipzig', webwerk: true },
  { key: 'ai', path: 'ki-gestuetzte-softwareentwicklung' },
];
