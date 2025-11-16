import express from "express";
import Resena from "../models/Resena.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

// Middleware JWT
const verificarToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) return res.status(403).json({ mensaje: "Token requerido" });
  try {
    const decodificado = jwt.verify(token, process.env.JWT_SECRET);
    req.usuarioId = decodificado.id;
    next();
  } catch {
    res.status(401).json({ mensaje: "Token inválido" });
  }
};

// Obtener reseñas del usuario
router.get("/", verificarToken, async (req, res) => {
  const resenas = await Resena.find({ usuarioId: req.usuarioId });
  res.json(resenas);
});

// Crear reseña
router.post("/", verificarToken, async (req, res) => {
  try {
    const nuevaResena = new Resena({ ...req.body, usuarioId: req.usuarioId });
    await nuevaResena.save();
    res.status(201).json(nuevaResena);
  } catch {
    res.status(500).json({ mensaje: "Error al crear reseña" });
  }
});

export default router;