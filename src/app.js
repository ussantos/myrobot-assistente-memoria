const storageKey = "myrobot-memory-demo";
const chatKey = "myrobot-memory-chat";

const memoryForm = document.querySelector("#memoryForm");
const factsList = document.querySelector("#factsList");
const messages = document.querySelector("#messages");
const chatForm = document.querySelector("#chatForm");
const messageInput = document.querySelector("#messageInput");
const forgetButton = document.querySelector("#forgetButton");
const clearChatButton = document.querySelector("#clearChatButton");

const fields = {
  studentName: document.querySelector("#studentName"),
  interests: document.querySelector("#interests"),
  goal: document.querySelector("#goal"),
  tone: document.querySelector("#tone"),
};

let memory = load(storageKey, {
  studentName: "",
  interests: "",
  goal: "",
  tone: "explicativo",
});

let history = load(chatKey, []);

function load(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) || fallback;
  } catch {
    return fallback;
  }
}

function save(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function syncFields() {
  fields.studentName.value = memory.studentName;
  fields.interests.value = memory.interests;
  fields.goal.value = memory.goal;
  fields.tone.value = memory.tone;
}

function renderFacts() {
  const facts = [
    ["Nome", memory.studentName || "Nao informado"],
    ["Interesses", memory.interests || "Nao informado"],
    ["Objetivo", memory.goal || "Nao informado"],
    ["Tom", memory.tone],
  ];

  factsList.innerHTML = facts
    .map(([label, value]) => `<dt>${label}</dt><dd>${value}</dd>`)
    .join("");
}

function addMessage(role, text, shouldSave = true) {
  const item = document.createElement("article");
  item.className = `message ${role}`;
  item.innerHTML = `<small>${role === "user" ? "Aluno" : "Assistente"}</small><div>${text}</div>`;
  messages.appendChild(item);
  messages.scrollTop = messages.scrollHeight;

  if (shouldSave) {
    history.push({ role, text });
    save(chatKey, history);
  }
}

function renderHistory() {
  messages.innerHTML = "";
  if (!history.length) {
    addMessage(
      "bot",
      "Salve uma memoria no painel da esquerda e pergunte algo. Eu vou usar esses dados na resposta.",
      false
    );
    return;
  }
  history.forEach((entry) => addMessage(entry.role, entry.text, false));
}

function tonePrefix() {
  if (memory.tone === "direto") return "Resposta curta:";
  if (memory.tone === "criativo") return "Ideia criativa:";
  return "Explicando passo a passo:";
}

function buildAnswer(question) {
  const name = memory.studentName ? `${memory.studentName}, ` : "";
  const interests = memory.interests
    ? `Vou conectar com seus interesses em ${memory.interests}. `
    : "Ainda nao sei seus interesses, entao vou dar uma sugestao geral. ";
  const goal = memory.goal
    ? `Como seu objetivo e ${memory.goal}, `
    : "Como ainda nao tenho um objetivo salvo, ";

  return `${tonePrefix()} ${name}${interests}${goal}uma boa proxima acao e transformar "${question}" em uma tarefa pequena: escreva a entrada esperada, descreva a resposta ideal e teste com dois exemplos diferentes.`;
}

memoryForm.addEventListener("submit", (event) => {
  event.preventDefault();
  memory = {
    studentName: fields.studentName.value.trim(),
    interests: fields.interests.value.trim(),
    goal: fields.goal.value.trim(),
    tone: fields.tone.value,
  };
  save(storageKey, memory);
  renderFacts();
  addMessage("bot", "Memoria atualizada. Agora minhas respostas vao usar esse contexto.");
});

chatForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const question = messageInput.value.trim();
  if (!question) return;
  addMessage("user", question);
  addMessage("bot", buildAnswer(question));
  messageInput.value = "";
});

forgetButton.addEventListener("click", () => {
  memory = { studentName: "", interests: "", goal: "", tone: "explicativo" };
  save(storageKey, memory);
  syncFields();
  renderFacts();
  addMessage("bot", "Memoria apagada. A conversa continua, mas o contexto salvo foi removido.");
});

clearChatButton.addEventListener("click", () => {
  history = [];
  save(chatKey, history);
  renderHistory();
});

syncFields();
renderFacts();
renderHistory();
