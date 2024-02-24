import axios from "axios";
import RuntimeEnv from "../config/RuntimeEnv";
const api = axios.create({
    baseURL: RuntimeEnv.BASE_URL,
});

export default api;
