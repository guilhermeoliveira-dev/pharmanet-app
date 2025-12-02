import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Stack from '@mui/material/Stack';
import Card from '../components/card';
import FormGroup from '../components/form-group';
import { mensagemSucesso, mensagemErro } from '../components/toastr';
import '../custom.css';
// import axios from 'axios';
import { BASE_URL } from '../config/axios';
import api from '../config/axios';

function getById(id, list) {
    for (let i = 0; i < list.length; i++) {
        if (list[i].id === Number(id)) {
            return list[i];
        }
    }
    return null;
}

function formatDateForInput(dateStr) {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length === 3 && parts[0].length === 2) {
        return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    return dateStr;
}

function CadastroEstoques() {
    const { idParam } = useParams();
    const navigate = useNavigate();
    const baseURL = `${BASE_URL}/estoques`;
    const [id, setId] = useState('');
    const [quantidade, setQuantidade] = useState(0);
    const [produto, setProduto] = useState(null);
    const [lote, setLote] = useState('');
    const [dataFabricacao, setDataFabricacao] = useState('');
    const [dataValidade, setDataValidade] = useState('');
    const [farmacia, setFarmacia] = useState(null);
    const [fornecedor, setFornecedor] = useState(null);
    const [exigeLote, setExigeLote] = useState(false);
    const [estoqueType, setEstoqueType] = useState('estoque');
    const [listaFarmacias, setListaFarmacias] = useState([]);
    const [listaProdutos, setListaProdutos] = useState([]);
    const [listaFornecedores, setListaFornecedores] = useState([]);

    const inicializar = useCallback(() => {
        setId('');
        setQuantidade(0);
        setProduto(null);
        setLote('');
        setDataFabricacao('');
        setDataValidade('');
        setFarmacia(null);
        setFornecedor(null);
        setExigeLote(false);
        setEstoqueType('estoque');
    }, []);

    const salvar = useCallback(async () => {
        let dataToSend = {
            id,
            quantidade,
            idProduto: produto ? produto.id : null,
            idFarmacia: farmacia ? farmacia.id : null,
            idFornecedor: fornecedor ? fornecedor.id : null,
            type: estoqueType
        };
        if (exigeLote) {
            dataToSend.lote = lote;
            dataToSend.dataFabricacao = dataFabricacao;
            dataToSend.dataValidade = dataValidade;
        }
        const data = JSON.stringify(dataToSend);
        if (idParam == null) {
            await api
                .post(baseURL, data, {
                    headers: { 'Content-Type': 'application/json' },
                })
                .then(function (response) {
                    mensagemSucesso(`Estoque para ${produto.nome} cadastrado com sucesso!`);
                    navigate(`/listagem-estoques`);
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
                    mensagemSucesso(`Estoque para ${produto.nome} alterado com sucesso!`);
                    navigate(`/listagem-estoques`);
                })
                .catch(function (error) {
                    mensagemErro(error.response.data);
                });
        }
    }, [id, quantidade, produto, lote, dataFabricacao, dataValidade, farmacia, fornecedor, exigeLote, estoqueType, idParam, baseURL, navigate]);

    const buscar = useCallback(async () => {
        try {
            const [farmaciasRes, produtosRes, fornecedoresRes] = await Promise.all([
                api.get(`${BASE_URL}/farmacias`),
                api.get(`${BASE_URL}/produtos`),
                api.get(`${BASE_URL}/fornecedores`)
            ]);
            setListaFarmacias(farmaciasRes.data);
            setListaProdutos(produtosRes.data);
            setListaFornecedores(fornecedoresRes.data);
            if (idParam != null) {
                const estoqueResponse = await api.get(`${baseURL}/${idParam}`);
                const estoqueData = estoqueResponse.data;
                setId(estoqueData.id);
                setQuantidade(estoqueData.quantidade);
                const produtoSelecionado = getById(estoqueData.idProduto, produtosRes.data);
                setProduto(produtoSelecionado);
                setFarmacia(getById(estoqueData.idFarmacia, farmaciasRes.data));
                setFornecedor(getById(estoqueData.idFornecedor, fornecedoresRes.data));
                if (estoqueData.type === 'estoqueLote') {
                    setExigeLote(true);
                    setEstoqueType('estoqueLote');
                    setLote(estoqueData.lote);
                    setDataFabricacao(formatDateForInput(estoqueData.dataFabricacao));
                    setDataValidade(formatDateForInput(estoqueData.dataValidade));
                } else {
                    setExigeLote(false);
                    setEstoqueType('estoque');
                }
            }
        } catch (error) {
            console.error("Erro ao carregar dados:", error);
            mensagemErro("Erro ao carregar dados ou listas de apoio.");
        }
    }, [idParam, baseURL, setListaFarmacias, setListaProdutos, setListaFornecedores, setId, setQuantidade, setProduto, setFarmacia, setFornecedor, setExigeLote, setEstoqueType, setLote, setDataFabricacao, setDataValidade]);

    useEffect(() => {
        buscar();
    }, [idParam, buscar]);

    useEffect(() => {
        if (produto) {
            setExigeLote(produto.requerLote);
            setEstoqueType(produto.requerLote ? 'estoqueLote' : 'estoque');
            if (!produto.requerLote) {
                setLote('');
                setDataFabricacao('');
                setDataValidade('');
            }
        } else {
            setExigeLote(false);
            setEstoqueType('estoque');
        }
    }, [produto]);

    return (
        <div className='container'>
            <Card title='Cadastro de Estoque'>
                <div className='row'>
                    <div className='col-lg-12'>
                        <div className='bs-component'>
                            <FormGroup label='Quantidade: *' htmlFor='inputQuantidade'>
                                <input
                                    type='number'
                                    id='inputQuantidade'
                                    value={quantidade}
                                    className='form-control'
                                    name='quantidade'
                                    onChange={(e) => setQuantidade(e.target.value)}
                                />
                            </FormGroup>
                            <FormGroup label='Produto: *' htmlFor='inputProduto'>

                                <select
                                    id='inputProduto'
                                    value={produto?.id || ''}
                                    className='form-select'
                                    name='produto'
                                    onChange={(e) => setProduto(getById(e.target.value, listaProdutos))}
                                >
                                    <option value=""> -- Selecione um Produto -- </option>
                                    {listaProdutos.map((p) => (
                                        <option value={p.id} key={p.id}>{p.nome}</option>
                                    ))}
                                </select>
                            </FormGroup>
                            {exigeLote && (
                                <div className='form-label ps-3'>
                                    Este produto requer lote.
                                    <br />
                                    <FormGroup label='Número do Lote: *' htmlFor='inputLote' className='ps-3'>
                                        <input
                                            type='text'
                                            id='inputLote'
                                            value={lote}
                                            className='form-control'
                                            name='lote'
                                            onChange={(e) => setLote(e.target.value)}
                                        />
                                    </FormGroup>
                                    <FormGroup label='Data de Fabricação: *' htmlFor='inputDataFabricacao' className='ps-3'>
                                        <input
                                            type='date'
                                            id='inputDataFabricacao'
                                            value={dataFabricacao}
                                            className='form-control'
                                            name='dataFabricacao'
                                            onChange={(e) => setDataFabricacao(e.target.value)}
                                        />
                                    </FormGroup>
                                    <FormGroup label='Data de Validade: *' htmlFor='inputDataValidade' className='ps-3'>
                                        <input
                                            type='date'
                                            id='inputDataValidade'
                                            value={dataValidade}
                                            className='form-control'
                                            name='dataValidade'
                                            onChange={(e) => setDataValidade(e.target.value)}
                                        />
                                    </FormGroup>
                                </div>
                            )}
                            <FormGroup label='Farmácia: *' htmlFor='inputFarmacia'>
                                <select
                                    id='inputFarmacia'
                                    value={farmacia?.id || ''}
                                    className='form-select'
                                    name='farmacia'
                                    onChange={(e) => setFarmacia(getById(e.target.value, listaFarmacias))}
                                >
                                    <option value=""> -- Selecione uma Farmácia -- </option>
                                    {listaFarmacias.map((f) => (
                                        <option value={f.id} key={f.id}>{f.nome}</option>
                                    ))}
                                </select>
                            </FormGroup>
                            <FormGroup label='Fornecedor: *' htmlFor='inputFornecedor'>

                                <select
                                    id='inputFornecedor'
                                    value={fornecedor?.id || ''}
                                    className='form-select'
                                    name='fornecedor'
                                    onChange={(e) => setFornecedor(getById(e.target.value, listaFornecedores))}
                                >
                                    <option value=""> -- Selecione um Fornecedor -- </option>
                                    {listaFornecedores.map((f) => (
                                        <option value={f.id} key={f.id}>{f.nome}</option>
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

export default CadastroEstoques;