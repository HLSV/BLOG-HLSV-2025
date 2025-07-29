const { useState, useEffect } = React;

function AdminPanel() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [password, setPassword] = useState("");
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [boletim, setBoletim] = useState("");

  const ADMIN_PASS = "1234";

  const loadPosts = () => {
    fetch("/api/posts")
      .then((res) => res.json())
      .then((data) => setPosts(data))
      .catch(() => setPosts([]));
  };

  useEffect(() => {
    if (loggedIn) loadPosts();
  }, [loggedIn]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASS) {
      setLoggedIn(true);
    } else {
      alert("Senha incorreta!");
    }
  };

  const createPost = () => {
    fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content }),
    })
      .then(() => {
        alert("Post criado!");
        setTitle("");
        setContent("");
        loadPosts();
      })
      .catch(() => alert("Erro ao criar post"));
  };

  const updateBoletim = () => {
    fetch("/api/boletim", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ boletim }),
    })
      .then(() => alert("Boletim atualizado!"))
      .catch(() => alert("Erro ao atualizar boletim"));
  };

  if (!loggedIn) {
    return (
      <div className="container">
        <div className="card p-4">
          <h2 className="text-center">Login ADM</h2>
          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label>Senha:</label>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button className="btn btn-success w-100">Entrar</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <h1 className="text-center mb-4">Painel ADM - HLSV</h1>

      <div className="card p-3 mb-4">
        <h3>Criar Post</h3>
        <input
          className="form-control mb-2"
          placeholder="Título"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className="form-control mb-2"
          rows="4"
          placeholder="Conteúdo"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button className="btn btn-primary" onClick={createPost}>
          Salvar Post
        </button>
      </div>

      <div className="card p-3 mb-4">
        <h3>Atualizar Boletim</h3>
        <textarea
          className="form-control mb-2"
          rows="3"
          placeholder="Texto do boletim"
          value={boletim}
          onChange={(e) => setBoletim(e.target.value)}
        />
        <button className="btn btn-warning" onClick={updateBoletim}>
          Atualizar
        </button>
      </div>

      <div className="card p-3">
        <h3>Posts Existentes</h3>
        {posts.length === 0 ? (
          <p>Nenhum post ainda.</p>
        ) : (
          posts.map((p) => (
            <div key={p.id} className="border p-2 mb-2">
              <strong>{p.title}</strong>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

ReactDOM.render(<AdminPanel />, document.getElementById("admin-root"));
