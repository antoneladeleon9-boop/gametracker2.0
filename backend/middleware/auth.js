import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export default function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  // No se envió encabezado
  if (!authHeader) {
    return res
      .status(401)
      .json({ mensaje: "Acceso denegado. No se encontró el token." });
  }

  // Debe venir como "Bearer token"
  const [tipo, token] = authHeader.split(" ");

  if (tipo !== "Bearer" || !token) {
    return res
      .status(401)
      .json({ mensaje: "Token inválido o formato incorrecto." });
  }

  try {
    // Verificar token
    const verificado = jwt.verify(token, process.env.JWT_SECRET);

    // Guardar usuario dentro del req
    req.usuario = verificado;

    next();
  } catch (error) {
    console.error("Error en authMiddleware:", error);
    res.status(401).json({ mensaje: "Token inválido o expirado." });
  }
}
