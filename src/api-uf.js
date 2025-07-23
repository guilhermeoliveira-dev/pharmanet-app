import { API_UF_BASE_URL } from "./config/axios";
import axios from "axios";

const baseURL = API_UF_BASE_URL;

export async function buscar_ufs() {
    
    try {

        const response = await axios.get(`${baseURL}`);


        if (response.data.erro) {
            throw new Error('Erro ao buscar lista de UFs.');
        }
        return response.data;

    } catch (error) {

        throw error;
    }
}

