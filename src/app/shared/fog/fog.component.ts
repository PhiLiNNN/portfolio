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
float h(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float n(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.-2.*f);
  return mix(mix(h(i), h(i+vec2(1,0)), f.x), mix(h(i+vec2(0,1)), h(i+vec2(1,1)), f.x), f.y); }
float fbm(vec2 p){ float a = .5, s = 0.; for (int k = 0; k < 6; k++) { s += a * n(p); p = p * 2.03 + 19.1; a *= .5; } return s; }
void main(){
  vec2 asp = vec2(res.x / res.y, 1.);
  vec2 q = v * asp * 1.1;
  vec2 drift = vec2(t * .035, t * .005);
  // Domain-warped noise: the warp gives the wispy, nebula-like filaments.
  vec2 w = vec2(fbm(q + drift), fbm(q + 7.3 + drift * .6));
  float f = fbm(q + drift + 1.6 * w);
  float g = fbm(q * .45 + drift * .5 + 3.1);
  float m = fbm(q * .3 - drift * .3 + 11.);
  vec3 c = mix(colA, colB, smoothstep(.35, .65, m));
  float dens = smoothstep(.28, .72, f) * .9 + smoothstep(.38, .8, g) * .6;
  float core = smoothstep(.58, .9, f);
  c = mix(c, vec3(1.), core * .4);
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
  private uniforms: Record<'t' | 'res' | 'colA' | 'colB' | 'strength', WebGLUniformLocation | null> | null = null;
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
    };

    this.readTheme();
    this.themeObserver = new MutationObserver(() => this.readTheme());
    this.themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    this.reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    this.resize();
    window.addEventListener('resize', this.onResize, { passive: true });
    document.addEventListener('visibilitychange', this.onVisibility);
    el.addEventListener('webglcontextlost', () => this.stop(), { once: true });

    this.t0 = performance.now();
    if (this.reduced) {
      this.frame(this.t0 + 40000);
      return;
    }
    this.start();
  }

  ngOnDestroy(): void {
    this.stop();
    if (!this.isBrowser) return;
    window.removeEventListener('resize', this.onResize);
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
    gl.uniform1f(u.t, (now - this.t0) / 1000);
    gl.uniform2f(u.res, el.width, el.height);
    if (this.dark) {
      // Cold cyan-blue and deep violet, like a nebula seen from far away.
      gl.uniform3f(u.colA, 0.25, 0.62, 1.0);
      gl.uniform3f(u.colB, 0.5, 0.36, 0.95);
      gl.uniform1f(u.strength, 0.42);
    } else {
      gl.uniform3f(u.colA, 0.18, 0.42, 0.72);
      gl.uniform3f(u.colB, 0.38, 0.33, 0.68);
      gl.uniform1f(u.strength, 0.13);
    }
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }
}
