import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const EARTH_TEXTURE = "/assets/earth-blue-marble.jpg";
const FOCUS_LAT = 39.8;
const FOCUS_LON = 46.8;

function surfaceVector(latitude: number, longitude: number, radius = 1) {
  const lat = THREE.MathUtils.degToRad(latitude);
  const lon = THREE.MathUtils.degToRad(longitude);
  return new THREE.Vector3(
    Math.cos(lat) * Math.cos(lon),
    Math.sin(lat),
    -Math.cos(lat) * Math.sin(lon),
  ).multiplyScalar(radius);
}

function makeHaloTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 128;
  const context = canvas.getContext("2d");
  if (!context) return null;
  const gradient = context.createRadialGradient(64, 64, 2, 64, 64, 64);
  gradient.addColorStop(0, "rgba(255, 224, 151, .95)");
  gradient.addColorStop(0.12, "rgba(245, 198, 113, .55)");
  gradient.addColorStop(0.5, "rgba(230, 170, 86, .12)");
  gradient.addColorStop(1, "rgba(230, 170, 86, 0)");
  context.fillStyle = gradient;
  context.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(canvas);
}

function makeStarfield() {
  const count = 420;
  const positions = new Float32Array(count * 3);
  const random = (seed: number) => {
    const value = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
    return value - Math.floor(value);
  };

  for (let i = 0; i < count; i += 1) {
    const longitude = random(i + 1) * Math.PI * 2;
    const vertical = random(i + count + 7) * 2 - 1;
    const horizontal = Math.sqrt(1 - vertical * vertical);
    const radius = 6 + random(i + count * 2 + 13) * 3;
    positions[i * 3] = Math.cos(longitude) * horizontal * radius;
    positions[i * 3 + 1] = vertical * radius;
    positions[i * 3 + 2] = Math.sin(longitude) * horizontal * radius;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  const material = new THREE.PointsMaterial({
    color: 0xe8e2ce,
    size: 0.018,
    transparent: true,
    opacity: 0.64,
    sizeAttenuation: true,
    depthWrite: false,
  });
  return { geometry, material, points: new THREE.Points(geometry, material) };
}

export default function GlobeCanvas() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
    } catch {
      mount.dataset.webglFallback = "true";
      return;
    }

    delete mount.dataset.webglFallback;
    mount.replaceChildren();
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(Math.max(mount.clientWidth, 1), Math.max(mount.clientHeight, 1), false);
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.18;
    renderer.domElement.setAttribute("aria-hidden", "true");
    renderer.domElement.style.touchAction = "none";
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 40);
    camera.position.copy(surfaceVector(FOCUS_LAT, FOCUS_LON, 3.34));
    camera.lookAt(0, 0, 0);

    const hemisphere = new THREE.HemisphereLight(0xe2efff, 0x10161d, 1.05);
    scene.add(hemisphere);
    const sun = new THREE.DirectionalLight(0xfff2d8, 3.2);
    sun.position.set(3.2, 4.2, -4.5);
    scene.add(sun);
    const fill = new THREE.DirectionalLight(0x87b7ed, 0.38);
    fill.position.set(-4, -1, 3);
    scene.add(fill);

    const stars = makeStarfield();
    scene.add(stars.points);

    const globe = new THREE.Group();
    scene.add(globe);

    const earthGeometry = new THREE.SphereGeometry(1, 96, 72);
    const earthMaterial = new THREE.MeshStandardMaterial({
      color: 0xf6f1e4,
      roughness: 0.9,
      metalness: 0.015,
    });
    const earth = new THREE.Mesh(earthGeometry, earthMaterial);
    earth.renderOrder = 1;
    globe.add(earth);

    const atmosphereGeometry = new THREE.SphereGeometry(1.045, 72, 56);
    const atmosphereMaterial = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vViewDirection;
        void main() {
          vec4 viewPosition = modelViewMatrix * vec4(position, 1.0);
          vNormal = normalize(normalMatrix * normal);
          vViewDirection = normalize(-viewPosition.xyz);
          gl_Position = projectionMatrix * viewPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        varying vec3 vViewDirection;
        void main() {
          float rim = 1.0 - max(dot(normalize(vNormal), normalize(vViewDirection)), 0.0);
          float glow = pow(rim, 3.1) * 0.48;
          gl_FragColor = vec4(0.31, 0.62, 0.98, glow);
        }
      `,
    });
    const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    atmosphere.renderOrder = 2;
    globe.add(atmosphere);

    const pin = new THREE.Group();
    const pinPosition = surfaceVector(FOCUS_LAT, FOCUS_LON, 1.009);
    const pinCore = new THREE.Mesh(
      new THREE.SphereGeometry(0.018, 20, 16),
      new THREE.MeshBasicMaterial({ color: 0xffd47c, toneMapped: false }),
    );
    pinCore.position.copy(pinPosition);
    pin.add(pinCore);

    const haloTexture = makeHaloTexture();
    let haloMaterial: THREE.SpriteMaterial | null = null;
    if (haloTexture) {
      haloTexture.colorSpace = THREE.SRGBColorSpace;
      haloMaterial = new THREE.SpriteMaterial({
        map: haloTexture,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        toneMapped: false,
      });
      const halo = new THREE.Sprite(haloMaterial);
      halo.position.copy(surfaceVector(FOCUS_LAT, FOCUS_LON, 1.025));
      halo.scale.set(0.19, 0.19, 1);
      pin.add(halo);
    }
    globe.add(pin);

    const stage = mount.closest(".globe-stage");
    const label = stage?.querySelector<HTMLElement>(".globe-tag") ?? null;
    if (label) label.style.transition = "opacity 160ms ease";

    const loader = new THREE.TextureLoader();
    let earthTexture: THREE.Texture | null = null;
    let disposed = false;
    const render = () => {
      renderer.render(scene, camera);
      if (!label) return;
      const projected = pinPosition.clone().normalize().multiplyScalar(1.16).project(camera);
      const width = mount.clientWidth;
      const height = mount.clientHeight;
      const visible = pinPosition.dot(camera.position) > 0
        && projected.z > -1 && projected.z < 1
        && Math.abs(projected.x) < 1.12 && Math.abs(projected.y) < 1.12;
      const x = THREE.MathUtils.clamp((projected.x * 0.5 + 0.5) * width, 56, Math.max(56, width - 56));
      const y = Math.max(18, (0.5 - projected.y * 0.5) * height - 24);
      label.style.left = `${x}px`;
      label.style.top = `${y}px`;
      label.style.transform = "translate(-50%, -50%)";
      label.style.opacity = visible ? "1" : "0";
    };
    loader.load(
      EARTH_TEXTURE,
      (texture) => {
        if (disposed) {
          texture.dispose();
          return;
        }
        earthTexture = texture;
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.ClampToEdgeWrapping;
        earthMaterial.map = texture;
        earthMaterial.needsUpdate = true;
        render();
      },
      undefined,
      () => {
        if (!disposed) {
          mount.dataset.textureFallback = "true";
          render();
        }
      },
    );

    const controls = new OrbitControls(camera, renderer.domElement);
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    controls.enableDamping = !reducedMotion;
    controls.dampingFactor = 0.055;
    controls.enablePan = false;
    controls.enableZoom = false;
    controls.autoRotate = !reducedMotion;
    controls.autoRotateSpeed = 0.22;
    controls.minPolarAngle = 0.2;
    controls.maxPolarAngle = Math.PI - 0.2;
    controls.rotateSpeed = 0.58;
    controls.update();

    let animationFrame = 0;
    const animate = () => {
      controls.update();
      render();
      animationFrame = window.requestAnimationFrame(animate);
    };
    controls.addEventListener("change", render);

    const resizeObserver = new ResizeObserver(() => {
      const width = Math.max(mount.clientWidth, 1);
      const height = Math.max(mount.clientHeight, 1);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
      render();
    });
    resizeObserver.observe(mount);
    render();
    if (!reducedMotion) animationFrame = window.requestAnimationFrame(animate);

    return () => {
      disposed = true;
      if (label) {
        label.style.removeProperty("left");
        label.style.removeProperty("top");
        label.style.removeProperty("transform");
        label.style.removeProperty("opacity");
        label.style.removeProperty("transition");
      }
      window.cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
      controls.removeEventListener("change", render);
      controls.dispose();
      earthTexture?.dispose();
      earthGeometry.dispose();
      earthMaterial.dispose();
      atmosphereGeometry.dispose();
      atmosphereMaterial.dispose();
      pinCore.geometry.dispose();
      (pinCore.material as THREE.Material).dispose();
      haloTexture?.dispose();
      haloMaterial?.dispose();
      stars.geometry.dispose();
      stars.material.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return (
    <>
      <div
        ref={mountRef}
        className="globe-canvas"
        role="img"
        aria-label="NASA Blue Marble teksturası, işıq-kölgə və Qarabağ göstəricisi olan interaktiv 3D Yer kürəsi; sürükləyərək fırladın"
        aria-describedby="earth-texture-credit"
      />
      <span className="earth-credit" id="earth-texture-credit">NASA / GSFC SVS · Blue Marble</span>
    </>
  );
}
