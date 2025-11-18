import mongoose from "mongoose";

const resenaSchema = new mongoose.Schema({
  juegoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Juego",
    required: true
  },
  usuarioId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Usuario",
    required: true
  },
  puntuacion: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },
  horasJugadas: {
    type: Number,
    default: 0
  },
  dificultad: {
    type: String,
    enum: ["Fácil", "Normal", "Difícil"],
    default: "Normal"
  },
  recomendaria: {
    type: Boolean,
    default: true
  },
  textoReseña: {
    type: String,
    required: true
  },
  fecha: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("Resena", resenaSchema);
