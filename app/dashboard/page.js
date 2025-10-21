"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState(null);
  const [avatarData, setAvatarData] = useState(null); //base64
  const fileRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = localStorage.getItem("user");
    if (!raw) {
      router.replace("/");
      return;
    }
    try {
      const u = JSON.parse(raw);
      setUserEmail(u.email || "Usuario");
      setAvatarData(u.avatar || null); // si hay avatar guardado se carga
    } catch {
      localStorage.removeItem("user");
      router.replace("/");
    }
  }, [router]);

  const logout = () => {
    localStorage.removeItem("user");
    router.replace("/");
  };

  const handleChooseFile = () => {
    if (fileRef.current) fileRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    // Opcional: limitar tamaño para no sobrecargar la vara
    const maxSizeBytes = 1.5 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      alert("La imagen es muy grande. Elige una menor a 1.5 MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result; // data:image/...;base64,...
      setAvatarData(base64);

      // actualizar localStorage (mantener email y otros datos)
      try {
        const raw = localStorage.getItem("user");
        const u = raw ? JSON.parse(raw) : {};
        u.avatar = base64;
        localStorage.setItem("user", JSON.stringify(u));
      } catch (err) {
        console.error("No se pudo guardar avatar en localStorage", err);
      }
    };
    reader.readAsDataURL(file);
  };

  // Fondo simple
  const backgroundStyle = {
    background:
      "linear-gradient(180deg, rgba(243,244,246,1) 0%, rgba(255,255,255,1) 100%)",
    minHeight: "100vh",
    padding: 32,
  };

  if (!userEmail) return null;

  return (
    <div style={backgroundStyle}>
      <div style={{ maxWidth: 960, margin: "0 auto", color: "#0f172a" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              className="avatar"
              title="Foto de perfil"
              style={{ cursor: "pointer" }}
              onClick={handleChooseFile}
              aria-label="avatar"
            >
              {avatarData ? (
                <img
                  src={avatarData}
                  alt="avatar"
                  style={{
                    width: "64px",
                    height: "64px",
                    borderRadius: "999px",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              ) : (
                // letra inicial si no hay imagen
                <div style={{ fontWeight: 800, color: "#0f172a" }}>
                  {(userEmail[0] || "U").toUpperCase()}
                </div>
              )}
            </div>

            <div>
              <h1 style={{ margin: 0, fontSize: 22 }}>Bienvenido</h1>
              <div style={{ fontSize: 18, fontWeight: 700 }}>{userEmail}</div>
              <div style={{ marginTop: 6, color: "rgba(15,23,42,0.7)" }}>
                Aquí puedes gestionar tu perfil.
              </div>
            </div>
          </div>

          <div style={{ marginLeft: "auto", display: "flex", gap: 12 }}>
            <button
              onClick={handleChooseFile}
              className="btn"
              style={{ width: 150, padding: "8px 12px" }}
            >
              Cambiar foto
            </button>

            <button
              onClick={logout}
              className="btn"
              style={{
                width: 140,
                background: "linear-gradient(90deg,#ef4444,#f97316)",
              }}
            >
              Cerrar sesión
            </button>
          </div>
        </div>

        {/* input oculto para archivos */}
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />

        {/* Solo tarjeta "Mi perfil" */}
        <section style={{ marginTop: 28 }}>
          <div className="card" style={{ padding: 18, maxWidth: 700 }}>
            <h3 style={{ marginTop: 0 }}>Mi perfil</h3>
            <p style={{ marginBottom: 6 }}>
              <strong>Correo:</strong> {userEmail}
            </p>

            {avatarData ? (
              <div style={{ marginTop: 8 }}>
                <strong>Foto de perfil cargada.</strong>
                <p style={{ marginTop: 6, marginBottom: 0 }}>
                  Haz clic en <em>Cambiar foto</em> o en el avatar para reemplazarla.
                </p>
              </div>
            ) : (
              <p style={{ marginTop: 8, marginBottom: 0 }}>
                No hay foto de perfil. Haz clic en <em>Cambiar foto</em> o en el avatar para subir una.
              </p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}