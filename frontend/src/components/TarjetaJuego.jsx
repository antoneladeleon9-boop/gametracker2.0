import { useState } from "react";
import ListaResenas from "./ListaResenas";
import FormularioResena from "./FormularioResena";

export default function TarjetaJuego({ juego, onEliminar, onEditar }) {
  const [mostrarResenas, setMostrarResenas] = useState(false);

  return (
    <div className="tarjeta-juego">
      <img
        src={juego.imagenPortada}
        alt={juego.titulo}
        onError={(e) => (e.target.src = "https://via.placeholder.com/300x400?text=Sin+Imagen")}
      />

      <h2>{juego.titulo}</h2>
      <p><strong>Género:</strong> {juego.genero}</p>
      <p><strong>Plataforma:</strong> {juego.plataforma}</p>
      <p><strong>Año:</strong> {juego.añoLanzamiento}</p>
      <p><strong>Desarrollador:</strong> {juego.desarrollador}</p>

      <p style={{ marginTop: "0.5rem" }}>
        <strong>Completado:</strong>{" "}
        {juego.completado ? "✅ Sí" : "❌ No"}
      </p>

      {juego.descripcion && (
        <p style={{ fontStyle: "italic", marginTop: "0.5rem" }}>
          {juego.descripcion}
        </p>
      )}

      <div className="botones">
        <button className="btn-editar" onClick={() => onEditar(juego)}>
          Editar
        </button>
        <button className="btn-eliminar" onClick={() => onEliminar(juego._id)}>
          Eliminar
        </button>
      </div>

      <div style={{ marginTop: "1rem" }}>
        <button
          onClick={() => setMostrarResenas(!mostrarResenas)}
          className="btn-ver-resenas"
        >
          {mostrarResenas ? "Ocultar reseñas" : "Ver reseñas"}
        </button>

        {mostrarResenas && (
          <div style={{ marginTop: "1rem" }}>
            <ListaResenas juegoId={juego._id} />
            <FormularioResena
              juegoId={juego._id}
              onResenaAgregada={() => console.log("Reseña agregada")}
            />
          </div>
        )}
      </div>
    </div>
  );
}