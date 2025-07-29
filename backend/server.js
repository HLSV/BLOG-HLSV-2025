const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const POSTS_FILE = path.join(__dirname, "posts.txt");
const BOLETIM_FILE = path.join(__dirname, "boletim.txt");
const SESSIONS_FILE = path.join(__dirname, "sessions.txt");

function readJSON(file) {
  if (!fs.existsSync(file)) return [];
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return [];
  }
}

function writeJSON(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

// 📌 Rota para buscar posts
app.get("/api/posts", (req, res) => {
  const posts = readJSON(POSTS_FILE);
  res.json(posts);
});

// 📌 Rota para adicionar novo post
app.post("/api/posts", (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: "Título e conteúdo são obrigatórios" });
  }

  const posts = readJSON(POSTS_FILE);
  const newPost = { id: Date.now(), title, content };
  posts.push(newPost);
  writeJSON(POSTS_FILE, posts);

  res.json({ success: true, post: newPost });
});

// 📌 Rota para buscar boletim
app.get("/api/boletim", (req, res) => {
  if (!fs.existsSync(BOLETIM_FILE)) return res.json({ boletim: "" });
  const boletim = fs.readFileSync(BOLETIM_FILE, "utf8");
  res.json({ boletim });
});

// 📌 Rota para atualizar boletim
app.post("/api/boletim", (req, res) => {
  const { boletim } = req.body;
  fs.writeFileSync(BOLETIM_FILE, boletim || "");
  res.json({ success: true });
});

// 📌 Rota para gerenciar sessões (usuários online)
app.post("/api/sessions", (req, res) => {
  const { sessionId } = req.body;
  if (!sessionId) return res.json({ online: 0 });

  let sessions = readJSON(SESSIONS_FILE);
  const now = Date.now();

  // Remove sessões inativas (+10s sem atualização)
  sessions = sessions.filter((s) => now - s.time < 10000);

  const existing = sessions.find((s) => s.id === sessionId);
  if (existing) {
    existing.time = now;
  } else {
    sessions.push({ id: sessionId, time: now });
  }

  writeJSON(SESSIONS_FILE, sessions);

  res.json({ online: sessions.length });
});

// 📌 Servir frontend
app.use(express.static(path.join(__dirname, "../frontend")));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Servidor rodando em http://localhost:${PORT}`);
});
