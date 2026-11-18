import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';

export interface PowChallenge {
  algorithm: 'SHA-256';
  challenge: string;
  salt: string;
  maxnumber: number;
  signature: string;
}

export interface PowSolution {
  algorithm: 'SHA-256';
  challenge: string;
  salt: string;
  number: number;
  signature: string;
}

export type PowState = 'idle' | 'solving' | 'ready' | 'failed';

/** SHA-256 of a string as lowercase hex (Web Crypto). */
export async function sha256Hex(input: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(input));
  return Array.from(new Uint8Array(buf), (b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Brute-forces the number whose hash matches the challenge (ALTCHA scheme:
 * sha256(salt + number) === challenge). Yields to the event loop regularly so
 * the page stays responsive. Returns null if nothing matches.
 */
export async function solveChallenge(c: PowChallenge): Promise<PowSolution | null> {
  for (let n = 0; n <= c.maxnumber; n++) {
    if (n % 500 === 0 && n > 0) await new Promise((r) => setTimeout(r, 0));
    if ((await sha256Hex(c.salt + n)) === c.challenge) {
      return { algorithm: 'SHA-256', challenge: c.challenge, salt: c.salt, number: n, signature: c.signature };
    }
  }
  return null;
}

/**
 * Invisible spam protection for the contact form: fetches a proof-of-work
 * challenge from the mail endpoint when the visitor starts using the form and
 * solves it in the background. The solution is sent along with the message
 * and verified server-side (sendMail.php). No third party involved.
 */
@Injectable({ providedIn: 'root' })
export class PowService {
  private readonly http = inject(HttpClient);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private pending?: Promise<PowSolution | null>;

  readonly state = signal<PowState>('idle');
  readonly solution = signal<PowSolution | null>(null);

  /** Start (once) and return the solution when done. Safe to call repeatedly. */
  prepare(endpoint: string): Promise<PowSolution | null> {
    if (!this.isBrowser) return Promise.resolve(null);
    if (this.pending) return this.pending;
    this.state.set('solving');
    this.pending = (async () => {
      try {
        const c = await firstValueFrom(this.http.get<PowChallenge>(`${endpoint}?challenge=1`));
        const sol = await solveChallenge(c);
        this.solution.set(sol);
        this.state.set(sol ? 'ready' : 'failed');
        return sol;
      } catch {
        this.state.set('failed');
        return null;
      }
    })();
    return this.pending;
  }

  /** After a submit the challenge is used up; the next message needs a fresh one. */
  reset(): void {
    this.pending = undefined;
    this.solution.set(null);
    this.state.set('idle');
  }
}
