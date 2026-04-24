# Receipt Parser AI

## What did you build?

    I built a full-stack web application that accepts receipt images (PNG, JPG, JPEG), sends them to a Node.js backend, and uses Google's Gemini 2.5 Flash multimodal model to extract structured receipt data such as merchant name, purchase date, line items, subtotal, tax, tip, and total. The parsed result is displayed immediately in the browser, can be copied as plain text, and is also persisted locally in a JSON file. The frontend is built with HTML, CSS, JavaScript, and Bootstrap, while the backend uses Express, TypeScript, and Multer.



## What are the biggest tradeoffs you made, and why?

### 1. Gemini Vision instead of OCR + LLM

    I chose Gemini's native multimodal capabilities rather than building a separate OCR pipeline. This significantly reduced system complexity, lowered latency, and improved developer velocity. The tradeoff is stronger dependence on a single external provider.

### 2. JSON File Storage instead of a Database

    I stored parsed receipts in a local JSON file to keep the implementation lightweight and focused on the core problem. This is simple and sufficient for a take-home project, though it would not scale well under concurrent writes or large datasets.

### 3. Adapter Pattern for LLM Providers

    Even though Gemini is the only active provider, I implemented an adapter-based architecture. This adds a small amount of upfront complexity, but it makes future migration to OpenAI, Claude, Groq, or an internal model straightforward.

---

## Where did you use an LLM, and for what?

    I used Google Gemini 2.5 Flash as the core parsing engine. It receives the uploaded receipt image directly and returns structured JSON. I wrote the prompt, API integration, schema validation, and provider abstraction myself. I also used ChatGPT during development for brainstorming prompt improvements, refining UI copy, and validating edge cases, but all application logic, architecture, and implementation were written manually.



## What would you do with another week?

    - Add an editable review screen so users can correct extracted fields before saving.
    - Replace JSON file storage with PostgreSQL or MongoDB.
    - Implement automated validation checks for totals and line-item sums.
    - Add provider fallback (OpenAI / Claude) when Gemini is unavailable or rate-limited.
    - Improve support for low-quality, rotated, or partially visible receipts.
    - Add automated tests for API routes, provider adapters, and parsing logic.



## What's one thing in this spec you'd push back on if I were your PM?

    1. I would question the requirement to rely entirely on an LLM for receipt extraction at scale. While LLMs are excellent for rapid prototyping and handling messy layouts, they introduce cost, latency, and non-determinism. For a high-volume production system, I would likely combine deterministic OCR and rule-based extraction with an LLM only as a fallback for ambiguous cases. That hybrid approach would be more reliable, cheaper, and easier to operate at scale.

    2. I would question the assumption that relying on a third-party LLM indefinitely is the right long-term strategy. External LLM APIs are excellent for rapid prototyping and early-stage development, but they introduce vendor lock-in, unpredictable pricing, rate limits, and limited control over performance. As usage scales, inference costs can become a significant part of the business model. For a production system, I would want a clear roadmap toward either a fine-tuned open-source model or an in-house specialized model for receipt parsing. Owning the core intelligence would provide better cost control, improved consistency, and greater strategic flexibility over time.