// Load JSON and inject content
fetch("106.json")
  .then(res => res.json())
  .then(data => {
    document.getElementById("projectName").textContent = data.project_name;
    document.getElementById("projectTagline").textContent = data.tagline;

    // Gallery Images
    const gallery = document.getElementById("gallerySection");
    data.gallery.forEach(img => {
      const image = document.createElement("img");
      image.src = `media/Gallery/${img}`;
      gallery.appendChild(image);
    });

    // Layout Images
    const layouts = document.getElementById("layoutsSection");
    data.layouts.forEach(img => {
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
function validateForm() {
  let ok = true;
  ["name","email","phone"].forEach(id => {
    const inp = document.getElementById(id);
    if (!inp.value.trim()) { inp.classList.add("is-invalid"); ok = false; }
    else inp.classList.remove("is-invalid");
  });
  return ok;
}
form.addEventListener("submit", async e => {
  e.preventDefault();
  if (!validateForm()) return scrollToForm();

  const payload = {
    name: document.getElementById("name").value.trim(),
    email: document.getElementById("email").value.trim(),
    phone:  document.getElementById("phone").value.trim(),
    projectId:"106"
  };

  const res = await fetch("https://www.sprecrm.com/submit-lead", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (res.ok) successMsg.style.display = "block";
});




