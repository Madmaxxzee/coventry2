// Load JSON and inject content

let downloadAfterSubmit = null;
const amenitiesDiv = document.getElementById("amenities");
const base = "media"; // Make sure this is correctly defined
fetch(`${base}/amenities.txt`)
  .then((res) => res.text())
  .then((text) => {
    const lines = text.split("\n");
    lines.forEach((line) => {
      const label = line.trim();
      if (label) {
        const filename = label + ".png";
        const col = document.createElement("div");
        col.className = "col-6 col-sm-4 col-md-3 col-lg-2 mb-4";

        col.innerHTML = `
          <div class="bg-white rounded shadow-sm p-3 h-100 d-flex flex-column align-items-center">
            <img src="${base}/common-icons/${filename}" alt="${label}" class="img-fluid mb-2" style="max-height: 60px;" />
            <p class="small text-muted mb-0">${label}</p>
          </div>`;
        
        amenitiesDiv.appendChild(col);
      }
    });
  });

  

document.querySelectorAll(".download-link").forEach((link) => {
  link.addEventListener("click", function (e) {
    e.preventDefault();
    downloadAfterSubmit = this;
    document.getElementById("enquire").scrollIntoView({ behavior: "smooth" });
  });
});
document.getElementById("heroSection").addEventListener("click", function () {
  // Show the modal
  const videoModal = new bootstrap.Modal(document.getElementById("videoModal"));
  videoModal.show();

  // Play the video inside the modal
  const modalVideo = document.getElementById("modalVideo");
  modalVideo.play();

  // Stop the hero video when the modal is shown
  const heroVideo = document.getElementById("heroVideo");
  heroVideo.pause();
});

// Listen for the modal being closed
document
  .getElementById("videoModal")
  .addEventListener("hidden.bs.modal", function () {
    // Play the hero video again when the modal is closed
    const heroVideo = document.getElementById("heroVideo");
    heroVideo.play();
  });

fetch("106.json")
  .then((res) => res.json())
  .then((data) => {
    document.getElementById("projectName").textContent = data.project_name;
    document.getElementById("projectTagline").textContent = data.tagline;
    // Gallery Images
    const inner = document.getElementById("carouselInner");
    const indicators = document.getElementById("carouselIndicators");

    data.gallery.forEach((img, index) => {
      // Create carousel item
      const item = document.createElement("div");
      item.className = `carousel-item${index === 0 ? " active" : ""}`;

      const image = document.createElement("img");
      image.src = `media/Gallery/${img}`;
      image.className = "d-block w-100";
      image.alt = `Slide ${index + 1}`;

      item.appendChild(image);
      inner.appendChild(item);

      // Create indicator (dot)
      const button = document.createElement("button");
      button.type = "button";
      button.setAttribute("data-bs-target", "#carouselGallery");
      button.setAttribute("data-bs-slide-to", index);
      if (index === 0) {
        button.className = "active";
        button.setAttribute("aria-current", "true");
      }
      button.setAttribute("aria-label", `Slide ${index + 1}`);
      indicators.appendChild(button);
    });
    // data.gallery.forEach(img => {
    //   const image = document.createElement("img");
    //   image.src = `media/Gallery/${img}`;
    //   gallery.appendChild(image);
    // });

    // Layout Images
    const layouts = document.getElementById("layoutsSection");
    data.layouts.forEach((img) => {
      const image = document.createElement("img");
      image.src = `media/layouts/${img}`;
      layouts.appendChild(image);
    });

    // Downloads
    document.getElementById("brochureLink").href = `${data.brochure}`;
    document.getElementById("factsheetLink").href = `${data.factsheet}`;
  });

// Form submission
const phoneInput = document.getElementById("phone");
const iti = intlTelInput(phoneInput, { initialCountry: "ae" });
const form = document.getElementById("contactForm");
const submitBtn = document.getElementById("submitBtn");
const spinner = document.getElementById("spinner");
const successMsg = document.getElementById("successMsg");
function validateForm() {
  let ok = true;
  ["name", "email", "phone"].forEach((id) => {
    const inp = document.getElementById(id);
    if (!inp.value.trim()) {
      inp.classList.add("is-invalid");
      ok = false;
    } else inp.classList.remove("is-invalid");
  });
  return ok;
}
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  // Disable button and show spinner
  submitBtn.disabled = true;
  spinner.style.display = "inline-block";
  if (!validateForm()) return scrollToForm();

  const payload = {
    name: document.getElementById("name").value.trim(),
    email: document.getElementById("email").value.trim(),
    phone: document.getElementById("phone").value.trim(),
    projectId: "106",
  };

  const res = await fetch("https://www.sprecrm.com/submit-lead", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (res.ok) {
    successMsg.style.display = "block";
    document.querySelectorAll(".download-link").forEach((link) => {});
    // Re-enable the button and hide the spinner
    submitBtn.disabled = false;
    spinner.style.display = "none";

    // Trigger the download if a link was clicked earlier
    if (downloadAfterSubmit) {
      const link = downloadAfterSubmit;
      const tempLink = document.createElement("a");
      tempLink.href = link.href;
      tempLink.download = ""; // Trigger download
      tempLink.click();
      downloadAfterSubmit = null;
    }
  } else {
    successMsg.style.display = "none";
  }
});
