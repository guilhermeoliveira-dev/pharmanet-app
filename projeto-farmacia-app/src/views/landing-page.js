import React from 'react';

// import Card from '../components/card';

import TextField from "@mui/material/TextField";

// import { mensagemSucesso, mensagemErro } from '../components/toastr';

import '../custom.css';

// import { useNavigate } from 'react-router-dom';

// import Stack from '@mui/material/Stack';
// import { IconButton } from '@mui/material';
// import DeleteIcon from '@mui/icons-material/Delete';
// import EditIcon from '@mui/icons-material/Edit';

import axios from 'axios';
import { BASE_URL } from '../config/axios';

const baseURL = `${BASE_URL}jsonfake/produtos`;

// const relacaoCores = new Map();
// //relacaoCores.set("", "");
// // não sei se é necessário relacionar "" com "", visto que o código funciona sem essa relação, apesar de isso soar como um erro.
// relacaoCores.set("Vermelha", "red");
// relacaoCores.set("Preta", "black");

function LandingPage() {
    // const navigate = useNavigate();

    //   const cadastrar = () => {
    //     navigate(`/cadastro-produtos`);
    //   };

    //   const editar = (id) => {
    //     navigate(`/cadastro-produtos/${id}`);
    //   };

    const [dados, setDados] = React.useState(null);

    //   async function excluir(id) {
    //     let data = JSON.stringify({ id });
    //     let url = `${baseURL}/${id}`;
    //     console.log(url);
    //     await axios
    //       .delete(url, data, {
    //         headers: { 'Content-Type': 'application/json' },
    //       })
    //       .then(function (response) {
    //         mensagemSucesso(`Produto excluído com sucesso!`);
    //         setDados(
    //           dados.filter((dado) => {
    //             return dado.id !== id;
    //           })
    //         );
    //       })
    //       .catch(function (error) {
    //         mensagemErro(`Erro ao excluir o produto`);
    //       });
    //   }

    React.useEffect(() => {
        axios.get(baseURL).then((response) => {
            setDados(response.data);
        });
    }, []);

    if (!dados) return null;
    return (
        <div className='container'>


            <h1>Catálogo</h1>
            <div className="search">
                <TextField
                    id="outlined-basic"
                    variant="outlined"
                    fullWidth
                    label="Pesquisar"
                />
            </div>


        </div>
    );
    
}


export default LandingPage;