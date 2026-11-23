import axios from "axios";

const api = axios.create({
  baseURL: "https://stockpilot-api-tn3t.onrender.com/api", 
});

export default api;