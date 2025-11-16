import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function LoginRegistro() {
  const { registrar, login } = useAuth();
  const [modo, setModo] = useState("login");
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const manejarSubmit = async (e) => {
    e.preventDefault();
    if (modo === "login") {
      await login(email, password);
    } else {
      await registrar(nombre, email, password);
    }
  };

  return (
    <div className="contenedor">
      <h1>{modo === "login" ? "Iniciar Sesión" : "Registrarse"}</h1>

      <form onSubmit={manejarSubmit}>
        {modo === "registro" && (
          <input
            type="text"
            placeholder="Tu nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        )}

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

        <button type="submit">
          {modo === "login" ? "Iniciar sesión" : "Registrarse"}
        </button>
      </form>

      <p>
        {modo === "login" ? (
          <>
            ¿No tenés cuenta?{" "}
            <button onClick={() => setModo("registro")}>Registrate</button>
          </>
        ) : (
          <>
            ¿Ya tenés cuenta?{" "}
            <button onClick={() => setModo("login")}>Iniciá sesión</button>
          </>
        )}
      </p>
    </div>
  );
}