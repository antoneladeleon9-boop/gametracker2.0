import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);

  // =========================
  // CARGAR USUARIO SI HAY TOKEN
  // =========================
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch("http://localhost:5000/api/usuarios/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data) setUsuario(data);
      })
      .catch(() => {});
  }, []);

  // =========================
  // LOGIN
  // =========================
  const login = async (email, password) => {
    try {
      const res = await fetch("http://localhost:5000/api/usuarios/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.mensaje || "Credenciales incorrectas");
        return false;
      }

      localStorage.setItem("token", data.token);
      setUsuario({ nombre: data.nombre, id: data.id });

      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  // =========================
  // REGISTRO
  // =========================
  const registrar = async (nombre, email, password) => {
    try {
      const res = await fetch("http://localhost:5000/api/usuarios/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.mensaje || "Error al registrar");
        return false;
      }

      localStorage.setItem("token", data.token);
      setUsuario({ nombre, email });

      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  // =========================
  // LOGOUT
  // =========================
  const logout = () => {
    localStorage.removeItem("token");
    setUsuario(null);
    window.location.href = "/";
  };

  return (
    <AuthContext.Provider value={{ usuario, login, registrar, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
