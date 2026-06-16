'use client'

import React, { useEffect, useRef } from 'react'

/* ----------------------------------------------------------------------------
   HeroCanvas — WebGL "living gallery wall"

   Renders the featured photograph on a full-bleed plane and adds three
   restrained, monochrome-geometric treatments that the DOM can't express:

     · a silk ripple that follows the pointer (aspect-correct, decaying)
     · a slow idle drift + Ken Burns scale, so a still frame is never quite still
     · an ink-dissolve between slides, driven by a value-noise threshold
     · a fine animated film grain over everything

   It is a pure enhancement. The photo, the scrim, the title and every control
   live in the DOM (see Carousel). This canvas sits *over* the <Image> fallback
   and fades in only once its textures are ready; any failure (no WebGL, a
   tainted/CORS-blocked texture, a lost context) calls onFail and the DOM
   crossfade underneath simply shows through. Nothing here is load-bearing.
---------------------------------------------------------------------------- */

export type HeroCanvasProps = {
  /** Cover image URLs, index-aligned with the carousel slides. */
  images: string[]
  /** Active slide index (the canvas animates the dissolve when this changes). */
  index: number
  /** Fired after the first frame paints with the active texture ready. */
  onReady?: () => void
  /** Fired on any unrecoverable failure — caller should reveal the DOM fallback. */
  onFail?: () => void
  className?: string
  style?: React.CSSProperties
}

const VERT = `
attribute vec2 aPos;
varying vec2 vUv;
void main() {
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}
`

const FRAG = `
precision highp float;

varying vec2 vUv;

uniform sampler2D uCurr;
uniform sampler2D uNext;
uniform vec2 uRes;        // canvas pixel size
uniform vec2 uImgCurr;    // natural size of current texture
uniform vec2 uImgNext;    // natural size of next texture
uniform float uTime;
uniform float uProgress;  // 0..1 dissolve from current -> next
uniform vec2 uPointer;    // pointer in uv space (0..1), y up
uniform float uPointerAmp;// 0..1 ripple strength (decays when idle)
uniform float uIdle;      // 0..1 idle-drift strength
uniform float uGrain;     // grain amount
uniform float uZoom;      // ken-burns scale (>= 1)

// Hash / value noise — cheap, branchless, GLSL ES 1.00 safe.
float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}
float vnoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

// object-fit: cover — match the wider axis, crop the other, scaled by zoom.
vec2 coverUv(vec2 uv, vec2 img) {
  float screen = uRes.x / uRes.y;
  float image = img.x / img.y;
  vec2 c = uv - 0.5;
  if (screen > image) c.y *= image / screen;
  else c.x *= screen / image;
  return c / uZoom + 0.5;
}

void main() {
  vec2 aspect = vec2(uRes.x / uRes.y, 1.0);

  // --- Pointer silk ripple: a whisper-soft decaying wave centered on the cursor.
  vec2 toP = (vUv - uPointer) * aspect;
  float d = length(toP);
  float ring = sin(d * 16.0 - uTime * 2.4) * exp(-d * 4.0);
  vec2 disp = normalize(toP + 1e-5) * ring * uPointerAmp * 0.008;

  // --- Idle flow: slow large-scale value-noise drift so it breathes.
  float nx = vnoise(vUv * 2.6 + uTime * 0.06);
  float ny = vnoise(vUv * 2.6 - uTime * 0.05 + 7.3);
  disp += (vec2(nx, ny) - 0.5) * 0.013 * uIdle;

  // --- Dissolve: noise threshold sweeps with progress; extra push at the edge.
  float threshold = vnoise(vUv * 3.5 + 11.0);
  float reveal = smoothstep(threshold - 0.14, threshold + 0.14, uProgress);
  float edge = reveal * (1.0 - reveal); // peaks mid-transition
  vec2 edgeDisp = (vec2(vnoise(vUv * 6.0), vnoise(vUv * 6.0 + 3.0)) - 0.5) * edge * 0.09;

  vec3 curr = texture2D(uCurr, coverUv(vUv + disp - edgeDisp, uImgCurr)).rgb;
  vec3 next = texture2D(uNext, coverUv(vUv + disp + edgeDisp, uImgNext)).rgb;
  vec3 color = mix(curr, next, reveal);

  // --- Film grain: per-pixel hash, animated, subtle.
  float g = hash(vUv * uRes + fract(uTime) * 137.0);
  color += (g - 0.5) * uGrain;

  // --- Whisper-soft vignette to seat the frame (depth via tone, not shadow).
  float vig = smoothstep(1.25, 0.35, length((vUv - 0.5) * aspect));
  color *= 0.94 + 0.06 * vig;

  gl_FragColor = vec4(color, 1.0);
}
`

type Tex = { tex: WebGLTexture; w: number; h: number }

const compile = (gl: WebGLRenderingContext, type: number, src: string) => {
  const sh = gl.createShader(type)!
  gl.shaderSource(sh, src)
  gl.compileShader(sh)
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    gl.deleteShader(sh)
    return null
  }
  return sh
}

/* Route remote images through Next's same-origin optimizer so the WebGL texture
   is never a cross-origin request — that sidesteps CORS entirely (a cross-origin
   <img>, even with crossOrigin="anonymous", taints the texture the moment the
   response lacks/!matches CORS headers or a non-CORS cached copy is reused).
   Relative URLs are already same-origin and pass through untouched. */
const sameOriginTextureSrc = (url: string) =>
  /^https?:\/\//i.test(url) ? `/_next/image?url=${encodeURIComponent(url)}&w=1920&q=75` : url

const loadTexture = (gl: WebGLRenderingContext, rawUrl: string) =>
  new Promise<Tex>((resolve, reject) => {
    const url = sameOriginTextureSrc(rawUrl)
    const img = new Image()
    img.decoding = 'async'
    img.onload = () => {
      const tex = gl.createTexture()!
      gl.bindTexture(gl.TEXTURE_2D, tex)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
      try {
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1)
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img)
      } catch (e) {
        // Tainted canvas (CORS) — unusable for WebGL.
        reject(e)
        return
      }
      resolve({ tex, w: img.naturalWidth || 1600, h: img.naturalHeight || 1067 })
    }
    img.onerror = () => reject(new Error(`texture load failed: ${url}`))
    img.src = url
  })

export const HeroCanvas = ({
  images,
  index,
  onReady,
  onFail,
  className,
  style,
}: HeroCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  // Latest index / callbacks read by the render loop without retriggering the
  // GL setup effect. Synced in an effect (never mutated during render).
  const indexRef = useRef(index)
  const onReadyRef = useRef(onReady)
  const onFailRef = useRef(onFail)
  useEffect(() => {
    indexRef.current = index
    onReadyRef.current = onReady
    onFailRef.current = onFail
  })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const gl = (canvas.getContext('webgl', {
      antialias: false,
      alpha: false,
      premultipliedAlpha: false,
      powerPreference: 'high-performance',
    }) ||
      canvas.getContext('experimental-webgl', {
        antialias: false,
      })) as WebGLRenderingContext | null

    if (!gl) {
      console.error('[HeroCanvas] disabled: no-webgl-context')
      onFailRef.current?.()
      return
    }

    let disposed = false
    const fail = (reason: string) => {
      if (disposed) return
      disposed = true
      console.error('[HeroCanvas] disabled:', reason)
      onFailRef.current?.()
    }

    const vs = compile(gl, gl.VERTEX_SHADER, VERT)
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG)
    if (!vs) return fail('vertex-shader: ' + (gl.getError() || 'compile-failed'))
    if (!fs) return fail('fragment-shader: ' + (gl.getError() || 'compile-failed'))
    const prog = gl.createProgram()!
    gl.attachShader(prog, vs)
    gl.attachShader(prog, fs)
    gl.linkProgram(prog)
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS))
      return fail('link: ' + (gl.getProgramInfoLog(prog) || 'unknown'))
    gl.useProgram(prog)

    // Full-screen quad (triangle strip).
    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW,
    )
    const aPos = gl.getAttribLocation(prog, 'aPos')
    gl.enableVertexAttribArray(aPos)
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0)

    const u = {
      curr: gl.getUniformLocation(prog, 'uCurr'),
      next: gl.getUniformLocation(prog, 'uNext'),
      res: gl.getUniformLocation(prog, 'uRes'),
      imgCurr: gl.getUniformLocation(prog, 'uImgCurr'),
      imgNext: gl.getUniformLocation(prog, 'uImgNext'),
      time: gl.getUniformLocation(prog, 'uTime'),
      progress: gl.getUniformLocation(prog, 'uProgress'),
      pointer: gl.getUniformLocation(prog, 'uPointer'),
      pointerAmp: gl.getUniformLocation(prog, 'uPointerAmp'),
      idle: gl.getUniformLocation(prog, 'uIdle'),
      grain: gl.getUniformLocation(prog, 'uGrain'),
      zoom: gl.getUniformLocation(prog, 'uZoom'),
    }
    gl.uniform1i(u.curr, 0)
    gl.uniform1i(u.next, 1)

    // --- Resize (DPR-capped for fill-rate on mid-range GPUs).
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const w = Math.max(1, Math.round(canvas.clientWidth * dpr))
      const h = Math.max(1, Math.round(canvas.clientHeight * dpr))
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w
        canvas.height = h
        gl.viewport(0, 0, w, h)
      }
      gl.uniform2f(u.res, canvas.width, canvas.height)
    }
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)
    resize()

    // --- Pointer (smoothed) — listen on window since the canvas is
    // pointer-events:none; map to the canvas rect, flip Y to uv space.
    const pointer = { x: 0.5, y: 0.5 } // target
    const smooth = { x: 0.5, y: 0.5 } // eased
    let pointerAmp = 0 // ripple target (1 on move, 0 when idle/left)
    let ampSmooth = 0 // eased amplitude actually sent to the shader
    // Drive the ripple straight from pointermove: amp 1 while the cursor is over
    // the hero, 0 otherwise. (pointerout on window is unusable — it fires on
    // every child-element boundary crossing and kept resetting amp to 0.)
    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect()
      if (r.width === 0 || r.height === 0) return
      const x = (e.clientX - r.left) / r.width
      const y = (e.clientY - r.top) / r.height
      const inside = x >= 0 && x <= 1 && y >= 0 && y <= 1
      if (inside) {
        pointer.x = x
        pointer.y = 1 - y
        pointerAmp = 1
      } else {
        pointerAmp = 0
      }
    }
    window.addEventListener('pointermove', onMove, { passive: true })

    // --- Context loss → hand back to the DOM fallback.
    const onLost = (e: Event) => {
      e.preventDefault()
      fail('context-lost')
    }
    canvas.addEventListener('webglcontextlost', onLost as EventListener)

    // --- Run only when on-screen and the tab is visible.
    let visible = document.visibilityState === 'visible'
    let onScreen = true
    const io = new IntersectionObserver(([entry]) => (onScreen = entry.isIntersecting), {
      threshold: 0.01,
    })
    io.observe(canvas)
    const onVis = () => (visible = document.visibilityState === 'visible')
    document.addEventListener('visibilitychange', onVis)

    // --- Texture state.
    const textures: (Tex | null)[] = images.map(() => null)
    let currIdx = indexRef.current
    let nextIdx = indexRef.current
    let lastSeen = indexRef.current // last index we reacted to
    let progress = 0 // 0..1 dissolve
    let transitioning = false

    const bind = (slot: number, t: Tex) => {
      gl.activeTexture(slot === 0 ? gl.TEXTURE0 : gl.TEXTURE1)
      gl.bindTexture(gl.TEXTURE_2D, t.tex)
    }

    let raf = 0
    let started = 0
    let last = 0
    let announced = false

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame)
      if (!started) started = now
      const dt = Math.min(0.05, (now - last || 16) / 1000)
      last = now
      if (!visible || !onScreen) return

      // React to a parent index change: dissolve if its texture is ready,
      // otherwise snap (the DOM crossfade covers the gap underneath).
      const want = indexRef.current
      if (want !== lastSeen) {
        lastSeen = want
        if (textures[want]) {
          nextIdx = want
          progress = 0
          transitioning = true
        } else {
          currIdx = want
          nextIdx = want
          progress = 0
          transitioning = false
        }
      }

      // Ease pointer + ripple amplitude.
      smooth.x += (pointer.x - smooth.x) * Math.min(1, dt * 6)
      smooth.y += (pointer.y - smooth.y) * Math.min(1, dt * 6)
      ampSmooth += (pointerAmp - ampSmooth) * Math.min(1, dt * 3)

      // Advance dissolve, then promote curr -> next on completion. Both happen
      // BEFORE the textures are read, so the final frame already binds the new
      // image (otherwise progress snaps to 0 while the old texture is still
      // bound — a one-frame flash of the previous slide).
      if (transitioning && textures[nextIdx]) {
        progress += dt / 0.9 // ~900ms
        if (progress >= 1) {
          progress = 0
          currIdx = nextIdx
          transitioning = false
        }
      }

      const tCurr = textures[currIdx]
      if (!tCurr) return
      const tNext = textures[nextIdx] ?? tCurr

      bind(0, tCurr)
      bind(1, tNext)
      const t = (now - started) / 1000
      gl.uniform1f(u.time, t)
      gl.uniform1f(u.progress, transitioning ? progress : 0)
      gl.uniform2f(u.imgCurr, tCurr.w, tCurr.h)
      gl.uniform2f(u.imgNext, tNext.w, tNext.h)
      gl.uniform2f(u.pointer, smooth.x, smooth.y)
      gl.uniform1f(u.pointerAmp, ampSmooth)
      gl.uniform1f(u.idle, 1)
      gl.uniform1f(u.grain, 0.07)
      // Perpetual Ken-Burns breathing — 1.04 → ~1.09 (zoom stays >= 1 so the
      // cover frame never reveals clamped edges).
      gl.uniform1f(u.zoom, 1.04 + 0.05 * (0.5 + 0.5 * Math.sin(t * 0.16)))
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)

      if (!announced) {
        announced = true
        onReadyRef.current?.()
      }
    }

    // Load the active texture first (fast first paint), then the rest.
    loadTexture(gl, images[currIdx])
      .then((t) => {
        if (disposed) return
        textures[currIdx] = t
        raf = requestAnimationFrame(frame)
        images.forEach((url, i) => {
          if (i === currIdx) return
          loadTexture(gl, url)
            .then((tx) => {
              if (!disposed) textures[i] = tx
            })
            .catch(() => {
              /* one slide failing isn't fatal; it shows the DOM image until ready */
            })
        })
      })
      .catch((e: unknown) =>
        fail('texture: ' + (e instanceof Error ? e.message : String(e))),
      )

    return () => {
      disposed = true
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('visibilitychange', onVis)
      canvas.removeEventListener('webglcontextlost', onLost as EventListener)
      // Delete GPU resources, but DO NOT call WEBGL_lose_context.loseContext():
      // that permanently kills the <canvas>'s context, and React Strict Mode /
      // HMR re-run this effect on the SAME canvas node — the next getContext()
      // would return the dead context and every shader compile would fail with
      // CONTEXT_LOST_WEBGL. Dropping the canvas frees the context on its own.
      textures.forEach((t) => t && gl.deleteTexture(t.tex))
      gl.deleteBuffer(buf)
      gl.deleteProgram(prog)
      gl.deleteShader(vs)
      gl.deleteShader(fs)
    }
    // images is a stable list for the life of the hero; index is read via ref.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [images.join('|')])

  return <canvas ref={canvasRef} className={className} style={style} aria-hidden="true" />
}
