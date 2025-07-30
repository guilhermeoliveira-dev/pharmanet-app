import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Stack from '@mui/material/Stack';

import Card from '../components/card';
import FormGroup from '../components/form-group';

import { mensagemSucesso, mensagemErro } from '../components/toastr';

import '../custom.css';

import axios from 'axios';
import { BASE_URL } from '../config/axios';

import validarCep from '../api-cep';
import { buscar_ufs } from '../api-uf';


function toDate(dateStr = "") {
	if(dateStr === undefined){
		return new Date();
	}
    return dateStr.split('-').reverse().join('-');
}

function CadastroClientes() {
	const { idParam } = useParams();

	const navigate = useNavigate();

	const baseURL = `${BASE_URL}/clientes`;

	const [id, setId] = useState('');
	const [nome, setNome] = useState('');
	const [email, setEmail] = useState('');
	const [cpf, setCpf] = useState('');
	const [senha, setSenha] = useState('');
	const [senhaRepeticao, setSenhaRepeticao] = useState('');
	const [telefone, setTelefone] = useState('');
	const [dataAdmissao, setDataAdmissao] = useState('');
	const [fidelidadePontos, setFidelidadePontos] = useState('');
	const [uf, setUf] = useState('');
	const [cidade, setCidade] = useState('');
	const [cep, setCep] = useState('');
	const [bairro, setBairro] = useState('');
	const [logradouro, setLogradouro] = useState('');
	const [numero, setNumero] = useState('');
	const [complemento, setComplemento] = useState('');

	const [dados, setDados] = useState([]);
    const [listaUFs, setlistaUFs] = useState([]);


    async function verificarCep(cep) {
        try {
            const validacaoDados = await validarCep(cep);
            console.log(validacaoDados);

            setUf(validacaoDados.uf);
            setCidade(validacaoDados.localidade);
            setBairro(validacaoDados.bairro);
            setLogradouro(validacaoDados.logradouro);
            setNumero('');

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
			setDataAdmissao('');
			setFidelidadePontos('');
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
			setDataAdmissao(dados.dataAdmissao);
			setFidelidadePontos(dados.fidelidadePontos);
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
		let endereco = { uf, cidade, cep, bairro, logradouro, numero, complemento }
		let data = { id, nome, email, cpf, senha, telefone, endereco, dataAdmissao, fidelidadePontos };
		data = JSON.stringify(data);
		if (idParam == null) {
			await axios
				.post(baseURL, data, {
					headers: { 'Content-Type': 'application/json' },
				})
				.then(function (response) {
					mensagemSucesso(`Cliente ${nome} cadastrado com sucesso!`);
					navigate(`/listagem-clientes`);
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
					mensagemSucesso(`Cliente ${nome} alterado com sucesso!`);
					navigate(`/listagem-clientes`);
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
			setNome(dados.nome);
			setEmail(dados.email);
			setCpf(dados.cpf);
			setSenha(dados.senha);
			setSenhaRepeticao(dados.senhaRepeticao);
			setTelefone(dados.telefone);
			setDataAdmissao(dados.dataAdmissao);
			setFidelidadePontos(dados.fidelidadePontos);
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
        buscar_ufs_func();
	}

	useEffect(() => {
		buscar();
	}, [id]);

	if (!dados) return null;

	return (
		<div className='container'>
			<Card title='Cadastro de Cliente'>
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
							<FormGroup label='Pontos de Fidelidade: ' htmlFor='inputFidelidadePontos'>
								<input
									type='number'
									id='inputFidelidadePontos'
									value={fidelidadePontos}
									className='form-control'
									name='fidelidadePontos'
									disabled
									onChange={(e) => setFidelidadePontos(e.target.value)}
								/>
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
									onClick={() => verificarCep(cep)}
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

export default CadastroClientes;