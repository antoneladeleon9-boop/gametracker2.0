import express from "express";
import Juego from "../models/Juego.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

// =======================================================
// 📌 1. OBTENER TODOS LOS JUEGOS DEL USUARIO LOGUEADO
// =======================================================
router.get("/", authMiddleware, async (req, res) => {
  try {
    const juegos = await Juego.find({ usuario: req.usuario.id });
    res.json(juegos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: "Error al obtener juegos" });
  }
});

// =======================================================
// 📌 2. AGREGAR UN NUEVO JUEGO
// =======================================================
router.post("/", authMiddleware, async (req, res) => {
  try {
    const {
      titulo,
      plataforma,
      genero,
      imagenPortada,
      añoLanzamiento,
      desarrollador,
      completado,
      descripcion,
    } = req.body;

    if (!titulo || !plataforma || !genero || !imagenPortada) {
      return res
        .status(400)
        .json({ mensaje: "Título, plataforma, género e imagen son obligatorios." });
    }

    const juego = new Juego({
      titulo,
      plataforma,
      genero,
      imagenPortada,
      añoLanzamiento,
      desarrollador,
      completado,
      descripcion,
      usuario: req.usuario.id,
    });

    const guardado = await juego.save();
    res.status(201).json(guardado);
  } catch (err) {
    console.error("Error al crear juego:", err);
    res.status(500).json({ mensaje: "Error al crear juego" });
  }
});

// =======================================================
// 📌 3. EDITAR UN JUEGO
// =======================================================
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const juegoActualizado = await Juego.findOneAndUpdate(
      { _id: id, usuario: req.usuario.id },
      req.body,
      { new: true }
    );

    if (!juegoActualizado) {
      return res.status(404).json({ mensaje: "Juego no encontrado" });
    }

    res.json(juegoActualizado);
  } catch (err) {
    console.error("Error al editar juego:", err);
    res.status(500).json({ mensaje: "Error al editar juego" });
  }
});

// =======================================================
// 📌 4. ELIMINAR UN JUEGO
// =======================================================
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const eliminado = await Juego.findOneAndDelete({
      _id: id,
      usuario: req.usuario.id,
    });

    if (!eliminado) {
      return res.status(404).json({ mensaje: "Juego no encontrado" });
    }

    res.json({ mensaje: "Juego eliminado correctamente" });
  } catch (err) {
    console.error("Error al eliminar juego:", err);
    res.status(500).json({ mensaje: "Error al eliminar juego" });
  }
});

export default router;
