import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import FormularioJuego from "../components/FormularioJuego";
import TarjetaJuego from "../components/TarjetaJuego";
import "../App.css";

export default function Inicio() {
  const { usuario, logout } = useAuth();
  const [juegos, setJuegos] = useState([]);

  // 🔥 Cargar juegos enviando el TOKEN
  useEffect(() => {
    const cargar = async () => {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5000/api/juegos", {
        headers: {
          "Authorization": "Bearer " + token,
        },
      });

      if (!res.ok) {
        console.log("No autorizado");
        return;
      }

      const data = await res.json();
      setJuegos(data);
    };

    cargar();
  }, []);

  // ==========================
  // AGREGAR JUEGO
  // ==========================
  const agregarJuego = async (juegoNuevo) => {
    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:5000/api/juegos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token,
      },
      body: JSON.stringify(juegoNuevo),
    });

    if (!res.ok) {
      console.log("Error al agregar juego");
      return;
    }

    const data = await res.json();
    setJuegos((prev) => [...prev, data]);
  };

  return (
    <div className="contenedor">

      {/* TÍTULO */}
      <h1 className="titulo-app">🎮 GameTracker</h1>
      <p className="bienvenida">
        Bienvenido/a, <strong>{usuario?.nombre}</strong>
      </p>

      {/* BOTÓN LOGOUT */}
      <button onClick={logout} className="btn-logout">
        Cerrar Sesión
      </button>

      {/* FORMULARIO DE JUEGO */}
      <div className="card-formulario">
        <FormularioJuego onAgregar={agregarJuego} />
      </div>

      {/* LISTA DE JUEGOS */}
      <h2 className="subtitulo">📚 Tu biblioteca de juegos</h2>
      <div className="lista-juegos">
        {Array.isArray(juegos) &&
          juegos.map((juego) => (
            <TarjetaJuego
              key={juego._id}
              juego={juego}
              onEliminar={async (id) => {
                const token = localStorage.getItem("token");

                const res = await fetch(
                  `http://localhost:5000/api/juegos/${id}`,
                  {
                    method: "DELETE",
                    headers: {
                      "Authorization": "Bearer " + token,
                    },
                  }
                );

                if (!res.ok) {
                  console.log("Error al eliminar juego");
                  return;
                }

                setJuegos((prev) => prev.filter((j) => j._id !== id));
              }}
            />
          ))}
      </div>
    </div>
  );
}
