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

function CadastroProdutos() {
    const { idParam } = useParams();

    const navigate = useNavigate();

    const baseURL = `${BASE_URL}/produtos`;

    const [id, setId] = useState('');
    const [nome, setNome] = useState('');
    const [descricao, setDescricao] = useState('');
    const [preco, setPreco] = useState('');
    const [requerLote, setRequerLote] = useState(false);
    const [peso, setPeso] = useState('');
    const [tarja, setTarja] = useState('');
    const [categoria, setCategoria] = useState('');

    const [dados, setDados] = useState([]);

    const [listaTarjas, setListaTarjas] = useState([]);
    const [listaCategorias, setListaCategorias] = useState([]);

    const [isRequerLoteOpen, setIsRequerLoteOpen] = useState(false);
    const [isTarjaOpen, setIsTarjaOpen] = useState(false);
    const [isCategoriaOpen, setIsCategoriaOpen] = useState(false);

    function inicializar() {
        if (idParam == null) {
            setId('');
            setNome('');
            setDescricao('');
            setPreco('');
            setRequerLote(false);
            setPeso('');
            setTarja('');
            setCategoria('');
        } else {
            setId(dados.id);
            setNome(dados.nome);
            setDescricao(dados.descricao);
            setPreco(dados.preco);
            setRequerLote(dados.requerLote);
            setPeso(dados.peso);
            setTarja(dados.tarja);
            setCategoria(dados.categoria);
        }
    }

    async function salvar() {
        let data = { id, nome, descricao, preco, requerLote, peso, tarja, categoria };
        data = JSON.stringify(data);
        if (idParam == null) {
            await axios
                .post(baseURL, data, {
                    headers: { 'Content-Type': 'application/json' },
                })
                .then(function (response) {
                    mensagemSucesso(`Produto ${nome} cadastrado com sucesso!`);
                    navigate(`/listagem-produtos`);
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
                    mensagemSucesso(`Produto ${nome} alterado com sucesso!`);
                    navigate(`/listagem-produtos`);
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
            setPreco(dados.preco);
            setRequerLote(dados.requerLote);
            setPeso(dados.peso);
            setTarja(dados.tarja);
            setCategoria(dados.categoria);
        }
        await axios.get(`${BASE_URL}/jsonfake3/tarjas`).then((response) => {
            setListaTarjas(response.data);
        }).catch((a) => {
            //console.log(a);
        });
        await axios.get(`${BASE_URL}/jsonfake3/categorias`).then((response) => {
            setListaCategorias(response.data);
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
            <Card title='Cadastro de Produto'>
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
                            <FormGroup label='Preco: *' htmlFor='inputPreco'>
                                <input
                                    //type='text'
                                    //maxLength='11'
                                    id='inputPreco'
                                    value={preco}
                                    className='form-control'
                                    name='preco'
                                    onChange={(e) => setPreco(e.target.value)}
                                />
                            </FormGroup>
                            <FormGroup label='Requer lote: *' htmlFor='inputRequerLote'>
                                <div className="select-arrow-wrapper">
                                    <select
                                        id='inputRequerLote'
                                        value={requerLote}
                                        className='form-control'
                                        name='requerLote'
                                        onChange={(e) => setRequerLote(e.target.value === 'true')}
                                        onClick={() => setIsRequerLoteOpen(!isRequerLoteOpen)}
                                        onBlur={() => setIsRequerLoteOpen(false)}
                                    >
                                        <option value="false" key="false">Não</option>
                                        <option value="true" key="true">Sim</option>
                                    </select>
                                    <div className={`arrow ${isRequerLoteOpen ? 'open' : ''}`}></div>
                                </div>
                            </FormGroup>
                            <FormGroup label='Peso: *' htmlFor='inputPeso'>
                                <input
                                    id='inputPeso'
                                    value={peso}
                                    className='form-control'
                                    name='peso'
                                    onChange={(e) => setPeso(e.target.value)}
                                />
                            </FormGroup>
                            <FormGroup label='Tarja: *' htmlFor='inputTarja'>
                                <div className="select-arrow-wrapper">
                                    <select
                                        id='inputTarja'
                                        value={tarja?.id || 0}
                                        className='form-control'
                                        name='tarja'
                                        onChange={(e) => setTarja(getById(e.target.value, listaTarjas))}
                                        onClick={() => setIsTarjaOpen(!isTarjaOpen)}
                                        onBlur={() => setIsTarjaOpen(false)}
                                    >
                                        <option value="0" key="0"> -- Escolha uma tarja -- </option>
                                        {listaTarjas.map((cat) => (
                                            <option value={cat.id} key={cat.id}>{cat.nome}</option>
                                        ))}
                                    </select>
                                    <div className={`arrow ${isTarjaOpen ? 'open' : ''}`}></div>
                                </div>
                            </FormGroup>
                            <FormGroup label='Categoria: *' htmlFor='inputCategoria'>
                                <div className="select-arrow-wrapper">
                                    <select
                                        id='inputCategoria'
                                        value={categoria?.id || 0}
                                        className='form-control'
                                        name='categoria'
                                        onChange={(e) => setCategoria(getById(e.target.value, listaCategorias))}
                                        onClick={() => setIsCategoriaOpen(!isCategoriaOpen)}
                                        onBlur={() => setIsCategoriaOpen(false)}
                                    >
                                        <option value="0" key="0"> -- Escolha uma categoria -- </option>
                                        {listaCategorias.map((cat) => (
                                            <option value={cat.id} key={cat.id}>{cat.nome}</option>
                                        ))}
                                    </select>
                                    <div className={`arrow ${isCategoriaOpen ? 'open' : ''}`}></div>
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

export default CadastroProdutos;