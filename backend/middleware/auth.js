import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export default function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ mensaje: "Acceso denegado. No hay token." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const verificado = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = verificado;
    next();
  } catch (error) {
    res.status(401).json({ mensaje: "Token inválido" });
  }
}