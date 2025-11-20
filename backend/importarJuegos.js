import mongoose from "mongoose";
import fs from "fs";
import dotenv from "dotenv";
import Juego from "./models/Juego.js";

dotenv.config();

const USUARIO_ID = "PON_AQUI_EL_ID_DEL_USUARIO"; // ⚠️ Tu ID de usuario

mongoose
  .connect(process.env.MONGO_URI, { dbName: "gametracker" })
  .then(() => {
    console.log("✅ Conectado a MongoDB");
    importarDatos();
  })
  .catch((err) => console.error("❌ Error al conectar:", err));

async function importarDatos() {
  try {
    const archivo = fs.readFileSync("./juegos.json", "utf-8");
    let juegos = JSON.parse(archivo);

    juegos = juegos.map((juego) => ({ ...juego, usuario: USUARIO_ID }));

    await Juego.deleteMany({});
    console.log("🗑 Colección limpia");

    await Juego.insertMany(juegos);
    console.log(`🎮 ${juegos.length} juegos importados`);
    process.exit();
  } catch (error) {
    console.error("❌ Error al importar:", error);
    process.exit(1);
  }
}
