import { useState } from "react";

export default function FormularioResena({ juegoId, onResenaAgregada }) {
  const [formData, setFormData] = useState({
    puntuacion: 0,
    textoReseña: "",
    horasJugadas: 0,
    dificultad: "Normal",
    recomendaria: true,
  });

  const manejarCambio = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const manejarEnvio = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:5000/api/resenas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...formData, juegoId }),
    });
    const data = await res.json();
    onResenaAgregada(data);
    setFormData({
      puntuacion: 0,
      textoReseña: "",
      horasJugadas: 0,
      dificultad: "Normal",
      recomendaria: true,
    });
  };

  return (
    <form className="formulario-resena" onSubmit={manejarEnvio}>
      <h3>Agregar reseña</h3>

      <input
        type="number"
        name="puntuacion"
        placeholder="Puntuación (1 a 5)"
        value={formData.puntuacion}
        onChange={manejarCambio}
        required
      />

      <input
        type="number"
        name="horasJugadas"
        placeholder="Horas jugadas"
        value={formData.horasJugadas}
        onChange={manejarCambio}
      />

      <select name="dificultad" value={formData.dificultad} onChange={manejarCambio}>
        <option value="Fácil">Fácil</option>
        <option value="Normal">Normal</option>
        <option value="Difícil">Difícil</option>
      </select>

      <textarea
        name="textoReseña"
        placeholder="Escribí tu reseña..."
        value={formData.textoReseña}
        onChange={manejarCambio}
      />

      <label>
        <input
          type="checkbox"
          name="recomendaria"
          checked={formData.recomendaria}
          onChange={manejarCambio}
        />
        ¿Lo recomendarías?
      </label>

      <button type="submit">Guardar reseña</button>
    </form>
  );
}