import { sha256Hex, solveChallenge } from './pow.service';

describe('proof of work', () => {
  it('hashes like the server (sha256 hex)', async () => {
    expect(await sha256Hex('abc')).toBe(
      'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad'
    );
  });

  it('finds the number behind a challenge', async () => {
    const salt = '1700000000.0123456789abcdef';
    const challenge = await sha256Hex(salt + '137');
    const sol = await solveChallenge({ algorithm: 'SHA-256', challenge, salt, maxnumber: 500, signature: 'sig' });
    expect(sol?.number).toBe(137);
    expect(sol?.signature).toBe('sig');
  });

  it('returns null when the number is outside the search space', async () => {
    const salt = '1700000000.0123456789abcdef';
    const challenge = await sha256Hex(salt + '900');
    expect(await solveChallenge({ algorithm: 'SHA-256', challenge, salt, maxnumber: 100, signature: 's' })).toBeNull();
  });
});
