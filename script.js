document.addEventListener("DOMContentLoaded", () => {
  document.body.classList.add("loaded");

  const header = document.querySelector(".site-header");
  const nav = document.getElementById("navMenu");
  const navToggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelectorAll(".nav-link");
  const backToTop = document.getElementById("backToTop");
  const terminalOutput = document.getElementById("terminal-output");
  const siteStatus = document.getElementById("site-status");

  let lastScrollY = window.scrollY;

  // Active nav link
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  navLinks.forEach(link => {
    const href = link.getAttribute("href");
    if (href === currentPage || (currentPage === "" && href === "index.html")) {
      link.classList.add("active");
    }
  });

  // Mobile nav toggle
  if (nav && navToggle) {
    if (window.innerWidth <= 860) {
      nav.classList.add("closed");
      navToggle.setAttribute("aria-expanded", "false");
    }

    navToggle.addEventListener("click", () => {
      const isClosed = nav.classList.toggle("closed");
      navToggle.setAttribute("aria-expanded", String(!isClosed));
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        nav.classList.add("closed");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });

    navLinks.forEach(link => {
      link.addEventListener("click", () => {
        if (window.innerWidth <= 860) {
          nav.classList.add("closed");
          navToggle.setAttribute("aria-expanded", "false");
        }
      });
    });
  }

  // Scroll behavior
  window.addEventListener("scroll", () => {
    const currentScrollY = window.scrollY;

    if (header) {
      header.classList.toggle("nav-scrolled", currentScrollY > 12);

      const scrollingDown = currentScrollY > lastScrollY;
      const farEnoughDown = currentScrollY > 120;

      if (scrollingDown && farEnoughDown) {
        header.classList.add("nav-hidden");
      } else {
        header.classList.remove("nav-hidden");
      }
    }

    if (backToTop) {
      backToTop.classList.toggle("show", currentScrollY > 400);
    }

    lastScrollY = currentScrollY;
  });

  // Back to top
  if (backToTop) {
    backToTop.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });
  }

  // Terminal intro
  if (terminalOutput) {
    const terminalText =
`> whoami
Eric Delaplaine - Cybersecurity / IT / Systems

> projects --list
- OPNsense Firewall & Segmentation
- Homelab NAS / NVR
- ESP32 Vehicle Telemetry
- Windows Troubleshooting
- 3D Printing Builds

> status
[ONLINE]`;

    let i = 0;
    const typeTerminal = () => {
      if (i < terminalText.length) {
        terminalOutput.textContent += terminalText.charAt(i);
        i += 1;
        setTimeout(typeTerminal, 18);
      }
    };
    typeTerminal();
  }

  // Project expanders
  document.querySelectorAll(".project").forEach(project => {
    project.addEventListener("click", (e) => {
      const clickedLink = e.target.closest("a, button");
      if (clickedLink) return;
      project.classList.toggle("open");
    });
  });

  // Photo tile lightbox
  const photoTileLinks = document.querySelectorAll("a.photo-tile");
  if (photoTileLinks.length > 0) {
    const lightbox = document.createElement("div");
    lightbox.className = "lightbox-backdrop";

    const lightboxImg = document.createElement("img");
    lightboxImg.alt = "Expanded image";

    const hint = document.createElement("div");
    hint.className = "lightbox-hint";
    hint.textContent = "Click anywhere or press Esc to close";

    lightbox.appendChild(lightboxImg);
    lightbox.appendChild(hint);
    document.body.appendChild(lightbox);

    document.addEventListener("click", (event) => {
      const link = event.target.closest("a.photo-tile");
      if (!link) return;

      event.preventDefault();
      const fullSrc = link.getAttribute("href");
      if (!fullSrc) return;

      lightboxImg.src = fullSrc;
      lightbox.classList.add("visible");
    });

    lightbox.addEventListener("click", () => {
      lightbox.classList.remove("visible");
      lightboxImg.src = "";
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && lightbox.classList.contains("visible")) {
        lightbox.classList.remove("visible");
        lightboxImg.src = "";
      }
    });
  }

  // Generic image lightbox
  const imageSelectors = ".gallery img, .photo-grid img, .project-image img, .lightbox-image";
  const images = document.querySelectorAll(imageSelectors);

  if (images.length > 0) {
    const lightbox = document.createElement("div");
    lightbox.className = "lightbox hidden";
    lightbox.setAttribute("role", "dialog");
    lightbox.setAttribute("aria-modal", "true");

    const lightboxImg = document.createElement("img");
    lightboxImg.alt = "";

    const closeBtn = document.createElement("button");
    closeBtn.className = "lightbox-close";
    closeBtn.setAttribute("aria-label", "Close image");
    closeBtn.textContent = "×";

    lightbox.appendChild(closeBtn);
    lightbox.appendChild(lightboxImg);
    document.body.appendChild(lightbox);

    const closeLightbox = () => {
      lightbox.classList.add("hidden");
      lightboxImg.src = "";
      lightboxImg.alt = "";
    };

    images.forEach(img => {
      img.style.cursor = "zoom-in";
      img.addEventListener("click", () => {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt || "";
        lightbox.classList.remove("hidden");
      });
    });

    closeBtn.addEventListener("click", closeLightbox);

    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        closeLightbox();
      }
    });
  }

  // Mouse glow
  document.addEventListener("mousemove", (e) => {
    document.documentElement.style.setProperty("--mouse-x", `${e.clientX}px`);
    document.documentElement.style.setProperty("--mouse-y", `${e.clientY}px`);
  });

  // Easter egg
  let typedKeys = "";
  document.addEventListener("keydown", (e) => {
    if (e.key.length === 1) {
      typedKeys += e.key.toLowerCase();
      typedKeys = typedKeys.slice(-20);
    }

    if (typedKeys.includes("delaplaine")) {
      if (siteStatus) {
        siteStatus.textContent = "System status: ADMIN MODE ENABLED";
      }
      typedKeys = "";
    }
  });

  // Status rotator
  if (siteStatus) {
    const statuses = [
      "System status: ONLINE",
      "Firewall: ACTIVE",
      "Homelab: OPERATIONAL",
      "NVR: RECORDING",
      "Pi-hole: FILTERING"
    ];

    let statusIndex = 0;
    setInterval(() => {
      statusIndex = (statusIndex + 1) % statuses.length;
      siteStatus.textContent = statuses[statusIndex];
    }, 4000);
  }
});