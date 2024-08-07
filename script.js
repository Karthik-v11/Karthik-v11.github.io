const link = document.querySelectorAll(".hover-this");
const cursor = document.querySelector(".cursor-cover");

const animateit = function (e) {
  cursor.style.transform = "translate(-50%,-50%) scale(10)";
  const span = this.querySelector("span");
  const { offsetX: x, offsetY: y } = e,
    { offsetWidth: width, offsetHeight: height } = this,
    move = 25,
    xMove = (x / width) * (move * 2) - move,
    yMove = (y / height) * (move * 2) - move;

  span.style.transform = `translate(${xMove}px, ${yMove}px)`;

  if (e.type === "mouseleave") {
    (span.style.transform = ""), (cursor.style.transform = "");
  }
};

const editCursor = (e) => {
  const { clientX: x, clientY: y } = e;
  var a, b;

  a = x - 50;
  b = y - 50;

  cursor.style.left = a + "px";
  cursor.style.top = b + "px";
};

link.forEach((b) => b.addEventListener("mousemove", animateit));
link.forEach((b) => b.addEventListener("mouseleave", animateit));
window.addEventListener("mousemove", editCursor);
window.onmousemove = (e) => editCursor(e);

window.ontouchmove = (e) => editCursor(e.touches[0]);

document.addEventListener("mousemove", editCursor);

window.onload = () => {
  document.getElementsByClassName("loading-overlay")[0].style.display = "flex";
  setTimeout(showPage, 3000);
};

function showPage() {
  const elements = document.getElementsByClassName("locomotive-scroll");
  for (let i = 0; i < elements.length; i++) {
    elements[i].style.display = "block";
  }
  const loadingOverlay = document.getElementsByClassName("loading-overlay")[0];
  loadingOverlay.classList.add("hide");

  setTimeout(() => {
    loadingOverlay.style.display = "none";
  }, 800); // Match the duration of the CSS transition
}

const transitionElements = document.querySelectorAll(".up-slider");

var observer = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        entry.target.style.transitionDelay = `${index * 0.25}s`; // 0.4s delay for each element
        entry.target.classList.add("slide-up");
        observer.unobserve(entry.target);
      } else {
        entry.target.classList.remove("slide-up");
      }
    });
  },
  {
    threshold: 0.1,
  }
);

transitionElements.forEach((element) => {
  observer.observe(element);
});

const transition2Elements = document.querySelectorAll(".left-sliders");
var observer = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("slide-right");
        entry.target.addEventListener("animationend", function () {
          entry.target.classList.add("opacity-full");
        });
        observer.unobserve(entry.target);
      } else {
        entry.target.classList.remove("slide-right");
      }
    });
  },
  {
    threshold: 0.1,
  }
);

transition2Elements.forEach((element) => {
  observer.observe(element);
});

const transition3Elements = document.querySelectorAll(".right-sliders");
var observer = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("slide-left");
        entry.target.addEventListener("animationend", function () {
          entry.target.classList.add("opacity-full");
        });
        observer.unobserve(entry.target);
      } else {
        entry.target.classList.remove("slide-left");
      }
    });
  },
  {
    threshold: 0.1,
  }
);

transition3Elements.forEach((element) => {
  observer.observe(element);
});

document.getElementById("links-btn").addEventListener("click", () => {
  document.getElementsByClassName("links-overlay")[0].style.display = "flex";
  document
    .getElementsByClassName("links-overlay")[0]
    .classList.add("links-overlay-opacity");
  document.getElementById("links-btn").style.zIndex = -1;
});
document
  .getElementsByClassName("links-overlay")[0]
  .addEventListener("click", function () {
    const overlay = this;
    this.classList.remove("links-overlay-opacity");
    document.getElementById("links-btn").innerHTML = "Links";
    document.getElementById("links-btn").style.zIndex = 0;

    setTimeout(() => {
      overlay.style.display = "none";
    }, 700);
  });
