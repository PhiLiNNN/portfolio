import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  PLATFORM_ID,
  inject,
  viewChild,
} from '@angular/core';

/** Render at half resolution; the fog is blurry by nature. */
const SCALE = 0.5;

const VS = `#version 300 es
layout(location=0) in vec2 p; out vec2 v;
void main(){ v = p * .5 + .5; gl_Position = vec4(p, 0., 1.); }`;

// Fractal noise fog. Coordinates move with time so the haze drifts from
// right to left; a second, slower layer gives depth. Output is a single
// colour with varying alpha so it works over any background.
const FS = `#version 300 es
precision highp float; in vec2 v; out vec4 o;
uniform float t; uniform vec2 res; uniform vec3 colA; uniform vec3 colB; uniform float strength;
uniform vec2 m; uniform float push; uniform vec2 drift;
uniform vec4 boxes[12]; uniform int nBoxes; uniform float sp;
float h(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float n(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.-2.*f);
  return mix(mix(h(i), h(i+vec2(1,0)), f.x), mix(h(i+vec2(0,1)), h(i+vec2(1,1)), f.x), f.y); }
float fbm(vec2 p){ float a = .5, s = 0.; for (int k = 0; k < 6; k++) { s += a * n(p); p = p * 2.03 + 19.1; a *= .5; } return s; }
void main(){
  vec2 asp = vec2(res.x / res.y, 1.);
  vec2 q = v * asp * 1.1;
  // Pointer: the haze is shoved outwards around the cursor and thins out
  // there. push rises with pointer speed and decays when it rests.
  vec2 d = (v - m) * asp;
  float r = length(d);
  float infl = exp(-r * r * 22.) * push;
  q -= (d / max(r, 1e-4)) * infl * 0.28;
  // Plates moving with the scroll: the haze is shoved ahead of each plate
  // (compressed) and thins out in the wake behind it. sp is the smoothed
  // scroll speed, positive while the page content moves up.
  float densMul = 1.;
  vec2 mv = vec2(0., sign(sp));
  for (int i = 0; i < 12; i++) {
    if (i >= nBoxes) break;
    vec2 bc = boxes[i].xy * asp;
    vec2 bh = boxes[i].zw * asp;
    vec2 bp = v * asp - bc;
    vec2 dd = abs(bp) - bh;
    float bd = length(max(dd, 0.));
    float bi = exp(-bd * bd * 160.) * abs(sp);
    vec2 outward = bp / max(length(bp), 1e-4);
    float side = dot(outward, mv);
    float ahead = smoothstep(-.2, .4, side);
    // Shove the haze away from the plate: sample from closer to the plate, so
    // the fog in front appears pushed outwards (same sign as the pointer push).
    q -= normalize(outward * .6 + mv * .4) * bi * .22 * ahead;
    densMul *= 1. - bi * .35 * ahead - bi * .7 * (1. - ahead);
  }
  // Domain-warped noise: the warp gives the wispy, nebula-like filaments.
  vec2 w = vec2(fbm(q + drift), fbm(q + 7.3 + drift * .6));
  float f = fbm(q + drift + 1.6 * w);
  float g = fbm(q * .45 + drift * .5 + 3.1);
  float mx = fbm(q * .3 - drift * .3 + 11.);
  vec3 c = mix(colA, colB, smoothstep(.35, .65, mx));
  float dens = smoothstep(.28, .72, f) * .9 + smoothstep(.38, .8, g) * .6;
  float core = smoothstep(.58, .9, f);
  c = mix(c, vec3(1.), core * .4);
  dens *= (1. - infl * .9) * max(densMul, 0.);
  o = vec4(c, dens * strength);
}`;

/**
 * Background nebula: slow, domain-warped fractal noise in two tints drifting
 * from right to left over the whole page (WebGL2, half resolution). Pauses when the tab is hidden and
 * shows a still frame for visitors who prefer reduced motion. Without WebGL2
 * nothing is drawn.
 */
@Component({
  selector: 'app-fog',
  template: `<canvas #c class="fog" aria-hidden="true"></canvas>`,
  styles: `
    :host { display: contents; }
    .fog { position: fixed; inset: 0; width: 100%; height: 100%; z-index: 0; pointer-events: none; }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FogComponent implements AfterViewInit, OnDestroy {
  private readonly canvas = viewChild.required<ElementRef<HTMLCanvasElement>>('c');
  private readonly zone = inject(NgZone);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  private gl: WebGL2RenderingContext | null = null;
  private uniforms: Record<'t' | 'res' | 'colA' | 'colB' | 'strength' | 'm' | 'push' | 'drift' | 'boxes' | 'nBoxes' | 'sp', WebGLUniformLocation | null> | null = null;
  private readonly aim = { x: -1, y: -1 };
  private readonly mouse = { x: -1, y: -1 };
  private push = 0;
  /** Accumulated wind travel; the wind slowly veers, so this is integrated per frame. */
  private readonly drift = { x: 1.7, y: 0.3 };
  /** Smoothed scroll speed (viewport heights per second, signed) and the plate rects passed to the shader. */
  private scrollPush = 0;
  private lastScrollY = 0;
  private readonly boxData = new Float32Array(12 * 4);
  private plates: Element[] = [];
  private platesStamp = 0;
  private lastFrame = 0;
  private readonly onPointer = (e: PointerEvent) => {
    this.aim.x = e.clientX / window.innerWidth;
    this.aim.y = 1 - e.clientY / window.innerHeight;
  };
  private raf = 0;
  private t0 = 0;
  private dark = true;
  private reduced = false;
  private themeObserver?: MutationObserver;
  private readonly onResize = () => this.resize();
  private readonly onVisibility = () => (document.hidden ? this.stop() : this.start());

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;
    const el = this.canvas().nativeElement;
    const gl = el.getContext('webgl2', { alpha: true, antialias: false, premultipliedAlpha: false });
    if (!gl) return;

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null;
    };
    const vs = compile(gl.VERTEX_SHADER, VS);
    const fs = compile(gl.FRAGMENT_SHADER, FS);
    if (!vs || !fs) return;
    const prog = gl.createProgram()!;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    // Single full-screen pass over a cleared buffer: no GL blending, the page
    // compositor applies the alpha (premultipliedAlpha is off).

    this.gl = gl;
    this.uniforms = {
      t: gl.getUniformLocation(prog, 't'),
      res: gl.getUniformLocation(prog, 'res'),
      colA: gl.getUniformLocation(prog, 'colA'),
      colB: gl.getUniformLocation(prog, 'colB'),
      strength: gl.getUniformLocation(prog, 'strength'),
      m: gl.getUniformLocation(prog, 'm'),
      push: gl.getUniformLocation(prog, 'push'),
      drift: gl.getUniformLocation(prog, 'drift'),
      boxes: gl.getUniformLocation(prog, 'boxes'),
      nBoxes: gl.getUniformLocation(prog, 'nBoxes'),
      sp: gl.getUniformLocation(prog, 'sp'),
    };

    this.readTheme();
    this.themeObserver = new MutationObserver(() => this.readTheme());
    this.themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    this.reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    this.resize();
    window.addEventListener('resize', this.onResize, { passive: true });
    window.addEventListener('pointermove', this.onPointer, { passive: true });
    document.addEventListener('visibilitychange', this.onVisibility);
    el.addEventListener('webglcontextlost', () => this.stop(), { once: true });

    this.t0 = performance.now();
    if (this.reduced) {
      this.drift.x = 1.7;
      this.drift.y = 0.3;
      this.frame(this.t0);
      return;
    }
    this.start();
  }

  ngOnDestroy(): void {
    this.stop();
    if (!this.isBrowser) return;
    window.removeEventListener('resize', this.onResize);
    window.removeEventListener('pointermove', this.onPointer);
    document.removeEventListener('visibilitychange', this.onVisibility);
    this.themeObserver?.disconnect();
  }

  private readTheme(): void {
    this.dark = document.documentElement.getAttribute('data-theme') !== 'light';
    if (this.reduced) this.frame(performance.now());
  }

  private resize(): void {
    const el = this.canvas().nativeElement;
    el.width = Math.max(1, Math.round(window.innerWidth * SCALE));
    el.height = Math.max(1, Math.round(window.innerHeight * SCALE));
    if (this.reduced) this.frame(performance.now());
  }

  private start(): void {
    if (this.raf || !this.gl || this.reduced) return;
    this.zone.runOutsideAngular(() => {
      const loop = (now: number) => {
        this.frame(now);
        this.raf = requestAnimationFrame(loop);
      };
      this.raf = requestAnimationFrame(loop);
    });
  }

  private stop(): void {
    if (this.raf) cancelAnimationFrame(this.raf);
    this.raf = 0;
  }

  private frame(now: number): void {
    const gl = this.gl;
    const u = this.uniforms;
    if (!gl || !u) return;
    const el = this.canvas().nativeElement;
    gl.viewport(0, 0, el.width, el.height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    const dt = Math.min(0.05, (now - (this.lastFrame || now)) / 1000);
    this.lastFrame = now;
    if (this.mouse.x < 0 && this.aim.x >= 0) {
      this.mouse.x = this.aim.x;
      this.mouse.y = this.aim.y;
    }
    const dx = this.aim.x - this.mouse.x;
    const dy = this.aim.y - this.mouse.y;
    this.mouse.x += dx * 0.18;
    this.mouse.y += dy * 0.18;
    // Speed (screen fractions per second) feeds the push; it settles back to 0 at rest.
    const speed = Math.hypot(dx, dy) / Math.max(dt, 1e-3);
    this.push = Math.min(1, this.push * Math.pow(0.08, dt) + speed * 0.9 * dt);
    // Wind: mostly from the right, but the direction veers slowly and the
    // speed breathes, so the haze never runs on a straight rail.
    const tt = (now - this.t0) / 1000;
    const angle = Math.PI + 0.9 * Math.sin(tt * 0.06) + 0.45 * Math.sin(tt * 0.021 + 1.3);
    const windSpeed = 0.04 * (1 + 0.35 * Math.sin(tt * 0.045 + 0.7));
    // Shader coordinates grow to the left when drift.x grows, so negate the x component.
    this.drift.x += -Math.cos(angle) * windSpeed * dt;
    this.drift.y += Math.sin(angle) * windSpeed * dt;
    gl.uniform2f(u.drift, this.drift.x, this.drift.y);
    this.updateScrollPush(dt);
    gl.uniform1f(u.sp, this.scrollPush);
    gl.uniform1i(u.nBoxes, Math.abs(this.scrollPush) > 0.01 ? this.collectBoxes(now) : 0);
    gl.uniform4fv(u.boxes, this.boxData);
    gl.uniform2f(u.m, this.mouse.x, this.mouse.y);
    gl.uniform1f(u.push, this.push);
    gl.uniform1f(u.t, (now - this.t0) / 1000);
    gl.uniform2f(u.res, el.width, el.height);
    // Phones show a narrow slice of the pattern; keep it calmer there so text stays readable.
    const phone = window.innerWidth < 700 ? 0.7 : 1;
    if (this.dark) {
      // Cold cyan-blue and deep violet, like a nebula seen from far away.
      gl.uniform3f(u.colA, 0.25, 0.62, 1.0);
      gl.uniform3f(u.colB, 0.5, 0.36, 0.95);
      gl.uniform1f(u.strength, 0.42 * phone);
    } else {
      gl.uniform3f(u.colA, 0.08, 0.28, 0.58);
      gl.uniform3f(u.colB, 0.26, 0.18, 0.52);
      gl.uniform1f(u.strength, 0.42 * phone);
    }
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  /** Scroll speed drives the plate push; it decays quickly once scrolling stops. */
  private updateScrollPush(dt: number): void {
    const y = window.scrollY;
    const v = (y - this.lastScrollY) / Math.max(dt, 1e-3) / window.innerHeight;
    this.lastScrollY = y;
    const target = Math.max(-1, Math.min(1, v * 0.5));
    const k = 1 - Math.pow(0.02, dt);
    this.scrollPush += (target - this.scrollPush) * k;
    if (Math.abs(this.scrollPush) < 0.004) this.scrollPush = 0;
  }

  /** Visible plates and the dial as UV boxes (centre, half size); the element list is refreshed every 2 s. */
  private collectBoxes(now: number): number {
    if (now - this.platesStamp > 2000) {
      this.plates = Array.from(document.querySelectorAll('.plate, .dial, .btn-primary'));
      this.platesStamp = now;
    }
    const W = window.innerWidth;
    const H = window.innerHeight;
    let n = 0;
    for (const el of this.plates) {
      if (n >= 12) break;
      const r = el.getBoundingClientRect();
      if (r.bottom < -80 || r.top > H + 80 || r.width === 0) continue;
      const o = n * 4;
      this.boxData[o] = (r.left + r.width / 2) / W;
      this.boxData[o + 1] = 1 - (r.top + r.height / 2) / H;
      this.boxData[o + 2] = r.width / 2 / W;
      this.boxData[o + 3] = r.height / 2 / H;
      n++;
    }
    return n;
  }
}
