const fileInput = document.getElementById("fileInput");
const fileName = document.getElementById("fileName");
const button = document.querySelector("button");
const form = document.getElementById("uploadForm");

button.disabled = true;

fileInput.addEventListener("change", () => {
  if (fileInput.files.length > 0) {
    fileName.textContent = "📄 " + fileInput.files[0].name;
    button.disabled = false;
  }
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const file = fileInput.files[0];

  if (!file) return;

  button.textContent = "Parsing...";
  button.disabled = true;

  try {
    const formData = new FormData();
    formData.append("receipt", file);

    const res = await fetch("http://localhost:8000/api/parse-receipt", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    console.log("Server response:", data);

    alert(JSON.stringify(data, null, 2));
  } catch (err) {
    console.error(err);
    alert("Upload failed");
  } finally {
    button.textContent = "Upload";
    button.disabled = false;
  }
});