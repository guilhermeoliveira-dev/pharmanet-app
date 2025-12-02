import axios from 'axios';

export const BASE_URL = 'http://localhost:8080/api/v1'
//'https://my-json-server.typicode.com/marcoaparaujo/jsonfake'; 
export const API_CEP_BASE_URL = 'https://viacep.com.br/ws'
export const API_UF_BASE_URL = 'https://servicodados.ibge.gov.br/api/v1/localidades/estados'




const api = axios.create({
    baseURL: BASE_URL
});


api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);


export default api;