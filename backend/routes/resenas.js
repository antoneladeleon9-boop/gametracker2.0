import express from "express";
import Resena from "../models/Resena.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

// Middleware JWT
const verificarToken = (req, res, next) => {
  const tokenHeader = req.headers["authorization"];
  if (!tokenHeader) return res.status(403).json({ mensaje: "Token requerido" });

  const token = tokenHeader.split(" ")[1];
  try {
    const decodificado = jwt.verify(token, process.env.JWT_SECRET);
    req.usuarioId = decodificado.id;
    next();
  } catch {
    res.status(401).json({ mensaje: "Token inválido" });
  }
};

// 📌 Obtener reseñas por juego
router.get("/juego/:id", async (req, res) => {
  try {
    const resenas = await Resena.find({ juegoId: req.params.id });
    res.json(resenas);
  } catch (err) {
    console.log(err);
    res.status(500).json({ mensaje: "Error al obtener reseñas" });
  }
});

// 📌 Crear reseña
router.post("/", verificarToken, async (req, res) => {
  try {
    const nuevaResena = new Resena({
      juegoId: req.body.juegoId,
      usuarioId: req.usuarioId,
      puntuacion: req.body.puntuacion,
      textoReseña: req.body.textoReseña,
      horasJugadas: req.body.horasJugadas,
      dificultad: req.body.dificultad,
      recomendaria: req.body.recomendaria
    });

    await nuevaResena.save();
    res.status(201).json(nuevaResena);

  } catch (err) {
    console.log(err);
    res.status(500).json({ mensaje: "Error al crear reseña" });
  }
});

// 📌 Eliminar reseña
router.delete("/:id", verificarToken, async (req, res) => {
  try {
    await Resena.findByIdAndDelete(req.params.id);
    res.json({ mensaje: "Reseña eliminada" });
  } catch {
    res.status(500).json({ mensaje: "Error al eliminar reseña" });
  }
});

export default router;
