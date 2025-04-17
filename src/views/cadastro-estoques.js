import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Stack from '@mui/material/Stack';

import Card from '../components/card';
import FormGroup from '../components/form-group';

import { mensagemSucesso, mensagemErro } from '../components/toastr';

import '../custom.css';

import axios from 'axios';
import { BASE_URL } from '../config/axios';

function getById(id, list) {
	for (let i = 0; i < list.length; i++) {
		// eslint-disable-next-line
		if (list[i].id == id) {
			return list[i];
		}
	}
	return null;
}
function toDate(dateStr = "") {
	if (dateStr === undefined) {
		return new Date();
	}
	return dateStr.split('-').reverse().join('-');
}

function CadastroEstoques() {
	const { idParam } = useParams();

	const navigate = useNavigate();

	const baseURL = `${BASE_URL}jsonfake2/estoques`;

	const [id, setId] = useState('');
	const [quantidade, setQuantidade] = useState(0);
	const [produto, setProduto] = useState(null);
	const [dataFabricacao, setDataFabricacao] = useState('');
	const [dataValidade, setDataValidade] = useState('');
	const [farmacia, setFarmacia] = useState(null);
	const [fornecedor, setFornecedor] = useState([]);

	const [dados, setDados] = useState([]);

	const [listaFarmacias, setListaFarmacias] = useState([]);
	const [listaProdutos, setListaProdutos] = useState([]);
	const [listaFornecedores, setListaFornecedores] = useState([]);

	const [isProdutoDropdownOpen, setIsProdutoDropdownOpen] = useState(false);
	const [isFarmaciaDropdownOpen, setIsFarmaciaDropdownOpen] = useState(false);
	const [isFornecedorDropdownOpen, setIsFornecedorDropdownOpen] = useState(false);

	//const [listaPermissoes, setListaPermissoes] = useState([]);

	function inicializar() {
		if (idParam == null) {
			setId('');
			setQuantidade(0);
			setProduto(null);
			setDataFabricacao('');
			setDataValidade('');
			setFarmacia(null);
			setFornecedor(null);
		} else {
			setId(dados.id);
			setQuantidade(dados.quantidade);
			setProduto(dados.produto);
			setDataFabricacao(toDate(dados.dataFabricacao));
			setDataValidade(toDate(dados.dataValidade));
			setFarmacia(dados.farmacia);
			setFornecedor(dados.fornecedor)
		}
	}

	async function salvar() {
		let data = { id, quantidade, produto, dataFabricacao, dataValidade, farmacia, fornecedor };
		data = JSON.stringify(data);
		if (idParam == null) {
			await axios
				.post(baseURL, data, {
					headers: { 'Content-Type': 'application/json' },
				})
				.then(function (response) {
					mensagemSucesso(`Estoque ${produto.nome + dataFabricacao} cadastrado com sucesso!`);
					navigate(`/listagem-estoques`);
				})
				.catch(function (error) {
					mensagemErro(error.response.data);
				});
		} else {
			await axios
				.put(`${baseURL}/${idParam}`, data, {
					headers: { 'Content-Type': 'application/json' },
				})
				.then(function (response) {
					mensagemSucesso(`Estoque ${produto.nome + " " + dataFabricacao} alterado com sucesso!`);
					navigate(`/listagem-estoques`);
				})
				.catch(function (error) {
					mensagemErro(error.response.data);
				});
		}
	}


	async function buscar() {
		if (idParam != null) {
			await axios.get(`${baseURL}/${idParam}`).then((response) => {
				setDados(response.data);
			}).catch((a) => {
				console.log(a);
			});
			setId(dados.id);
			setQuantidade(dados.quantidade);
			setProduto(dados.produto);
			setDataFabricacao(dados.dataFabricacao);
			setDataValidade(dados.dataValidade);
			setFarmacia(dados.farmacia);
			setFornecedor(dados.fornecedor);
		}
		await axios.get(`${BASE_URL}/jsonfake/farmacias`).then((response) => {
			setListaFarmacias(response.data);
		}).catch((a) => {
			//console.log(a);
		});
		await axios.get(`${BASE_URL}/jsonfake/produtos`).then((response) => {
			setListaProdutos(response.data);
		}).catch((a) => {
			//console.log(a);
		});
		await axios.get(`${BASE_URL}/jsonfake4/fornecedores`).then((response) => {
			setListaFornecedores(response.data);
		}).catch((a) => {
			//console.log(a);
		});
	}

	useEffect(() => {
		buscar(); // eslint-disable-next-line
	}, [id]);

	if (!dados) return null;

	return (
		<div className='container'>
			<Card title='Cadastro de Estoque'>
				<div className='row'>
					<div className='col-lg-12'>
						<div className='bs-component'>
							<FormGroup label='Quantidade: *' htmlFor='inputQuantidade'>
								<input
									type='text'
									id='inputQuantidade'
									value={quantidade}
									className='form-control'
									name='quantidade'
									onChange={(e) => setQuantidade(e.target.value)}
								/>
							</FormGroup>
							<FormGroup label='Produto: *' htmlFor='inputProduto'>
								<div className="select-arrow-wrapper">
									<select
										id='inputProduto'
										value={produto == null ? 0 : produto.id}
										className='form-control'
										name='produto'
										onChange={(e) => setProduto(getById(e.target.value, listaProdutos))}
										onClick={() => setIsProdutoDropdownOpen(!isProdutoDropdownOpen)}
										onBlur={() => setIsProdutoDropdownOpen(false)}
									>
										<option value="null" key="0"> -- Selecione um Produto -- </option>
										{listaProdutos.map((cat) => (
											<option value={cat.id} key={cat.id}>{cat.nome}</option>
										))}
									</select>
									<div className={`arrow ${isProdutoDropdownOpen ? 'open' : ''}`}></div>
								</div>
							</FormGroup>

							<FormGroup label='Data de Fabricação: *' htmlFor='inputDataFabricacao'>
								<input
									type='date'
									id='inputDataFabricacao'
									defaultValue={toDate(dataFabricacao)}
									className='form-control'
									name='dataFabricacao'
									onChange={(e) => setDataFabricacao(toDate(e.target.value))}
								/>
							</FormGroup>
							<FormGroup label='Data de Validade: *' htmlFor='inputDataValidade'>
								<input
									type='date'
									id='inputDataValidade'
									value={toDate(dataValidade)}
									className='form-control'
									name='dataValidade'
									onChange={(e) => setDataValidade(toDate(e.target.value))}
								/>
							</FormGroup>

							<FormGroup label='Farmácia: *' htmlFor='inputFarmacia'>
								<div className="select-arrow-wrapper">
									<select
										id='inputFarmacia'
										value={farmacia == null ? 0 : farmacia.id}
										className='form-control'
										name='farmacia'
										onChange={(e) => setFarmacia(getById(e.target.value, listaFarmacias))}
										onClick={() => setIsFarmaciaDropdownOpen(!isFarmaciaDropdownOpen)}
										onBlur={() => setIsFarmaciaDropdownOpen(false)}
									>
										<option value="null" key="0"> -- Selecione uma Farmácia -- </option>
										{listaFarmacias.map((cat) => (
											<option value={cat.id} key={cat.id}>{cat.nome}</option>
										))}
									</select>
									<div className={`arrow ${isFarmaciaDropdownOpen ? 'open' : ''}`}></div>
								</div>
							</FormGroup>

							<FormGroup label='Fornecedor: *' htmlFor='inputFornecedor'>
								<div className="select-arrow-wrapper">
									<select
										id='inputFornecedor'
										value={fornecedor == null ? 0 : fornecedor.id}
										className='form-control'
										name='fornecedor'
										onChange={(e) => setFornecedor(getById(e.target.value, listaFornecedores))}
										onClick={() => setIsFornecedorDropdownOpen(!isFornecedorDropdownOpen)}
										onBlur={() => setIsFornecedorDropdownOpen(false)}
									>
										<option value="null" key="0"> -- Selecione um Fornecedor -- </option>
										{listaFornecedores.map((cat) => (
											<option value={cat.id} key={cat.id}>{cat.nome}</option>
										))}
									</select>
									<div className={`arrow ${isFornecedorDropdownOpen ? 'open' : ''}`}></div>
								</div>
							</FormGroup>

							<Stack spacing={1} padding={1} direction='row'>
								<button
									onClick={salvar}
									type='button'
									className='btn btn-success'
								>
									Salvar
								</button>
								<button
									onClick={inicializar}
									type='button'
									className='btn btn-danger'
								>
									Cancelar
								</button>
							</Stack>
						</div>
					</div>
				</div>
			</Card>
		</div>
	);
}

export default CadastroEstoques;