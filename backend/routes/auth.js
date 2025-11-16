import express from "express";
import jwt from "jsonwebtoken";
import Usuario from "../models/Usuario.js";
import dotenv from "dotenv";
import authMiddleware from "../middleware/auth.js";

dotenv.config();
const router = express.Router();

// 🟢 REGISTRO DE USUARIO
router.post("/register", async (req, res) => {
  try {
    const { nombre, email, password } = req.body;

    const existe = await Usuario.findOne({ email });
    if (existe) return res.status(400).json({ mensaje: "El usuario ya existe" });

    const nuevoUsuario = new Usuario({ nombre, email, password });
    await nuevoUsuario.save();

    res.status(201).json({ mensaje: "Usuario registrado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error en el registro" });
  }
});

// 🟢 LOGIN DE USUARIO
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const usuario = await Usuario.findOne({ email });
    if (!usuario) return res.status(400).json({ mensaje: "Usuario no encontrado" });

    const esValido = await usuario.compararPassword(password);
    if (!esValido) return res.status(400).json({ mensaje: "Contraseña incorrecta" });

    const token = jwt.sign(
      { id: usuario._id, nombre: usuario.nombre },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ mensaje: "Inicio de sesión exitoso", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error en el inicio de sesión" });
  }
});

// 🟢 NUEVA RUTA: OBTENER DATOS DEL USUARIO LOGUEADO
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.usuario.id).select("-password");
    if (!usuario) return res.status(404).json({ mensaje: "Usuario no encontrado" });
    res.json(usuario);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al obtener datos del usuario" });
  }
});

export default router;