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
      <h1>GameTracker</h1>
      <p>Bienvenido/a, {usuario?.nombre}</p>

      <button onClick={logout} style={{ marginBottom: 20 }}>
        Cerrar Sesión
      </button>

      {/* FORMULARIO DE JUEGO DENTRO DE INICIO */}
      <FormularioJuego onAgregar={agregarJuego} />

      {/* LISTA DE JUEGOS */}
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
