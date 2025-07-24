import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Stack from '@mui/material/Stack';

import Card from '../components/card';
import FormGroup from '../components/form-group';

import { mensagemSucesso, mensagemErro } from '../components/toastr';

import '../custom.css';

import axios from 'axios';
import { BASE_URL } from '../config/axios';
//import ListagemCategorias from './listagem-categorias';


function getById(id, list) {
    for (let i = 0; i < list.length; i++) {
        // eslint-disable-next-line
        if (list[i].id == id) {
            return list[i];
        }
    }
    return null;
}

function CadastroCategorias() {
    const { idParam } = useParams();

    const navigate = useNavigate();

    const baseURL = `${BASE_URL}/categorias`;

    const [id, setId] = useState('');
    const [nome, setNome] = useState('');
    const [descricao, setDescricao] = useState('');
    const [categoriaPai, setCategoriaPai] = useState(0);

    const [dados, setDados] = useState([]);

    const [listaCategorias, setlistaCategorias] = useState([]);

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const handleToggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    function inicializar() {
        if (idParam == null) {
            setId('');
            setNome('');
            setDescricao('');
            setCategoriaPai(0);
        } else {
            setId(dados.id);
            setNome(dados.nome);
            setDescricao(dados.descricao);
            setCategoriaPai(dados.idCategoriaPai);
        }
    }

    async function salvar() {
        let data = { id, nome, descricao, idCategoriaPai: categoriaPai };
        data = JSON.stringify(data);
        if (idParam == null) {
            await axios
                .post(baseURL, data, {
                    headers: { 'Content-Type': 'application/json' },
                })
                .then(function (response) {
                    mensagemSucesso(`Categoria ${nome} cadastrada com sucesso!`);
                    navigate(`/listagem-categorias`);
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
                    mensagemSucesso(`Categoria ${nome} alterada com sucesso!`);
                    navigate(`/listagem-categorias`);
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
            setDescricao(dados.descricao);
            setCategoriaPai(dados.idCategoriaPai);


        }
        await axios.get(`${baseURL}`).then((response) => {
            setlistaCategorias(response.data);
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
            <Card title='Cadastro de Categoria'>
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
                            <FormGroup label='Descricao: *' htmlFor='inputDescricao'>
                                <input
                                    type='text'
                                    id='inputDescricao'
                                    value={descricao}
                                    className='form-control'
                                    name='descricao'
                                    onChange={(e) => setDescricao(e.target.value)}
                                />
                            </FormGroup>
                            <FormGroup label='Categoria pai: ' htmlFor='inputCategoriaPai'>
                                <select
                                    id='inputCategoriaPai'
                                    value={categoriaPai}
                                    className='form-select'
                                    name='categoriaPai'
                                    onChange={(e) => setCategoriaPai(e.target.value)}
                                    onClick={handleToggleDropdown}
                                >
                                    <option value="null" key="0">Nenhuma</option>
                                    {listaCategorias.map((cat) => (
                                        cat.id !== id ? <option value={cat.id} key={cat.id}>{cat.nome}</option> : <></>)
                                    )}
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

export default CadastroCategorias;