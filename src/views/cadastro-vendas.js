// import React, { useState, useEffect } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';

// import Stack from '@mui/material/Stack';

// import Card from '../components/card';
// import FormGroup from '../components/form-group';

// import { mensagemSucesso, mensagemErro } from '../components/toastr';

// import '../custom.css';

// import axios from 'axios';
// import { BASE_URL } from '../config/axios';

// function CadastroVendas() {
// 	const { idParam } = useParams();

// 	const navigate = useNavigate();

// 	const baseURL = `${BASE_URL}jsonfake/vendas`;

// 	const [id, setId] = useState('');
// 	const [nome, setNome] = useState('');
// 	const [pagamento, setPagamento] = useState('');
//     const [dataVenda, setDataVenda] = useState('');

// 	const [dados, setDados] = useState([]);

// 	function inicializar() {
// 		if (idParam == null) {
// 			setId('');
// 			setNome('');
// 			setPagamento('');
// 			setDataVenda('');
	
// 		} else {
// 			setId(dados.id);
// 			setNome(dados.nome);
// 			setPagamento(dados.pagamento);
// 			setDataVenda(dados.dataVenda);
// 		}
// 	}

// 	async function salvar() {
// 		let data = { id, nome, pagamento, dataVenda};
// 		data = JSON.stringify(data);
// 		if (idParam == null) {
// 			await axios
// 				.post(baseURL, data, {
// 					headers: { 'Content-Type': 'application/json' },
// 				})
// 				.then(function (response) { 
// 					mensagemSucesso(`Venda ${nome} cadastrada com sucesso!`);
// 					navigate(`/listagem-vendas`);
// 				})
// 				.catch(function (error) {
// 					mensagemErro(error.response.data);
// 				});
// 		} else {
// 			await axios
// 				.put(`${baseURL}/${idParam}`, data, {
// 					headers: { 'Content-Type': 'application/json' },
// 				})
// 				.then(function (response) {
// 					mensagemSucesso(`Venda ${nome} alterada com sucesso!`);
// 					navigate(`/listagem-vendas`);
// 				})
// 				.catch(function (error) {
// 					mensagemErro(error.response.data);
// 				});
// 		}
// 	}


// 	async function buscar() {
// 		if (idParam != null) {
// 			await axios.get(`${baseURL}/${idParam}`).then((response) => {
// 				if (response.data == null) return;
// 				setDados(response.data);
// 			}).catch((a) => {
// 				//console.log(a);
// 			});
// 			if (dados == null){
// 				//console.log(JSON.stringify(response));
// 				//return;
// 			} 
// 			setId(dados.id);
// 			setNome(dados.nome);
// 			setPagamento(dados.pagamento);
//             setDataVenda(dados.dataVenda);
// 		}
// 	}

// 	useEffect(() => {
// 		buscar(); // eslint-disable-next-line
// 	}, [id]);

// 	if (!dados) return null;

// 	return (
// 		<div className='container'>
// 			<Card title='Cadastro de Venda'>
// 				<div className='row'>
// 					<div className='col-lg-12'>
// 						<div className='bs-component'>
// 							<FormGroup label='Nome: *' htmlFor='inputNome'>
// 								<input
// 									type='text'
// 									id='inputNome'
// 									value={nome}
// 									className='form-control'
// 									name='nome'
// 									onChange={(e) => setNome(e.target.value)}
// 								/>
// 							</FormGroup>
// 							<FormGroup label='E-mail: *' htmlFor='inputPagamento'>
// 								<input
// 									//type='text'
// 									id='inputPagamento'
// 									value={pagamento}
// 									className='form-control'
// 									name='pagamento'
// 									onChange={(e) => setPagamento(e.target.value)}
// 								/>
// 							</FormGroup>
// 							<FormGroup label='CNPJ: *' htmlFor='inputDataVenda'>
// 								<input
// 									type='date'
// 									//maxLength='11'
// 									id='inputDataVenda'
// 									value={dataVenda}
// 									className='form-control'
// 									name='dataVenda'
// 									onChange={(e) => setDataVenda(e.target.value)}
// 								/>
// 							</FormGroup>
							
// 							<Stack spacing={1} padding={1} direction='row'>
// 								<button
// 									onClick={salvar}
// 									type='button'
// 									className='btn btn-success'
// 								>
// 									Salvar
// 								</button>
// 								<button
// 									onClick={inicializar}
// 									type='button'
// 									className='btn btn-danger'
// 								>
// 									Cancelar
// 								</button>
// 							</Stack> 
// 						</div>
// 					</div>
// 				</div>
// 			</Card>
// 		</div>
// 	);
// }

// export default CadastroVendas;