const fileInput = document.getElementById("fileInput");
const fileName = document.getElementById("fileName");
const form = document.getElementById("uploadForm");

const resultCard = document.getElementById("resultCard");
const copyBtn = document.getElementById("copyBtn");

const button = form.querySelector("button"); // FIXED

let lastData = null;

button.disabled = true;

function buildReceiptText(data = {}) {
  const items = data.line_items || [];

  return `
Merchant: ${data.merchant || "-"}
Date: ${data.date || "-"}
Confidence: ${data.confidence || "-"}

Items:
${items.map(i => `- ${i.name}: ₹${i.amount}`).join("\n") || "-"}

Subtotal: ₹${data.subtotal ?? "-"}
Tax: ₹${data.tax ?? "-"}
Tip: ₹${data.tip ?? "-"}
Total: ₹${data.total ?? "-"}

Notes: ${data.notes ?? "-"}
`.trim();
}

function renderResult(data) {
  const textVersion = buildReceiptText(data);

  resultCard.innerHTML = `
    <div class="mb-3">
      <h5>${data.merchant || "-"}</h5>
      <small class="text-muted">
        ${data.date || "-"} • ${data.confidence || "-"}
      </small>
    </div>

    <hr/>

    <h6>📄 Copyable Text</h6>

    <textarea id="textOutput" class="form-control mb-3" rows="10" readonly>
${textVersion}
    </textarea>

    <button id="copyTextBtn" class="btn btn-dark w-100">
      Copy Text
    </button>
  `;

  const copyTextBtn = document.getElementById("copyTextBtn");

  copyTextBtn.addEventListener("click", async () => {
    const text = document.getElementById("textOutput").value;

    await navigator.clipboard.writeText(text);

    copyTextBtn.innerText = "Copied!";
    setTimeout(() => {
      copyTextBtn.innerText = "Copy Text";
    }, 1500);
  });
}


fileInput.addEventListener("change", () => {
  if (fileInput.files && fileInput.files.length > 0) {
    fileName.textContent = "📄 " + fileInput.files[0].name;
    button.disabled = false;
  }
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const file = fileInput.files?.[0];
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

    if (!res.ok) {
      throw new Error(data?.error || "Server error");
    }

    renderResult(data);

  } catch (err) {
    console.error(err);
    alert(err.message || "Upload failed");
  } finally {
    button.textContent = "Parse Receipt";
    button.disabled = false;
  }
});