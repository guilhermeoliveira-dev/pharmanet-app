import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Stack from '@mui/material/Stack';

import Card from '../components/card';
import FormGroup from '../components/form-group';

import { mensagemSucesso, mensagemErro } from '../components/toastr';

import '../custom.css';

import axios from 'axios';
import { BASE_URL } from '../config/axios';

// function getById(id, list) {
// 	for (let i = 0; i < list.length; i++) {
// 		if (list[i].id === id) {
// 			return list[i];
// 		}
// 	}
// 	return null;
// }

function CadastroCargos() {
	const { idParam } = useParams();

	const navigate = useNavigate();

	const baseURL = `${BASE_URL}/cargos`;

	const [id, setId] = useState('');
	const [nome, setNome] = useState('');
	const [permissoes, setPermissoes] = useState([]);

	const [dados, setDados] = useState([]);

	const [listaPermissoes, setListaPermissoes] = useState([]);



	function inicializar() {
		if (idParam == null) {
			setId('');
			setNome('');
			setPermissoes('');
		} else {
			setId(dados.id);
			setNome(dados.nome);
			setPermissoes(dados.permissoes);
			console.log(permissoes);
		}
	}

	async function salvar() {
		let data = { id, nome, permissoes };
		data = JSON.stringify(data);
		if (idParam == null) {
			await axios
				.post(baseURL, data, {
					headers: { 'Content-Type': 'application/json' },
				})
				.then(function (response) {
					mensagemSucesso(`Cargo ${nome} cadastrado com sucesso!`);
					navigate(`/listagem-cargos`);
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
					mensagemSucesso(`Cargo ${nome} alterado com sucesso!`);
					navigate(`/listagem-cargos`);
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
			setPermissoes(dados.permissoes);
		}
		await axios.get(`${BASE_URL}//permissoes`).then((response) => {
			setListaPermissoes(response.data); 
		}).catch((a) => {
			//console.log(a);
		});
	}

	useEffect(() => {
		buscar(); // eslint-disable-next-line
	}, [id]);

	const handlePermissoesChange = (event) => {
        const selectedOptions = Array.from(event.target.selectedOptions, (option) => option.value);
        // Mapeia os IDs selecionados para os objetos correspondentes
        const permissoesSelecionadas = selectedOptions.map((id) =>
            listaPermissoes.find((perm) => perm.id === parseInt(id))
        );
        setPermissoes(permissoesSelecionadas);
    };

	if (!dados) return null;

	return (
		<div className='container'>
			<Card title='Cadastro de Cargo'>
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
							<FormGroup label='Permissões: ' htmlFor='inputPermissoes'>
                                <select
                                    multiple
                                    id='inputPermissoes'
                                    value={permissoes == null ? [] : permissoes.map((perm) => perm.id)} // Array de IDs
                                    className='form-control'
                                    name='permissoes'
                                    onChange={handlePermissoesChange}
                                >
                                    {listaPermissoes.map((cat) => (
                                        <option value={cat.id} key={cat.id}>{cat.nome}</option>
                                    ))}
                                </select>
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

export default CadastroCargos;