"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  //Estilos del fondo
  const backgroundStyle = {
    backgroundImage:
      "linear-gradient(rgba(6,11,35,0.35), rgba(6,11,35,0.35))",
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validación para lo que es el cliente donde se guarda en el localStorage
    setTimeout(() => {
      if (email === "gmail@ejemplo.com" && password === "1234") {
        localStorage.setItem("user", JSON.stringify({ email }));
        setLoading(false);
        router.replace("/dashboard");
        return;
      }
      setLoading(false);
      setError("Credenciales inválidas. Usa gmail@ejemplo.com / 1234");
    }, 600); // pequeño delay
  };

  return (
    <div className="center-screen" style={backgroundStyle}>
      <div className="card" role="main" aria-label="Login">
        <div style={{ textAlign: "center", marginBottom: 8 }}>
          <div style={{ fontSize: 28, fontWeight: 800, color: "black", textShadow: "0 1px 0 rgba(0,0,0,0.2)" }}>
            Login
          </div>
        </div>

        <h2 className="title">Iniciar sesión</h2>
        <p className="subtitle">Accede con tus credenciales para continuar.</p>

        <form onSubmit={handleSubmit} aria-label="form-login">
          <label style={{ display: "block", marginTop: 8 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#0f172a" }}>Correo</div>
            <input
              className="input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="tu@ejemplo.com"
            />
          </label>

          <label style={{ display: "block", marginTop: 10 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#0f172a" }}>Contraseña</div>
            <input
              className="input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
          </label>

          {error && <p style={{ color: "crimson", marginTop: 10 }}>{error}</p>}

          <button className="btn" type="submit" disabled={loading}>
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
        </form>

        <p className="link-muted">
          Credenciales: <b>gmail@ejemplo.com</b> / <b>1234</b>
        </p>
      </div>
    </div>
  );
}

