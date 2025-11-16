import express from "express";
import jwt from "jsonwebtoken";
import Usuario from "../models/Usuario.js";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

// Registro
router.post("/registro", async (req, res) => {
  try {
    const { nombre, email, password } = req.body;
    const usuarioExistente = await Usuario.findOne({ email });
    if (usuarioExistente) return res.status(400).json({ mensaje: "El usuario ya existe" });

    const nuevoUsuario = new Usuario({ nombre, email, password });
    await nuevoUsuario.save();

    res.status(201).json({ mensaje: "Usuario registrado con éxito" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al registrar usuario" });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const usuario = await Usuario.findOne({ email });
    if (!usuario) return res.status(400).json({ mensaje: "Usuario no encontrado" });

    const esValido = await usuario.compararPassword(password);
    if (!esValido) return res.status(400).json({ mensaje: "Contraseña incorrecta" });

    const token = jwt.sign({ id: usuario._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.json({ token, usuario: { id: usuario._id, nombre: usuario.nombre, email: usuario.email } });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al iniciar sesión" });
  }
});

export default router;