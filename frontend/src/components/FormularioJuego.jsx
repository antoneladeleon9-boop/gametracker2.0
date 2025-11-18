import { useEffect, useState } from "react";

export default function FormularioJuego({ onAgregar, onEditar, juegoEditando }) {
  const [titulo, setTitulo] = useState("");
  const [plataforma, setPlataforma] = useState("");
  const [genero, setGenero] = useState("");
  const [imagenPortada, setImagenPortada] = useState("");
  const [añoLanzamiento, setAñoLanzamiento] = useState("");
  const [desarrollador, setDesarrollador] = useState("");
  const [completado, setCompletado] = useState(false);
  const [descripcion, setDescripcion] = useState("");

  useEffect(() => {
    if (juegoEditando) {
      setTitulo(juegoEditando.titulo || "");
      setPlataforma(juegoEditando.plataforma || "");
      setGenero(juegoEditando.genero || "");
      setImagenPortada(juegoEditando.imagenPortada || "");
      setAñoLanzamiento(juegoEditando.añoLanzamiento || "");
      setDesarrollador(juegoEditando.desarrollador || "");
      setCompletado(juegoEditando.completado || false);
      setDescripcion(juegoEditando.descripcion || "");
    } else {
      setTitulo("");
      setPlataforma("");
      setGenero("");
      setImagenPortada("");
      setAñoLanzamiento("");
      setDesarrollador("");
      setCompletado(false);
      setDescripcion("");
    }
  }, [juegoEditando]);

  const manejarEnvio = (e) => {
    e.preventDefault();

    const nuevoJuego = {
      _id: juegoEditando?._id,
      titulo,
      plataforma,
      genero,
      imagenPortada,
      añoLanzamiento,
      desarrollador,
      completado,
      descripcion,
    };

    if (juegoEditando) onEditar(nuevoJuego);
    else onAgregar(nuevoJuego);
  };

  return (
    <form className="formulario-juego" onSubmit={manejarEnvio}>
      <h2>{juegoEditando ? "✏️ Editar juego" : "Agregar nuevo juego"}</h2>

      <input type="text" placeholder="Título" value={titulo} onChange={(e) => setTitulo(e.target.value)} />
      <input type="text" placeholder="Plataforma" value={plataforma} onChange={(e) => setPlataforma(e.target.value)} />
      <input type="text" placeholder="Género" value={genero} onChange={(e) => setGenero(e.target.value)} />
      <input type="text" placeholder="URL de imagen" value={imagenPortada} onChange={(e) => setImagenPortada(e.target.value)} />

      <input type="number" placeholder="Año de lanzamiento" value={añoLanzamiento} onChange={(e) => setAñoLanzamiento(e.target.value)} />
      <input type="text" placeholder="Desarrollador" value={desarrollador} onChange={(e) => setDesarrollador(e.target.value)} />

      <label style={{ marginTop: "10px" }}>
        <input type="checkbox" checked={completado} onChange={(e) => setCompletado(e.target.checked)} />
        {' '}Juego completado
      </label>

      <textarea placeholder="Descripción" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />

      <button type="submit">{juegoEditando ? "Guardar cambios" : "Agregar"}</button>
    </form>
  );
}
