/**
 * VALENCE KINETICS - 3D Storytelling Engine & E-Commerce Cart Logic
 * Handles Three.js 3D Viewport, Real-Time Fabric Simulation, Chapter Morphing, and Slide-Out Bag
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (window.lucide) {
    lucide.createIcons();
  }

  // =========================================================================
  // 1. THREE.JS 3D STORYTELLING VIEWPORT
  // =========================================================================
  const canvas = document.getElementById('story-3d-canvas');
  const stageContainer = document.getElementById('story-3d-stage');

  let scene, camera, renderer;
  let activeChapter = 1;
  let groupPlate, groupCloth, groupDuffel;
  let clothGeometry, clothMesh;

  if (canvas && window.THREE) {
    initThreeStoryEngine();
  }

  function initThreeStoryEngine() {
    const width = stageContainer.clientWidth || window.innerWidth;
    const height = stageContainer.clientHeight || 560;

    // Scene & Camera
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 5.8);

    // Renderer
    renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Master Rotation Group for Inertia
    const masterGroup = new THREE.Group();
    scene.add(masterGroup);

    // -----------------------------------------------------------------------
    // MODEL 1: OLYMPIC BUMPER WEIGHT PLATE (20KG RAW CAST IRON)
    // -----------------------------------------------------------------------
    groupPlate = new THREE.Group();

    // Outer Plate Ring
    const plateOuterGeo = new THREE.CylinderGeometry(2.1, 2.1, 0.32, 64);
    const plateMaterial = new THREE.MeshStandardMaterial({
      color: 0x141418,
      metalness: 0.85,
      roughness: 0.35,
    });
    const plateOuter = new THREE.Mesh(plateOuterGeo, plateMaterial);
    plateOuter.rotation.x = Math.PI / 2;
    groupPlate.add(plateOuter);

    // Inner Rim Inset
    const rimGeo = new THREE.TorusGeometry(1.4, 0.08, 16, 64);
    const rimMaterial = new THREE.MeshStandardMaterial({
      color: 0x22222a,
      metalness: 0.9,
      roughness: 0.2
    });
    const rimMesh = new THREE.Mesh(rimGeo, rimMaterial);
    groupPlate.add(rimMesh);

    // Center Steel Hub Hole (Olympic Barbell Collar)
    const hubGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.34, 32);
    const hubMaterial = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      metalness: 0.95,
      roughness: 0.15
    });
    const hubMesh = new THREE.Mesh(hubGeo, hubMaterial);
    hubMesh.rotation.x = Math.PI / 2;
    groupPlate.add(hubMesh);

    // Embossed Accent Ring (Volt Green Grip Marker)
    const voltRingGeo = new THREE.TorusGeometry(1.85, 0.025, 16, 64);
    const voltRingMat = new THREE.MeshBasicMaterial({ color: 0xccff00 });
    const voltRing = new THREE.Mesh(voltRingGeo, voltRingMat);
    groupPlate.add(voltRing);

    masterGroup.add(groupPlate);

    // -----------------------------------------------------------------------
    // MODEL 2: KINETIC FABRIC MESH (WAVING PERFORMANCE CLOTH)
    // -----------------------------------------------------------------------
    groupCloth = new THREE.Group();
    groupCloth.visible = false;

    clothGeometry = new THREE.PlaneGeometry(3.6, 2.6, 45, 35);
    const clothMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x1b1b22,
      metalness: 0.1,
      roughness: 0.75,
      clearcoat: 0.3,
      side: THREE.DoubleSide,
    });
    clothMesh = new THREE.Mesh(clothGeometry, clothMaterial);
    clothMesh.rotation.x = -Math.PI / 8;
    groupCloth.add(clothMesh);

    // Subtle floating seam boundary line
    const seamGeo = new THREE.BufferGeometry();
    const seamPoints = [];
    for (let x = -1.8; x <= 1.8; x += 0.2) {
      seamPoints.push(new THREE.Vector3(x, 0, 0.05));
    }
    seamGeo.setFromPoints(seamPoints);
    const seamMat = new THREE.LineBasicMaterial({ color: 0xccff00 });
    const seamLine = new THREE.Line(seamGeo, seamMat);
    groupCloth.add(seamLine);

    masterGroup.add(groupCloth);

    // -----------------------------------------------------------------------
    // MODEL 3: TACTICAL MODULAR GYM DUFFEL BAG
    // -----------------------------------------------------------------------
    groupDuffel = new THREE.Group();
    groupDuffel.visible = false;

    // Main Duffel Barrel (Capsule / Rounded Box)
    const bagGeo = new THREE.CylinderGeometry(1.1, 1.1, 2.8, 32);
    const bagMaterial = new THREE.MeshStandardMaterial({
      color: 0x17171d,
      roughness: 0.65,
      metalness: 0.2
    });
    const bagMesh = new THREE.Mesh(bagGeo, bagMaterial);
    bagMesh.rotation.z = Math.PI / 2;
    groupDuffel.add(bagMesh);

    // Dual Webbing Straps (Reinforced Military Nylon)
    const strap1Geo = new THREE.TorusGeometry(1.14, 0.04, 16, 64);
    const strapMat = new THREE.MeshStandardMaterial({ color: 0x09090b, roughness: 0.9 });
    const strap1 = new THREE.Mesh(strap1Geo, strapMat);
    strap1.rotation.y = Math.PI / 2;
    strap1.position.x = -0.7;
    groupDuffel.add(strap1);

    const strap2 = new THREE.Mesh(strap1Geo, strapMat);
    strap2.rotation.y = Math.PI / 2;
    strap2.position.x = 0.7;
    groupDuffel.add(strap2);

    // Top Tactical Carry Handle
    const handleGeo = new THREE.TorusGeometry(0.65, 0.05, 16, 32, Math.PI);
    const handleMat = new THREE.MeshStandardMaterial({ color: 0xccff00, roughness: 0.4 });
    const handleMesh = new THREE.Mesh(handleGeo, handleMat);
    handleMesh.position.y = 1.1;
    groupDuffel.add(handleMesh);

    // Titanium Carabiner Clip
    const clipGeo = new THREE.TorusGeometry(0.18, 0.03, 16, 32);
    const clipMat = new THREE.MeshStandardMaterial({ color: 0xa1a1aa, metalness: 0.95, roughness: 0.1 });
    const clipMesh = new THREE.Mesh(clipGeo, clipMat);
    clipMesh.position.set(-1.42, 0.3, 0);
    groupDuffel.add(clipMesh);

    masterGroup.add(groupDuffel);

    // -----------------------------------------------------------------------
    // LIGHTING SETUP
    // -----------------------------------------------------------------------
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
    keyLight.position.set(5, 6, 4);
    scene.add(keyLight);

    // Dynamic Volt Accent Rim Light
    const voltLight = new THREE.PointLight(0xccff00, 3.5, 10);
    voltLight.position.set(-4, -2, 3);
    scene.add(voltLight);

    const softFillLight = new THREE.DirectionalLight(0x71717a, 1.0);
    softFillLight.position.set(0, -5, -3);
    scene.add(softFillLight);

    // -----------------------------------------------------------------------
    // MOUSE DRAG & INERTIA
    // -----------------------------------------------------------------------
    let mouseX = 0;
    let mouseY = 0;
    let targetRotX = 0;
    let targetRotY = 0;
    let isDragging = false;
    let prevX = 0;
    let prevY = 0;

    window.addEventListener('mousemove', (e) => {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(e.clientY / window.innerHeight) * 2 + 1;

      voltLight.position.x = mouseX * 5;
      voltLight.position.y = mouseY * 4;

      if (!isDragging) {
        targetRotY = mouseX * 0.7;
        targetRotX = -mouseY * 0.5;
      }
    });

    canvas.addEventListener('pointerdown', (e) => {
      isDragging = true;
      prevX = e.clientX;
      prevY = e.clientY;
    });

    window.addEventListener('pointermove', (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevX;
      const deltaY = e.clientY - prevY;

      masterGroup.rotation.y += deltaX * 0.009;
      masterGroup.rotation.x += deltaY * 0.009;

      prevX = e.clientX;
      prevY = e.clientY;
    });

    window.addEventListener('pointerup', () => {
      isDragging = false;
    });

    // -----------------------------------------------------------------------
    // CHAPTER SWITCHING LOGIC
    // -----------------------------------------------------------------------
    const chapterButtons = document.querySelectorAll('.chapter-switch-btn');
    const chapterLabel = document.getElementById('stage-chapter-label');
    const chapterSpec = document.getElementById('stage-chapter-spec');

    window.switch3DChapter = function(chapterNumber) {
      activeChapter = chapterNumber;

      // Toggle 3D groups visibility
      groupPlate.visible = (chapterNumber === 1);
      groupCloth.visible = (chapterNumber === 2);
      groupDuffel.visible = (chapterNumber === 3);

      // Reset orientation with a smooth spin
      masterGroup.rotation.set(0, 0, 0);

      // Update button styles
      chapterButtons.forEach(btn => {
        const c = parseInt(btn.getAttribute('data-chapter'), 10);
        if (c === chapterNumber) {
          btn.classList.add('bg-[#ccff00]', 'text-black', 'border-[#ccff00]');
          btn.classList.remove('bg-white/5', 'text-zinc-400', 'border-white/10');
        } else {
          btn.classList.remove('bg-[#ccff00]', 'text-black', 'border-[#ccff00]');
          btn.classList.add('bg-white/5', 'text-zinc-400', 'border-white/10');
        }
      });

      // Update dynamic stage labels
      if (chapterNumber === 1) {
        if (chapterLabel) chapterLabel.textContent = 'RAW DISCIPLINE / 20KG OLYMPIC CAST PLATE';
        if (chapterSpec) chapterSpec.textContent = 'STEEL HUB • METRIC DUROMETER: 92A • DROP-TESTED';
      } else if (chapterNumber === 2) {
        if (chapterLabel) chapterLabel.textContent = 'KINETIC WEAVE / 320 GSM FRENCH TERRY';
        if (chapterSpec) chapterSpec.textContent = 'REAL-TIME VERTEX WAVE PHYSICS • HYDROPHOBIC BREATHABILITY';
      } else if (chapterNumber === 3) {
        if (chapterLabel) chapterLabel.textContent = 'TACTICAL CARRY / 45L WATERPROOF GYM DUFFEL';
        if (chapterSpec) chapterSpec.textContent = 'CORDURA® 500D • AEROSPACE TITANIUM CLIPS • SHOE SUITE';
      }
    };

    chapterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const c = parseInt(btn.getAttribute('data-chapter'), 10);
        window.switch3DChapter(c);
      });
    });

    // -----------------------------------------------------------------------
    // ANIMATION & REAL-TIME CLOTH WAVE LOOP
    // -----------------------------------------------------------------------
    const clock = new THREE.Clock();

    function renderLoop() {
      requestAnimationFrame(renderLoop);
      const time = clock.getElapsedTime();

      // Inertia Damping
      if (!isDragging) {
        masterGroup.rotation.y += (targetRotY - masterGroup.rotation.y) * 0.05;
        masterGroup.rotation.x += (targetRotX - masterGroup.rotation.x) * 0.05;
      }

      // 1. Plate Idle Rotation
      if (groupPlate.visible) {
        groupPlate.rotation.z = time * 0.35;
      }

      // 2. Real-Time Fabric Physics Simulation (Perturbing Plane Vertices)
      if (groupCloth.visible && clothGeometry) {
        const pos = clothGeometry.attributes.position;
        for (let i = 0; i < pos.count; i++) {
          const u = pos.getX(i);
          const v = pos.getY(i);
          // Wave function: combination of frequencies for realistic organic drape
          const z = Math.sin(u * 2.2 + time * 3.2) * 0.16 + Math.cos(v * 2.8 + time * 2.5) * 0.12;
          pos.setZ(i, z);
        }
        pos.needsUpdate = true;
        clothGeometry.computeVertexNormals();
      }

      // 3. Duffel Bag Float & Subtle Yaw
      if (groupDuffel.visible) {
        groupDuffel.position.y = Math.sin(time * 1.8) * 0.08;
        groupDuffel.rotation.y = Math.sin(time * 0.8) * 0.25;
      }

      renderer.render(scene, camera);
    }
    renderLoop();

    // Resize
    window.addEventListener('resize', () => {
      const w = stageContainer.clientWidth || window.innerWidth;
      const h = stageContainer.clientHeight || 560;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });
  }

  // =========================================================================
  // 2. INTERACTIVE SLIDE-OUT BAG / CART LOGIC
  // =========================================================================
  const cartDrawer = document.getElementById('cart-drawer');
  const cartOverlay = document.getElementById('cart-drawer-overlay');
  const openCartBtns = document.querySelectorAll('.open-cart-btn');
  const closeCartBtn = document.getElementById('close-cart-btn');
  const cartItemsList = document.getElementById('cart-items-container');
  const cartCountBadges = document.querySelectorAll('.cart-count-badge');
  const cartSubtotalEl = document.getElementById('cart-subtotal-val');
  const freeShippingBar = document.getElementById('free-shipping-progress');
  const freeShippingText = document.getElementById('free-shipping-text');
  const checkoutBtn = document.getElementById('checkout-action-btn');

  // Initial Cart State
  let cart = [
    {
      id: 'tee-01',
      name: 'Valence Heavyweight Boxy Tee',
      price: 58,
      color: 'Onyx Black',
      size: 'L',
      qty: 1,
      tag: '320 GSM French Terry',
      icon: 'shirt'
    },
    {
      id: 'duffel-01',
      name: 'Tactical Modular Gym Duffel (45L)',
      price: 135,
      color: 'Matte Carbon',
      size: 'One Size',
      qty: 1,
      tag: 'Cordura® 500D',
      icon: 'briefcase'
    }
  ];

  function toggleCart(open) {
    if (cartDrawer && cartOverlay) {
      if (open) {
        cartDrawer.classList.add('active');
        cartOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
      } else {
        cartDrawer.classList.remove('active');
        cartOverlay.classList.remove('active');
        document.body.style.overflow = '';
      }
    }
  }

  openCartBtns.forEach(b => b.addEventListener('click', () => toggleCart(true)));
  if (closeCartBtn) closeCartBtn.addEventListener('click', () => toggleCart(false));
  if (cartOverlay) cartOverlay.addEventListener('click', () => toggleCart(false));

  function renderCart() {
    if (!cartItemsList) return;

    cartItemsList.innerHTML = '';
    let total = 0;
    let itemCount = 0;

    if (cart.length === 0) {
      cartItemsList.innerHTML = `
        <div class="py-16 text-center text-zinc-500">
          <i data-lucide="shopping-bag" class="w-12 h-12 mx-auto mb-3 opacity-30"></i>
          <p class="text-sm font-semibold text-zinc-400">Your bag is currently empty.</p>
          <p class="text-xs mt-1">Explore our engineered apparel & gear.</p>
        </div>
      `;
    } else {
      cart.forEach((item, index) => {
        total += item.price * item.qty;
        itemCount += item.qty;

        const el = document.createElement('div');
        el.className = 'flex items-start gap-3.5 p-3.5 rounded-xl bg-white/[0.03] border border-white/5';
        el.innerHTML = `
          <div class="w-12 h-12 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-300 flex-shrink-0">
            <i data-lucide="${item.icon || 'package'}" class="w-6 h-6"></i>
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex justify-between items-start">
              <h4 class="text-xs font-semibold text-white truncate">${item.name}</h4>
              <span class="text-xs font-mono font-bold text-[#ccff00] ml-2">$${item.price * item.qty}</span>
            </div>
            <div class="text-[11px] text-zinc-400 mt-0.5">${item.color} • Size ${item.size}</div>
            
            <div class="flex items-center justify-between mt-3 pt-2 border-t border-white/5">
              <div class="flex items-center border border-white/10 rounded-lg overflow-hidden bg-black/40">
                <button class="px-2 py-0.5 text-xs text-zinc-400 hover:text-white transition-colors" onclick="updateQty(${index}, -1)">-</button>
                <span class="px-2 text-xs font-mono text-white">${item.qty}</span>
                <button class="px-2 py-0.5 text-xs text-zinc-400 hover:text-white transition-colors" onclick="updateQty(${index}, 1)">+</button>
              </div>
              <button class="text-[11px] text-zinc-500 hover:text-rose-400 transition-colors" onclick="removeItem(${index})">
                Remove
              </button>
            </div>
          </div>
        `;
        cartItemsList.appendChild(el);
      });
    }

    // Update Counts & Totals
    cartCountBadges.forEach(b => b.textContent = itemCount);
    if (cartSubtotalEl) cartSubtotalEl.textContent = `$${total}`;

    // Free Shipping threshold: $150
    const threshold = 150;
    const progressPercent = Math.min(100, Math.round((total / threshold) * 100));
    if (freeShippingBar) freeShippingBar.style.width = `${progressPercent}%`;

    if (freeShippingText) {
      if (total >= threshold) {
        freeShippingText.innerHTML = `🔥 <span class="text-[#ccff00] font-semibold">You unlocked FREE Express Global Shipping!</span>`;
      } else {
        const remaining = threshold - total;
        freeShippingText.innerHTML = `Add <strong class="text-white">$${remaining}</strong> more for Free Global Shipping.`;
      }
    }

    if (window.lucide) lucide.createIcons();
  }

  window.updateQty = function(index, delta) {
    if (cart[index]) {
      cart[index].qty += delta;
      if (cart[index].qty <= 0) {
        cart.splice(index, 1);
      }
      renderCart();
    }
  };

  window.removeItem = function(index) {
    if (cart[index]) {
      cart.splice(index, 1);
      renderCart();
    }
  };

  window.addToCart = function(productName, price, color, size, icon = 'package') {
    const existing = cart.find(i => i.name === productName && i.color === color && i.size === size);
    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({
        id: `prod-${Date.now()}`,
        name: productName,
        price: price,
        color: color,
        size: size,
        qty: 1,
        icon: icon
      });
    }
    renderCart();
    toggleCart(true);
    showToast('Added to Bag', `${productName} (${color}, ${size}) added.`);
  };

  renderCart();

  // Checkout Simulation
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      if (cart.length === 0) {
        showToast('Bag Empty', 'Please add products before checking out.');
        return;
      }
      const orig = checkoutBtn.innerHTML;
      checkoutBtn.disabled = true;
      checkoutBtn.innerHTML = `<div class="animate-spin rounded-full h-4 w-4 border-2 border-black border-t-transparent mx-auto"></div>`;

      setTimeout(() => {
        checkoutBtn.disabled = false;
        checkoutBtn.innerHTML = orig;
        toggleCart(false);
        cart = [];
        renderCart();
        showToast('Order Confirmed! ⚡', 'Thank you for joining the Valence Syndicate. Tracking link dispatched.');
      }, 1200);
    });
  }

  // =========================================================================
  // 3. PRODUCT CARDS INTERACTION (COLOR & SIZE PICKERS)
  // =========================================================================
  const productCards = document.querySelectorAll('.shop-product-card');
  productCards.forEach(card => {
    const colorChips = card.querySelectorAll('.color-chip');
    const sizeBtns = card.querySelectorAll('.size-btn');
    const addBtn = card.querySelector('.add-product-btn');
    const nameEl = card.querySelector('.product-name');
    const priceEl = card.querySelector('.product-price');
    const colorLabel = card.querySelector('.selected-color-label');

    let selectedColor = 'Onyx Black';
    let selectedSize = 'L';
    const price = parseInt(card.getAttribute('data-price') || '58', 10);
    const icon = card.getAttribute('data-icon') || 'shirt';

    colorChips.forEach(chip => {
      chip.addEventListener('click', () => {
        colorChips.forEach(c => c.classList.remove('ring-2', 'ring-[#ccff00]'));
        chip.classList.add('ring-2', 'ring-[#ccff00]');
        selectedColor = chip.getAttribute('data-color') || 'Onyx Black';
        if (colorLabel) colorLabel.textContent = selectedColor;
      });
    });

    sizeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        sizeBtns.forEach(s => {
          s.classList.remove('bg-[#ccff00]', 'text-black', 'border-[#ccff00]');
          s.classList.add('bg-white/5', 'text-zinc-300');
        });
        btn.classList.add('bg-[#ccff00]', 'text-black', 'border-[#ccff00]');
        btn.classList.remove('bg-white/5', 'text-zinc-300');
        selectedSize = btn.getAttribute('data-size') || 'L';
      });
    });

    if (addBtn) {
      addBtn.addEventListener('click', () => {
        const name = nameEl ? nameEl.textContent.trim() : 'Valence Gear';
        window.addToCart(name, price, selectedColor, selectedSize, icon);
      });
    }
  });

  // Category Filtering
  const filterBtns = document.querySelectorAll('.category-filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const cat = btn.getAttribute('data-filter');
      filterBtns.forEach(b => {
        b.classList.remove('bg-[#ccff00]', 'text-black');
        b.classList.add('bg-white/5', 'text-zinc-400');
      });
      btn.classList.add('bg-[#ccff00]', 'text-black');
      btn.classList.remove('bg-white/5', 'text-zinc-400');

      productCards.forEach(card => {
        const itemCat = card.getAttribute('data-category');
        if (cat === 'all' || itemCat === cat) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  // =========================================================================
  // 4. STORY TIMELINE PROGRESSION
  // =========================================================================
  const timelineDots = document.querySelectorAll('.timeline-dot');
  const sections = document.querySelectorAll('.story-section');

  window.addEventListener('scroll', () => {
    let currentId = 'chapter-1';
    sections.forEach(sec => {
      const top = sec.getBoundingClientRect().top;
      if (top <= window.innerHeight * 0.45) {
        currentId = sec.id;
      }
    });

    timelineDots.forEach(dot => {
      const target = dot.getAttribute('data-target');
      if (target === currentId) {
        dot.classList.add('active');
        // Auto sync 3D model if in chapter 1, 2, or 3
        if (target === 'chapter-1' && activeChapter !== 1) window.switch3DChapter(1);
        if (target === 'chapter-2' && activeChapter !== 2) window.switch3DChapter(2);
        if (target === 'chapter-3' && activeChapter !== 3) window.switch3DChapter(3);
      } else {
        dot.classList.remove('active');
      }
    });
  });

  timelineDots.forEach(dot => {
    dot.addEventListener('click', () => {
      const target = dot.getAttribute('data-target');
      const targetEl = document.getElementById(target);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // =========================================================================
  // 5. TOAST NOTIFICATION UTILITY
  // =========================================================================
  function showToast(title, message) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'glass-card-dark p-4 rounded-xl border border-white/10 flex items-start gap-3 shadow-2xl transition-all duration-300 transform translate-y-3 opacity-0 w-80 max-w-[90vw] bg-[#121218]';
    toast.innerHTML = `
      <div class="mt-0.5 text-[#ccff00]">
        <i data-lucide="zap" class="w-4 h-4"></i>
      </div>
      <div class="flex-1">
        <h4 class="text-xs font-bold text-white font-['Space_Grotesk']">${title}</h4>
        <p class="text-[11px] text-zinc-400 mt-0.5 leading-relaxed">${message}</p>
      </div>
      <button class="text-zinc-500 hover:text-white" onclick="this.parentElement.remove()">
        <i data-lucide="x" class="w-3.5 h-3.5"></i>
      </button>
    `;

    container.appendChild(toast);
    if (window.lucide) lucide.createIcons();

    requestAnimationFrame(() => {
      toast.classList.remove('translate-y-3', 'opacity-0');
      toast.classList.add('translate-y-0', 'opacity-100');
    });

    setTimeout(() => {
      toast.classList.remove('translate-y-0', 'opacity-100');
      toast.classList.add('translate-y-3', 'opacity-0');
      setTimeout(() => toast.remove(), 300);
    }, 3800);
  }

  // Drop Early Access Waitlist Form
  const dropForm = document.getElementById('drop-form');
  if (dropForm) {
    dropForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = dropForm.querySelector('input[type="email"]');
      if (emailInput && emailInput.value.includes('@')) {
        showToast('Syndicate Access Reserved ⚡', `You're on the priority notification list for Drop 004.`);
        emailInput.value = '';
      }
    });
  }
});
