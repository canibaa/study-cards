const WORKER_URL = "https://cool-term-10e1.zyablick211.workers.dev";

async function generate(mode) {
  const text = document.getElementById("input-text").value;
  const res = await fetch(WORKER_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, mode }),
  });
  const raw = await res.json();
  let content = (raw.text || "[]").replace(/```json|```/g, "").trim();

  try {
    const parsed = JSON.parse(content);
    mode === "cards" ? renderCards(parsed) : renderTest(parsed);
  } catch (e) {
    console.error("Не удалось распарсить ответ:", content);
  }
}

document.getElementById("generate-btn").addEventListener("click", () => generate("cards"));
document.getElementById("generate-test-btn").addEventListener("click", () => generate("test"));

function renderCards(cards) {
  const area = document.getElementById("card-area");
  area.innerHTML = "";
  cards.forEach(c => {
    const wrapper = document.createElement("div");
    wrapper.className = "flip-card";

    wrapper.innerHTML = `
      <div class="flip-card-inner">
        <div class="flip-card-front">${c.front}</div>
        <div class="flip-card-back">${c.back}</div>
      </div>
    `;

    wrapper.addEventListener("click", () => {
      wrapper.classList.toggle("flipped");
    });

    area.appendChild(wrapper);
  });
}

function renderTest(test) {
  const area = document.getElementById("card-area");
  area.innerHTML = "";
  test.forEach((q, i) => {
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `<p>${i + 1}. ${q.question}</p>`;
    q.options.forEach((opt, idx) => {
      const btn = document.createElement("button");
      btn.textContent = opt;
      btn.onclick = () => btn.style.background = idx === q.correctIndex ? "lightgreen" : "salmon";
      div.appendChild(btn);
    });
    area.appendChild(div);
  });
}