import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Stack from '@mui/material/Stack';

import Card from '../components/card';
import FormGroup from '../components/form-group';

import { mensagemSucesso, mensagemErro } from '../components/toastr';

import '../custom.css';

import axios from 'axios';
import { BASE_URL } from '../config/axios';

/**
 * A component for creating and editing 'Cargos' (Roles).
 * It allows assigning multiple 'Permissoes' (Permissions) to a Cargo.
 */
function CadastroCargos() {
	const { idParam } = useParams(); // Gets the ID from the URL, if present (for editing)
	const navigate = useNavigate(); // Hook for programmatic navigation
	const baseURL = `${BASE_URL}/cargos`;

	// State for the 'Cargo' name
	const [nome, setNome] = useState('');
	
	// State to hold the list of ALL available permissions fetched from the backend (PermissaoDTO objects)
	const [listaPermissoesDisponiveis, setListaPermissoesDisponiveis] = useState([]);
	
	// State to hold the list of currently SELECTED permission objects (PermissaoDTO objects)
	const [permissoesSelecionadas, setPermissoesSelecionadas] = useState([]);

	// This effect runs when the component mounts or when the URL parameter 'idParam' changes.
	// It's responsible for fetching all necessary data from the backend.
	useEffect(() => {
		// Fetches all available permissions that can be assigned to a cargo.
		const buscarTodasPermissoes = async () => {
			try {
				const response = await axios.get(`${BASE_URL}/cargos/permissoes`);
				setListaPermissoesDisponiveis(response.data);
				return response.data; // Return data for chaining in the next step
			} catch (error) {
				mensagemErro('Erro ao carregar a lista de permissões.');
				console.error("Error fetching permissions list: ", error);
				return [];
			}
		};

		// Fetches the data for a specific cargo if we are in "edit" mode.
		const buscarCargo = async (todasPermissoes) => {
			// If idParam exists, we are editing an existing cargo.
			if (idParam) {
				try {
					const response = await axios.get(`${baseURL}/${idParam}`);
					const cargo = response.data;
					
					setNome(cargo.nome);

					// The cargo data includes its permissions as an array of PermissaoIndividualDTO.
					// We need to find the corresponding full PermissaoDTO objects from our list of all available permissions.
					if (cargo.permissoes && todasPermissoes.length > 0) {
						const permissoesIniciais = cargo.permissoes
							.map(pIndividual => 
								todasPermissoes.find(pDisponivel => pDisponivel.id === pIndividual.permissaoId)
							)
							.filter(p => p !== undefined); // Filter out any undefined results, just in case.
						
						setPermissoesSelecionadas(permissoesIniciais);
					}
				} catch (error) {
					mensagemErro('Erro ao buscar dados do cargo para edição.');
					console.error(`Error fetching cargo with id ${idParam}: `, error);
					navigate('/listagem-cargos'); // Navigate away on error
				}
			}
			// If idParam is null, we are in "create" mode, and the initial empty states are already correct.
		};

		// Execute the fetch sequence: first get all permissions, then get the specific cargo.
		buscarTodasPermissoes().then(todasPermissoes => {
			buscarCargo(todasPermissoes);
		});

	}, [idParam, navigate, baseURL]); // Dependencies ensure the effect runs at the right times.

	/**
	 * Saves the cargo data (create or update) to the backend.
	 */
	const salvar = async () => {
		// From our list of selected permission objects, create the array for the DTO.
		// The backend's PermissaoIndividualDTO only needs the `permissaoId` to create the link.
		const permissoesParaEnviar = permissoesSelecionadas.map(p => ({ permissaoId: p.id }));

		const cargoDTO = {
			id: idParam ? parseInt(idParam) : null, // Send ID only for updates
			nome: nome,
			permissoes: permissoesParaEnviar,
		};

		const requestConfig = {
			headers: { 'Content-Type': 'application/json' },
		};

		// Determine whether to POST (create) or PUT (update)
		const request = idParam
			? axios.put(`${baseURL}/${idParam}`, cargoDTO, requestConfig)
			: axios.post(baseURL, cargoDTO, requestConfig);

		try {
			await request;
			mensagemSucesso(`Cargo ${nome} ${idParam ? 'alterado' : 'cadastrado'} com sucesso!`);
			navigate(`/listagem-cargos`);
		} catch (error) {
			const errorMessage = error.response?.data || 'Ocorreu um erro ao salvar o cargo.';
			mensagemErro(errorMessage);
			console.error("Error saving cargo: ", error);
		}
	};

	/**
	 * Handles selection changes in the multi-select component for permissions.
	 * @param {React.ChangeEvent<HTMLSelectElement>} event The change event from the select input.
	 */
	const handlePermissoesChange = (event) => {
		// Get an array of the selected values (which are string IDs) and parse them to numbers.
        const selectedIds = Array.from(event.target.selectedOptions, (option) => parseInt(option.value));
		
		// Filter the full list of available permissions to get the objects corresponding to the selected IDs.
        const novasPermissoesSelecionadas = listaPermissoesDisponiveis.filter(p => selectedIds.includes(p.id));
        
		setPermissoesSelecionadas(novasPermissoesSelecionadas);
    };

	/**
	 * The "cancelar" button will simply navigate back to the list page.
	 */
	const cancelar = () => {
		navigate('/listagem-cargos');
	};

	// For the <select> component's `value` prop, we need an array of the selected permission IDs.
	const selectedPermissionIds = permissoesSelecionadas.map(p => p.id);

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
                                    value={selectedPermissionIds} // Bind to the array of selected IDs
                                    className='form-select'
                                    name='permissoes'
                                    onChange={handlePermissoesChange}
									style={{ height: '250px' }} // Add some height for better usability
                                >
                                    {listaPermissoesDisponiveis.map((permissao) => (
                                        <option key={permissao.id} value={permissao.id}>{permissao.nome}</option>
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
									onClick={cancelar}
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
