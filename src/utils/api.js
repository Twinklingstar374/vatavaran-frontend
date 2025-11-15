import axios from "axios";
console.log("DEBUG: NEXT_PUBLIC_API_URL =", process.env.NEXT_PUBLIC_API_URL);

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ,
  withCredentials: false,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
