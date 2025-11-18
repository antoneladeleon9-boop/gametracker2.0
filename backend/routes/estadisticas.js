import express from "express";
import Resena from "../models/Resena.js";
import Juego from "../models/Juego.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

// ================================================
// 📊 ESTADÍSTICAS GLOBALES
// ================================================
router.get("/", authMiddleware, async (req, res) => {
  try {
    const usuarioId = req.usuario.id;

    const resenas = await Resena.find({ usuarioId });

    const totalResenas = resenas.length;

    const promedioGlobal =
      totalResenas > 0
        ? (resenas.reduce((acc, r) => acc + r.puntuacion, 0) / totalResenas).toFixed(2)
        : 0;

    const recomendados = resenas.filter((r) => r.recomendaria === true).length;
    const noRecomendados = resenas.filter((r) => r.recomendaria === false).length;

    const dificultadGlobal = {
      "Fácil": resenas.filter((r) => r.dificultad === "Fácil").length,
      "Normal": resenas.filter((r) => r.dificultad === "Normal").length,
      "Difícil": resenas.filter((r) => r.dificultad === "Difícil").length,
    };

    const puntuaciones = {
      1: resenas.filter((r) => r.puntuacion === 1).length,
      2: resenas.filter((r) => r.puntuacion === 2).length,
      3: resenas.filter((r) => r.puntuacion === 3).length,
      4: resenas.filter((r) => r.puntuacion === 4).length,
      5: resenas.filter((r) => r.puntuacion === 5).length,
    };

    // =============================
    // ⭐ TOP 5 MÁS HORAS
    // =============================
    const topHoras = await Resena.aggregate([
      { $match: { usuarioId } },
      {
        $group: {
          _id: "$juegoId",
          horas: { $sum: "$horasJugadas" },
        },
      },
      { $sort: { horas: -1 } },
      { $limit: 5 },
    ]);

    const juegosHoras = await Promise.all(
      topHoras.map(async (item) => {
        const juego = await Juego.findById(item._id);
        return { juego, horas: item.horas };
      })
    );

    // =============================
    // ⭐ TOP 5 MEJOR PUNTUADOS
    // =============================
    const topPuntuacion = await Resena.aggregate([
      { $match: { usuarioId } },
      {
        $group: {
          _id: "$juegoId",
          promedio: { $avg: "$puntuacion" },
        },
      },
      { $sort: { promedio: -1 } },
      { $limit: 5 },
    ]);

    const juegosPuntuacion = await Promise.all(
      topPuntuacion.map(async (item) => {
        const juego = await Juego.findById(item._id);
        return { juego, promedio: item.promedio.toFixed(2) };
      })
    );

    // RESPUESTA FINAL
    res.json({
      totalResenas,
      promedioGlobal,
      recomendados,
      noRecomendados,
      dificultadGlobal,
      puntuaciones,
      topHoras: juegosHoras,
      topPuntuacion: juegosPuntuacion,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error obteniendo estadísticas" });
  }
});

export default router;   // ⬅️ ESTA LÍNEA ES OBLIGATORIA
