const observerOptions = {
  threshold: 0.08,
  rootMargin: "0px 0px -40px 0px",
}

// Animates elements sliding up with staggered delays when they scroll into view
const animateOnScroll = (selector, animateClass, staggerBase = 0.12) => {
  const elements = document.querySelectorAll(selector)
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const siblings = [...entry.target.parentElement.querySelectorAll(selector)]
        const index = siblings.indexOf(entry.target)
        entry.target.style.transitionDelay = `${index * staggerBase}s`
        entry.target.classList.add(animateClass)
        obs.unobserve(entry.target)
      }
    })
  }, observerOptions)
  elements.forEach((el) => observer.observe(el))
}

animateOnScroll(".up-slider", "slide-up", 0.12)

// Reveals fade-in / fade-up elements as they scroll into view (project pages)
const projectFadeEls = document.querySelectorAll(".fade-up, .fade-in")
if (projectFadeEls.length) {
  const projectObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible")
        obs.unobserve(entry.target)
      }
    })
  }, observerOptions)
  projectFadeEls.forEach((el) => projectObserver.observe(el))
}

// Highlights the active section in the project-page timeline sidebar
const timelineItems = document.querySelectorAll(".timeline-item")
const timelineSections = document.querySelectorAll(".section-overview, .section-highlights")
if (timelineItems.length && timelineSections.length) {
  const timelineObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        timelineItems.forEach((item) => {
          item.classList.toggle("active", item.getAttribute("href") === "#" + entry.target.id)
        })
      }
    })
  }, { threshold: 0.3 })
  timelineSections.forEach((s) => timelineObserver.observe(s))
}

// Toggles the links overlay panel on project pages
const linksBtn = document.getElementById("links-btn")
const linksOverlay = document.getElementsByClassName("links-overlay")[0]

if (linksBtn && linksOverlay) {
  linksBtn.addEventListener("click", () => {
    linksOverlay.style.display = "flex"
    linksOverlay.classList.add("links-overlay-opacity")
    linksBtn.style.zIndex = -1
  })
  linksOverlay.addEventListener("click", function () {
    const overlay = this
    this.classList.remove("links-overlay-opacity")
    linksBtn.innerHTML = "Links"
    linksBtn.style.zIndex = 0
    setTimeout(() => {
      overlay.style.display = "none"
    }, 700)
  })
}

// Checks whether the user prefers reduced motion
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

// Updates the scroll progress bar width based on page scroll position
const progressBar = document.querySelector(".scroll-progress span")
const updateScrollProgress = () => {
  if (!progressBar) return
  const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight
  progressBar.style.width = `${scrollableHeight > 0 ? (window.scrollY / scrollableHeight) * 100 : 0}%`
}
window.addEventListener("scroll", updateScrollProgress, { passive: true })
updateScrollProgress()

// Moves buttons slightly toward the pointer for a magnetic hover effect
if (!reducedMotion) {
  document.querySelectorAll(".magnetic-button").forEach((button) => {
    button.addEventListener("pointermove", (event) => {
      const rect = button.getBoundingClientRect()
      button.style.transform = `translate(${(event.clientX - rect.left - rect.width / 2) * 0.16}px, ${(event.clientY - rect.top - rect.height / 2) * 0.16}px)`
    })
    button.addEventListener("pointerleave", () => { button.style.transform = "translate(0, 0)" })
  })
}

// Applies a subtle 3D parallax tilt to the hero window based on mouse position
if (!reducedMotion) {
  const windowMain = document.querySelector('.window-main');
  if (windowMain) {
    let frameId = null;
    windowMain.addEventListener('mousemove', (e) => {
      if (frameId) cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(() => {
        const rect = windowMain.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        windowMain.style.setProperty('--mouse-x', `${x}px`);
        windowMain.style.setProperty('--mouse-y', `${y}px`);

        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const rotateX = -(e.clientY - centerY) / (rect.height / 2) * 1.5;
        const rotateY = (e.clientX - centerX) / (rect.width / 2) * 1.5;
        windowMain.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      });
    });

    windowMain.addEventListener('mouseleave', () => {
      if (frameId) cancelAnimationFrame(frameId);
      windowMain.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg)';
    });
  }
}

// Renders an interactive 3D point cloud inside the hero canvas with pointer-driven rotation
if (typeof THREE !== 'undefined') {
  const canvas = document.getElementById('hero-canvas');
  if (canvas && canvas.parentElement) {
    const host = canvas.parentElement;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.z = 5.0;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'low-power'
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const COUNT = 1400;
    const RADIUS = 1.8;
    const positions = new Float32Array(COUNT * 3);
    const colors = new Float32Array(COUNT * 3);
    const base = new Float32Array(COUNT * 3);
    const phase = new Float32Array(COUNT);

    const golden = Math.PI * (3 - Math.sqrt(5));
    const accent = new THREE.Color(0x12a588);
    const plain = new THREE.Color(0xf2f2f2);

    for (let i = 0; i < COUNT; i++) {
      const y = 1 - (i / (COUNT - 1)) * 2;
      const ring = Math.sqrt(Math.max(0, 1 - y * y));
      const theta = golden * i;
      const i3 = i * 3;

      base[i3] = Math.cos(theta) * ring;
      base[i3 + 1] = y;
      base[i3 + 2] = Math.sin(theta) * ring;

      positions[i3] = base[i3] * RADIUS;
      positions[i3 + 1] = base[i3 + 1] * RADIUS;
      positions[i3 + 2] = base[i3 + 2] * RADIUS;

      phase[i] = Math.random() * Math.PI * 2;

      const tint = i % 13 === 0 ? accent : plain;
      colors[i3] = tint.r;
      colors[i3 + 1] = tint.g;
      colors[i3 + 2] = tint.b;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.03,
      sizeAttenuation: true,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      depthWrite: false
    });

    const cloud = new THREE.Points(geometry, material);
    const group = new THREE.Group();
    group.add(cloud);
    group.rotation.z = -0.24;
    scene.add(group);

    const resize = () => {
      const w = Math.max(1, host.clientWidth);
      const h = Math.max(1, host.clientHeight);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    };
    window.addEventListener('resize', resize);
    resize();

    const pointer = { x: 0, y: 0 };
    const eased = { x: 0, y: 0 };
    if (!reducedMotion) {
      window.addEventListener('pointermove', (event) => {
        pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
        pointer.y = (event.clientY / window.innerHeight) * 2 - 1;
      }, { passive: true });
    }

    const attr = geometry.getAttribute('position');
    let frameId = null;
    let visible = true;
    let clock = 0;

    const render = () => {
      frameId = requestAnimationFrame(render);
      if (!visible) return;

      clock += 0.006;
      eased.x += (pointer.x - eased.x) * 0.045;
      eased.y += (pointer.y - eased.y) * 0.045;

      for (let i = 0; i < COUNT; i++) {
        const i3 = i * 3;
        const wave =
          Math.sin(clock + phase[i] + base[i3 + 1] * 2.6) * 0.055 +
          Math.sin(clock * 0.6 + base[i3] * 3.1) * 0.03;
        const r = RADIUS + wave + eased.x * base[i3] * 0.09;
        attr.array[i3] = base[i3] * r;
        attr.array[i3 + 1] = base[i3 + 1] * r;
        attr.array[i3 + 2] = base[i3 + 2] * r;
      }
      attr.needsUpdate = true;

      group.rotation.y += 0.0016;
      group.rotation.x += (eased.y * 0.28 - group.rotation.x) * 0.05;
      group.position.x += (eased.x * 0.12 - group.position.x) * 0.05;

      renderer.render(scene, camera);
    };

    if (reducedMotion) {
      renderer.render(scene, camera);
    } else {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => { visible = entry.isIntersecting; });
      }, { threshold: 0.02 });
      observer.observe(canvas);
      render();

      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          cancelAnimationFrame(frameId);
          frameId = null;
        } else if (!frameId) {
          render();
        }
      });
    }
  }
}

// Shows a follow-cursor label on project cards with a smooth easing effect
const workCursor = document.querySelector('.work-cursor')
if (workCursor && !reducedMotion && window.matchMedia('(pointer: fine)').matches) {
  const label = workCursor.querySelector('span')
  const target = { x: 0, y: 0 }
  const current = { x: 0, y: 0 }
  let active = false
  let cursorFrame = null

  const followCursor = () => {
    current.x += (target.x - current.x) * 0.18
    current.y += (target.y - current.y) * 0.18
    workCursor.style.translate = `${current.x}px ${current.y}px`
    if (active || Math.abs(target.x - current.x) > 0.5) {
      cursorFrame = requestAnimationFrame(followCursor)
    } else {
      cursorFrame = null
    }
  }

  document.querySelectorAll('[data-preview]').forEach((card) => {
    card.addEventListener('pointerenter', (event) => {
      label.textContent = card.dataset.preview
      target.x = current.x = event.clientX
      target.y = current.y = event.clientY
      active = true
      workCursor.classList.add('is-visible')
      if (!cursorFrame) followCursor()
    })
    card.addEventListener('pointermove', (event) => {
      target.x = event.clientX
      target.y = event.clientY
      if (!cursorFrame) followCursor()
    })
    card.addEventListener('pointerleave', () => {
      active = false
      workCursor.classList.remove('is-visible')
    })
  })
}

// Triggers confetti animation when the user types "karthik" on the keyboard
const triggerConfetti = () => {
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.inset = '0';
  container.style.pointerEvents = 'none';
  container.style.zIndex = '9999';
  document.body.appendChild(container);

  const colors = ['#00ffab', '#fc356d', '#fecc4e', '#38bdf8', '#ffffff'];
  for (let i = 0; i < 80; i++) {
    const p = document.createElement('div');
    p.style.position = 'absolute';
    p.style.width = `${Math.random() * 8 + 4}px`;
    p.style.height = `${Math.random() * 15 + 5}px`;
    p.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    p.style.left = `${Math.random() * 100}vw`;
    p.style.top = `-20px`;
    p.style.borderRadius = '2px';
    p.style.transform = `rotate(${Math.random() * 360}deg)`;
    container.appendChild(p);

    const speed = Math.random() * 4 + 3;
    const delay = Math.random() * 1.5;
    p.animate([
      { transform: `translate(0, 0) rotate(0deg)`, opacity: 1 },
      { transform: `translate(${(Math.random() - 0.5) * 150}px, 105vh) rotate(${Math.random() * 540}deg)`, opacity: 0 }
    ], {
      duration: speed * 1000,
      delay: delay * 1000,
      easing: 'cubic-bezier(.1,.8,.9,.3)',
      fill: 'forwards'
    });
  }

  setTimeout(() => container.remove(), 6000);
};

let keyBuffer = '';
window.addEventListener('keydown', (e) => {
  keyBuffer += e.key.toLowerCase();
  if (keyBuffer.length > 20) keyBuffer = keyBuffer.slice(-20);
  if (keyBuffer.endsWith('karthik')) {
    triggerConfetti();
    keyBuffer = '';
  }
});

// Creates a seamless auto-scrolling skills reel that pauses on hover
(function () {
  const reel = document.getElementById('skillsReel');
  if (!reel || reducedMotion) return;

  const orig = reel.querySelectorAll('.skill-item');
  const count = orig.length;
  if (count < 2) return;

  orig.forEach(el => reel.appendChild(el.cloneNode(true)));

  const measure = () => {
    const first = reel.querySelector('.skill-item');
    if (!first) return 126;
    const gap = parseFloat(getComputedStyle(reel).gap) || 16;
    return first.getBoundingClientRect().width + gap;
  };

  let step = measure();
  let idx = 0;
  let running = true;
  let timer;

  const recalc = () => { step = measure(); };
  window.addEventListener('resize', recalc);

  const advance = () => {
    if (!running) return;
    idx++;
    const x = -idx * step;
    reel.style.transition = 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
    reel.style.transform = `translateX(${x}px)`;

    if (idx >= count) {
      clearTimeout(timer);
      timer = setTimeout(() => {
        reel.style.transition = 'none';
        reel.style.transform = 'translateX(0)';
        idx = 0;
      }, 600);
    }
  };

  let tick = setInterval(advance, 2200);

  reel.addEventListener('pointerenter', () => { running = false; });
  reel.addEventListener('pointerleave', () => { running = true; });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { running = false; }
    else { running = true; }
  });

  window.addEventListener('beforeunload', () => clearInterval(tick));
})();

// Shows a loading overlay on page load and fades it out once content is ready
(function () {
  var overlay = document.querySelector(".loading-overlay");
  if (!overlay) return;
  var done = false;

  function reveal() {
    if (done) return;
    done = true;
    var main = document.querySelector("main");
    if (main) main.classList.add("reveal");
    document.querySelectorAll(".section-hero").forEach(function (el) { el.classList.add("fade-in"); });
    overlay.classList.add("hide");
    setTimeout(function () { overlay.style.display = "none"; }, 800);
  }

  if (window.innerWidth > 800) {
    if (document.readyState === "complete") {
      setTimeout(reveal, 200);
    } else {
      window.addEventListener("load", function () { setTimeout(reveal, 200); });
    }
    setTimeout(reveal, 3000);
  } else {
    overlay.style.display = "none";
  }
})();

// Toggles the hamburger mobile menu open and closed
(function () {
  var hamburger = document.querySelector('.hamburger');
  var mobileNav = document.querySelector('.mobile-nav');
  if (!hamburger || !mobileNav) return;

  hamburger.addEventListener('click', function () {
    var open = mobileNav.classList.toggle('is-open');
    hamburger.classList.toggle('is-active', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });

  mobileNav.querySelectorAll('.mobile-nav-link').forEach(function (link) {
    link.addEventListener('click', function () {
      mobileNav.classList.remove('is-open');
      hamburger.classList.remove('is-active');
      document.body.style.overflow = '';
    });
  });
})();

// Animates the nav indicator on tab switch, then navigates
document.querySelectorAll(".nav-toggle").forEach(function (el) {
  el.addEventListener("click", function (e) {
    var goTo = this.getAttribute("href");
    var isCurrent = this.getAttribute("aria-selected") === "true";
    var pill = document.querySelector(".nav-indicator-pill");
    var glow = document.querySelector(".nav-indicator-glow");
    if (!pill || !glow) return;

    e.preventDefault();
    if (isCurrent) return;

    if (/(^|\/)index\.html$/.test(goTo)) {
      pill.classList.remove("info");
      glow.classList.add("info-pill-change");
    } else {
      pill.classList.add("info");
      glow.classList.add("info");
    }
    setTimeout(function () { window.location = goTo; }, 600);
  });
});
document.getElementById("footer-year").textContent = new Date().getFullYear();

// Preserves home-page scroll position when returning from a project page
(function () {
  var homeCards = document.querySelectorAll('.work-card[data-preview]');
  if (!homeCards.length) return;
  var key = 'portfolio-scroll';

  homeCards.forEach(function (card) {
    card.addEventListener('click', function () {
      sessionStorage.setItem(key, window.scrollY);
    });
  });

  var saved = sessionStorage.getItem(key);
  if (saved === null) return;
  sessionStorage.removeItem(key);

  var target = parseInt(saved, 10);
  if (isNaN(target) || target <= 0) return;

  var restore = function () {
    document.documentElement.style.scrollBehavior = 'auto';
    window.scrollTo(0, target);
    document.documentElement.style.scrollBehavior = '';
  };

  if (document.readyState === 'complete') {
    setTimeout(restore, 300);
  } else {
    window.addEventListener('load', function () { setTimeout(restore, 300); });
  }
})();
