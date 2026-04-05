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
        nav.classList.add("closed");
        navToggle.setAttribute("aria-expanded", "false");
      } else {
        nav.classList.remove("closed");
        navToggle.setAttribute("aria-expanded", "true");
      }
    };

    setNavState();
    window.addEventListener("resize", setNavState);

    navToggle.addEventListener("click", () => {
      if (window.innerWidth <= 860) {
        const isClosed = nav.classList.toggle("closed");
        navToggle.setAttribute("aria-expanded", String(!isClosed));
      }
    });

    document.addEventListener("keydown", e => {
      if (e.key === "Escape" && window.innerWidth <= 860) {
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

    photoTiles.forEach(link => {
      link.addEventListener("click", e => {
        e.preventDefault();
        img.src = link.getAttribute("href");
        lightbox.classList.add("visible");
      });
    });

    lightbox.addEventListener("click", closePhotoLightbox);

    document.addEventListener("keydown", e => {
      if (e.key === "Escape") {
        closePhotoLightbox();
      }
    });
  }

  /* ---------------- SITE STATUS ---------------- */
  if (siteStatus) {
    siteStatus.textContent = "Online";
  }
});