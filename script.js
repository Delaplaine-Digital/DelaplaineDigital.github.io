document.addEventListener("DOMContentLoaded", () => {
  // If this page has no photo tiles, do nothing
  const hasPhotoTiles = document.querySelector("a.photo-tile");
  if (!hasPhotoTiles) return;

  // Create a reusable lightbox element once for pages that need it
  const lightbox = document.createElement("div");
  lightbox.className = "lightbox-backdrop";
  lightbox.innerHTML = `
    <img alt="Expanded image">
    <div class="lightbox-hint">Click anywhere or press Esc to close</div>
  `;
  document.body.appendChild(lightbox);

  const lightboxImg = lightbox.querySelector("img");

  // Open lightbox when a .photo-tile link is clicked
  document.addEventListener("click", (event) => {
    const link = event.target.closest("a.photo-tile");
    if (!link) return;

    event.preventDefault();
    const fullSrc = link.getAttribute("href");
    if (!fullSrc) return;

    lightboxImg.src = fullSrc;
    lightbox.classList.add("visible");
  });

  // Close when clicking anywhere on the overlay
  lightbox.addEventListener("click", () => {
    lightbox.classList.remove("visible");
    lightboxImg.src = "";
  });

  // Close with Escape key
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && lightbox.classList.contains("visible")) {
      lightbox.classList.remove("visible");
      lightboxImg.src = "";
    }
  });
});
