/**
 * YASH PROPERTIES LIMITED - About Section 3D Scene
 * Interactive Architectural Skyscraper Model with Floor-Level Holograms
 */

(function () {
  const canvas = document.getElementById('about-canvas');
  if (!canvas) return;

  const parent = canvas.parentElement;

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    38,
    parent.clientWidth / parent.clientHeight,
    0.1,
    100
  );
  camera.position.set(0, 8, 22);

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance'
  });
  renderer.setSize(parent.clientWidth, parent.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Main Skyscraper Group
  const towerGroup = new THREE.Group();
  scene.add(towerGroup);

  // Materials
  const darkGlassMat = new THREE.MeshPhysicalMaterial({
    color: 0x0f1c3f,
    metalness: 0.8,
    roughness: 0.15,
    transmission: 0.5,
    transparent: true,
    opacity: 0.85
  });

  const goldFrameMat = new THREE.MeshStandardMaterial({
    color: 0xd4af37,
    metalness: 0.9,
    roughness: 0.2,
    emissive: 0x3d3008,
    emissiveIntensity: 0.4
  });

  const coreGlowMat = new THREE.MeshBasicMaterial({
    color: 0x38bdf8
  });

  const ringGlowMat = new THREE.MeshBasicMaterial({
    color: 0xd4af37,
    wireframe: true
  });

  // 1. Skyscraper Base & Podium
  const podiumGeo = new THREE.CylinderGeometry(4.2, 5.2, 1.2, 8);
  const podium = new THREE.Mesh(podiumGeo, goldFrameMat);
  podium.position.y = -3.8;
  towerGroup.add(podium);

  // 2. Central Illuminated Elevator Core
  const coreGeo = new THREE.BoxGeometry(1.4, 15, 1.4);
  const core = new THREE.Mesh(coreGeo, coreGlowMat);
  core.position.y = 3.5;
  towerGroup.add(core);

  // 3. Multi-tier Tower Segments
  const tiers = [
    { radiusTop: 2.8, radiusBottom: 3.4, height: 4.5, y: -1.2, sides: 6 },
    { radiusTop: 2.2, radiusBottom: 2.7, height: 4.5, y: 3.2, sides: 6 },
    { radiusTop: 1.5, radiusBottom: 2.1, height: 4.2, y: 7.4, sides: 6 },
    { radiusTop: 0.8, radiusBottom: 1.4, height: 3.2, y: 11.0, sides: 6 }
  ];

  const holographicRings = [];

  tiers.forEach((tier, index) => {
    // Glass exterior
    const geo = new THREE.CylinderGeometry(tier.radiusTop, tier.radiusBottom, tier.height, tier.sides);
    const mesh = new THREE.Mesh(geo, darkGlassMat);
    mesh.position.y = tier.y;
    towerGroup.add(mesh);

    // Golden boundary frames
    const frameGeo = new THREE.CylinderGeometry(tier.radiusTop + 0.05, tier.radiusBottom + 0.05, tier.height, tier.sides, 1, true);
    const frameMesh = new THREE.Mesh(frameGeo, new THREE.MeshBasicMaterial({ color: 0xd4af37, wireframe: true }));
    frameMesh.position.y = tier.y;
    towerGroup.add(frameMesh);

    // Holographic floor scanner ring
    const ringGeo = new THREE.TorusGeometry(tier.radiusBottom + 0.6, 0.05, 6, 24);
    const ringMesh = new THREE.Mesh(ringGeo, ringGlowMat);
    ringMesh.rotation.x = Math.PI / 2;
    ringMesh.position.y = tier.y - tier.height / 2 + 0.5;
    towerGroup.add(ringMesh);

    holographicRings.push(ringMesh);
  });

  // 4. Rooftop Architectural Spire / Helipad
  const spireGeo = new THREE.ConeGeometry(0.3, 3.8, 6);
  const spire = new THREE.Mesh(spireGeo, goldFrameMat);
  spire.position.y = 14.5;
  towerGroup.add(spire);

  const beaconGeo = new THREE.SphereGeometry(0.2, 8, 8);
  const beacon = new THREE.Mesh(beaconGeo, new THREE.MeshBasicMaterial({ color: 0xff3b30 }));
  beacon.position.y = 16.4;
  towerGroup.add(beacon);

  // Lighting
  const lightAmbient = new THREE.AmbientLight(0x0f172a, 1.8);
  scene.add(lightAmbient);

  const dirLight1 = new THREE.DirectionalLight(0xd4af37, 2.2);
  dirLight1.position.set(12, 18, 14);
  scene.add(dirLight1);

  const dirLight2 = new THREE.DirectionalLight(0x38bdf8, 1.6);
  dirLight2.position.set(-12, 10, -10);
  scene.add(dirLight2);

  // Position tower nicely
  towerGroup.position.y = -2;

  // Mouse Interaction (Parallax Tilt)
  let targetRotationY = 0;
  let targetRotationX = 0;

  function onMouseMove(e) {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
      const normX = (x / rect.width) * 2 - 1;
      const normY = -(y / rect.height) * 2 + 1;

      targetRotationY = normX * 0.7;
      targetRotationX = -normY * 0.3;
    }
  }

  window.addEventListener('mousemove', onMouseMove);

  function resize() {
    if (!parent) return;
    camera.aspect = parent.clientWidth / parent.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(parent.clientWidth, parent.clientHeight);
  }

  window.addEventListener('resize', resize);

  // Animation Loop
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);

    const delta = clock.getDelta();
    const elapsedTime = clock.getElapsedTime();

    // Constant majestic base rotation
    towerGroup.rotation.y += delta * 0.4;

    // Smooth lerp to mouse position
    towerGroup.rotation.x += (targetRotationX - towerGroup.rotation.x) * 0.05;

    // Animate holographic floor rings
    holographicRings.forEach((ring, idx) => {
      ring.rotation.z = elapsedTime * (idx % 2 === 0 ? 0.8 : -0.8);
      ring.scale.setScalar(1 + Math.sin(elapsedTime * 2 + idx) * 0.04);
    });

    renderer.render(scene, camera);
  }

  animate();
})();
