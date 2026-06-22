class Cursor {
  DEFAULT_SIZE = 36
  LERP = 0.15

  constructor() {
    this.el = document.querySelector(".cursor")
    this.trail = document.querySelector(".cursor-trail")
    this.current = { x: -9999, y: -9999 }
    this.target = { x: -9999, y: -9999 }
    this.isLocked = false
    this.isTouch = false
    this.lockedEl = null
    this.rect = null
    this._boundRaf = this.raf.bind(this)


    document.addEventListener("mousemove", this.onMove.bind(this))
    document.addEventListener("scroll", this.onScroll.bind(this))
    document.addEventListener("touchstart", this.onTouch.bind(this))

    this.bindTextNodes()
    this.bindInteractive()

 this._boundRaf()
  }

  raf() {
    this.current.x += (this.target.x - this.current.x) * this.LERP
    this.current.y += (this.target.y - this.current.y) * this.LERP
    if (!this.isLocked && !this.isTouch) {
      this.el.style.left = this.current.x + "px"
      this.el.style.top = this.current.y + "px"
      if (this.trail) {
        this.trail.style.left = this.current.x + "px"
        this.trail.style.top = this.current.y + "px"
      }
    }
  requestAnimationFrame(this._boundRaf)

  }

  onMove(e) {
    this.target.x = e.clientX
    this.target.y = e.clientY
    if (this.isLocked && this.lockedEl && this.rect) {
      this.moveLocked(e.clientX, e.clientY)
    }
  }

  onScroll() {
    if (this.isLocked && this.lockedEl && this.rect) {
      this.rect = this.lockedEl.getBoundingClientRect()
      const cx = this.target.x
      const cy = this.target.y
      if (
        cx < this.rect.left || cx > this.rect.right ||
        cy < this.rect.top || cy > this.rect.bottom
      ) {
        this.unlock(this.lockedEl)
        return
      }
      this.el.style.left = this.rect.left + this.rect.width / 2 + "px"
      this.el.style.top = this.rect.top + this.rect.height / 2 + "px"
      this.moveLocked(cx, cy)
    }
  }

  moveLocked(cx, cy) {
    if (!this.rect) return
    const halfW = this.rect.width / 2
    const halfH = this.rect.height / 2
    const lx = (cx - this.rect.left - halfW) / halfW
    const ly = (cy - this.rect.top - halfH) / halfH
    this.el.style.transform = `translate(calc(-50% + ${lx * 8}px), calc(-50% + ${ly * 8}px))`
    this.lockedEl.style.transform = `translate(${lx * 6}px, ${ly * 6}px)`
  }

  unlock(el) {
    this.isLocked = false
    this.lockedEl = null
    this.rect = null
    this.el.classList.remove("is-locked")
    this.el.classList.remove("cursor--text")
    this.el.style.borderRadius = "50%"
    this.el.style.transform = "translate(-50%, -50%)"
    this.resetSize()
    el.style.backgroundColor = ""
    if (el._origTransition !== undefined) {
      el.style.transition = el._origTransition
      delete el._origTransition
    }
    if (el.style.transform) el.style.transform = ""
    if (this.trail) {
      this.trail.style.opacity = "1"
      this.trail.style.left = this.target.x + "px"
      this.trail.style.top = this.target.y + "px"
    }
  }

  onTouch() {
    this.isTouch = true
    this.el.style.display = "none"
    if (this.trail) this.trail.style.display = "none"
  }

  bindTextNodes() {
    const nodes = document.querySelectorAll("h1, h2, h3, h4, h5, h6, p, dd, dt, figcaption, blockquote, .text-hero-serif, .text-projectcard-title, .text-projectpage-heading, .text-projectpage-body")
    nodes.forEach(el => {
      el.addEventListener("mouseenter", () => {
        if (this.isTouch || this.isLocked) return
        const fs = parseFloat(getComputedStyle(el).fontSize) || 16
        this.el.style.height = fs * 1.4 + "px"
        this.el.style.width = fs * 1.4 + "px"
        this.el.classList.add("cursor--text")
      }, { passive: true })
      el.addEventListener("mouseleave", () => {
        if (this.isTouch || this.isLocked) return
        this.resetSize()
        this.el.classList.remove("cursor--text")
      }, { passive: true })
    })
  }

  bindInteractive() {
    const targets = document.querySelectorAll(
      ".project-card-outline, .project-card, a, button, .skill-card, .experience-card, .link-pill, .nav-toggle, .resume-btn, .nav-resume-btn, .hero-cta-btn, .contact-icons, .hover-this, .chip-socials"
    )
    targets.forEach(el => {
      el.addEventListener("mouseenter", () => {
        if (this.isTouch) return
        this.isLocked = true
        this.lockedEl = el
        this.rect = el.getBoundingClientRect()
        this.el.classList.add("is-locked")
        this.el.style.width = this.rect.width + "px"
        this.el.style.height = this.rect.height + "px"
        const br = getComputedStyle(el).borderRadius || "12px"
        this.el.style.borderRadius = br
        this.el.style.left = this.rect.left + this.rect.width / 2 + "px"
        this.el.style.top = this.rect.top + this.rect.height / 2 + "px"
        this.el.style.transform = "translate(-50%, -50%)"
        if (!el.classList.contains("project-card")) el.style.backgroundColor = "#292929"
        el._origTransition = el.style.transition
        el.style.transition = "transform 0s"
        if (this.trail) this.trail.style.opacity = "0"
      })
      el.addEventListener("mouseleave", () => {
        if (this.isTouch) return
        this.unlock(el)
      })
    })
  }

  resetSize() {
    this.el.style.width = this.DEFAULT_SIZE + "px"
    this.el.style.height = this.DEFAULT_SIZE + "px"
  }
}

const cursor = new Cursor()

window.onload = () => {
  if (!detectMob()) {
    setTimeout(showPage, 600)
  }
}

function detectMob() {
  return window.innerWidth <= 800
}

function showPage() {
  const scroll = document.querySelector(".locomotive-scroll")
  const loadingOverlay = document.querySelector(".loading-overlay")
  if (scroll) scroll.classList.add("reveal")
  if (loadingOverlay) {
    loadingOverlay.classList.add("hide")
    setTimeout(() => {
      loadingOverlay.style.display = "none"
    }, 800)
  }
}

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