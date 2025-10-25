"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "../lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Estilos del fondo
  const backgroundStyle = {
    backgroundImage:
      "linear-gradient(rgba(6,11,35,0.35), rgba(6,11,35,0.35))",
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  setLoading(true);

  // 1) Modo local de prueba que igual lo guarda en el localstorage
  if (email === "gmail@ejemplo.com" && password === "1234") {
    // Usuario local de prueba (no llama al API)
    const usuarioLocal = {
      email,
      name: "Usuario de prueba",
      source: "local"
    };

    try {
      localStorage.setItem("user", JSON.stringify(usuarioLocal));
      localStorage.setItem("token", "local");
      // Asegurarnos de que axios no envíe un Bearer real
      if (api.defaults && api.defaults.headers && api.defaults.headers.common) {
        delete api.defaults.headers.common["Authorization"];
      }
    } catch (err) {
      console.error("Error guardando en localStorage:", err);
    }

    setLoading(false);
    router.replace("/dashboard");
    return;
  }

  // 2) Modo API usando las credenciales reales
  try {
    const res = await api.post("/api/login", { email, password });
    console.log("LOGIN response:", res.data); // para depuración
    
    const token =
      res.data?.token ||
      res.data?.access_token ||
      res.data?.data?.token ||
      null;

    if (!token) {
      setError("No se encontró token en la respuesta del servidor.");
      setLoading(false);
      return;
    }

    // Guardar token y setear header para futuras peticiones
    localStorage.setItem("token", token);
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    // Obtener perfil real desde el endpoint correcto
    const perfilRes = await api.get("/api/profile");
    const usuario = perfilRes.data?.data || perfilRes.data || { email };

    // Guardar usuario para dashboard
    localStorage.setItem("user", JSON.stringify(usuario));

    setLoading(false);
    router.replace("/dashboard");
  } catch (err) {
    console.error(err.response?.data || err.message);
    const msg =
      err.response?.data?.message ||
      err.response?.data ||
      err.message ||
      "Error al iniciar sesión";
    setError(typeof msg === "string" ? msg : JSON.stringify(msg));
    setLoading(false);
  }
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
          Credenciales para la prueba local (algo como un fallback): <b>gmail@ejemplo.com</b> / <b>1234</b>
          <br />
          Credenciales para la prueba con la API integrada: <b>admin@ejemplo.com</b> / <b>admin123</b>
        </p>
      </div>
    </div>
  );
}