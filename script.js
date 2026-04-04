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

  /* ---------------- NAV ACTIVE LINK ---------------- */
  const currentPage = window.location.pathname.split("/").pop() || "index.html";

  navLinks.forEach(link => {
    const href = link.getAttribute("href");
    if (href === currentPage || (currentPage === "" && href === "index.html")) {
      link.classList.add("active");
    }
  });

  /* ---------------- MOBILE NAV ---------------- */
  if (nav && navToggle) {

    const setNavState = () => {
      if (window.innerWidth <= 860) {
        nav.classList.add("closed");
        navToggle.setAttribute("aria-expanded", "false");
      } else {
        nav.classList.remove("closed");
        navToggle.setAttribute("aria-expanded", "true");
      }
    };

    // Run on load + resize
    setNavState();
    window.addEventListener("resize", setNavState);

    navToggle.addEventListener("click", () => {
      const isClosed = nav.classList.toggle("closed");
      navToggle.setAttribute("aria-expanded", String(!isClosed));
    });

    // Close on ESC
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        nav.classList.add("closed");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });

    // Close when clicking a link (mobile only)
    navLinks.forEach(link => {
      link.addEventListener("click", () => {
        if (window.innerWidth <= 860) {
          nav.classList.add("closed");
          navToggle.setAttribute("aria-expanded", "false");
        }
      });
    });
  }

  /* ---------------- SCROLL BEHAVIOR ---------------- */
  window.addEventListener("scroll", () => {
    const currentScrollY = window.scrollY;

    if (header) {
      header.classList.toggle("nav-scrolled", currentScrollY > 12);

      const scrollingDown = currentScrollY > lastScrollY;
      const farEnoughDown = currentScrollY > 120;

      header.classList.toggle("nav-hidden", scrollingDown && farEnoughDown);
    }

    if (backToTop) {
      backToTop.classList.toggle("show", currentScrollY > 400);
    }

    lastScrollY = currentScrollY;
  });

  /* ---------------- BACK TO TOP ---------------- */
  if (backToTop) {
    backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ---------------- TERMINAL EFFECT ---------------- */
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
        i++;
        setTimeout(typeTerminal, 18);
      }
    };

    typeTerminal();
  }

  /* ---------------- PROJECT EXPANDERS ---------------- */
  document.querySelectorAll(".project").forEach(project => {
    project.addEventListener("click", (e) => {
      if (e.target.closest("a, button")) return;
      project.classList.toggle("open");
    });
  });

  /* ---------------- LIGHTBOX (PHOTO TILE) ---------------- */
  const photoTiles = document.querySelectorAll("a.photo-tile");

  if (photoTiles.length > 0) {
    const lightbox = document.createElement("div");
    lightbox.className = "lightbox-backdrop";

    const img = document.createElement("img");
    const hint = document.createElement("div");

    hint.className = "lightbox-hint";
    hint.textContent = "Click anywhere or press Esc to close";

    lightbox.appendChild(img);
    lightbox.appendChild(hint);
    document.body.appendChild(lightbox);

    document.addEventListener("click", (e) => {
      const link = e.target.closest("a.photo-tile");
      if (!link) return;

      e.preventDefault();
      const src = link.getAttribute("href");
      if (!src) return;

      img.src = src;
      lightbox.classList.add("visible");
    });

    const close = () => {
      lightbox.classList.remove("visible");
      img.src = "";
    };

    lightbox.addEventListener("click", close);

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") close();
    });
  }

  /* ---------------- GENERIC IMAGE LIGHTBOX ---------------- */
  const images = document.querySelectorAll(
    ".gallery img, .photo-grid img, .project-image img, .lightbox-image"
  );

  if (images.length > 0) {
    const lightbox = document.createElement("div");
    lightbox.className = "lightbox hidden";

    const img = document.createElement("img");
    const closeBtn = document.createElement("button");

    closeBtn.className = "lightbox-close";
    closeBtn.textContent = "×";

    lightbox.appendChild(closeBtn);
    lightbox.appendChild(img);
    document.body.appendChild(lightbox);

    const close = () => {
      lightbox.classList.add("hidden");
      img.src = "";
    };

    images.forEach(el => {
      el.style.cursor = "zoom-in";
      el.addEventListener("click", () => {
        img.src = el.src;
        img.alt = el.alt || "";
        lightbox.classList.remove("hidden");
      });
    });

    closeBtn.addEventListener("click", close);

    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) close();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") close();
    });
  }

  /* ---------------- MOUSE GLOW ---------------- */
  document.addEventListener("mousemove", (e) => {
    document.documentElement.style.setProperty("--mouse-x", `${e.clientX}px`);
    document.documentElement.style.setProperty("--mouse-y", `${e.clientY}px`);
  });

  /* ---------------- EASTER EGG ---------------- */
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

  /* ---------------- STATUS ROTATOR ---------------- */
  if (siteStatus) {
    const statuses = [
      "System status: ONLINE",
      "Firewall: ACTIVE",
      "Homelab: OPERATIONAL",
      "NVR: RECORDING",
      "Pi-hole: FILTERING"
    ];

    let index = 0;

    setInterval(() => {
      index = (index + 1) % statuses.length;
      siteStatus.textContent = statuses[index];
    }, 4000);
  }

});