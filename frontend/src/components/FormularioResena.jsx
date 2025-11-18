import { useState } from "react";

export default function FormularioResena({ juegoId, onResenaAgregada }) {
  const [texto, setTexto] = useState("");

  const manejarEnvio = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:5000/api/resenas", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      },
      body: JSON.stringify({
        texto,
        fecha: new Date(),
        juegoId
      }),
    });

    const data = await res.json();

    if (res.ok) {
      onResenaAgregada(data);
      setTexto("");
    } else {
      alert("Error al crear reseña");
    }
  };

  return (
    <form className="formulario-resena" onSubmit={manejarEnvio}>
      <h3>Agregar reseña</h3>

      <textarea
        placeholder="Escribí tu reseña..."
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        required
      />

      <button type="submit">Guardar reseña</button>
    </form>
  );
}
