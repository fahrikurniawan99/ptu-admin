import config from "@/config";
import axios from "axios";

export const mainApi = axios.create({ baseURL: config.apiUrl });
export const masterApi = axios.create({ baseURL: config.masterApiUrl });
