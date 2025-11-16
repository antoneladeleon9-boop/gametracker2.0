const API_URL = "http://localhost:5000/api";

export const registerUser = async (userData) => {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  return res.json();
};

export const loginUser = async (userData) => {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  return res.json();
};

export const getJuegos = async (token) => {
  const res = await fetch(`${API_URL}/juegos`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
};

export const addJuego = async (token, juego) => {
  const res = await fetch(`${API_URL}/juegos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(juego),
  });
  return res.json();
};