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
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `<b>${c.front}</b><p class="answer" style="display:none">${c.back}</p>`;
    div.addEventListener("click", () => div.querySelector(".answer").style.display = "block");
    area.appendChild(div);
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