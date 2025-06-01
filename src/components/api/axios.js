import axios from "axios";
import BASE_URL from "../routes/serverRoutes";
export default axios.create({
   baseURL: BASE_URL,
   //baseURL: "https://mimlyricstest5-api.onrender.com",
})
