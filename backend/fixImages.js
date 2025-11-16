// fixImages.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import Juego from "./models/Juego.js";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

const urlsCorregidas = {
  "Super Mario Odyssey": "https://upload.wikimedia.org/wikipedia/en/8/8d/Super_Mario_Odyssey.jpg",
  "Portal 2": "https://upload.wikimedia.org/wikipedia/en/f/f9/Portal2cover.jpg",
  "Hogwarts Legacy": "https://upload.wikimedia.org/wikipedia/en/0/0b/Hogwarts_Legacy_cover.jpg",
  "Cyberpunk 2077": "https://upload.wikimedia.org/wikipedia/en/9/9f/Cyberpunk_2077_box_art.jpg",
  "Red Dead Redemption 2": "https://upload.wikimedia.org/wikipedia/en/4/44/Red_Dead_Redemption_II.jpg",
  "The Witcher 3: Wild Hunt": "https://upload.wikimedia.org/wikipedia/en/0/0c/Witcher_3_cover_art.jpg",
  "Left 4 Dead": "https://upload.wikimedia.org/wikipedia/en/5/5b/Left4Dead_Windows_cover.jpg"
};

async function fixImages() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Conectado a MongoDB Atlas\n");

    for (const [titulo, nuevaUrl] of Object.entries(urlsCorregidas)) {
      const juego = await Juego.findOne({ titulo });
      if (juego) {
        juego.portada = nuevaUrl;
        await juego.save();
        console.log(`🔧 Actualizada portada de: ${titulo}`);
      } else {
        console.log(`⚠️ No se encontró el juego: ${titulo}`);
      }
    }

    console.log("\n✨ Todas las portadas fueron verificadas y corregidas.");
    mongoose.connection.close();
  } catch (error) {
    console.error("❌ Error al corregir portadas:", error);
  }
}

fixImages();