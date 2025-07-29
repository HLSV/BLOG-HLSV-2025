const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "..", "frontend")));

const postsFile = path.join(__dirname, "posts.txt");

if (!fs.existsSync(postsFile)) fs.writeFileSync(postsFile, "[]");

app.get("/api/posts", (req, res) => {
  const data = fs.readFileSync(postsFile, "utf-8");
  res.json(JSON.parse(data));
});

app.post("/api/posts", (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) return res.status(400).json({ error: "Campos obrigatórios" });

  const posts = JSON.parse(fs.readFileSync(postsFile, "utf-8"));
  const newPost = { id: Date.now(), title, content };
  posts.push(newPost);
  fs.writeFileSync(postsFile, JSON.stringify(posts, null, 2));

  res.json({ success: true, post: newPost });
});

app.listen(PORT, () => {
  console.log(`🚀 Server rodando em http://localhost:${PORT}`);
});
