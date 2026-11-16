/**
 * YASH PROPERTIES LIMITED - Hero 3D Scene
 * High-End Architectural Modern Villa with Infinity Pool & Skyline
 * Powered by Three.js & OrbitControls
 */

window.HeroScene = (function () {
  const container = document.getElementById('hero-3d-container');
  const canvas = document.getElementById('hero-canvas');
  if (!container || !canvas) return;

  // Scene, Camera, Renderer
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x06080e, 0.015);

  const camera = new THREE.PerspectiveCamera(
    42,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
  );
  camera.position.set(22, 14, 28);

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance'
  });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;

  // OrbitControls for interactive 3D inspection
  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.maxPolarAngle = Math.PI / 2 - 0.04; // Don't clip below ground
  controls.minDistance = 14;
  controls.maxDistance = 55;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 0.45;
  controls.target.set(0, 3, 0);

  // Group for the main rotating model
  const mainGroup = new THREE.Group();
  scene.add(mainGroup);

  // Material Library
  const materials = {
    darkStone: new THREE.MeshStandardMaterial({
      color: 0x111622,
      roughness: 0.6,
      metalness: 0.2
    }),
    concreteWhite: new THREE.MeshStandardMaterial({
      color: 0xdfdfeb,
      roughness: 0.4,
      metalness: 0.1
    }),
    goldTrim: new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      roughness: 0.25,
      metalness: 0.85,
      emissive: 0x4a3b0a,
      emissiveIntensity: 0.25
    }),
    glass: new THREE.MeshPhysicalMaterial({
      color: 0x3b82f6,
      transparent: true,
      opacity: 0.38,
      roughness: 0.1,
      metalness: 0.1,
      transmission: 0.6,
      ior: 1.5
    }),
    water: new THREE.MeshStandardMaterial({
      color: 0x06b6d4,
      roughness: 0.1,
      metalness: 0.8,
      transparent: true,
      opacity: 0.85
    }),
    woodDeck: new THREE.MeshStandardMaterial({
      color: 0x5c4033,
      roughness: 0.7,
      metalness: 0.05
    }),
    glowWarm: new THREE.MeshBasicMaterial({
      color: 0xffd27d
    }),
    skylineBuilding: new THREE.MeshStandardMaterial({
      color: 0x0c1220,
      roughness: 0.7,
      metalness: 0.3
    }),
    windowGlow: new THREE.MeshBasicMaterial({
      color: 0x38bdf8
    })
  };

  // Wireframe state tracker
  let isWireframe = false;

  // -------------------------------------------------------------
  // BUILD PROCEDURAL ARCHITECTURAL VILLA
  // -------------------------------------------------------------

  // 1. Foundation Podium / Lawn Platform
  const podiumGeo = new THREE.BoxGeometry(26, 0.8, 20);
  const podium = new THREE.Mesh(podiumGeo, materials.darkStone);
  podium.position.y = -0.4;
  podium.receiveShadow = true;
  mainGroup.add(podium);

  // Gold accent rim on podium
  const rimGeo = new THREE.BoxGeometry(26.2, 0.1, 20.2);
  const rim = new THREE.Mesh(rimGeo, materials.goldTrim);
  rim.position.y = 0.05;
  mainGroup.add(rim);

  // 2. Infinity Swimming Pool & Sun Deck
  const deckGeo = new THREE.BoxGeometry(10, 0.2, 7);
  const deck = new THREE.Mesh(deckGeo, materials.woodDeck);
  deck.position.set(6, 0.1, 4.5);
  deck.receiveShadow = true;
  mainGroup.add(deck);

  const poolBorderGeo = new THREE.BoxGeometry(8, 0.3, 5);
  const poolBorder = new THREE.Mesh(poolBorderGeo, materials.darkStone);
  poolBorder.position.set(6, 0.15, -2);
  mainGroup.add(poolBorder);

  const waterGeo = new THREE.PlaneGeometry(7.6, 4.6, 16, 16);
  const poolWater = new THREE.Mesh(waterGeo, materials.water);
  poolWater.rotation.x = -Math.PI / 2;
  poolWater.position.set(6, 0.28, -2);
  mainGroup.add(poolWater);

  // 3. Ground Level Living Pavilion
  const groundPavilionGeo = new THREE.BoxGeometry(12, 3.2, 9);
  const groundPavilion = new THREE.Mesh(groundPavilionGeo, materials.concreteWhite);
  groundPavilion.position.set(-4, 1.6, 1);
  groundPavilion.castShadow = true;
  groundPavilion.receiveShadow = true;
  mainGroup.add(groundPavilion);

  // Floor-to-ceiling glass front facade
  const glassFrontGeo = new THREE.BoxGeometry(10.5, 2.7, 0.2);
  const glassFront = new THREE.Mesh(glassFrontGeo, materials.glass);
  glassFront.position.set(-4, 1.5, 5.6);
  mainGroup.add(glassFront);

  // Golden mullions/frames
  for (let x = -8; x <= 0; x += 2.6) {
    const colGeo = new THREE.BoxGeometry(0.12, 2.7, 0.22);
    const col = new THREE.Mesh(colGeo, materials.goldTrim);
    col.position.set(x, 1.5, 5.61);
    mainGroup.add(col);
  }

  // 4. Cantilevered Upper Master Wing (Dramatic Luxury Architecture)
  const upperWingGeo = new THREE.BoxGeometry(14, 3.4, 8);
  const upperWing = new THREE.Mesh(upperWingGeo, materials.concreteWhite);
  upperWing.position.set(-1.5, 4.8, -0.5);
  upperWing.castShadow = true;
  upperWing.receiveShadow = true;
  mainGroup.add(upperWing);

  // Gold architectural band
  const bandGeo = new THREE.BoxGeometry(14.2, 0.25, 8.2);
  const band = new THREE.Mesh(bandGeo, materials.goldTrim);
  band.position.set(-1.5, 3.15, -0.5);
  mainGroup.add(band);

  // Master balcony with glass railing
  const balconyFloorGeo = new THREE.BoxGeometry(6, 0.3, 4);
  const balconyFloor = new THREE.Mesh(balconyFloorGeo, materials.darkStone);
  balconyFloor.position.set(3.5, 3.3, 4);
  balconyFloor.castShadow = true;
  mainGroup.add(balconyFloor);

  const railingGeo = new THREE.BoxGeometry(6, 1.1, 0.1);
  const railing = new THREE.Mesh(railingGeo, materials.glass);
  railing.position.set(3.5, 3.9, 6);
  mainGroup.add(railing);

  // 5. Rooftop Gold Pergola
  for (let i = -5; i <= 3; i += 1.6) {
    const lathGeo = new THREE.BoxGeometry(0.15, 0.2, 7.5);
    const lath = new THREE.Mesh(lathGeo, materials.goldTrim);
    lath.position.set(i, 6.7, -0.5);
    mainGroup.add(lath);
  }

  // 6. Minimalist Architectural Trees / Planters
  function createArchitecturalTree(x, z, scale = 1) {
    const treeGroup = new THREE.Group();
    treeGroup.position.set(x, 0.2, z);
    treeGroup.scale.set(scale, scale, scale);

    const trunkGeo = new THREE.CylinderGeometry(0.08, 0.14, 2.5, 6);
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x3d2817 });
    const trunk = new THREE.Mesh(trunkGeo, trunkMat);
    trunk.position.y = 1.25;
    treeGroup.add(trunk);

    const foliageGeo = new THREE.ConeGeometry(1.2, 3, 7);
    const foliageMat = new THREE.MeshStandardMaterial({ color: 0x1b4332, roughness: 0.8 });
    const foliage = new THREE.Mesh(foliageGeo, foliageMat);
    foliage.position.y = 3;
    foliage.castShadow = true;
    treeGroup.add(foliage);

    const planterGeo = new THREE.BoxGeometry(1.4, 0.6, 1.4);
    const planter = new THREE.Mesh(planterGeo, materials.darkStone);
    planter.position.y = 0.3;
    treeGroup.add(planter);

    mainGroup.add(treeGroup);
  }

  createArchitecturalTree(-10.5, 6, 0.9);
  createArchitecturalTree(-10.5, -6, 0.85);
  createArchitecturalTree(10.5, 7.5, 0.95);
  createArchitecturalTree(11.5, -5, 0.8);

  // 7. DISTANT LUXURY SKYLINE
  const skylineGroup = new THREE.Group();
  scene.add(skylineGroup);

  const towerGeometries = [
    new THREE.BoxGeometry(4, 30, 4),
    new THREE.BoxGeometry(5, 42, 5),
    new THREE.BoxGeometry(6, 25, 6),
    new THREE.BoxGeometry(3.5, 36, 3.5),
    new THREE.CylinderGeometry(2, 2.5, 38, 8)
  ];

  for (let i = 0; i < 28; i++) {
    const angle = (i / 28) * Math.PI * 2;
    const radius = 60 + Math.random() * 25;
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;
    
    // Pick random geometry
    const geo = towerGeometries[Math.floor(Math.random() * towerGeometries.length)];
    const tower = new THREE.Mesh(geo, materials.skylineBuilding);
    tower.position.set(x, geo.parameters.height ? geo.parameters.height / 2 - 10 : 15, z);
    skylineGroup.add(tower);

    // Glowing rooftop beacon
    const beaconGeo = new THREE.SphereGeometry(0.3, 6, 6);
    const beaconMat = new THREE.MeshBasicMaterial({ color: i % 2 === 0 ? 0xd4af37 : 0xef4444 });
    const beacon = new THREE.Mesh(beaconGeo, beaconMat);
    beacon.position.set(x, tower.position.y + 15, z);
    skylineGroup.add(beacon);
  }

  // 8. FLOATING 3D GOLD STARDUST PARTICLES IN SCENE
  const particleCount = 280;
  const particleGeo = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);

  const goldColor = new THREE.Color(0xd4af37);
  const blueColor = new THREE.Color(0x38bdf8);

  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3;
    positions[i3] = (Math.random() - 0.5) * 45;
    positions[i3 + 1] = Math.random() * 22;
    positions[i3 + 2] = (Math.random() - 0.5) * 45;

    const mixed = Math.random() > 0.4 ? goldColor : blueColor;
    colors[i3] = mixed.r;
    colors[i3 + 1] = mixed.g;
    colors[i3 + 2] = mixed.b;
  }

  particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const particleMat = new THREE.PointsMaterial({
    size: 0.22,
    vertexColors: true,
    transparent: true,
    opacity: 0.85
  });

  const particleSystem = new THREE.Points(particleGeo, particleMat);
  scene.add(particleSystem);

  // -------------------------------------------------------------
  // LIGHTING SETUP
  // -------------------------------------------------------------

  // Ambient Moonlight/Twilight (Royal Deep Blue)
  const ambientLight = new THREE.AmbientLight(0x0e1c36, 1.4);
  scene.add(ambientLight);

  // Directional Golden Architectural Key Light
  const keyLight = new THREE.DirectionalLight(0xffecd1, 1.8);
  keyLight.position.set(25, 30, 20);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.width = 2048;
  keyLight.shadow.mapSize.height = 2048;
  keyLight.shadow.camera.near = 10;
  keyLight.shadow.camera.far = 70;
  keyLight.shadow.camera.left = -20;
  keyLight.shadow.camera.right = 20;
  keyLight.shadow.camera.top = 20;
  keyLight.shadow.camera.bottom = -20;
  keyLight.shadow.bias = -0.0005;
  scene.add(keyLight);

  // Secondary Blue Fill Light
  const fillLight = new THREE.DirectionalLight(0x1e40af, 1.0);
  fillLight.position.set(-20, 15, -20);
  scene.add(fillLight);

  // Interior Warm Glow Point Lights
  const interiorLight1 = new THREE.PointLight(0xffa726, 3.5, 14);
  interiorLight1.position.set(-3, 2, 2);
  mainGroup.add(interiorLight1);

  const interiorLight2 = new THREE.PointLight(0xffd54f, 2.5, 12);
  interiorLight2.position.set(-1, 5, 0);
  mainGroup.add(interiorLight2);

  // Pool Accent Light
  const poolLight = new THREE.PointLight(0x06b6d4, 2.8, 10);
  poolLight.position.set(6, 0.8, -2);
  mainGroup.add(poolLight);

  // -------------------------------------------------------------
  // INTERACTION & ANIMATION LOOP
  // -------------------------------------------------------------

  // Wireframe toggle button
  const wireframeBtn = document.getElementById('toggle-wireframe-btn');
  if (wireframeBtn) {
    wireframeBtn.addEventListener('click', () => {
      isWireframe = !isWireframe;
      Object.values(materials).forEach((mat) => {
        if (mat.wireframe !== undefined) {
          mat.wireframe = isWireframe;
        }
      });
      wireframeBtn.innerHTML = isWireframe
        ? '<i data-lucide="layers"></i> Solid View'
        : '<i data-lucide="box"></i> Wireframe';
      if (window.lucide) lucide.createIcons();
    });
  }

  // Handle window resizing
  function onWindowResize() {
    if (!container) return;
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  }
  window.addEventListener('resize', onWindowResize);

  // Animation clock
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);

    const elapsedTime = clock.getElapsedTime();

    // Subtle water surface motion
    if (poolWater) {
      poolWater.position.y = 0.28 + Math.sin(elapsedTime * 2.5) * 0.02;
    }

    // Slowly rotate distant skyline in opposite direction
    skylineGroup.rotation.y = elapsedTime * 0.015;

    // Float particles
    particleSystem.rotation.y = elapsedTime * 0.03;

    // Controls damping
    controls.update();

    renderer.render(scene, camera);
  }

  animate();

  return {
    scene,
    camera,
    renderer,
    controls
  };
})();
