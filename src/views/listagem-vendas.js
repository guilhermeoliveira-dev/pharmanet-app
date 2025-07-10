import React from 'react';

import Card from '../components/card';

// import { mensagemSucesso, mensagemErro } from '../components/toastr';

import '../custom.css';

// import { useNavigate } from 'react-router-dom';

// import Stack from '@mui/material/Stack';
// import { IconButton } from '@mui/material';
// import DeleteIcon from '@mui/icons-material/Delete';
// import EditIcon from '@mui/icons-material/Edit';

import axios from 'axios';
import { BASE_URL } from '../config/axios';

const baseURL = `${BASE_URL}/vendas`;

// const relacaoCores = new Map();
// //relacaoCores.set("", "");
// // não sei se é necessário relacionar "" com "", visto que o código funciona sem essa relação, apesar de isso soar como um erro.
// relacaoCores.set("Vermelha", "red");
// relacaoCores.set("Preta", "black");

function ListagemVendas() {
	//   const navigate = useNavigate();

	//   const cadastrar = () => {
	//     navigate(`/cadastro-vendas`);
	//   };

	//   const editar = (id) => {
	//     navigate(`/cadastro-vendas/${id}`);
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
	//         mensagemSucesso(`Venda excluída com sucesso!`);
	//         setDados(
	//           dados.filter((dado) => {
	//             return dado.id !== id;
	//           })
	//         );
	//       })
	//       .catch(function (error) {
	//         mensagemErro(`Erro ao excluir a venda`);
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
			<Card title='Listagem de Vendas'>
				<div className='row'>
					<div className='col-lg-12'>
						<div className='bs-component'>
							{/* <button
                type='button'
                className='btn btn-warning'
                onClick={() => cadastrar()}
              >
                Nova Venda
              </button> */}
							<table className='table table-hover'>
								<thead>
									<tr>
										
										<th scope='col'>Pedido</th>
										<th scope='col'>Pagamento</th>
										<th scope='col'>Data da Venda</th>
									</tr>
								</thead>
								<tbody>
									{dados.map((dado) => (

										<tr key={dado.id}>
											<td>{dado.pedido.codigo}</td>
											<td>{"R$"+dado.pagamento.valor.toFixed(2)}</td>
											<td>{dado.dataVenda}</td>
											{/* <Stack spacing={1} padding={0} direction='row'>
                          <IconButton
                            aria-label='edit'
                            style={{ color: "white"}}
                            onClick={() => editar(dado.id)}
                          >
                            <EditIcon /> 
                          </IconButton>
                          <IconButton
                            aria-label='delete'
                            style={{ color: "red"}}
                            onClick={() => excluir(dado.id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Stack> */}

										</tr>
									))}
								</tbody>
							</table>{' '}
						</div>
					</div>
				</div>
			</Card>
		</div>
	);
}

export default ListagemVendas;