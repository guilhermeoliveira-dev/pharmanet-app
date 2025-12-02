import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Stack from '@mui/material/Stack';

import Card from '../components/card';
import FormGroup from '../components/form-group';

import { mensagemSucesso, mensagemErro } from '../components/toastr';

import '../custom.css';

// import axios from 'axios';
import { BASE_URL } from '../config/axios';
import api from '../config/axios';

import validarCep from '../api-cep';
import { buscar_ufs } from '../api-uf';

function toDate(dateStr = "") {
	if (dateStr === undefined || dateStr == null) {
		return new Date();
	}
	return dateStr.split('-').reverse().join('-');
}


function CadastroFuncionarios() {
	const { idParam } = useParams();

	const navigate = useNavigate();

	const baseURL = `${BASE_URL}/funcionarios`;

	const [id, setId] = useState('');
	const [nome, setNome] = useState('');
	const [email, setEmail] = useState('');
	const [cpf, setCpf] = useState('');
	const [senha, setSenha] = useState('');
	const [senhaRepeticao, setSenhaRepeticao] = useState('');
	const [telefone, setTelefone] = useState('');
	const [cargo, setCargo] = useState(0);
	const [dataAdmissao, setDataAdmissao] = useState('');
	const [salario, setSalario] = useState(0);
	const [expediente, setExpediente] = useState('');
	const [farmacia, setFarmacia] = useState(0);

	// endereço
	const [uf, setUf] = useState('');
	const [cidade, setCidade] = useState('');
	const [cep, setCep] = useState('');
	const [bairro, setBairro] = useState('');
	const [logradouro, setLogradouro] = useState('');
	const [numero, setNumero] = useState('');
	const [complemento, setComplemento] = useState('');

	const [listaCargos, setListaCargos] = useState([]);
	const [listaFarmacias, setListaFarmacias] = useState([]);
	const [listaUFs, setlistaUFs] = useState([]);

	const [dados, setDados] = useState([]);

	async function verificarCep(cep) {

		try {
			const validacaoDados = await validarCep(cep);
			console.log(validacaoDados);

			setUf(validacaoDados.uf);
			setCidade(validacaoDados.localidade);
			// setCep(validacaoDados.cep);
			setBairro(validacaoDados.bairro);
			setLogradouro(validacaoDados.logradouro);
			setNumero('');
			// setComplemento(validacaoDados.complemento);

			// Comentei o complemento porque os complementos que vem da api são meio 
			// estranhos, muitas vezes são coisas do tipo "de 1000 ate 2000" ou coisa 
			// parecida. eu optei por tirar e deixar o usuário preencher se quiser.

		}
		catch (e) {
			mensagemErro(e.message);
		}

	}

	async function buscar_ufs_func() {
		try {
			const api_response = await buscar_ufs();

			setlistaUFs(api_response);
		}
		catch (e) {
			mensagemErro(e.message);
		}
	}

	function inicializar() {
		if (idParam == null) {
			setId('');
			setNome('');
			setEmail('');
			setCpf('');
			setSenha('');
			setSenhaRepeticao('');
			setTelefone('');
			setCargo(0);
			setDataAdmissao('');
			setSalario('');
			setExpediente('');
			setFarmacia(0);
			// endereço
			setUf('');
			setCidade('');
			setCep('');
			setBairro('');
			setLogradouro('');
			setNumero('');
			setComplemento('');
		} else {
			setId(dados.id);
			setNome(dados.nome);
			setEmail(dados.email);
			setCpf(dados.cpf);
			setSenha(dados.senha);
			setSenhaRepeticao(dados.senhaRepeticao);
			setTelefone(dados.telefone);
			setCargo(dados.idCargo);
			setDataAdmissao(dados.dataAdmissao);
			setSalario(dados.salario);
			setExpediente(dados.expediente);
			setFarmacia(dados.idFarmacia);
			// endereço
			setUf(dados.uf);
			setCidade(dados.cidade);
			setCep(dados.cep);
			setBairro(dados.bairro);
			setLogradouro(dados.logradouro);
			setNumero(dados.numero);
			setComplemento(dados.complemento);
		}
	}

	async function salvar() {
		if (senha !== senhaRepeticao && idParam === null){
			mensagemErro("As senhas devem ser iguais");
			return;
		}
		let data = { id, nome, email, cpf, senha, telefone, uf, cidade, cep, bairro, logradouro, numero, complemento, idCargo: cargo, dataAdmissao, salario, expediente, idFarmacia: farmacia };
		data = JSON.stringify(data);
		if (idParam == null) {
			await api
				.post(baseURL, data, {
					headers: { 'Content-Type': 'application/json' },
				})
				.then(function (response) {
					mensagemSucesso(`Funcionário ${nome} cadastrado com sucesso!`);
					navigate(`/listagem-funcionarios`);
				})
				.catch(function (error) {
					mensagemErro(error.response.data);
				});
		} else {
			await api
				.put(`${baseURL}/${idParam}`, data, {
					headers: { 'Content-Type': 'application/json' },
				})
				.then(function (response) {
					mensagemSucesso(`Funcionário ${nome} alterado com sucesso!`);
					navigate(`/listagem-funcionarios`);
				})
				.catch(function (error) {
					mensagemErro(error.response.data);
				});
		}
	}


	async function buscar() {
		if (idParam != null) {
			await api.get(`${baseURL}/${idParam}`).then((response) => {
				setDados(response.data);
			}).catch((a) => {
				console.log(a);
			});
			setId(dados.id);
			setNome(dados.nome);
			setEmail(dados.email);
			setCpf(dados.cpf);
			setSenha(dados.senha);
			setSenhaRepeticao(dados.senhaRepeticao);
			setTelefone(dados.telefone);
			setCargo(dados.idCargo);
			setDataAdmissao(dados.dataAdmissao);
			setSalario(dados.salario);
			setExpediente(dados.expediente);
			setFarmacia(dados.idFarmacia);
			// endereço
			try {
				setUf(dados.uf);
				setCidade(dados.cidade);
				setCep(dados.cep);
				setBairro(dados.bairro);
				setLogradouro(dados.logradouro);
				setNumero(dados.numero);
				setComplemento(dados.complemento);
			}
			catch (e) {

			}
		}
		await api.get(`${BASE_URL}/cargos`).then((response) => {
			setListaCargos(response.data);
		}).catch((a) => {
			//console.log(a);
		});
		await api.get(`${BASE_URL}/farmacias`).then((response) => {
			setListaFarmacias(response.data);
		}).catch((a) => {
			//console.log(a);
		});

		buscar_ufs_func();

	}


	useEffect(() => {
		buscar(); // eslint-disable-next-line
	}, [id]);

	if (!dados) return null;

	return (
		<div className='container'>
			<Card title='Cadastro de Funcionário'>
				<div className='row'>
					<div className='col-lg-12'>
						<div className='bs-component'>
							<FormGroup label='Nome: *' htmlFor='inputNome'>
								<input
									type='text'
									id='inputNome'
									value={nome}
									className='form-control'
									name='nome'
									onChange={(e) => setNome(e.target.value)}
								/>
							</FormGroup>
							<FormGroup label='E-mail: *' htmlFor='inputEmail'>
								<input
									type='text'
									id='inputEmail'
									value={email}
									className='form-control'
									name='email'
									onChange={(e) => setEmail(e.target.value)}
								/>
							</FormGroup>
							<FormGroup label='CPF: *' htmlFor='inputCpf'>
								<input
									type='text'
									maxLength='11'
									id='inputCpf'
									value={cpf}
									className='form-control'
									name='cpf'
									onChange={(e) => setCpf(e.target.value)}
								/>
							</FormGroup>
							<FormGroup label='Senha: *' htmlFor='inputSenha'>
								<input
									type='password'
									id='inputSenha'
									value={senha}
									className='form-control'
									name='senha'
									onChange={(e) => setSenha(e.target.value)}
								/>
							</FormGroup>
							<FormGroup label='Repita a Senha: *' htmlFor='inputRepitaSenha'>
								<input
									type='password'
									id='inputRepitaSenha'
									value={senhaRepeticao}
									className='form-control'
									name='senhaRepeticao'
									onChange={(e) => setSenhaRepeticao(e.target.value)}
								/>
							</FormGroup>
							<FormGroup label='Telefone: ' htmlFor='inputTelefone'>
								<input
									type='text'
									id='inputTelefone'
									value={telefone}
									className='form-control'
									name='telefone'
									onChange={(e) => setTelefone(e.target.value)}
								/>
							</FormGroup>
							<FormGroup label='Data de Admissão: ' htmlFor='inputDataAdmissao'>
								<input
									type='date'
									id='inputDataAdmissao'
									value={toDate(dataAdmissao)}
									className='form-control'
									name='dataAdmissao'
									onChange={(e) => setDataAdmissao(toDate(e.target.value))}
								/>
							</FormGroup>
							<FormGroup label='Cargo: ' htmlFor='inputCargo'>

								<select
									className="form-select"
									id='inputCargo'
									value={cargo}
									name='cargo'
									onChange={(e) => setCargo(e.target.value)}
								>
									<option value="null" key="0"> -- Selecione um Cargo -- </option>
									{listaCargos.map((cat) => (
										<option value={cat.id} key={cat.id}>{cat.nome}</option>
									))}
								</select>
							</FormGroup>
							<FormGroup label='Salário: *' htmlFor='inputSalario'>
								<input
									type='number'
									// min='0'
									// max='10000000'
									// step='0.01'
									id='inputSalario'
									value={salario}
									className='form-control'
									name='salario'
									onChange={(e) => setSalario(e.target.value)}
								/>
							</FormGroup>
							<FormGroup label='Expediente: ' htmlFor='inputExpediente'>
								<select
									id='inputExpediente'
									value={expediente}
									className='form-select'
									name='expediente'
									onChange={(e) => setExpediente(e.target.value)}
								>
									<option value="" key="vazio"> -- Selecione um Expediente -- </option>
									<option value="manha" key="manha">Manhã</option>
									<option value="tarde" key="tarde">Tarde</option>
									<option value="noite" key="noite">Noite</option>
									<option value="madrugada" key="madrugada">Madrugada</option>
								</select>
							</FormGroup>

							<FormGroup label='Farmácia: ' htmlFor='inputFarmacia'>

								<select
									id='inputFarmacia'
									value={farmacia}
									className='form-select'
									name='farmacia'
									onChange={(e) => setFarmacia(e.target.value)}
								>
									<option value="0" key="0"> -- Selecione uma Farmácia -- </option>
									{listaFarmacias.map((cat) => (
										<option value={cat.id} key={cat.id}>{cat.nome}</option>
									))}
								</select>
							</FormGroup>

							<br></br><h2>Endereço:</h2>

							<FormGroup label='CEP: *' htmlFor='inputCep'>
								<input
									type='text'
									id='inputCep'
									value={cep}
									className='form-control'
									name='cep'
									onChange={(e) => setCep(e.target.value)}
								/>
								<button
									type='button'
									id='validarInputCep'
									className='btn btn-info'
									name='validarCep'
									onClick={(e) => verificarCep(cep)}
									label='Validar CEP'
								>
									Validar CEP
								</button>
							</FormGroup>

							<FormGroup label='UF: *' htmlFor='inputUf'>
								<select
									id='inputUf'
									value={uf}
									className='form-select'
									name='uf'
									onChange={(e) => setUf(e.target.value)}
								>
									<option value="" key="vazio"> -- Selecione uma Unidade Federal -- </option>

									{listaUFs.map((cat) => (
										<option value={cat.sigla} key={cat.id}>{cat.nome}</option>
									))}
								</select>
							</FormGroup>
							<FormGroup label='Cidade: *' htmlFor='inputCidade'>
								<input
									type='text'
									id='inputCidade'
									value={cidade}
									className='form-control'
									name='cidade'
									onChange={(e) => setCidade(e.target.value)}
								/>
							</FormGroup>
							<FormGroup label='Bairro: *' htmlFor='inputBairro'>
								<input
									type='text'
									id='inputBairro'
									value={bairro}
									className='form-control'
									name='bairro'
									onChange={(e) => setBairro(e.target.value)}
								/>
							</FormGroup>
							<FormGroup label='Logradouro: *' htmlFor='inputLogradouro'>
								<input
									type='text'
									id='inputLogradouro'
									value={logradouro}
									className='form-control'
									name='logradouro'
									onChange={(e) => setLogradouro(e.target.value)}
								/>
							</FormGroup>

							<FormGroup label='Complemento: ' htmlFor='inputComplemento'>
								<input
									type='text'
									id='inputComplemento'
									value={complemento}
									className='form-control'
									name='complemento'
									onChange={(e) => setComplemento(e.target.value)}
								/>
							</FormGroup>
							<FormGroup label='Número: *' htmlFor='inputNumero'>
								<input
									type='text'
									id='inputNumero'
									value={numero}
									className='form-control'
									name='numero'
									onChange={(e) => setNumero(e.target.value)}
								/>
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

export default CadastroFuncionarios;