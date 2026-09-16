import * as THREE from 'three';

const material = (color, roughness = .72) => new THREE.MeshStandardMaterial({ color, roughness });

function box(scene, size, position, color, rotation = [0, 0, 0]) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), material(color));
  mesh.position.set(...position);
  mesh.rotation.set(...rotation);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  scene.add(mesh);
  return mesh;
}

export function createRoomScene(canvas) {
  if (!canvas) return { available: false, setIntensity() {}, destroy() {} };
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: 'high-performance' });
  } catch {
    canvas.setAttribute('aria-label', 'Vista 3D no disponible. Las decisiones siguen funcionando.');
    return { available: false, setIntensity() {}, destroy() {} };
  }

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x07131b);
  scene.fog = new THREE.Fog(0x07131b, 6, 18);
  const camera = new THREE.PerspectiveCamera(52, 1, .1, 50);
  camera.position.set(0, 2.1, 6.7);
  camera.lookAt(0, 1.2, 0);

  const ambient = new THREE.HemisphereLight(0x98ddeb, 0x1b1510, 1.9);
  scene.add(ambient);
  const lamp = new THREE.PointLight(0xffc877, 45, 12, 2);
  lamp.position.set(-2.2, 3.4, 1.8);
  lamp.castShadow = true;
  scene.add(lamp);

  box(scene, [9, .18, 9], [0, -.1, 0], 0x3c3028);
  box(scene, [9, 5, .18], [0, 2.4, -3.7], 0x18323e);
  box(scene, [.18, 5, 9], [-4.4, 2.4, 0], 0x102833);

  // Table: the safe cover is visually central.
  box(scene, [3.2, .18, 1.65], [-.4, 1.25, -.2], 0x69452f);
  [-1.7, .9].forEach(x => [-.8, .45].forEach(z => box(scene, [.16, 1.25, .16], [x, .58, z], 0x4b3023)));

  // Window and panes.
  const windowFrame = box(scene, [2.5, 1.9, .12], [2.55, 2.35, -3.53], 0x285b70);
  const glass = new THREE.Mesh(new THREE.PlaneGeometry(2.18, 1.58), new THREE.MeshPhysicalMaterial({ color: 0x86bfd1, transparent: true, opacity: .38, roughness: .18 }));
  glass.position.set(2.55, 2.35, -3.45);
  scene.add(glass);
  box(scene, [.08, 1.72, .16], [2.55, 2.35, -3.38], 0xd6e0df);
  box(scene, [2.32, .08, .16], [2.55, 2.35, -3.38], 0xd6e0df);
  windowFrame.userData.risk = true;

  // Door and bookshelf.
  box(scene, [1.45, 2.85, .16], [-2.7, 1.36, -3.48], 0x443226, [0, -.12, 0]);
  box(scene, [1.35, 3.15, .48], [3.4, 1.5, -.7], 0x392b23);
  for (let y = .35; y < 2.8; y += .55) box(scene, [1.15, .08, .45], [3.4, y, -.42], 0x6c4c37);
  const bookColors = [0xd06950, 0x5f99a7, 0xe3b95a, 0x8770a6];
  for (let i = 0; i < 12; i += 1) {
    box(scene, [.11 + (i % 3) * .025, .34 + (i % 2) * .1, .22], [2.94 + (i % 4) * .27, .62 + Math.floor(i / 4) * .55, -.14], bookColors[i % bookColors.length]);
  }

  // Hanging lamp gives the shake motion a visible reference.
  box(scene, [.025, 1.25, .025], [-2.1, 3.65, .7], 0x171c1f);
  const shade = new THREE.Mesh(new THREE.ConeGeometry(.42, .45, 24, 1, true), material(0x20292d));
  shade.position.set(-2.1, 3.05, .7);
  shade.rotation.x = Math.PI;
  scene.add(shade);

  const clock = new THREE.Clock();
  let intensity = 1;
  let pointerX = 0;
  let frame;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function resize() {
    const width = canvas.clientWidth || 640;
    const height = canvas.clientHeight || 380;
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.75);
    renderer.setPixelRatio(pixelRatio);
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }

  function render() {
    const t = clock.getElapsedTime();
    const shake = reduced ? 0 : .015 * intensity;
    camera.position.x = pointerX + Math.sin(t * 13) * shake;
    camera.position.y = 2.1 + Math.cos(t * 17) * shake * .55;
    shade.rotation.z = Math.sin(t * 3.6) * .085 * intensity;
    renderer.render(scene, camera);
    frame = requestAnimationFrame(render);
  }

  function onPointer(event) {
    const rect = canvas.getBoundingClientRect();
    pointerX = ((event.clientX - rect.left) / rect.width - .5) * .35;
  }

  const observer = new ResizeObserver(resize);
  observer.observe(canvas);
  canvas.addEventListener('pointermove', onPointer);
  resize();
  render();

  return {
    available: true,
    setIntensity(value) { intensity = Math.max(0, Math.min(2, Number(value) || 0)); },
    destroy() {
      cancelAnimationFrame(frame);
      observer.disconnect();
      canvas.removeEventListener('pointermove', onPointer);
      renderer.dispose();
    }
  };
}
