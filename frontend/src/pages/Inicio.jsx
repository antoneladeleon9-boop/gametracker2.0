import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import FormularioJuego from "../components/FormularioJuego";
import TarjetaJuego from "../components/TarjetaJuego";
import "../styles/Inicio.css";

export default function Inicio() {
  const { usuario, logout } = useAuth();
  const [juegos, setJuegos] = useState([]);
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [generoSeleccionado, setGeneroSeleccionado] = useState("");

  // 🔥 Cargar juegos enviando el TOKEN
  useEffect(() => {
    const cargar = async () => {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5000/api/juegos", {
        headers: {
          Authorization: "Bearer " + token,
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
        Authorization: "Bearer " + token,
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

  // ==========================
  // FILTRAR JUEGOS POR GÉNERO
  // ==========================
  const juegosFiltrados = generoSeleccionado
    ? juegos.filter((j) => j.genero === generoSeleccionado)
    : juegos;

  return (
    <div className="contenedor">

      {/* TÍTULO */}
      <h1 className="titulo-app">🎮 GameTracker</h1>
      <p className="bienvenida">
        Bienvenido/a, <strong>{usuario?.nombre}</strong>
      </p>

      {/* BOTÓN HAMBURGUESA Y LOGOUT */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <button onClick={logout} className="btn-ghost">Cerrar Sesión</button>
        <button onClick={() => setMostrarFiltros(!mostrarFiltros)} className="btn-ghost">
          ☰ Filtros
        </button>
      </div>

      {/* PANEL HAMBURGUESA CON ANIMACIÓN */}
      <div className={`panel-filtros ${mostrarFiltros ? "activo" : ""}`}>
        <h4>Filtros</h4>

        {/* FILTRO POR GÉNERO */}
        <select
          value={generoSeleccionado}
          onChange={(e) => setGeneroSeleccionado(e.target.value)}
        >
          <option value="">Todos los géneros</option>
          {Array.from(new Set(juegos.map((j) => j.genero))).map((g) => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>

        {/* BOTÓN PARA CERRAR FILTROS */}
        <button className="btn-cerrar-filtros" onClick={() => setMostrarFiltros(false)}>
          Cerrar
        </button>
      </div>

      {/* FORMULARIO DE JUEGO */}
      <div className="card-formulario">
        <FormularioJuego onAgregar={agregarJuego} />
      </div>

      {/* LISTA DE JUEGOS */}
      <h2 className="subtitulo">📚 Tu biblioteca de juegos</h2>
      <div className="lista-juegos">
        {Array.isArray(juegosFiltrados) &&
          juegosFiltrados.map((juego) => (
            <TarjetaJuego
              key={juego._id}
              juego={juego}
              onEliminar={async (id) => {
                const token = localStorage.getItem("token");

                const res = await fetch(`http://localhost:5000/api/juegos/${id}`, {
                  method: "DELETE",
                  headers: {
                    Authorization: "Bearer " + token,
                  },
                });

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
