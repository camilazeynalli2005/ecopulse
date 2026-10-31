import { useEffect, useRef } from "react";

const land: Array<Array<[number, number]>> = [
  [[70, -10], [66, 5], [62, 18], [58, 29], [54, 36], [52, 45], [58, 57], [61, 72], [57, 88], [51, 104], [45, 119], [38, 132], [28, 137], [20, 127], [16, 115], [8, 109], [10, 96], [18, 87], [20, 72], [27, 62], [33, 52], [37, 42], [45, 34], [49, 20], [57, 9], [62, -3]],
  [[36, -11], [43, -2], [44, 10], [40, 18], [37, 28], [31, 33], [25, 35], [18, 41], [11, 43], [4, 50], [-4, 48], [-12, 43], [-20, 39], [-28, 33], [-35, 25], [-32, 15], [-25, 8], [-16, 3], [-7, -3], [2, -9], [13, -17], [25, -16]],
  [[12, 43], [10, 51], [6, 55], [3, 49]],
  [[56, -10], [61, -8], [62, -2], [58, 1], [55, -4]],
  [[-12, 112], [-5, 115], [-7, 127], [-15, 132], [-22, 127], [-21, 117]],
];

function drawGlobe(canvas: HTMLCanvasElement, rotation: number, width: number, height: number, pulseActive = true) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, width, height);

  const cx = width * 0.51;
  const cy = height * 0.5;
  const radius = Math.min(width * 0.42, height * 0.42);
  const glow = ctx.createRadialGradient(cx - radius * 0.42, cy - radius * 0.5, radius * 0.04, cx, cy, radius * 1.36);
  glow.addColorStop(0, "rgba(225, 194, 123, .10)");
  glow.addColorStop(0.62, "rgba(33, 77, 62, .12)");
  glow.addColorStop(1, "rgba(18, 40, 34, 0)");
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(cx, cy, radius * 1.36, 0, Math.PI * 2);
  ctx.fill();

  const sphere = ctx.createRadialGradient(cx - radius * 0.38, cy - radius * 0.42, radius * 0.08, cx, cy, radius);
  sphere.addColorStop(0, "#416e61");
  sphere.addColorStop(0.53, "#23483f");
  sphere.addColorStop(1, "#102820");
  ctx.fillStyle = sphere;
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, radius - 0.5, 0, Math.PI * 2);
  ctx.clip();

  const project = (lat: number, lon: number) => {
    const phi = (lat * Math.PI) / 180;
    const lambda = ((lon - rotation) * Math.PI) / 180;
    const z = Math.cos(phi) * Math.cos(lambda);
    if (z < -0.035) return null;
    return { x: cx + radius * Math.cos(phi) * Math.sin(lambda), y: cy - radius * Math.sin(phi), z };
  };

  ctx.lineWidth = 0.65;
  for (let lat = -60; lat <= 60; lat += 20) {
    ctx.beginPath();
    let started = false;
    for (let lon = -180; lon <= 180; lon += 3) {
      const point = project(lat, lon);
      if (!point) { started = false; continue; }
      if (!started) { ctx.moveTo(point.x, point.y); started = true; }
      else ctx.lineTo(point.x, point.y);
    }
    ctx.strokeStyle = "rgba(217, 231, 212, .16)";
    ctx.stroke();
  }
  for (let lon = -180; lon < 180; lon += 20) {
    ctx.beginPath();
    let started = false;
    for (let lat = -88; lat <= 88; lat += 3) {
      const point = project(lat, lon);
      if (!point) { started = false; continue; }
      if (!started) { ctx.moveTo(point.x, point.y); started = true; }
      else ctx.lineTo(point.x, point.y);
    }
    ctx.strokeStyle = "rgba(217, 231, 212, .14)";
    ctx.stroke();
  }

  for (const polygon of land) {
    ctx.beginPath();
    let started = false;
    let visibleCount = 0;
    polygon.forEach(([lat, lon]) => {
      const point = project(lat, lon);
      if (!point) { started = false; return; }
      if (!started) { ctx.moveTo(point.x, point.y); started = true; }
      else ctx.lineTo(point.x, point.y);
      visibleCount += 1;
    });
    if (visibleCount > 2) {
      ctx.closePath();
      ctx.fillStyle = "rgba(182, 192, 142, .34)";
      ctx.fill();
      ctx.strokeStyle = "rgba(220, 224, 184, .31)";
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  }

  const karabakh = project(39.8, 46.8);
  if (karabakh) {
    const pulse = pulseActive ? 0.5 + 0.5 * Math.sin(Date.now() / 390) : 0.5;
    ctx.beginPath();
    ctx.arc(karabakh.x, karabakh.y, 8 + pulse * 8, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(231, 190, 104, ${0.12 + pulse * 0.09})`;
    ctx.fill();
    ctx.beginPath();
    ctx.arc(karabakh.x, karabakh.y, 3.5, 0, Math.PI * 2);
    ctx.fillStyle = "#f1cb79";
    ctx.fill();
    ctx.strokeStyle = "rgba(255, 241, 200, .9)";
    ctx.lineWidth = 1.2;
    ctx.stroke();
  }

  for (let i = 0; i < 38; i += 1) {
    const x = cx + Math.sin(i * 71.7) * radius * 0.9;
    const y = cy + Math.cos(i * 37.3) * radius * 0.88;
    if (Math.hypot(x - cx, y - cy) < radius * 0.94) {
      ctx.fillStyle = `rgba(238, 232, 193, ${0.18 + ((i % 4) * 0.08)})`;
      ctx.beginPath();
      ctx.arc(x, y, i % 7 === 0 ? 1.4 : 0.7, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.restore();
  ctx.strokeStyle = "rgba(226, 213, 164, .48)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.stroke();
}

export default function GlobeCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rotationRef = useRef(46.8);
  const pointerRef = useRef<{ x: number; y: number; active: boolean }>({ x: 0, y: 0, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    if (!canvas || !parent) return;
    let frame = 0;
    let width = 0;
    let height = 0;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const resize = () => {
      const rect = parent.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      drawGlobe(canvas, rotationRef.current, width, height, !reduced);
    };
    const observer = new ResizeObserver(resize);
    observer.observe(parent);
    resize();

    const animate = () => {
      if (!pointerRef.current.active) rotationRef.current += 0.012;
      drawGlobe(canvas, rotationRef.current, width, height, true);
      frame = window.requestAnimationFrame(animate);
    };
    if (!reduced) frame = window.requestAnimationFrame(animate);
    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(frame);
    };
  }, []);

  const onPointerDown = (event: React.PointerEvent<HTMLCanvasElement>) => {
    pointerRef.current = { x: event.clientX, y: event.clientY, active: true };
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const onPointerMove = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!pointerRef.current.active) return;
    const dx = event.clientX - pointerRef.current.x;
    rotationRef.current -= dx * 0.32;
    pointerRef.current.x = event.clientX;
  };
  const stopDrag = () => { pointerRef.current.active = false; };

  return (
    <canvas
      ref={canvasRef}
      className="globe-canvas"
      aria-label="Qarabağ fokusa alınmış, sürükləyərək fırladıla bilən demo 3D Yer kürəsi"
      role="img"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={stopDrag}
      onPointerCancel={stopDrag}
    />
  );
}
