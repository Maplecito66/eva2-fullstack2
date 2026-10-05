// src/services/api.js

// Reemplaza esta URL con el endpoint real de tu backend cuando lo tengan levantado
const API_URL = "http://localhost:3000/api"; 

// ==========================================
// CRUD PARA PRODUCTOS
// ==========================================

export const getProductos = async () => {
  try {
    const response = await fetch(`${API_URL}/productos`);
    if (!response.ok) throw new Error("Error al obtener los productos");
    return await response.json();
  } catch (error) {
    console.error(error);
    return []; // Retorna un arreglo vacío si falla la API para no romper la vista
  }
};

export const addProducto = async (nuevoProducto) => {
  const response = await fetch(`${API_URL}/productos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(nuevoProducto),
  });
  return await response.json();
};

export const deleteProducto = async (id) => {
  const response = await fetch(`${API_URL}/productos/${id}`, {
    method: "DELETE",
  });
  return response.ok;
};

// ==========================================
// CRUD PARA USUARIOS
// ==========================================

export const getUsuarios = async () => {
  const response = await fetch(`${API_URL}/usuarios`);
  return await response.json();
};