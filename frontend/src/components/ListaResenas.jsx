import { useEffect, useState } from "react";

export default function ListaResenas({ juegoId }) {
  const [resenas, setResenas] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch(`http://localhost:5000/api/resenas/${juegoId}`, {
      headers: {
        "Authorization": "Bearer " + token
      }
    })
      .then((res) => res.json())
      .then((data) => setResenas(data));
  }, [juegoId]);

  const eliminarResena = async (id) => {
    const token = localStorage.getItem("token");

    await fetch(`http://localhost:5000/api/resenas/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": "Bearer " + token
      }
    });

    setResenas((prev) => prev.filter((r) => r._id !== id));
  };

  return (
    <div>
      <h3>Reseñas</h3>

      {resenas.length === 0 && <p>No hay reseñas aún.</p>}

      {resenas.map((r) => (
        <div key={r._id} className="tarjeta-resena">
          <p>⭐ <strong>{r.puntuacion}/5</strong></p>
          <p><strong>Horas jugadas:</strong> {r.horasJugadas}</p>
          <p><strong>Dificultad:</strong> {r.dificultad}</p>
          <p><strong>Recomienda:</strong> {r.recomendaria ? "Sí" : "No"}</p>
          <p>{r.textoReseña}</p>
          <button onClick={() => eliminarResena(r._id)}>Eliminar</button>
        </div>
      ))}
    </div>
  );
}
