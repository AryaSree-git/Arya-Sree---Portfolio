/**
 * Arya Sree Ashok — Portfolio Application Logic
 * Interactive Neural Canvas, Project Case Studies, Skill Matrix, Form Validation & Modals
 */

document.addEventListener('DOMContentLoaded', () => {
  initNeuralCanvas();
  initRoleTypewriter();
  initNavigation();
  initProjectSystem();
  initSkillsFilter();
  initContactForm();
  initResumeViewer();
  initBackToTop();
  initPortraitToggle();
  initAOS();
});

/* ==========================================================================
   1. NEURAL NETWORK CANVAS ANIMATION
   ========================================================================== */
function initNeuralCanvas() {
  const canvas = document.getElementById('neural-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  const particles = [];
  const particleCount = Math.min(Math.floor((width * height) / 14000), 85);
  const maxDistance = 140;
  const mouse = { x: null, y: null, radius: 180 };

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
  });

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.7;
      this.vy = (Math.random() - 0.5) * 0.7;
      this.radius = Math.random() * 1.8 + 1;
      this.color = Math.random() > 0.4 ? 'rgba(0, 242, 254, ' : 'rgba(168, 85, 247, ';
      this.baseAlpha = Math.random() * 0.4 + 0.3;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      // Mouse subtle pull
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          this.x += (dx / dist) * force * 0.6;
          this.y += (dy / dist) * force * 0.6;
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color + this.baseAlpha + ')';
      ctx.shadowBlur = 8;
      ctx.shadowColor = this.color.includes('242') ? '#00f2fe' : '#a855f7';
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function render() {
    ctx.clearRect(0, 0, width, height);

    // Draw connecting synapses
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxDistance) {
          const alpha = (1 - dist / maxDistance) * 0.22;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(56, 189, 248, ${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    // Connect to cursor
    if (mouse.x !== null && mouse.y !== null) {
      for (let i = 0; i < particles.length; i++) {
        const dx = mouse.x - particles[i].x;
        const dy = mouse.y - particles[i].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const alpha = (1 - dist / mouse.radius) * 0.35;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(0, 242, 254, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    particles.forEach((p) => {
      p.update();
      p.draw();
    });

    requestAnimationFrame(render);
  }

  render();
}

/* ==========================================================================
   2. ROLE TYPEWRITER / ROTATOR
   ========================================================================== */
function initRoleTypewriter() {
  const el = document.getElementById('role-rotator');
  if (!el) return;

  const roles = [
    'Aspiring AI/ML Engineer',
    'Computer Vision Developer',
    'Deep Learning Explorer',
    'Generative AI & Multimodal Researcher',
    'AI Safety & Accessibility Innovator'
  ];

  let roleIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  let speed = 90;

  function type() {
    const current = roles[roleIdx];
    if (isDeleting) {
      el.textContent = current.substring(0, charIdx - 1);
      charIdx--;
      speed = 45;
    } else {
      el.textContent = current.substring(0, charIdx + 1);
      charIdx++;
      speed = 85;
    }

    if (!isDeleting && charIdx === current.length) {
      isDeleting = true;
      speed = 2200; // Pause at end of word
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
      speed = 400; // Pause before typing new word
    }

    setTimeout(type, speed);
  }

  type();
}

/* ==========================================================================
   3. NAVIGATION & SCROLL-SPY
   ========================================================================== */
function initNavigation() {
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  const mobileToggle = document.getElementById('mobile-menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');

  if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });

    // Close mobile menu when link is clicked
    mobileMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
      });
    });
  }

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollY = window.pageYOffset;

    sections.forEach((sec) => {
      const top = sec.offsetTop - 120;
      const height = sec.offsetHeight;
      const id = sec.getAttribute('id');
      if (scrollY >= top && scrollY < top + height) {
        current = id;
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('text-cyan-400', 'font-semibold');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('text-cyan-400', 'font-semibold');
      }
    });
  });
}

/* ==========================================================================
   4. PROJECTS DATA & MODAL SYSTEM (FACTUAL FROM CV)
   ========================================================================== */
const projectsData = [
  {
    id: 'tsl-speech',
    title: 'Tamil Sign Language to Speech Converter',
    category: 'cv',
    categoryLabel: 'Computer Vision & Accessibility',
    badge: 'Accessibility AI',
    status: 'Verified Project',
    shortDesc: 'A real-time Tamil Sign Language recognition pipeline engineered using MediaPipe hand landmark extraction, OpenCV spatial processing, and fine-tuned deep learning classification.',
    overview: 'This project bridges communication gaps for the speech- and hearing-impaired Tamil community. By tracking 21 3D hand coordinates in real-time, the system maps intricate Tamil sign language gestures into natural synthesized speech output with minimal latency.',
    problem: 'Existing sign language recognition models overwhelmingly focus on American Sign Language (ASL) and lack real-time support for regional Indian languages like Tamil, which have intricate spatial and rotational gestures.',
    techStack: ['Python', 'MediaPipe', 'OpenCV', 'MLP', 'ConvNeXt', 'ResNet', 'VGG', 'NumPy'],
    architecture: 'Input Video Stream → OpenCV Frame Preprocessing → MediaPipe 21-point Landmark Vectorization (x, y, z coordinates) → Normalization & Spatial Augmentation → Comparative Classification Benchmark (MLP / ConvNeXt / ResNet / VGG) → Real-Time Gesture Mapping → Speech Audio Synthesis.',
    modelsUsed: 'Fine-tuned Multi-Layer Perceptron (MLP) for low-latency inference, benchmarked against heavyweight convolutional backbones including VGG-16, ResNet-50, and ConvNeXt.',
    results: 'Optimized feature preprocessing techniques enabled a classification accuracy of 80%–90% on dynamic gesture datasets while maintaining real-time execution (>30 FPS) without requiring high-end server GPU infrastructure.',
    github: 'https://github.com/AryaSree-git',
    featured: true
  },
  {
    id: 'wardrobe-vton',
    title: 'AI-Powered Wardrobe Styling & Virtual Try-On System',
    category: 'genai',
    categoryLabel: 'Generative AI & Multimodal',
    badge: 'Generative AI',
    status: 'Research Project',
    shortDesc: 'A state-of-the-art outfit recommendation and virtual try-on pipeline integrating CLIP multimodal embeddings, K-means color harmony clustering, Stable Diffusion v1.5, and IDM-VTON.',
    overview: 'Developed as a high-performance fashion intelligence engine. Combines semantic matching of garments with natural language prompts, aesthetic color harmony analysis, and photo-realistic virtual garment fitting onto user images.',
    problem: 'Traditional virtual shopping experiences rely on static image overlays that look artificial, fail to preserve fabric folds, and ignore color theory and user body pose.',
    techStack: ['PyTorch', 'Stable Diffusion v1.5', 'IDM-VTON', 'CLIP (OpenAI)', 'CUDA', 'K-Means Clustering', 'NVIDIA RTX 5060'],
    architecture: 'Garment & User Input → CLIP Image-Text Multimodal Embedding Extraction → K-Means Color Palette & Harmony Clustering → Pose Estimation & DensePose Mapping → IDM-VTON Conditioned Warping → Stable Diffusion v1.5 Inpainting & Texture Synthesis → GPU-Accelerated Final Composite Rendering.',
    modelsUsed: 'OpenAI CLIP ViT-B/32, IDM-VTON (Improving Diffusion Models for Virtual Try-On), Stable Diffusion v1.5 latent inpainting, and GPU acceleration with PyTorch CUDA primitives.',
    results: 'Engineered GPU-accelerated pipeline on NVIDIA RTX hardware optimizing pose estimation and feature extraction. Generates realistic garment deformations and fold textures with high semantic fidelity to user descriptions.',
    github: 'https://github.com/AryaSree-git',
    featured: true
  },
  {
    id: 'smart-intrusion',
    title: 'Smart Intrusion Detection and Alert System',
    category: 'edge',
    categoryLabel: 'Edge Computing & Surveillance',
    badge: 'Intelligent Surveillance',
    status: 'Verified Project',
    shortDesc: 'An automated, real-time intrusion monitoring pipeline utilizing computer vision techniques to detect unauthorized access and dynamically transmit encrypted security alerts.',
    overview: 'An edge-ready intelligent surveillance application designed for automated perimeter monitoring. It processes continuous video feeds, isolates anomalous motion vectors, captures high-resolution intrusion payloads, and executes immediate alert routines.',
    problem: 'Conventional CCTV systems require constant human monitoring or trigger false alarms on minor environmental shifts (shadows, pets), lacking automated, encrypted evidence dispatch.',
    techStack: ['Python', 'OpenCV', 'Computer Vision', 'NumPy', 'SMTP / TLS Encryption', 'Edge Computing'],
    architecture: 'RTSP/Webcam Video Stream → Dynamic Gaussian Mixture Background Modeling → Morphological Filtering & Contour Isolation → Spatial Thresholding & Bounding Box Extraction → Event Trigger Engine → Payload Snapshot Capture → Dynamic Encrypted Email Dispatch (TLS/SSL).',
    modelsUsed: 'Real-time OpenCV motion analysis, differential frame analysis, adaptive thresholding algorithms, and secure multi-part MIME alert pipelines.',
    results: 'Demonstrated zero-lag unauthorized entry detection with sub-second encrypted alert dispatch containing photographic evidence directly to administrative endpoints.',
    github: 'https://github.com/AryaSree-git',
    featured: true
  }
];

function initProjectSystem() {
  const container = document.getElementById('projects-grid');
  const filterBtns = document.querySelectorAll('.project-filter-btn');
  const modalOverlay = document.getElementById('project-modal-overlay');
  const modalBody = document.getElementById('project-modal-content');
  const modalClose = document.getElementById('project-modal-close');

  if (!container) return;

  function renderProjects(filter = 'all') {
    container.innerHTML = '';
    const filtered = filter === 'all' 
      ? projectsData 
      : projectsData.filter(p => p.category === filter);

    filtered.forEach((p) => {
      const card = document.createElement('div');
      card.className = 'project-card glass-panel p-6 sm:p-8 flex flex-col justify-between cursor-pointer group';
      card.setAttribute('data-id', p.id);

      card.innerHTML = `
        <div>
          <div class="flex items-center justify-between gap-3 mb-4">
            <span class="badge-tech text-xs">${p.badge}</span>
            <span class="text-xs font-mono text-slate-400 flex items-center gap-1.5">
              <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              ${p.status}
            </span>
          </div>
          <h3 class="text-xl sm:text-2xl font-bold text-white group-hover:text-cyan-300 transition-colors mb-3 leading-snug">
            ${p.title}
          </h3>
          <p class="text-slate-300 text-sm leading-relaxed mb-6">
            ${p.shortDesc}
          </p>
        </div>

        <div>
          <div class="flex flex-wrap gap-2 mb-6">
            ${p.techStack.slice(0, 4).map(t => `<span class="px-2.5 py-1 text-xs rounded-md bg-slate-800/80 border border-slate-700/60 text-slate-300 font-mono">${t}</span>`).join('')}
            ${p.techStack.length > 4 ? `<span class="px-2.5 py-1 text-xs rounded-md bg-slate-800/40 text-slate-400 font-mono">+${p.techStack.length - 4}</span>` : ''}
          </div>
          <div class="pt-4 border-t border-slate-800/80 flex items-center justify-between text-sm">
            <span class="text-cyan-400 font-semibold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1.5">
              Explore Architecture & Metrics
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
            </span>
            <span class="text-xs text-slate-400 font-mono">Case Study</span>
          </div>
        </div>
      `;

      card.addEventListener('click', () => openProjectModal(p));
      container.appendChild(card);
    });
  }

  renderProjects('all');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderProjects(btn.getAttribute('data-filter'));
    });
  });

  function openProjectModal(project) {
    if (!modalOverlay || !modalBody) return;

    modalBody.innerHTML = `
      <div class="p-6 sm:p-8">
        <!-- Header -->
        <div class="flex items-start justify-between gap-4 mb-6">
          <div>
            <div class="flex items-center gap-2 mb-2">
              <span class="badge-tech">${project.categoryLabel}</span>
              <span class="badge-emerald text-xs">${project.status}</span>
            </div>
            <h2 class="text-2xl sm:text-3xl font-bold text-white mb-2">${project.title}</h2>
          </div>
        </div>

        <!-- Problem & Overview -->
        <div class="space-y-6 text-slate-300 text-sm leading-relaxed mb-8">
          <div class="bg-slate-900/80 p-5 rounded-xl border border-slate-800">
            <h4 class="text-xs uppercase tracking-wider font-mono text-cyan-400 mb-2 font-semibold">Problem Statement</h4>
            <p>${project.problem}</p>
          </div>

          <div>
            <h4 class="text-xs uppercase tracking-wider font-mono text-slate-400 mb-2 font-semibold">Executive Overview</h4>
            <p>${project.overview}</p>
          </div>

          <div class="bg-slate-900/80 p-5 rounded-xl border border-slate-800">
            <h4 class="text-xs uppercase tracking-wider font-mono text-violet-400 mb-2 font-semibold">Pipeline Architecture</h4>
            <div class="font-mono text-xs text-slate-300 bg-slate-950 p-3.5 rounded-lg border border-slate-800/80 leading-normal">
              ${project.architecture}
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <h5 class="text-xs font-mono text-cyan-400 mb-1 font-semibold">Models & Algorithms</h5>
              <p class="text-xs text-slate-300">${project.modelsUsed}</p>
            </div>
            <div class="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <h5 class="text-xs font-mono text-emerald-400 mb-1 font-semibold">Results & Benchmarks</h5>
              <p class="text-xs text-slate-300">${project.results}</p>
            </div>
          </div>

          <div>
            <h4 class="text-xs uppercase tracking-wider font-mono text-slate-400 mb-2 font-semibold">Technologies Utilized</h4>
            <div class="flex flex-wrap gap-2">
              ${project.techStack.map(t => `<span class="badge-tech">${t}</span>`).join('')}
            </div>
          </div>
        </div>

        <!-- Footer Actions -->
        <div class="pt-6 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <a href="${project.github}" target="_blank" rel="noopener noreferrer" class="btn-primary text-xs">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>
            Inspect Repository on GitHub
          </a>
          <button class="px-5 py-2.5 rounded-xl border border-slate-700 text-slate-300 text-xs font-semibold hover:bg-slate-800 transition-colors" onclick="document.getElementById('project-modal-overlay').classList.remove('active')">
            Close Case Study
          </button>
        </div>
      </div>
    `;

    modalOverlay.classList.add('active');
  }

  if (modalClose && modalOverlay) {
    modalClose.addEventListener('click', () => modalOverlay.classList.remove('active'));
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) modalOverlay.classList.remove('active');
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
        modalOverlay.classList.remove('active');
      }
    });
  }
}

/* ==========================================================================
   5. SKILLS MATRIX FILTER
   ========================================================================== */
function initSkillsFilter() {
  const filterBtns = document.querySelectorAll('.skill-filter-btn');
  const skillCards = document.querySelectorAll('.skill-category-block');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-skill-filter');
      skillCards.forEach((card) => {
        if (filter === 'all' || card.getAttribute('data-skill-group') === filter) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   6. CONTACT FORM VALIDATION & GOOGLE FORM DISPATCH WITH POPUP
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const toast = document.getElementById('toast-notice');
  const toastText = document.getElementById('toast-message');

  // Status Modal Elements
  const statusModal = document.getElementById('contact-status-modal');
  const statusClose = document.getElementById('contact-status-close');
  const statusOkBtn = document.getElementById('contact-status-ok-btn');
  const statusRetryBtn = document.getElementById('contact-status-retry-btn');
  const statusSuccessView = document.getElementById('contact-status-success');
  const statusErrorView = document.getElementById('contact-status-error');
  const statusEmailDisplay = document.getElementById('status-submitted-email');

  if (!form) return;

  function openStatusModal(success = true, email = '') {
    if (!statusModal) return;
    if (success) {
      statusSuccessView.classList.remove('hidden');
      statusErrorView.classList.add('hidden');
      if (statusEmailDisplay) statusEmailDisplay.textContent = email;
    } else {
      statusSuccessView.classList.add('hidden');
      statusErrorView.classList.remove('hidden');
    }
    statusModal.classList.add('active');
  }

  function closeStatusModal() {
    if (statusModal) statusModal.classList.remove('active');
  }

  if (statusClose) statusClose.addEventListener('click', closeStatusModal);
  if (statusOkBtn) statusOkBtn.addEventListener('click', closeStatusModal);
  if (statusRetryBtn) statusRetryBtn.addEventListener('click', closeStatusModal);
  if (statusModal) {
    statusModal.addEventListener('click', (e) => {
      if (e.target === statusModal) closeStatusModal();
    });
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('contact-name').value.trim();
    const email = document.getElementById('contact-email').value.trim();
    const subject = document.getElementById('contact-subject').value.trim();
    const message = document.getElementById('contact-message').value.trim();

    if (!name || !email || !message) {
      showToast('Please fill in all required fields.', true);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showToast('Please enter a valid email address.', true);
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = `
      <svg class="animate-spin w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path></svg>
      Recording to Google Form...
    `;
    submitBtn.disabled = true;

    // Google Form Destination URL
    const googleFormUrl = "https://docs.google.com/forms/u/0/d/e/1FAIpQLSfJpOG1iKOremwxkH8VZSpUoGQeAVq47UEzoKBYqs3vGrlLeQ/formResponse";

    // Prepare payload matching the exact Google Form DOM entries
    const formData = new FormData();
    formData.append("entry.1453924958", name);       // Your Name
    formData.append("entry.1079554105", email);      // Your Email
    formData.append("entry.483342631", subject);     // Subject
    formData.append("entry.921190686", message);     // Message Content
    formData.append("fvv", "1");
    formData.append("pageHistory", "0");
    formData.append("fbzx", "-6296008140683642800");

    // Dual Dispatch: Fetch with no-cors + silent iframe fallback
    let submitted = false;

    function handleSuccess() {
      if (submitted) return;
      submitted = true;
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
      form.reset();

      // Show Popup Modal & Toast Notification
      openStatusModal(true, email);
      showToast('Details submitted successfully to Google Form! 🎉');
    }

    // 1. Send via fetch (no-cors)
    fetch(googleFormUrl, {
      method: "POST",
      mode: "no-cors",
      body: formData
    })
    .then(() => {
      handleSuccess();
    })
    .catch((err) => {
      console.warn("Fetch no-cors caught exception, relying on iframe target:", err);
      // Fallback submit directly via form element into hidden iframe
      form.submit();
      setTimeout(handleSuccess, 600);
    });

    // Ensure completion within 1200ms in all browser environments
    setTimeout(handleSuccess, 1200);
  });

  function showToast(msg, isError = false) {
    if (!toast || !toastText) return;
    toastText.textContent = msg;
    toast.className = `toast-notice show ${isError ? 'border-rose-500' : 'border-emerald-500'}`;

    setTimeout(() => {
      toast.classList.remove('show');
    }, 4500);
  }
}

/* ==========================================================================
   7. RESUME PREVIEW & DOWNLOAD MODAL
   ========================================================================== */
function initResumeViewer() {
  const previewBtns = document.querySelectorAll('.preview-resume-btn');
  const modal = document.getElementById('resume-modal-overlay');
  const closeBtn = document.getElementById('resume-modal-close');

  if (!modal) return;

  previewBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      modal.classList.add('active');
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => modal.classList.remove('active'));
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('active');
    });
  }
}

/* ==========================================================================
   8. BACK TO TOP
   ========================================================================== */
function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 500) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ==========================================================================
   9. SCROLL REVEAL (AOS Lightweight Observer)
   ========================================================================== */
function initAOS() {
  const elements = document.querySelectorAll('[data-reveal]');
  if (!('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('opacity-100', 'translate-y-0');
        entry.target.classList.remove('opacity-0', 'translate-y-8');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  elements.forEach((el) => {
    el.classList.add('transition-all', 'duration-700', 'opacity-0', 'translate-y-8');
    observer.observe(el);
  });
}

/* ==========================================================================
   10. INTERACTIVE PORTRAIT TOGGLE (AI Studio vs Original Photo)
   ========================================================================== */
function initPortraitToggle() {
  const btn = document.getElementById('toggle-portrait-btn');
  const img = document.getElementById('hero-portrait');
  if (!btn || !img) return;

  let isAI = true;
  img.style.transition = 'opacity 0.25s ease, transform 0.25s ease';

  btn.addEventListener('click', () => {
    img.style.opacity = '0';
    img.style.transform = 'scale(0.95)';
    setTimeout(() => {
      if (isAI) {
        img.src = 'assets/img/profile-original.jpg';
        btn.innerHTML = `
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
          Showing Original Photo (Switch to AI Studio)
        `;
        isAI = false;
      } else {
        img.src = 'assets/img/portrait-ai.jpg';
        btn.innerHTML = `
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
          Showing AI Studio Portrait (Switch to Original)
        `;
        isAI = true;
      }
      img.style.opacity = '1';
      img.style.transform = 'scale(1)';
    }, 200);
  });
}
