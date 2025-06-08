import axios from "axios";

// Las URLs se obtienen de las variables de entorno definidas en .env
export const GENERAL_API_BASE = import.meta.env.VITE_API_GENERAL;

// Instancia para el API Principal
export const generalApi = axios.create({
  baseURL: GENERAL_API_BASE,
  headers: {
    "Content-type": "application/json"
  }
});