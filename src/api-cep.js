import { API_CEP_BASE_URL } from "./config/axios";
import axios from "axios";

const baseURL = API_CEP_BASE_URL;


function formatar(cep) {
    // Garante que o input é uma string usável
    if (typeof cep !== 'string' || cep.trim().length === 0 || ( cep.trim().length !== 8 && cep.trim().length !== 9)) {
        throw new Error('CEP não fornecido ou inválido.');
    }

    const cepLimpo = cep.trim();

    // Regex para validar o formato XXXXX-XXX ou XXXXXXXX
    const regexCEP = /^\d{5}-?\d{3}$/;

    if (regexCEP.test(cepLimpo)) {
        // Retorna o CEP sem o hífen para ser usado na API
        return cepLimpo.replace('-', '');
    } else {
        // Lança um erro específico sobre o formato
        throw new Error('Formato de CEP inválido. O formato deve ser 12345-678 ou 12345678.');
    }
}


async function validarCep(cep) {
    

    // Usamos um bloco try...catch para lidar com TODAS as possíveis exceções
    try {
        // 1. Valida e formata. Se inválido, vai pular direto para o `catch`
        const cepFormatado = formatar(cep);

        const response = await axios.get(`${baseURL}/${cepFormatado}/json`);

        // 2. A API ViaCEP retorna um objeto com `{"erro": true}` para CEPs válidos no formato, mas inexistentes.
        // Esta é uma verificação crucial.
        if (response.data.erro) {
            throw new Error('CEP não encontrado.');
        }

        // 3. Se tudo deu certo, retorna os dados
        return response.data;

    } catch (error) {
        // O bloco catch captura erros de:
        // a) validarEFormatarCep()
        // b) Erros da chamada axios (ex: rede, 404, 500)
        // c) O erro "CEP não encontrado" que lançamos acima

        // Para depuração, é bom ver o erro original no console
        //console.error("Ocorreu um erro ao buscar o CEP:", error.message);

        // Lança o erro novamente para que a função que chamou `buscarDadosCep`
        // possa saber que algo deu errado e tratar a exceção.
        // Isso preserva a mensagem de erro específica.
        throw error;
    }
}

export default validarCep;