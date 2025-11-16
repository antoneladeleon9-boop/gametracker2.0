import mongoose from "mongoose";

const juegoSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  plataforma: { type: String, required: true },
  genero: { type: String, required: true },
  imagenPortada: { type: String, required: true },
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario", required: true }
});

export default mongoose.model("Juego", juegoSchema);
