import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

// Rutas
import authRoutes from "./routes/auth.js";
import juegosRoutes from "./routes/juegos.js";

dotenv.config();

const app = express();

// =========================
// 🔥 MIDDLEWARES
// =========================
app.use(cors());
app.use(express.json());

// =========================
// 🔥 CONEXIÓN A MONGODB
// =========================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("📌 Conectado a MongoDB"))
  .catch((err) => console.error("❌ Error al conectar MongoDB:", err));

// =========================
// 🔥 RUTAS PRINCIPALES
// =========================
app.use("/api/auth", authRoutes);
app.use("/api/juegos", juegosRoutes);

// =========================
// ⚠ Ruta base
// =========================
app.get("/", (req, res) => {
  res.send("API funcionando correctamente");
});

// =========================
// 🚀 LEVANTAR SERVIDOR
// =========================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor backend corriendo en http://localhost:${PORT}`);
});
