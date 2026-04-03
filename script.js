document.addEventListener("DOMContentLoaded", () => {
  document.body.classList.add("loaded");

  const header = document.querySelector(".site-header");
  const nav = document.getElementById("navMenu");
  const navToggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelectorAll(".nav-link");
  const backToTop = document.getElementById("backToTop");
  const terminalOutput = document.getElementById("terminal-output");
  const siteStatus = document.getElementById("site-status");

  // photo tile lightbox only if photo tiles exist
  const hasPhotoTiles = document.querySelector("a.photo-tile");
  if (hasPhotoTiles) {
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

  // rest of your nav / terminal / back-to-top / etc goes here
});