/**
 * YASH PROPERTIES LIMITED - Core Application Controller
 * High-End Animations, Interactions, Audio Synthesizer & Modals
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (window.lucide) {
    lucide.createIcons();
  }

  // ==========================================
  // 1. PRELOADER & LOADING PROGRESS
  // ==========================================
  const preloader = document.getElementById('preloader');
  const loaderProgress = document.getElementById('loader-progress');
  const loaderPercent = document.getElementById('loader-percent');
  const loaderStatus = document.getElementById('loader-status');

  const loadingStatuses = [
    'Initializing 3D Architectural Space...',
    'Loading High-Fidelity Geometry...',
    'Calibrating Volumetric Twilight...',
    'Synchronizing Fiduciary Catalog...',
    'Welcome to Yash Properties Limited.'
  ];

  let progress = 0;
  const loadInterval = setInterval(() => {
    progress += Math.floor(Math.random() * 8) + 4;
    if (progress > 100) progress = 100;

    if (loaderProgress) loaderProgress.style.width = `${progress}%`;
    if (loaderPercent) loaderPercent.textContent = `${progress}%`;

    const statusIndex = Math.min(
      Math.floor((progress / 100) * loadingStatuses.length),
      loadingStatuses.length - 1
    );
    if (loaderStatus) loaderStatus.textContent = loadingStatuses[statusIndex];

    if (progress >= 100) {
      clearInterval(loadInterval);
      setTimeout(() => {
        if (preloader) {
          preloader.classList.add('fade-out');
          initHeroEntranceAnimations();
        }
      }, 500);
    }
  }, 50);

  // ==========================================
  // 2. CUSTOM CURSOR & MOUSE SPOTLIGHT
  // ==========================================
  const cursorDot = document.getElementById('cursor-dot');
  const cursorOutline = document.getElementById('cursor-outline');
  const mouseSpotlight = document.getElementById('mouse-spotlight');

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let outlineX = mouseX;
  let outlineY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (cursorDot) {
      cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
    }

    if (mouseSpotlight) {
      mouseSpotlight.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
    }
  });

  function animateCursor() {
    outlineX += (mouseX - outlineX) * 0.15;
    outlineY += (mouseY - outlineY) * 0.15;

    if (cursorOutline) {
      cursorOutline.style.transform = `translate(${outlineX}px, ${outlineY}px)`;
    }
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Hover states for magnetic buttons and links
  const interactives = document.querySelectorAll('a, button, input, textarea, select, .property-card, .stat-card, .pillar-card');
  interactives.forEach((el) => {
    el.addEventListener('mouseenter', () => {
      if (cursorOutline) cursorOutline.classList.add('hover-active');
    });
    el.addEventListener('mouseleave', () => {
      if (cursorOutline) cursorOutline.classList.remove('hover-active');
    });
  });

  // ==========================================
  // 3. CURRENCY SWITCHER (INR ₹ <-> USD $)
  // ==========================================
  const currencyToggle = document.getElementById('currency-toggle');
  let currentCurrency = 'INR'; // 'INR' or 'USD'

  if (currencyToggle) {
    currencyToggle.addEventListener('click', () => {
      currentCurrency = currentCurrency === 'INR' ? 'USD' : 'INR';

      const tags = currencyToggle.querySelectorAll('.currency-tag');
      tags.forEach((tag) => {
        tag.classList.toggle('active', tag.getAttribute('data-cur') === currentCurrency);
      });

      // Update all prices on page
      updatePrices();
      playTone(520, 0.08); // pleasant UI tick
    });
  }

  function updatePrices() {
    const priceElements = document.querySelectorAll('[data-price-inr]');
    priceElements.forEach((el) => {
      const inr = parseFloat(el.getAttribute('data-price-inr'));
      const usd = parseFloat(el.getAttribute('data-price-usd'));

      if (currentCurrency === 'INR') {
        const inCr = (inr / 10000000).toFixed(2);
        el.textContent = `₹${inCr} Cr`;
      } else {
        const inM = (usd / 1000000).toFixed(2);
        el.textContent = `$${inM}M`;
      }
    });
  }

  // ==========================================
  // 4. AUDIO FX SYNTHESIZER (Web Audio API)
  // Zero external dependencies - pure luxury ambient tones
  // ==========================================
  let audioCtx = null;
  let soundEnabled = true;
  const soundToggle = document.getElementById('sound-toggle');

  function initAudioContext() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) audioCtx = new AudioContext();
    }
  }

  function playTone(freq = 440, duration = 0.1, type = 'sine') {
    if (!soundEnabled) return;
    try {
      initAudioContext();
      if (!audioCtx) return;
      if (audioCtx.state === 'suspended') audioCtx.resume();

      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

      gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      // Audio context policy guard
    }
  }

  if (soundToggle) {
    soundToggle.addEventListener('click', () => {
      soundEnabled = !soundEnabled;
      const iconOn = soundToggle.querySelector('.icon-on');
      const iconOff = soundToggle.querySelector('.icon-off');

      if (iconOn && iconOff) {
        iconOn.classList.toggle('hidden', !soundEnabled);
        iconOff.classList.toggle('hidden', soundEnabled);
      }

      if (soundEnabled) {
        playTone(660, 0.15);
      }
    });
  }

  // Attach subtle audio feedback to key luxury buttons
  document.querySelectorAll('.btn-primary-luxury, .btn-gold-outline, .quick-view-btn').forEach((btn) => {
    btn.addEventListener('mouseenter', () => playTone(380, 0.06));
    btn.addEventListener('click', () => playTone(784, 0.18));
  });

  // ==========================================
  // 5. NAVBAR SCROLL & ACTIVE LINKS
  // ==========================================
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.desktop-nav .nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    if (!navbar) return;
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Active Section Tracking
    let currentId = '';
    sections.forEach((sec) => {
      const top = sec.offsetTop - 160;
      const height = sec.offsetHeight;
      if (window.scrollY >= top && window.scrollY < top + height) {
        currentId = sec.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  });

  // Mobile Drawer Toggle
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileCloseBtn = document.getElementById('mobile-close-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.add('open');
      playTone(440, 0.1);
    });
  }

  if (mobileCloseBtn && mobileMenu) {
    mobileCloseBtn.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
    });
  }

  mobileLinks.forEach((l) => {
    l.addEventListener('click', () => {
      if (mobileMenu) mobileMenu.classList.remove('open');
    });
  });

  // ==========================================
  // 6. GSAP SCROLL ANIMATIONS & STAT COUNTERS
  // ==========================================
  function initHeroEntranceAnimations() {
    if (typeof gsap === 'undefined') return;

    gsap.from('.hero-badge-pill', {
      opacity: 0,
      y: -20,
      duration: 0.8,
      ease: 'power3.out'
    });

    gsap.from('.hero-headline span', {
      opacity: 0,
      y: 40,
      stagger: 0.15,
      duration: 1.1,
      ease: 'power4.out',
      delay: 0.2
    });

    gsap.from('.hero-lead', {
      opacity: 0,
      y: 25,
      duration: 0.9,
      ease: 'power3.out',
      delay: 0.5
    });

    gsap.from('.hero-cta-group', {
      opacity: 0,
      y: 20,
      duration: 0.8,
      ease: 'power3.out',
      delay: 0.7
    });

    gsap.from('.hero-3d-card-preview', {
      opacity: 0,
      x: 60,
      duration: 1.2,
      ease: 'power4.out',
      delay: 0.6
    });
  }

  // Register GSAP ScrollTrigger
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    // Section Titles Fade Up
    gsap.utils.toArray('.section-header').forEach((header) => {
      gsap.from(header, {
        scrollTrigger: {
          trigger: header,
          start: 'top 85%'
        },
        opacity: 0,
        y: 45,
        duration: 1.0,
        ease: 'power3.out'
      });
    });

    // About Stats Counters
    const statCounters = document.querySelectorAll('.stat-counter');
    let counted = false;

    ScrollTrigger.create({
      trigger: '.stats-grid',
      start: 'top 80%',
      onEnter: () => {
        if (counted) return;
        counted = true;

        statCounters.forEach((counter) => {
          const target = parseInt(counter.getAttribute('data-target'), 10);
          gsap.to(counter, {
            innerText: target,
            duration: 2.2,
            ease: 'power2.out',
            snap: { innerText: 1 },
            onUpdate: function () {
              counter.textContent = Math.floor(counter.innerText).toLocaleString();
            }
          });
        });
      }
    });

    // Timeline Glow Line Fill
    gsap.from('#timeline-progress-line', {
      scrollTrigger: {
        trigger: '.timeline-track',
        start: 'top 75%',
        end: 'bottom 60%',
        scrub: 1
      },
      scaleX: 0,
      transformOrigin: 'left center'
    });
  }

  // ==========================================
  // 7. PROPERTY CATEGORY FILTERING
  // ==========================================
  const filterBtns = document.querySelectorAll('.filter-btn');
  const propertyCards = document.querySelectorAll('.property-card');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filterVal = btn.getAttribute('data-filter');
      playTone(500, 0.08);

      propertyCards.forEach((card) => {
        const cat = card.getAttribute('data-category');
        if (filterVal === 'all' || cat === filterVal) {
          card.style.display = 'flex';
          if (typeof gsap !== 'undefined') {
            gsap.fromTo(card, { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 0.45 });
          }
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // ==========================================
  // 8. PROPERTY 3D SPECS MODAL & QUICK VIEW
  // ==========================================
  const propertyData = {
    1: {
      title: 'The Grand Belvedere Villa',
      location: 'Palm Jumeirah Enclave, Sector 14',
      priceInr: '₹32.50 Cr',
      priceUsd: '$3.90M',
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
      description: 'The Grand Belvedere represents the absolute pinnacle of contemporary private estate architecture. Featuring double-height structural glass pavilions, an illuminated private infinity pool, Italian marble cantilevered suites, smart solar grid integration, and custom wine vault.',
      specs: [
        { label: 'Bedrooms', val: '6 En-Suite' },
        { label: 'Bathrooms', val: '7 Designer' },
        { label: 'Super Built-Up', val: '11,500 Sq.Ft' },
        { label: 'Private Garage', val: '4 Supercars' },
        { label: 'Orientation', val: 'Vastu Compliant' },
        { label: 'Furnishing', val: 'Bespoke Turnkey' }
      ],
      amenities: [
        'Private Infinity Pool',
        'Helipad Clearance',
        'Custom Wine Cellar',
        'Private Elevator',
        'Biometric Smart Security',
        'Sub-Zero & Wolf Kitchen'
      ]
    },
    2: {
      title: 'Skyline Elysium Penthouse',
      location: 'Central Skyline Pinnacle, 68th Floor',
      priceInr: '₹28.00 Cr',
      priceUsd: '$3.38M',
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
      description: 'Suspended in the clouds on the 68th floor, Skyline Elysium boasts 360-degree panoramic skyline vistas, glass-bottom cantilever plunge pool, and customized Boffi Italian kitchen. Unobstructed sunrises and sunsets guaranteed in perpetuity.',
      specs: [
        { label: 'Bedrooms', val: '5 Sky Suites' },
        { label: 'Bathrooms', val: '6 Spa Baths' },
        { label: 'Super Built-Up', val: '9,200 Sq.Ft' },
        { label: 'Floor Level', val: '68th Penthouse' },
        { label: 'Private Elevator', val: 'High-Speed Keyed' },
        { label: 'Ceiling Height', val: '4.2 Meters' }
      ],
      amenities: [
        'Glass Cantilever Pool',
        'Private Rooftop Deck',
        'Sommelier Tasting Lounge',
        'Private Spa Sauna',
        'Acoustic Screening Room',
        'Concierge Valet Service'
      ]
    },
    3: {
      title: 'Apex Horizon Corporate Hub',
      location: 'Financial District Gateway, Axis Boulevard',
      priceInr: '₹125.0 Cr',
      priceUsd: '$15.00M',
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
      description: 'Grade-A institutional commercial towers designed for global multinational headquarters and Fortune 100 entities. Featuring LEED Platinum zero-carbon certification, biometric entry speedstiles, column-free floor plates, and automated BMS infrastructure.',
      specs: [
        { label: 'Floors', val: '42 Levels' },
        { label: 'Parking Bays', val: '1,200 Covered' },
        { label: 'Total Leasable', val: '350,000 Sq.Ft' },
        { label: 'Green Rating', val: 'LEED Platinum' },
        { label: 'Power Backup', val: '100% N+1 DG' },
        { label: 'Efficiency', val: '86% Super Area' }
      ],
      amenities: [
        'Destination Elevators',
        '500-Seat Auditorium',
        'Helipad on Tower A',
        'EV Fleet Station',
        'Executive Dining Club',
        '24/7 Redundant Power'
      ]
    },
    4: {
      title: 'Villa Aurelia Waterfront',
      location: 'Coastal Bayfront Lagoon, Private Marina',
      priceInr: '₹54.00 Cr',
      priceUsd: '$6.50M',
      image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80',
      description: 'Direct oceanfront sanctuary with exclusive deep-water private yacht berth. Expansive Japanese Zen gardens, outdoor teppanyaki kitchen, temperature-controlled subterranean wine cave, and private security outpost.',
      specs: [
        { label: 'Bedrooms', val: '7 En-Suite' },
        { label: 'Bathrooms', val: '9 Baths' },
        { label: 'Super Built-Up', val: '16,400 Sq.Ft' },
        { label: 'Yacht Berth', val: 'Up to 90ft Vessel' },
        { label: 'Land Plot', val: '1.2 Acres' },
        { label: 'Security', val: 'Gated Perimeter' }
      ],
      amenities: [
        'Private Yacht Berth',
        'Zen Water Gardens',
        'Olympic Lap Pool',
        'Staff Quarters (4)',
        'Private Cinema (12 Seats)',
        'Subterranean Wine Cave'
      ]
    },
    5: {
      title: 'The Sovereign Sky Palace',
      location: 'Crown Heights Promenade, 74th Floor',
      priceInr: '₹39.50 Cr',
      priceUsd: '$4.75M',
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
      description: 'An architectural marvel spanning three upper levels. Sculpted floating marble staircase, 360-degree bulletproof glass perimeter, 24-karat gold-leaf finishing in master salon, and private heated sky plunge pool.',
      specs: [
        { label: 'Type', val: 'Triplex Palace' },
        { label: 'Bedrooms', val: '5 Grand Suites' },
        { label: 'Bathrooms', val: '7 Imperial Baths' },
        { label: 'Super Built-Up', val: '10,800 Sq.Ft' },
        { label: 'Level', val: '74th-76th Floors' },
        { label: 'Private Pool', val: 'Heated Sky Pool' }
      ],
      amenities: [
        'Floating Marble Staircase',
        'Sky Terrace Lounge',
        '24K Gold-Leaf Accents',
        'Private Cigar Bar',
        'Butler Pantries',
        'Biometric Safe Room'
      ]
    },
    6: {
      title: 'Vanguard Silicon Campus',
      location: 'Cyber City Core, Global Tech Zone',
      priceInr: '₹85.00 Cr',
      priceUsd: '$10.25M',
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
      description: 'A blue-chip tech asset pre-leased to Fortune 100 technology corporations with a verifiable 9-year lock-in period. Generates an immediate 9.2% net rental yield with annual escalation guarantees.',
      specs: [
        { label: 'Asset Type', val: 'Tech Campus' },
        { label: 'Tenant Status', val: 'Pre-Leased F100' },
        { label: 'Net ROI', val: '9.2% Annually' },
        { label: 'Super Built-Up', val: '220,000 Sq.Ft' },
        { label: 'Escalation', val: '5% Annually' },
        { label: 'Lock-In', val: '9 Years Firm' }
      ],
      amenities: [
        'Institutional Grade Lease',
        'Integrated Solar Canopy',
        'High-Density Fibre Grid',
        'Dedicated Substation',
        'Campus Food Hall',
        'Ample EV Superchargers'
      ]
    }
  };

  const modal = document.getElementById('property-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const quickViewBtns = document.querySelectorAll('.quick-view-btn');

  function openPropertyModal(id) {
    const data = propertyData[id];
    if (!data || !modal) return;

    document.getElementById('modal-title').textContent = data.title;
    document.getElementById('modal-location').textContent = data.location;
    document.getElementById('modal-price').textContent = currentCurrency === 'INR' ? data.priceInr : data.priceUsd;
    document.getElementById('modal-desc').textContent = data.description;
    document.getElementById('modal-image').src = data.image;

    // Specs grid
    const specsContainer = document.getElementById('modal-specs');
    specsContainer.innerHTML = '';
    data.specs.forEach((s) => {
      const box = document.createElement('div');
      box.className = 'm-spec-box';
      box.innerHTML = `
        <span class="m-spec-label">${s.label}</span>
        <span class="m-spec-val">${s.val}</span>
      `;
      specsContainer.appendChild(box);
    });

    // Amenities
    const amenitiesContainer = document.getElementById('modal-amenities');
    amenitiesContainer.innerHTML = '';
    data.amenities.forEach((a) => {
      const chip = document.createElement('span');
      chip.className = 'amenity-chip';
      chip.textContent = a;
      amenitiesContainer.appendChild(chip);
    });

    // WhatsApp link prefilled
    const waLink = document.getElementById('modal-whatsapp-link');
    if (waLink) {
      waLink.href = `https://wa.me/916355564217?text=Hello%20Yash%20Properties%20Limited,%20I%20would%20like%20to%20schedule%20a%20private%20tour%20for%20${encodeURIComponent(data.title)}.`;
    }

    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    playTone(600, 0.15);

    if (window.lucide) lucide.createIcons();
  }

  function closePropertyModal() {
    if (!modal) return;
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  }

  quickViewBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.getAttribute('data-id');
      openPropertyModal(id);
    });
  });

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closePropertyModal);
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closePropertyModal();
    });
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && !modal.classList.contains('hidden')) {
      closePropertyModal();
    }
  });

  // ==========================================
  // 9. TESTIMONIALS AUTO-CAROUSEL
  // ==========================================
  const slides = document.querySelectorAll('.testimonial-slide');
  const dots = document.querySelectorAll('#carousel-dots .dot');
  const prevBtn = document.getElementById('carousel-prev');
  const nextBtn = document.getElementById('carousel-next');

  let currentSlide = 0;
  let carouselInterval = null;

  function showSlide(index) {
    slides.forEach((s) => s.classList.remove('active'));
    dots.forEach((d) => d.classList.remove('active'));

    currentSlide = (index + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');
    if (dots[currentSlide]) dots[currentSlide].classList.add('active');
  }

  function nextSlide() {
    showSlide(currentSlide + 1);
  }

  function prevSlide() {
    showSlide(currentSlide - 1);
  }

  if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); playTone(450, 0.08); });
  if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); playTone(450, 0.08); });

  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      const idx = parseInt(dot.getAttribute('data-index'), 10);
      showSlide(idx);
      playTone(480, 0.08);
    });
  });

  function startCarousel() {
    carouselInterval = setInterval(nextSlide, 5500);
  }

  function stopCarousel() {
    if (carouselInterval) clearInterval(carouselInterval);
  }

  const carouselWrap = document.querySelector('.testimonial-carousel-wrap');
  if (carouselWrap) {
    carouselWrap.addEventListener('mouseenter', stopCarousel);
    carouselWrap.addEventListener('mouseleave', startCarousel);
  }

  startCarousel();

  // ==========================================
  // 10. LUXURY CONTACT FORM WITH CONFETTI
  // ==========================================
  const form = document.getElementById('luxury-contact-form');
  const successCard = document.getElementById('form-success-alert');
  const resetBtn = document.getElementById('reset-form-btn');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('form-name');
      const phoneInput = document.getElementById('form-phone');
      const emailInput = document.getElementById('form-email');
      const categoryInput = document.getElementById('form-category');
      const messageInput = document.getElementById('form-message');

      let isValid = true;

      // Validate Name
      if (!nameInput.value.trim()) {
        document.getElementById('error-name').textContent = 'Please enter your full name.';
        isValid = false;
      } else {
        document.getElementById('error-name').textContent = '';
      }

      // Validate Phone
      if (!phoneInput.value.trim() || phoneInput.value.length < 8) {
        document.getElementById('error-phone').textContent = 'Please provide a valid contact number.';
        isValid = false;
      } else {
        document.getElementById('error-phone').textContent = '';
      }

      // Validate Email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailInput.value.trim() || !emailRegex.test(emailInput.value)) {
        document.getElementById('error-email').textContent = 'Please enter a valid corporate/personal email.';
        isValid = false;
      } else {
        document.getElementById('error-email').textContent = '';
      }

      if (!isValid) return;

      // Celebrate with gold and royal blue confetti
      if (typeof confetti === 'function') {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#d4af37', '#f7e7b4', '#1e3a8a', '#2563eb', '#ffffff']
        });
      }

      playTone(880, 0.35);

      // Transition to success card
      form.classList.add('hidden');
      if (successCard) successCard.classList.remove('hidden');

      // Prefill WhatsApp direct message with what they submitted
      const submittedName = encodeURIComponent(nameInput.value.trim());
      const submittedCategory = encodeURIComponent(categoryInput.value);
      const waSuccessLink = successCard.querySelector('a');
      if (waSuccessLink) {
        waSuccessLink.href = `https://wa.me/916355564217?text=Hello%20Yash%20Properties%20Limited,%20I%20am%20${submittedName}.%20I%20just%20submitted%20an%20inquiry%20for%20${submittedCategory}.`;
      }
    });
  }

  if (resetBtn && form && successCard) {
    resetBtn.addEventListener('click', () => {
      form.reset();
      form.classList.remove('hidden');
      successCard.classList.add('hidden');
    });
  }
});
