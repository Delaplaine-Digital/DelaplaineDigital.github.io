document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const header = document.querySelector(".site-header");
  const nav = document.getElementById("navMenu");
  const navToggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelectorAll(".nav-link");
  const backToTop = document.getElementById("backToTop");
  const siteStatus = document.getElementById("site-status");
  const yearEl = document.getElementById("year");

  let lastScrollY = window.scrollY;
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  const isLubeLoggerPage = currentPage.toLowerCase() === "lubelogger.html";

  /* ---------------- YEAR ---------------- */
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  /* ---------------- ACTIVE NAV LINK ---------------- */
  navLinks.forEach(link => {
    const href = link.getAttribute("href");
    if (href === currentPage || (currentPage === "index.html" && href === "index.html")) {
      link.classList.add("active");
    }
  });

  /* ---------------- MOBILE NAV ---------------- */
  if (nav && navToggle) {
    const setNavState = () => {
      const isMobile = window.innerWidth <= 860;

      if (isMobile) {
        if (isLubeLoggerPage) {
          nav.classList.remove("closed");
          navToggle.setAttribute("aria-expanded", "true");
        } else {
          nav.classList.add("closed");
          navToggle.setAttribute("aria-expanded", "false");
        }
      } else {
        nav.classList.remove("closed");
        navToggle.setAttribute("aria-expanded", "true");
      }
    };

    setNavState();
    window.addEventListener("resize", setNavState);

    navToggle.addEventListener("click", () => {
      if (window.innerWidth <= 860 && isLubeLoggerPage) {
        return;
      }

      const isClosed = nav.classList.toggle("closed");
      navToggle.setAttribute("aria-expanded", String(!isClosed));
    });

    document.addEventListener("keydown", e => {
      if (e.key === "Escape" && window.innerWidth <= 860 && !isLubeLoggerPage) {
        nav.classList.add("closed");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });

    navLinks.forEach(link => {
      link.addEventListener("click", () => {
        if (window.innerWidth <= 860 && !isLubeLoggerPage) {
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
      backToTop.classList.toggle("show", currentScrollY > 150);
    }

    lastScrollY = currentScrollY;
  });

  /* ---------------- BACK TO TOP ---------------- */
  if (backToTop) {
    backToTop.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });
  }

  /* ---------------- PROJECT EXPANDERS ---------------- */
  document.querySelectorAll(".project").forEach(project => {
    project.addEventListener("click", e => {
      if (e.target.closest("a, button")) return;
      project.classList.toggle("open");
    });
  });

  /* ---------------- PHOTO TILE LIGHTBOX ---------------- */
  const photoTiles = document.querySelectorAll("a.photo-tile");

  if (photoTiles.length > 0) {
    const lightbox = document.createElement("div");
    lightbox.className = "lightbox-backdrop";

    const img = document.createElement("img");
    img.alt = "Expanded image";

    const hint = document.createElement("div");
    hint.className = "lightbox-hint";
    hint.textContent = "Click anywhere or press Esc to close";

    lightbox.appendChild(img);
    lightbox.appendChild(hint);
    body.appendChild(lightbox);

    const closePhotoLightbox = () => {
      lightbox.classList.remove("visible");
      img.src = "";
    };

    document.addEventListener("click", e => {
      const link = e.target.closest("a.photo-tile");
      if (!link) return;

      e.preventDefault();
      const src = link.getAttribute("href");
      if (!src) return;

      img.src = src;
      lightbox.classList.add("visible");
    });

    lightbox.addEventListener("click", closePhotoLightbox);

    document.addEventListener("keydown", e => {
      if (e.key === "Escape" && lightbox.classList.contains("visible")) {
        closePhotoLightbox();
      }
    });
  }

  /* ---------------- GENERIC IMAGE LIGHTBOX ---------------- */
  const images = document.querySelectorAll(
    ".gallery img, .project-image img, .lightbox-image, .content-image img, .screenshot img"
  );

  if (images.length > 0) {
    const lightbox = document.createElement("div");
    lightbox.className = "lightbox hidden";
    lightbox.setAttribute("role", "dialog");
    lightbox.setAttribute("aria-modal", "true");

    const img = document.createElement("img");
    img.alt = "";

    const closeBtn = document.createElement("button");
    closeBtn.className = "lightbox-close";
    closeBtn.setAttribute("aria-label", "Close image");
    closeBtn.textContent = "×";

    lightbox.appendChild(closeBtn);
    lightbox.appendChild(img);
    body.appendChild(lightbox);

    const closeGenericLightbox = () => {
      lightbox.classList.add("hidden");
      img.src = "";
      img.alt = "";
    };

    images.forEach(el => {
      el.style.cursor = "zoom-in";
      el.addEventListener("click", () => {
        img.src = el.src;
        img.alt = el.alt || "";
        lightbox.classList.remove("hidden");
      });
    });

    closeBtn.addEventListener("click", closeGenericLightbox);

    lightbox.addEventListener("click", e => {
      if (e.target === lightbox) {
        closeGenericLightbox();
      }
    });

    document.addEventListener("keydown", e => {
      if (e.key === "Escape" && !lightbox.classList.contains("hidden")) {
        closeGenericLightbox();
      }
    });
  }

  /* ---------------- MOUSE GLOW ---------------- */
  document.addEventListener("mousemove", e => {
    document.documentElement.style.setProperty("--mouse-x", `${e.clientX}px`);
    document.documentElement.style.setProperty("--mouse-y", `${e.clientY}px`);
  });

  /* ---------------- EASTER EGG ---------------- */
  let typedKeys = "";

  document.addEventListener("keydown", e => {
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