import { useEffect, useState } from "react";

export default function ListaResenas({ juegoId }) {
  const [resenas, setResenas] = useState([]);

  // Cargar reseñas al iniciar
  useEffect(() => {
    if (!juegoId) return;

    fetch(`http://localhost:5000/api/resenas/juego/${juegoId}`)
      .then((res) => res.json())
      .then((data) => setResenas(data))
      .catch((err) => console.error("Error al cargar reseñas:", err));
  }, [juegoId]);

  // Eliminar reseña
  const eliminarResena = async (id) => {
    if (!confirm("¿Eliminar esta reseña?")) return;
    await fetch(`http://localhost:5000/api/resenas/${id}`, { method: "DELETE" });
    setResenas(resenas.filter((r) => r._id !== id));
  };

  return (
    <div className="resenas">
      <h3>Reseñas</h3>
      {resenas.length === 0 ? (
        <p>No hay reseñas para este juego aún.</p>
      ) : (
        resenas.map((r) => (
          <div key={r._id} className="tarjeta-resena">
            <p><strong>Puntuación:</strong> ⭐ {r.puntuacion}</p>
            <p><strong>Horas jugadas:</strong> {r.horasJugadas}</p>
            <p><strong>Dificultad:</strong> {r.dificultad}</p>
            <p>{r.textoReseña}</p>
            <button className="btn-eliminar" onClick={() => eliminarResena(r._id)}>Eliminar</button>
          </div>
        ))
      )}
    </div>
  );
}