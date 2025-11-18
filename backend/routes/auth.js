import express from "express";
import jwt from "jsonwebtoken";
import Usuario from "../models/Usuario.js";
import authMiddleware from "../middleware/auth.js";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

// ====================================
// 🟢 REGISTRO
// ====================================
router.post("/register", async (req, res) => {
  try {
    const { nombre, email, password } = req.body;

    if (!nombre || !email || !password)
      return res.status(400).json({ mensaje: "Todos los campos son obligatorios" });

    // ¿Ya existe?
    const existe = await Usuario.findOne({ email });
    if (existe)
      return res.status(400).json({ mensaje: "El usuario ya existe" });

    // Crear usuario
    const nuevoUsuario = new Usuario({ nombre, email, password });
    await nuevoUsuario.save();

    res.status(201).json({ mensaje: "Usuario registrado correctamente" });
  } catch (error) {
    console.error("Error en register:", error);
    res.status(500).json({ mensaje: "Error interno en el registro" });
  }
});

// ====================================
// 🟢 LOGIN
// ====================================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscar usuario
    const usuario = await Usuario.findOne({ email });
    if (!usuario)
      return res.status(400).json({ mensaje: "Usuario no encontrado" });

    // Comparar contraseñas
    const valido = await usuario.compararPassword(password);
    if (!valido)
      return res.status(400).json({ mensaje: "Contraseña incorrecta" });

    // Crear token
    const token = jwt.sign(
      { id: usuario._id, nombre: usuario.nombre },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      mensaje: "Inicio de sesión exitoso",
      token,
    });
  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ mensaje: "Error interno en el login" });
  }
});

// ====================================
// 🟢 OBTENER USUARIO LOGUEADO
// ====================================
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.usuario.id).select("-password");

    if (!usuario)
      return res.status(404).json({ mensaje: "Usuario no encontrado" });

    res.json(usuario);
  } catch (error) {
    console.error("Error en /me:", error);
    res.status(500).json({ mensaje: "Error al obtener usuario" });
  }
});

export default router;
