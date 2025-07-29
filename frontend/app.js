const { useState, useEffect, useRef } = React;

function App() {
  const [showMatrix, setShowMatrix] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const [posts, setPosts] = useState([]);
  const [boletim, setBoletim] = useState("");
  const [onlineCount, setOnlineCount] = useState(0);
  const [expandedPost, setExpandedPost] = useState(null);
  const [themeRed, setThemeRed] = useState(false);
  const [showBoletim, setShowBoletim] = useState(false);
  const sessionIdRef = useRef(null);
  const blocks = Array.from({ length: 10 });
  const sparks = Array.from({ length: 6 });

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowMatrix(false);
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 5000);
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let sid = localStorage.getItem("sessionId");
    if (!sid) {
      sid = Date.now().toString() + Math.floor(Math.random() * 10000);
      localStorage.setItem("sessionId", sid);
    }
    sessionIdRef.current = sid;
  }, []);

  useEffect(() => {
    fetch("/api/posts")
      .then((res) => res.json())
      .then((data) => setPosts(data))
      .catch(() => setPosts([]));
  }, []);

  useEffect(() => {
    fetch("/api/boletim")
      .then((res) => res.json())
      .then((data) => setBoletim(data.boletim || ""))
      .catch(() => setBoletim(""));
  }, []);

  useEffect(() => {
    if (!sessionIdRef.current) return;
    const interval = setInterval(() => {
      fetch("/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: sessionIdRef.current }),
      })
        .then((res) => res.json())
        .then((data) => setOnlineCount(data.online || 0));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleReadMore = (id) => {
    setThemeRed(true);
    setExpandedPost(id);
    setTimeout(() => {
      alert("💀 Você foi hackeado! Brincadeira 😆");
      setThemeRed(false);
    }, 2000);
  };

  const handleReadLess = () => setExpandedPost(null);

  if (showMatrix) {
    return <div className="matrix-text neon-text">H L S V</div>;
  }

  return (
    <>
      {blocks.map((_, i) => (
        <div
          key={i}
          className="floating-block"
          style={{
            left: `${Math.random() * 90}%`,
            animationDelay: `${i * 1.5}s`,
          }}
        ></div>
      ))}

      {sparks.map((_, i) => (
        <div
          key={i}
          className="spark"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${i * 0.8}s`,
          }}
        ></div>
      ))}

      {showAlert && (
        <div className="custom-alert">
          👋 Seja bem-vindo ao site HLSV!  
          Conteúdo de cyber segurança, tutoriais e serviços para proteger suas redes.
        </div>
      )}

      <button
        className="btn btn-primary"
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          zIndex: 3000,
        }}
        onClick={() => setShowBoletim(true)}
      >
        📢 Boletim
      </button>

      {showBoletim && (
        <div
          style={{
            position: "fixed",
            bottom: "80px",
            right: "20px",
            width: "300px",
            padding: "15px",
            background: "#000",
            border: "2px solid #0f0",
            boxShadow: "0 0 15px #0f0",
            zIndex: 4000,
          }}
        >
          <h4 style={{ color: "#0f0" }}>Boletim de hoje</h4>
          <p>{boletim || "Nenhum boletim publicado hoje."}</p>
          <button
            className="btn btn-sm btn-danger"
            onClick={() => setShowBoletim(false)}
          >
            Fechar
          </button>
        </div>
      )}

      <div className={`container p-4 ${themeRed ? "theme-red" : ""}`}>
        <header className="text-center mb-4 neon-text">
          <h1>Blog da HLSV - Cyber Segurança</h1>
          <p>Aqui você encontra conteúdo de pentest, tutoriais e ferramentas hacker éticas.</p>
          <p><strong>Usuários online agora:</strong> {onlineCount}</p>
        </header>

        <section>
          {posts.length === 0 ? (
            <p>Nenhum post disponível.</p>
          ) : (
            posts.map((post) => (
              <article key={post.id}>
                <h3 className="neon-text">{post.title}</h3>
                <p>
                  {expandedPost === post.id
                    ? post.content
                    : post.content.substring(0, 120) + "..."}
                </p>
                {expandedPost === post.id ? (
                  <button className="btn btn-sm btn-secondary" onClick={handleReadLess}>
                    Ler menos
                  </button>
                ) : (
                  <button className="btn btn-sm btn-danger" onClick={() => handleReadMore(post.id)}>
                    Ler mais
                  </button>
                )}
              </article>
            ))
          )}
        </section>
      </div>
    </>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
