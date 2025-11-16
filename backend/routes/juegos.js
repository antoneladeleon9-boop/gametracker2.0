import express from "express";
import Juego from "../models/Juego.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

// =============================
// 📌 1. OBTENER TODOS LOS JUEGOS DEL USUARIO LOGUEADO
// =============================
router.get("/", authMiddleware, async (req, res) => {
  try {
    const juegos = await Juego.find({ usuario: req.usuario.id });
    res.json(juegos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: "Error al obtener juegos" });
  }
});

// =============================
// 📌 2. AGREGAR JUEGO NUEVO
// =============================
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { titulo, plataforma, genero, imagenPortada } = req.body;

    if (!titulo || !plataforma || !genero || !imagenPortada) {
      return res.status(400).json({ mensaje: "Todos los campos son obligatorios" });
    }

    const juego = new Juego({
      titulo,
      plataforma,
      genero,
      imagenPortada,
      usuario: req.usuario.id,
    });

    const guardado = await juego.save();
    res.status(201).json(guardado);
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: "Error al agregar juego" });
  }
});

// =============================
// 📌 3. EDITAR JUEGO
// =============================
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const juego = await Juego.findOneAndUpdate(
      { _id: id, usuario: req.usuario.id },
      req.body,
      { new: true }
    );

    if (!juego) return res.status(404).json({ mensaje: "Juego no encontrado" });

    res.json(juego);
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: "Error al editar juego" });
  }
});

// =============================
// 📌 4. ELIMINAR JUEGO
// =============================
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const eliminado = await Juego.findOneAndDelete({
      _id: id,
      usuario: req.usuario.id,
    });

    if (!eliminado)
      return res.status(404).json({ mensaje: "Juego no encontrado" });

    res.json({ mensaje: "Juego eliminado correctamente" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: "Error al eliminar juego" });
  }
});

export default router;
