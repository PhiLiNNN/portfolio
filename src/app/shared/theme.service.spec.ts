import { TestBed } from '@angular/core/testing';
import { ThemeService, normalizeHue } from './theme.service';

describe('normalizeHue', () => {
  it('wraps negative and overflowing values into 0–359', () => {
    expect(normalizeHue(0)).toBe(0);
    expect(normalizeHue(360)).toBe(0);
    expect(normalizeHue(-10)).toBe(350);
    expect(normalizeHue(725)).toBe(5);
    expect(normalizeHue(42.6)).toBe(43);
  });
});

describe('ThemeService', () => {
  const root = document.documentElement;

  beforeEach(() => {
    localStorage.clear();
    root.removeAttribute('data-theme');
    root.removeAttribute('data-hue');
    root.style.removeProperty('--hue');
    TestBed.configureTestingModule({});
  });

  it('defaults to dark when nothing is applied', () => {
    const svc = TestBed.inject(ThemeService);
    expect(svc.theme()).toBe('dark');
    expect(svc.hue()).toBeNull();
  });

  it('reads the theme that theme-init.js already applied', () => {
    root.setAttribute('data-theme', 'light');
    const svc = TestBed.inject(ThemeService);
    expect(svc.theme()).toBe('light');
  });

  it('toggles the theme, updates <html> and persists it', () => {
    const svc = TestBed.inject(ThemeService);
    svc.toggleTheme();
    expect(svc.theme()).toBe('light');
    expect(root.getAttribute('data-theme')).toBe('light');
    expect(localStorage.getItem('theme')).toBe('light');
  });

  it('sets, persists and resets the accent hue', () => {
    const svc = TestBed.inject(ThemeService);
    svc.setHue(400);
    expect(svc.hue()).toBe(40);
    expect(root.hasAttribute('data-hue')).toBeTrue();
    expect(root.style.getPropertyValue('--hue')).toBe('40');
    expect(localStorage.getItem('accent-hue')).toBe('40');

    svc.resetHue();
    expect(svc.hue()).toBeNull();
    expect(root.hasAttribute('data-hue')).toBeFalse();
    expect(localStorage.getItem('accent-hue')).toBeNull();
  });

  it('restores a stored hue on startup', () => {
    localStorage.setItem('accent-hue', '200');
    const svc = TestBed.inject(ThemeService);
    expect(svc.hue()).toBe(200);
  });
});
