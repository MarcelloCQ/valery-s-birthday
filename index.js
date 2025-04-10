document.addEventListener("DOMContentLoaded", function () {
  // Elements
  const music = document.getElementById("bgMusic");
  const musicToggle = document.getElementById("musicToggle");
  const sections = document.querySelectorAll(".timeline-section");
  const dots = document.querySelectorAll(".dot");
  const celebrateBtn = document.getElementById("celebrateBtn");
  const confettiContainer = document.querySelector(".confetti-container");

  // Configuración inicial de la música
  music.volume = 0.3; // Volumen bajo
  let isAutoPlayAttempted = false;

  // Función para intentar autoplay
  function attemptAutoPlay() {
    if (isAutoPlayAttempted) return;

    const playPromise = music.play();

    if (playPromise !== undefined) {
      playPromise
        .then((_) => {
          musicToggle.classList.remove("muted");
        })
        .catch((error) => {
          musicToggle.classList.add("muted");
        });
    }
    isAutoPlayAttempted = true;
  }

  document.body.addEventListener(
    "click",
    function firstInteraction() {
      attemptAutoPlay();
      document.body.removeEventListener("click", firstInteraction);
    },
    { once: true }
  );

  // Initialize
  updateActiveSection();

  // Scroll event to update active section
  window.addEventListener("scroll", function () {
    updateActiveSection();
  });

  // Control del botón
  musicToggle.addEventListener("click", function () {
    if (music.paused) {
      music.play();
      this.classList.remove("muted");
    } else {
      music.pause();
      this.classList.add("muted");
    }
  });

  // Click event for dots
  dots.forEach((dot) => {
    dot.addEventListener("click", function () {
      const sectionId = this.getAttribute("data-section");
      document.getElementById(sectionId).scrollIntoView({ behavior: "smooth" });
    });
  });

  // Celebrate button click event
  celebrateBtn.addEventListener("click", function () {
    createConfetti();
    this.disabled = true;
    this.textContent = "🎉 Hooray! 🎉";

    if (music.paused) {
      music.play();
      musicToggle.classList.remove("muted");
    }

    // music.volume = 0.7;

    setTimeout(() => {
      this.disabled = false;
      this.textContent = "Celebrate Again!";
      music.volume = 0.3;
    }, 3000);
  });

  // Function to update active section based on scroll position
  function updateActiveSection() {
    const scrollPosition = window.scrollY;

    sections.forEach((section, index) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;

      if (
        scrollPosition >= sectionTop - sectionHeight / 3 &&
        scrollPosition < sectionTop + sectionHeight - sectionHeight / 3
      ) {
        // Update active class on sections
        sections.forEach((s) => s.classList.remove("active"));
        section.classList.add("active");

        // Update active class on dots
        dots.forEach((d) => d.classList.remove("active"));
        dots[index].classList.add("active");
      }
    });
  }

  // Function to create confetti
  function createConfetti() {
    confettiContainer.innerHTML = "";
    const colors = ["#ffb6d9", "#ff8ac5", "#ffecb3", "#ffdbeb", "#fff8e1"];

    for (let i = 0; i < 100; i++) {
      const confetti = document.createElement("div");
      confetti.className = "confetti";

      // Random properties
      const size = Math.random() * 10 + 5;
      const color = colors[Math.floor(Math.random() * colors.length)];
      const left = Math.random() * 100;
      const duration = Math.random() * 3 + 2;
      const delay = Math.random() * 2;

      // Apply styles
      confetti.style.width = `${size}px`;
      confetti.style.height = `${size}px`;
      confetti.style.background = color;
      confetti.style.left = `${left}%`;
      confetti.style.top = "-50px";
      confetti.style.position = "absolute";
      confetti.style.borderRadius = Math.random() > 0.5 ? "50%" : "0";
      confetti.style.opacity = Math.random() + 0.5;
      confetti.style.animation = `fall ${duration}s ease-in forwards ${delay}s`;

      confettiContainer.appendChild(confetti);
    }

    // Add keyframes for confetti animation
    if (!document.querySelector("#confetti-animation")) {
      const style = document.createElement("style");
      style.id = "confetti-animation";
      style.textContent = `
              @keyframes fall {
                  0% {
                      transform: translateY(0) rotate(0deg);
                      opacity: 1;
                  }
                  100% {
                      transform: translateY(${window.innerHeight}px) rotate(360deg);
                      opacity: 0;
                  }
              }
          `;
      document.head.appendChild(style);
    }
  }
});
