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

    fetch("http://localhost:5000/api/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        // el backend devuelve el usuario directamente
        if (data && data._id) setUsuario(data);
      })
      .catch(() => {});
  }, []);

  // =========================
  // LOGIN
  // =========================
  const login = async (email, password) => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!data.token) {
        alert(data.mensaje || "Credenciales incorrectas");
        return false;
      }

      // Guardar token
      localStorage.setItem("token", data.token);

      // Obtener usuario automáticamente
      const me = await fetch("http://localhost:5000/api/auth/me", {
        headers: { Authorization: "Bearer " + data.token },
      });

      const usuarioData = await me.json();
      setUsuario(usuarioData);

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
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, email, password }),
      });

      const data = await res.json();

      if (!data.mensaje) {
        alert("Error al registrar");
        return false;
      }

      alert("Registro exitoso. Ahora inicia sesión.");
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
    <AuthContext.Provider
      value={{
        usuario,
        setUsuario,
        login,
        registrar,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
