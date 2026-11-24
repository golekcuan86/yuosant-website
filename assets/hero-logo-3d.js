// Progressive enhancement of the existing Yuosant hero mark.
// Geometry and material direction adapted from the supplied 3D logo prototype.
const panel = document.querySelector('#home .hero-visual .visual-shape');
const fallback = panel?.querySelector('img');
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const compact = matchMedia('(max-width: 760px)');
const saveData = navigator.connection?.saveData;
const canObserve = typeof IntersectionObserver === 'function';
let starting = false;

function boot() {
  if (starting || !panel || !fallback || reduced.matches || saveData || document.hidden) return;
  starting = true;
  loadObserver?.disconnect();
  Promise.all([
    import('./vendor/three-r180/three.module.min.js'),
    import('./vendor/three-r180/RoomEnvironment.js')
  ]).then(([THREE, { RoomEnvironment }]) => {
    if (reduced.matches || !panel.isConnected) return;
    initialize(THREE, RoomEnvironment);
  }).catch(() => { /* Existing SVG remains visible. */ });
}

const loadObserver = canObserve && panel ? new IntersectionObserver(([entry]) => {
  if (entry.isIntersecting) boot();
}, { rootMargin: '100px' }) : null;
if (panel && !reduced.matches && !saveData) {
  if (loadObserver) loadObserver.observe(panel);
  else boot();
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && panel.getBoundingClientRect().bottom > 0 && panel.getBoundingClientRect().top < innerHeight) boot();
  });
}

function initialize(T, RoomEnvironment) {
  let renderer, target, scene, ro, io, frame = 0, disposed = false, visible = true, active = false, shown = false;
  const handlers = [];
  const listen = (node, event, fn, options) => {
    node.addEventListener(event, fn, options);
    handlers.push(() => node.removeEventListener(event, fn, options));
  };
  function cleanup() {
    if (disposed) return;
    disposed = true;
    active = false;
    cancelAnimationFrame(frame);
    io?.disconnect();
    ro?.disconnect();
    handlers.forEach(remove => remove());
    if (scene) scene.traverse(object => {
      object.geometry?.dispose();
      if (Array.isArray(object.material)) object.material.forEach(m => m.dispose());
      else object.material?.dispose();
    });
    target?.dispose();
    renderer?.dispose();
    renderer?.domElement.remove();
    fallback.style.visibility = '';
  }
  try {
    renderer = new T.WebGLRenderer({ alpha: true, antialias: !compact.matches, powerPreference: 'low-power', stencil: false });
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = T.SRGBColorSpace;
    renderer.toneMapping = T.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    const canvas = renderer.domElement;
    canvas.className = 'yuosant-hero-logo-3d';
    canvas.setAttribute('aria-hidden', 'true');
    Object.assign(canvas.style, {
      position: 'absolute', inset: '0', width: '100%', height: '100%', display: 'block',
      zIndex: '1', transform: 'rotate(8deg)', touchAction: 'pan-y', cursor: 'grab',
      opacity: '0', transition: 'opacity 220ms ease'
    });
    panel.appendChild(canvas);
    listen(canvas, 'webglcontextlost', event => { event.preventDefault(); cleanup(); });
    scene = new T.Scene();
    const camera = new T.PerspectiveCamera(36, 1, 0.1, 60);
    camera.position.set(0, 0.55, 10.3);
    camera.lookAt(0, 0, 0);
    const studio = new RoomEnvironment();
    const pmrem = new T.PMREMGenerator(renderer);
    try { target = pmrem.fromScene(studio, 0.04); scene.environment = target.texture; }
    finally { studio.dispose(); pmrem.dispose(); }
    scene.add(new T.HemisphereLight(0xc8f5f2, 0x071112, 1.55));
    const key = new T.DirectionalLight(0xe8ffff, 3.1);
    key.position.set(-3.8, 5.6, 5.2);
    scene.add(key);
    const teal = new T.PointLight(0x00e7c4, 32, 13, 2);
    teal.position.set(3.2, 1.3, 2.8);
    scene.add(teal);
    const blue = new T.PointLight(0x078aff, 17, 12, 2);
    blue.position.set(-4.2, -0.6, 2.4);
    scene.add(blue);
    const pulse = new T.PointLight(0x41fff0, 0, 5, 2);
    pulse.position.set(0, 0.2, 2.2);
    scene.add(pulse);

    const p = (x, y) => [(x - 257) * 0.014, (230 - y) * 0.014];
    const left = new T.Shape();
    left.moveTo(...p(249,354)); left.lineTo(...p(198,313));
    left.bezierCurveTo(...p(187,304),...p(181,293),...p(181,277));
    left.lineTo(...p(181,236));
    left.bezierCurveTo(...p(181,226),...p(177,219),...p(169,213));
    left.lineTo(...p(106,169));
    left.bezierCurveTo(...p(86,155),...p(90,128),...p(102,114));
    left.bezierCurveTo(...p(115,98),...p(138,98),...p(155,108));
    left.lineTo(...p(232,166));
    left.bezierCurveTo(...p(244,175),...p(249,185),...p(249,198));
    left.closePath();
    const right = new T.Shape();
    right.moveTo(...p(266,354)); right.lineTo(...p(318,313));
    right.bezierCurveTo(...p(330,304),...p(335,293),...p(335,277));
    right.lineTo(...p(335,236));
    right.bezierCurveTo(...p(335,226),...p(339,219),...p(347,213));
    right.lineTo(...p(408,166));
    right.bezierCurveTo(...p(428,151),...p(425,127),...p(413,112));
    right.bezierCurveTo(...p(400,96),...p(377,97),...p(359,108));
    right.lineTo(...p(283,164));
    right.bezierCurveTo(...p(272,173),...p(266,184),...p(266,197));
    right.closePath();

    const logo = new T.Group(); scene.add(logo);
    const edges = [];
    [left, right].forEach((shape, i) => {
      const geometry = new T.ExtrudeGeometry(shape, { depth: .30, bevelEnabled: true,
        bevelSegments: compact.matches ? 3 : 5, bevelSize: .055, bevelThickness: .065,
        curveSegments: compact.matches ? 10 : 16, steps: 1 });
      geometry.computeVertexNormals();
      const front = new T.MeshPhysicalMaterial({
        color: i ? 0x08bfa9 : 0x07373b, metalness: i ? .68 : .77,
        roughness: .2, clearcoat: 1, clearcoatRoughness: .12,
        envMapIntensity: 1.4, emissive: i ? 0x003e37 : 0x001a1d, emissiveIntensity: .18
      });
      const side = new T.MeshStandardMaterial({
        color: i ? 0x10d9c1 : 0x08777a, metalness: .8, roughness: .24,
        emissive: i ? 0x00665b : 0x00373a, emissiveIntensity: .26
      });
      const mesh = new T.Mesh(geometry, [front, side]); logo.add(mesh);
      const edgeMaterial = new T.LineBasicMaterial({
        color: i ? 0x7affed : 0x35c9ca, transparent: true, opacity: .43,
        blending: T.AdditiveBlending, depthWrite: false, toneMapped: false
      });
      mesh.add(new T.LineSegments(new T.EdgesGeometry(geometry, 24), edgeMaterial));
      edges.push(edgeMaterial);
    });
    let hoverX = 0, hoverY = 0, drag = null, rotationX = 0, rotationY = 0, pulseAt = -1e6;
    let last = 0;
    const clamp = T.MathUtils.clamp;
    function resize() {
      if (disposed) return;
      const w = Math.max(panel.clientWidth, 1), h = Math.max(panel.clientHeight, 1);
      renderer.setPixelRatio(Math.min(devicePixelRatio || 1, compact.matches ? 1 : 1.5));
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.position.z = 10.3 * Math.max(1, 1 / camera.aspect);
      camera.updateProjectionMatrix();
    }
    function tick(now) {
      if (!active || disposed) return;
      frame = requestAnimationFrame(tick);
      if (now - last < (compact.matches ? 40 : 1000 / 30)) return;
      last = now;
      const t = now * .001;
      const motion = reduced.matches ? 0 : 1;
      const x = drag?.moved ? rotationX : rotationX + hoverY * -.12 + Math.sin(t * .27 + 1.4) * .022 * motion;
      const y = drag?.moved ? rotationY : rotationY + hoverX * .19 + Math.sin(t * .34) * .045 * motion;
      logo.rotation.x += (x - logo.rotation.x) * .12;
      logo.rotation.y += (y - logo.rotation.y) * .12;
      logo.position.y = Math.sin(t * .7) * .035 * motion;
      key.position.x = -3.8 + hoverX * 2.5;
      key.position.y = 5.6 - hoverY * 1.8;
      const progress = (now - pulseAt) / 1350;
      const glow = progress >= 0 && progress <= 1 ? Math.sin(progress * Math.PI) : 0;
      pulse.intensity = glow * 18;
      edges.forEach(mat => { mat.opacity = .43 + glow * .42; });
      logo.scale.setScalar(1 + glow * .012);
      try {
        renderer.render(scene, camera);
        if (!shown) { shown = true; canvas.style.opacity = '1'; fallback.style.visibility = 'hidden'; }
      } catch { cleanup(); }
    }
    function sync() {
      if (disposed) return;
      if (reduced.matches) { cleanup(); return; }
      const shouldRun = visible && !document.hidden;
      if (shouldRun && !active) { active = true; frame = requestAnimationFrame(tick); }
      else if (!shouldRun && active) { active = false; cancelAnimationFrame(frame); }
    }
    listen(canvas, 'pointermove', event => {
      const rect = canvas.getBoundingClientRect();
      hoverX = clamp((event.clientX - rect.left) / rect.width * 2 - 1, -1, 1);
      hoverY = clamp((event.clientY - rect.top) / rect.height * 2 - 1, -1, 1);
      if (drag && drag.id === event.pointerId) {
        const dx = event.clientX - drag.x, dy = event.clientY - drag.y;
        if (Math.abs(dx) + Math.abs(dy) > 6) drag.moved = true;
        if (drag.moved) {
          rotationY = drag.ry + dx * .009;
          rotationX = clamp(drag.rx + dy * .007, -.9, .9);
        }
      }
    }, { passive: true });
    listen(canvas, 'pointerdown', event => {
      if (!event.isPrimary || event.button !== 0) return;
      drag = { id: event.pointerId, x: event.clientX, y: event.clientY, rx: rotationX, ry: rotationY, moved: false };
      canvas.style.cursor = 'grabbing';
      try { canvas.setPointerCapture(event.pointerId); } catch {}
    }, { passive: true });
    function end(event) {
      if (drag?.id !== event.pointerId) return;
      if (event.type === 'pointerup' && !drag.moved) pulseAt = performance.now();
      drag = null;
      canvas.style.cursor = 'grab';
      if (event.pointerType !== 'mouse') hoverX = hoverY = 0;
    }
    listen(canvas, 'pointerup', end); listen(canvas, 'pointercancel', end); listen(canvas, 'lostpointercapture', end);
    listen(canvas, 'pointerleave', () => { hoverX = hoverY = 0; });
    listen(window, 'resize', resize, { passive: true });
    listen(document, 'visibilitychange', sync);
    listen(reduced, 'change', sync);
    if (typeof ResizeObserver === 'function') { ro = new ResizeObserver(resize); ro.observe(panel); }
    if (canObserve) {
      visible = false;
      io = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); }, { threshold: .01 });
      io.observe(panel);
    }
    listen(window, 'pagehide', event => { if (!event.persisted) cleanup(); });
    resize(); sync();
  } catch { cleanup(); }
}
