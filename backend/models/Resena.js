import mongoose from "mongoose";

const resenaSchema = new mongoose.Schema({
  juegoId: { type: mongoose.Schema.Types.ObjectId, ref: "Juego", required: true },
  usuarioId: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario", required: true },
  puntuacion: { type: Number, min: 1, max: 5 },
  textoReseña: { type: String },
  horasJugadas: { type: Number },
  dificultad: { type: String },
  recomendaria: { type: Boolean },
  fechaCreacion: { type: Date, default: Date.now },
  fechaActualizacion: { type: Date, default: Date.now },
});

const Resena = mongoose.model("Resena", resenaSchema);
export default Resena;