import React, { useState, useEffect, useCallback } from 'react';
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
        if (list[i].id === Number(id)) {
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
    const [tarja, setTarja] = useState(null);
    const [categoria, setCategoria] = useState(null);
    const [generico, setGenerico] = useState(false);
    const [listaTarjas, setListaTarjas] = useState([]);
    const [listaCategorias, setListaCategorias] = useState([]);

    const inicializar = useCallback(() => {
        setId('');
        setNome('');
        setDescricao('');
        setPreco('');
        setRequerLote(false);
        setPeso('');
        setTarja(null);
        setCategoria(null);
        setGenerico(false);
    }, []);

    const salvar = useCallback(async () => {
        let dataToSend = {
            id,
            nome,
            descricao,
            preco,
            requerLote,
            peso,
            generico,
            idTarja: tarja ? tarja.id : null,
            idCategoria: categoria ? categoria.id : null
        };
        const data = JSON.stringify(dataToSend);
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
    }, [id, nome, descricao, preco, requerLote, peso, generico, tarja, categoria, idParam, baseURL, navigate]);

    const buscar = useCallback(async () => {
        try {
            const [tarjasRes, categoriasRes] = await Promise.all([
                axios.get(`${baseURL}/tarjas`),
                axios.get(`${BASE_URL}/categorias`)
            ]);
            setListaTarjas(tarjasRes.data);
            setListaCategorias(categoriasRes.data);
            if (idParam != null) {
                const produtoResponse = await axios.get(`${baseURL}/${idParam}`);
                const produtoData = produtoResponse.data;
                setId(produtoData.id);
                setNome(produtoData.nome);
                setDescricao(produtoData.descricao);
                setPreco(produtoData.preco);
                setRequerLote(produtoData.requerLote);
                setPeso(produtoData.peso);
                setGenerico(produtoData.generico);
                if (produtoData.idTarja) {
                    setTarja(getById(produtoData.idTarja, tarjasRes.data));
                } else {
                    setTarja(null);
                }
                if (produtoData.idCategoria) {
                    setCategoria(getById(produtoData.idCategoria, categoriasRes.data));
                } else {
                    setCategoria(null);
                }
            }
        } catch (error) {
            console.error("Erro ao carregar dados:", error);
            mensagemErro("Erro ao carregar dados do produto ou listas de apoio.");
        }
    }, [idParam, baseURL, setListaTarjas, setListaCategorias, setId, setNome, setDescricao, setPreco, setRequerLote, setPeso, setGenerico, setTarja, setCategoria]);

    useEffect(() => {
        buscar();
    }, [idParam, buscar]);

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
                                    type='number'
                                    id='inputPreco'
                                    value={preco}
                                    className='form-control'
                                    name='preco'
                                    onChange={(e) => setPreco(e.target.value)}
                                />
                            </FormGroup>
                            <FormGroup label='Requer lote: *' htmlFor='inputRequerLote'>

                                <select
                                    id='inputRequerLote'
                                    value={requerLote.toString()}
                                    className='form-select'
                                    name='requerLote'
                                    onChange={(e) => setRequerLote(e.target.value === 'true')}
                                >
                                    <option value="false">Não</option>
                                    <option value="true">Sim</option>
                                </select>
                            </FormGroup>
                            <FormGroup label='Peso: *' htmlFor='inputPeso'>
                                <input
                                    type='number'
                                    id='inputPeso'
                                    value={peso}
                                    className='form-control'
                                    name='peso'
                                    onChange={(e) => setPeso(e.target.value)}
                                />
                            </FormGroup>
                            <FormGroup label='Genérico: *' htmlFor='inputGenerico'>

                                <select
                                    id='inputGenerico'
                                    value={generico.toString()}
                                    className='form-select'
                                    name='generico'
                                    onChange={(e) => setGenerico(e.target.value === 'true')}
                                >
                                    <option value="false">Não</option>
                                    <option value="true">Sim</option>
                                </select>
                            </FormGroup>
                            <FormGroup label='Tarja: *' htmlFor='inputTarja'>

                                <select
                                    id='inputTarja'
                                    value={tarja?.id || ''}
                                    className='form-select'
                                    name='tarja'
                                    onChange={(e) => setTarja(getById(e.target.value, listaTarjas))}
                                >
                                    <option value=""> -- Escolha uma tarja -- </option>
                                    {listaTarjas.map((t) => (
                                        <option value={t.id} key={t.id}>{t.nome}</option>
                                    ))}
                                </select>
                            </FormGroup>
                            <FormGroup label='Categoria: *' htmlFor='inputCategoria'>
                                
                                    <select
                                        id='inputCategoria'
                                        value={categoria?.id || ''}
                                        className='form-select'
                                        name='categoria'
                                        onChange={(e) => setCategoria(getById(e.target.value, listaCategorias))}
                                    >
                                        <option value=""> -- Escolha uma categoria -- </option>
                                        {listaCategorias.map((cat) => (
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

export default CadastroProdutos;