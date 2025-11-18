import mongoose from "mongoose";

const juegoSchema = new mongoose.Schema(
  {
    titulo: {
      type: String,
      required: true,
      trim: true,
    },
    plataforma: {
      type: String,
      required: true,
      trim: true,
    },
    genero: {
      type: String,
      required: true,
      trim: true,
    },
    imagenPortada: {
      type: String,
      required: true,
      trim: true,
    },

    // ⭐ NUEVOS CAMPOS
    añoLanzamiento: {
      type: Number,
      default: null,
    },
    desarrollador: {
      type: String,
      trim: true,
      default: "",
    },
    completado: {
      type: Boolean,
      default: false,
    },
    descripcion: {
      type: String,
      trim: true,
      default: "",
    },

    usuario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Juego", juegoSchema);
