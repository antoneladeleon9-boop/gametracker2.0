import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const manejarSubmit = async (e) => {
    e.preventDefault();
    const ok = await login(email, password);

    if (ok) window.location.href = "/";
  };

  return (
    <div className="contenedor">
      <h1>Iniciar Sesión</h1>

      <form onSubmit={manejarSubmit} className="formulario-juego">
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Iniciar Sesión</button>
      </form>

      <p>
        ¿No tenés cuenta?{" "}
        <a href="/register" style={{ color: "#4caf50" }}>Registrarse</a>
      </p>
    </div>
  );
}