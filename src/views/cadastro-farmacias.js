import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Stack from '@mui/material/Stack';

import Card from '../components/card';
import FormGroup from '../components/form-group';

import { mensagemSucesso, mensagemErro } from '../components/toastr';

import '../custom.css';

import axios from 'axios';
import { BASE_URL } from '../config/axios';

function CadastroFarmacias() {
	const { idParam } = useParams();

	const navigate = useNavigate();

	const baseURL = `${BASE_URL}jsonfake/farmacias`;

	const [id, setId] = useState('');
	const [nome, setNome] = useState('');
	const [email, setEmail] = useState('');
	const [cnpj, setCnpj] = useState('');
	const [telefone, setTelefone] = useState('');
	// endereço
	const [uf, setUf] = useState('');
	const [cidade, setCidade] = useState('');
	const [cep, setCep] = useState('');
	const [bairro, setBairro] = useState('');
	const [logradouro, setLogradouro] = useState('');
	const [numero, setNumero] = useState('');
	const [complemento, setComplemento] = useState('');

	const [dados, setDados] = useState([]);

	function inicializar() {
		if (idParam == null) {
			setId('');
			setNome('');
			setEmail('');
			setCnpj('');
			setTelefone('');
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
			setCnpj(dados.cnpj);
			setTelefone(dados.telefone);
			// endereço
			setUf(dados.endereco.uf);
			setCidade(dados.endereco.cidade);
			setCep(dados.endereco.cep);
			setBairro(dados.endereco.bairro);
			setLogradouro(dados.endereco.logradouro);
			setNumero(dados.endereco.numero);
			setComplemento(dados.endereco.complemento);
		}
	}

	async function salvar() {
		let endereco = {uf, cidade, cep, bairro, logradouro, numero, complemento}
		let data = { id, nome, email, cnpj, telefone, endereco};
		data = JSON.stringify(data);
		if (idParam == null) {
			await axios
				.post(baseURL, data, {
					headers: { 'Content-Type': 'application/json' },
				})
				.then(function (response) { 
					mensagemSucesso(`Farmácia ${nome} cadastrada com sucesso!`);
					navigate(`/listagem-farmacias`);
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
					mensagemSucesso(`Farmácia ${nome} alterada com sucesso!`);
					navigate(`/listagem-farmacias`);
				})
				.catch(function (error) {
					mensagemErro(error.response.data);
				});
		}
	}


	async function buscar() {
		if (idParam != null) {
			await axios.get(`${baseURL}/${idParam}`).then((response) => {
				if (response.data == null) return;
				setDados(response.data);
			}).catch((a) => {
				//console.log(a);
			});
			if (dados == null){
				//console.log(JSON.stringify(response));
				//return;
			} 
			setId(dados.id);
			setNome(dados.nome);
			setEmail(dados.email);
			setCnpj(dados.cnpj);
			setTelefone(dados.telefone);
			// endereço
			try{
				setUf(dados.endereco.uf);
				setCidade(dados.endereco.cidade);
				setCep(dados.endereco.cep);
				setBairro(dados.endereco.bairro);
				setLogradouro(dados.endereco.logradouro);
				setNumero(dados.endereco.numero);
				setComplemento(dados.endereco.complemento);
			}
			catch(e){
				
			}
			
		}
	}

	useEffect(() => {
		buscar(); // eslint-disable-next-line
	}, [id]);

	if (!dados) return null;

	return (
		<div className='container'>
			<Card title='Cadastro de Farmácia'>
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
							<FormGroup label='CNPJ: *' htmlFor='inputCnpj'>
								<input
									type='text'
									//maxLength='11'
									id='inputCnpj'
									value={cnpj}
									className='form-control'
									name='cnpj'
									onChange={(e) => setCnpj(e.target.value)}
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

							<br></br><h2>Endereço:</h2>

							<FormGroup label='UF: *' htmlFor='inputUf'>
								<input
									type='text'
									id='inputUf'
									value={uf}
									className='form-control'
									name='uf'
									onChange={(e) => setUf(e.target.value)}
								/>
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
							<FormGroup label='CEP: *' htmlFor='inputCep'>
								<input
									type='text'
									id='inputCep'
									value={cep}
									className='form-control'
									name='cep'
									onChange={(e) => setCep(e.target.value)}
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

export default CadastroFarmacias;