const observerOptions = {
  threshold: 0.08,
  rootMargin: "0px 0px -40px 0px",
}

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

const slideFrom = (selector, direction) => {
  const elements = document.querySelectorAll(selector)
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const cls = direction === "left" ? "slide-right" : "slide-left"
        entry.target.classList.add(cls)
        const onEnd = () => {
          entry.target.classList.add("opacity-full")
          entry.target.removeEventListener("animationend", onEnd)
        }
        entry.target.addEventListener("animationend", onEnd)
        obs.unobserve(entry.target)
      }
    })
  }, observerOptions)
  elements.forEach((el) => observer.observe(el))
}

slideFrom(".left-sliders", "left")
slideFrom(".right-sliders", "right")

document.getElementById("links-btn").addEventListener("click", () => {
  document.getElementsByClassName("links-overlay")[0].style.display = "flex"
  document
    .getElementsByClassName("links-overlay")[0]
    .classList.add("links-overlay-opacity")
  document.getElementById("links-btn").style.zIndex = -1
})
document
  .getElementsByClassName("links-overlay")[0]
  .addEventListener("click", function () {
    const overlay = this
    this.classList.remove("links-overlay-opacity")
    document.getElementById("links-btn").innerHTML = "Links"
    document.getElementById("links-btn").style.zIndex = 0
    setTimeout(() => {
      overlay.style.display = "none"
    }, 700)
  })

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

const progressBar = document.querySelector(".scroll-progress span")
const updateScrollProgress = () => {
  if (!progressBar) return
  const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight
  progressBar.style.width = `${scrollableHeight > 0 ? (window.scrollY / scrollableHeight) * 100 : 0}%`
}
window.addEventListener("scroll", updateScrollProgress, { passive: true })
updateScrollProgress()

if (!reducedMotion) {
  document.querySelectorAll(".magnetic-button").forEach((button) => {
    button.addEventListener("pointermove", (event) => {
      const rect = button.getBoundingClientRect()
      button.style.transform = `translate(${(event.clientX - rect.left - rect.width / 2) * 0.16}px, ${(event.clientY - rect.top - rect.height / 2) * 0.16}px)`
    })
    button.addEventListener("pointerleave", () => { button.style.transform = "translate(0, 0)" })
  })
}

const counters = document.querySelectorAll("[data-counter]")
const countUp = (counter) => {
  const target = Number(counter.dataset.counter)
  const suffix = counter.dataset.suffix || ""
  const start = performance.now()
  const update = (now) => {
    const progress = Math.min((now - start) / 1100, 1)
    counter.textContent = `${Math.floor((1 - Math.pow(1 - progress, 3)) * target).toLocaleString()}${suffix}`
    if (progress < 1) requestAnimationFrame(update)
  }
  requestAnimationFrame(update)
}
if (counters.length && !reducedMotion) {
  const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) { countUp(entry.target); observer.unobserve(entry.target) }
    })
  }, { threshold: 0.5 })
  counters.forEach((counter) => { counter.textContent = `0${counter.dataset.suffix || ""}`; counterObserver.observe(counter) })
}

/* === Cursor Parallax Glow & Tilt (Hero Section) === */
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

        // Subtle 3D tilt/shift
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const rotateX = -(e.clientY - centerY) / (rect.height / 2) * 1.5; // max 1.5deg
        const rotateY = (e.clientX - centerX) / (rect.width / 2) * 1.5; // max 1.5deg
        windowMain.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      });
    });

    windowMain.addEventListener('mouseleave', () => {
      if (frameId) cancelAnimationFrame(frameId);
      windowMain.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg)';
    });
  }
}

/* === Smooth Rotating Tagline (Cross-fade) === */
const phrases = [
  "build digital products.",
  "craft Digital Experiences.",
  "build Real-Time Systems.",
  "ship Mobile Apps.",
  "create WebVR Experiences."
];
const textEl = document.getElementById("rotating-text");
if (textEl) {
  let phraseIdx = 0;
  setInterval(() => {
    textEl.classList.add("fade-out");
    setTimeout(() => {
      phraseIdx = (phraseIdx + 1) % phrases.length;
      textEl.textContent = phrases[phraseIdx];
      textEl.classList.remove("fade-out");
    }, 450); // matches CSS transition
  }, 4000);
}

/* === Optimized Three.js Particle Background in Hero === */
if (typeof THREE !== 'undefined') {
  const canvas = document.getElementById('hero-canvas');
  if (canvas) {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
    const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: false, powerPreference: "low-power" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

    // Particle field geometry
    const count = 100; // Reduced count for higher performance
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 12; // X
      positions[i + 1] = (Math.random() - 0.5) * 12; // Y
      positions[i + 2] = (Math.random() - 0.5) * 8 - 4; // Z
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      size: 0.04,
      color: 0xffffff,
      transparent: true,
      opacity: 0.4,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);
    camera.position.z = 4;

    const handleResize = () => {
      const w = canvas.parentElement.clientWidth;
      const h = canvas.parentElement.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    };
    window.addEventListener('resize', handleResize);
    handleResize();

    let animationFrameId = null;
    let isCanvasVisible = true;

    const animateParticles = () => {
      if (!isCanvasVisible) return;
      animationFrameId = requestAnimationFrame(animateParticles);
      points.rotation.y += 0.0004;
      points.rotation.x += 0.0002;
      renderer.render(scene, camera);
    };

    // Use IntersectionObserver to stop rendering when canvas is out of view
    const canvasObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        isCanvasVisible = entry.isIntersecting;
        if (isCanvasVisible) {
          cancelAnimationFrame(animationFrameId);
          animateParticles();
        } else {
          cancelAnimationFrame(animationFrameId);
        }
      });
    }, { threshold: 0.05 });
    canvasObserver.observe(canvas);
  }
}

/* === Throttled Interactive Skill Cards Tilt === */
if (!reducedMotion) {
  document.querySelectorAll('.skill-card').forEach(card => {
    let frameId = null;
    card.addEventListener('pointermove', (e) => {
      if (frameId) cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(() => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const rotateX = -(e.clientY - centerY) / (rect.height / 2) * 8; // max 8deg
        const rotateY = (e.clientX - centerX) / (rect.width / 2) * 8; // max 8deg
        card.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px) scale(1.04)`;
        card.style.boxShadow = `0 12px 36px rgba(255, 255, 255, 0.08)`;
      });
    });
    
    card.addEventListener('pointerleave', () => {
      if (frameId) cancelAnimationFrame(frameId);
      card.style.transform = '';
      card.style.boxShadow = '';
    });
  });
}

/* === Easter Egg ("KARTHIK" confetti) === */
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
