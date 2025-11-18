import { useEffect, useState } from "react";
import ListaResenas from "./ListaResenas";
import FormularioResena from "./FormularioResena";
import GraficoBarras from "./GraficoBarras";

export default function TarjetaJuego({ juego, onEliminar, onEditar }) {
  const [mostrarResenas, setMostrarResenas] = useState(false);
  const [stats, setStats] = useState(null);

  // ==========================================================
  // 🔥 Cargar estadísticas del juego
  // ==========================================================
  const cargarStats = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch(`http://localhost:5000/api/resenas/${juego._id}`, {
      headers: {
        "Authorization": "Bearer " + token
      }
    });

    const data = await res.json();

    if (!Array.isArray(data)) return;

    if (data.length === 0) {
      setStats(null);
      return;
    }

    // ⭐ Promedio de puntuación
    const promedio = (
      data.reduce((sum, r) => sum + (r.puntuacion || 0), 0) / data.length
    ).toFixed(1);

    // ⏳ Horas totales jugadas
    const horas = data.reduce((sum, r) => sum + (r.horasJugadas || 0), 0);

    // 🎚️ Conteo de dificultad
    const conteoDificultad = { "Fácil": 0, "Normal": 0, "Difícil": 0 };
    data.forEach(r => conteoDificultad[r.dificultad]++);

    const dificultadTop = Object.entries(conteoDificultad)
      .sort((a, b) => b[1] - a[1])[0][0];

    // ⭐ Conteo de puntuaciones (1–5)
    const puntuaciones = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    data.forEach(r => puntuaciones[r.puntuacion]++);

    // 👍 Recomendación
    const recomendados = data.filter(r => r.recomendaria).length;
    const porcentajeRecomendado = Math.round((recomendados / data.length) * 100);

    setStats({
      promedio,
      horas,
      dificultadTop,
      porcentajeRecomendado,
      total: data.length,
      puntuaciones,
      recomendados,
      conteoDificultad,
    });
  };

  // Cargar estadísticas al abrir reseñas
  useEffect(() => {
    if (mostrarResenas) cargarStats();
  }, [mostrarResenas]);

  return (
    <div className="tarjeta-juego">
      {/* Imagen */}
      <img
        src={juego.imagenPortada}
        alt={juego.titulo}
        onError={(e) =>
          (e.target.src = "https://via.placeholder.com/300x400?text=Sin+Imagen")
        }
      />

      {/* Datos del juego */}
      <h2>{juego.titulo}</h2>
      <p><strong>Género:</strong> {juego.genero}</p>
      <p><strong>Plataforma:</strong> {juego.plataforma}</p>

      {/* =======================================
          🔥 ESTADÍSTICAS DEL JUEGO
         ======================================= */}
      {stats && (
        <div className="stats-juego">

          <p><strong>⭐ Promedio:</strong> {stats.promedio} / 5</p>
          <p><strong>⏳ Horas jugadas:</strong> {stats.horas}</p>
          <p><strong>🎚️ Dificultad más votada:</strong> {stats.dificultadTop}</p>
          <p><strong>👍 Recomendado por:</strong> {stats.porcentajeRecomendado}%</p>
          <p><em>{stats.total} reseña(s)</em></p>

          {/* 🔵 Gráfico 1 — Dificultad */}
          <GraficoBarras
            titulo="Dificultad más jugada"
            labels={["Fácil", "Normal", "Difícil"]}
            valores={[
              stats.conteoDificultad["Fácil"],
              stats.conteoDificultad["Normal"],
              stats.conteoDificultad["Difícil"],
            ]}
            color="rgba(255, 159, 64, 0.7)"
          />

          {/* 🔵 Gráfico 2 — Recomendación */}
          <GraficoBarras
            titulo="Recomendaciones"
            labels={["Sí", "No"]}
            valores={[
              stats.recomendados,
              stats.total - stats.recomendados,
            ]}
            color="rgba(54, 162, 235, 0.7)"
          />

          {/* 🔵 Gráfico 3 — Distribución de puntuaciones */}
          <GraficoBarras
            titulo="Puntuaciones (1 a 5)"
            labels={["1", "2", "3", "4", "5"]}
            valores={[
              stats.puntuaciones[1],
              stats.puntuaciones[2],
              stats.puntuaciones[3],
              stats.puntuaciones[4],
              stats.puntuaciones[5],
            ]}
            color="rgba(153, 102, 255, 0.7)"
          />
        </div>
      )}

      {/* Botones */}
      <div className="botones">
        <button className="btn-editar" onClick={() => onEditar(juego)}>
          Editar
        </button>
        <button className="btn-eliminar" onClick={() => onEliminar(juego._id)}>
          Eliminar
        </button>
      </div>

      {/* =======================================
          🔥 Sección de reseñas
         ======================================= */}
      <div style={{ marginTop: "1rem" }}>
        <button
          onClick={() => {
            setMostrarResenas(!mostrarResenas);
            if (!mostrarResenas) cargarStats();
          }}
          className="btn-ver-resenas"
        >
          {mostrarResenas ? "Ocultar reseñas" : "Ver reseñas"}
        </button>

        {mostrarResenas && (
          <div style={{ marginTop: "1rem" }}>
            <ListaResenas juegoId={juego._id} />
            <FormularioResena
              juegoId={juego._id}
              onResenaAgregada={() => cargarStats()}
            />
          </div>
        )}
      </div>
    </div>
  );
}
