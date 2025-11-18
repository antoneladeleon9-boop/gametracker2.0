import { useEffect, useState } from "react";
import GraficoBarras from "../components/GraficoBarras";
import "../App.css";

export default function Estadisticas() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const cargar = async () => {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5000/api/estadisticas", {
        headers: {
          "Authorization": "Bearer " + token
        }
      });

      const data = await res.json();
      setStats(data);
    };

    cargar();
  }, []);

  if (!stats)
    return (
      <h2 style={{ textAlign: "center", marginTop: "4rem", color: "#0ff" }}>
        Cargando estadísticas...
      </h2>
    );

  return (
    <div
      style={{
        padding: "2rem",
        background: "#0c0f16",
        minHeight: "100vh",
        color: "#e0e0e0",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          color: "#0ff",
          textShadow: "0px 0px 10px #0ff",
          marginBottom: "2rem",
        }}
      >
        🧪 Panel de Estadísticas Globales
      </h1>

      {/* ============================================ */}
      {/* TARJETAS RESUMEN */}
      {/* ============================================ */}
      <div
        style={{
          display: "flex",
          gap: "1.5rem",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {/* Tarjeta */}
        <div className="card-dark">
          <h3>Total de reseñas</h3>
          <p className="numero">{stats.totalResenas}</p>
        </div>

        <div className="card-dark">
          <h3>Promedio global</h3>
          <p className="numero">{stats.promedioGlobal} ⭐</p>
        </div>

        <div className="card-dark">
          <h3>Recomendado</h3>
          <p className="numero">{stats.recomendados}</p>
        </div>

        <div className="card-dark">
          <h3>No recomendado</h3>
          <p className="numero">{stats.noRecomendados}</p>
        </div>
      </div>

      {/* ============================================ */}
      {/* GRÁFICOS GLOBALES */}
      {/* ============================================ */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
          gap: "2rem",
          marginTop: "3rem",
        }}
      >
        <GraficoBarras
          titulo="Dificultad Global"
          labels={["Fácil", "Normal", "Difícil"]}
          valores={[
            stats.dificultadGlobal["Fácil"],
            stats.dificultadGlobal["Normal"],
            stats.dificultadGlobal["Difícil"],
          ]}
          color="rgba(0, 255, 255, 0.6)"
        />

        <GraficoBarras
          titulo="Recomendaciones Globales"
          labels={["Sí", "No"]}
          valores={[stats.recomendados, stats.noRecomendados]}
          color="rgba(255, 0, 255, 0.6)"
        />

        <GraficoBarras
          titulo="Distribución de Puntuaciones"
          labels={["1⭐", "2⭐", "3⭐", "4⭐", "5⭐"]}
          valores={[
            stats.puntuaciones[1],
            stats.puntuaciones[2],
            stats.puntuaciones[3],
            stats.puntuaciones[4],
            stats.puntuaciones[5],
          ]}
          color="rgba(255, 200, 0, 0.6)"
        />
      </div>

      {/* ============================================ */}
      {/* TOP 5 MÁS JUGADOS */}
      {/* ============================================ */}
      <h2 className="titulo-neon">🎮 Top 5: Juegos Más Jugados</h2>

      <div className="lista-top">
        {stats.topHoras.map(({ juego, horas }) => (
          <div className="item-top" key={juego._id}>
            <img src={juego.imagenPortada} alt="" className="mini-portada" />
            <div>
              <h3>{juego.titulo}</h3>
              <p>{horas} horas jugadas</p>
            </div>
          </div>
        ))}
      </div>

      {/* ============================================ */}
      {/* TOP 5 MEJOR PUNTUADOS */}
      {/* ============================================ */}
      <h2 className="titulo-neon">⭐ Top 5: Juegos Mejor Puntuados</h2>

      <div className="lista-top">
        {stats.topPuntuacion.map(({ juego, promedio }) => (
          <div className="item-top" key={juego._id}>
            <img src={juego.imagenPortada} alt="" className="mini-portada" />
            <div>
              <h3>{juego.titulo}</h3>
              <p>{promedio} ⭐ promedio</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
