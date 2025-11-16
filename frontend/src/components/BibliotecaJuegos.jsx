import TarjetaJuego from "./TarjetaJuego";
import { Link } from "react-router-dom"; // <-- IMPORTANTE

function BibliotecaJuegos({ juegos, onEliminar, onEditar }) {
  return (
    <div className="biblioteca">

      {/* BOTÓN PARA IR AL FORMULARIO */}
      <Link to="/agregar">
        <button className="btn-agregar">Agregar juego</button>
      </Link>

      {juegos.length === 0 ? (
        <p>No hay juegos registrados aún.</p>
      ) : (
        juegos.map((juego) => (
          <TarjetaJuego
            key={juego._id}
            juego={juego}
            onEliminar={onEliminar}
            onEditar={onEditar}
          />
        ))
      )}
    </div>
  );
}

export default BibliotecaJuegos;
