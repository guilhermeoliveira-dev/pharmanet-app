import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Stack from '@mui/material/Stack';
import Card from '../components/card';
import FormGroup from '../components/form-group';
import { IconButton, Collapse, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { mensagemSucesso, mensagemErro } from '../components/toastr';
import '../custom.css';
// import axios from 'axios';
import { BASE_URL } from '../config/axios';
import api from '../config/axios';
import imagemErro from '../img/imagem-erro.png';
import { toDate } from '../utils/date-formatter';

const ProductDropdown = ({ product }) => {
    const [open, setOpen] = useState(false);
    if (!product) {
        return null;
    }
    return (
        <div>
            <IconButton onClick={() => setOpen(!open)}>
                {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
            <Collapse in={open}>
                <Typography variant="body2" color="white">
                    <strong>Descrição:</strong> {product.descricao}
                </Typography>
                <Typography variant="body2" color="white">
                    <strong>Tarja:</strong> {product.nomeTarja}
                </Typography>
                <Typography variant="body2" color="white">
                    <strong>Peso:</strong> {product.peso}
                </Typography>
            </Collapse>
        </div>
    );
};

function getById(id, list) {
    const numericId = Number(id);
    for (let i = 0; i < list.length; i++) {
        if (list[i].id === numericId) {
            return list[i];
        }
    }
    return null;
}

function formatText(text) {
    if (!text) return '';
    return text.toLowerCase().split(' ').map(word => {
        return word.charAt(0).toUpperCase() + word.slice(1);
    }).join(' ');
}

const statusPedidoOptions = [
    { value: "pagamento pendente", label: "Pagamento Pendente" },
    { value: "entrega pendente", label: "Entrega Pendente" },
    { value: "finalizado", label: "Finalizado" }
];

const statusEntregaOptions = [
    { value: "", label: " -- Selecione o Status da Entrega -- " },
    { value: "pendente", label: "Pendente" },
    { value: "em rota", label: "Em Rota" },
    { value: "entregue", label: "Entregue" },
    { value: "cancelado", label: "Cancelado" }
];

function CadastroPedidos() {
    const { idParam } = useParams();
    const navigate = useNavigate();
    const baseURL = `${BASE_URL}/pedidoCompras`;
    const [id, setId] = useState('');
    const [dataCriacao, setDataCriacao] = useState('');
    const [codigo, setCodigo] = useState('');
    const [status, setStatus] = useState('');
    const [valorTotal, setValorTotal] = useState(0);
    const [tipoEntrega, setTipoEntrega] = useState('');
    const [dataEntrega, setDataEntrega] = useState('');
    const [endereco, setEndereco] = useState(null);
    const [statusEntrega, setStatusEntrega] = useState('');
    const [listaEnderecos, setListaEnderecos] = useState([]);
    const [listaItemsPedidos, setListaItemsPedidos] = useState([]);

    const [totalGeralCalculado, setTotalGeralCalculado] = useState(0);

    const inicializar = useCallback(() => {
        setId('');
        setDataCriacao('');
        setCodigo('');
        setStatus('');
        setValorTotal(0);
        setTipoEntrega('');
        setDataEntrega('');
        setEndereco(null);
        setStatusEntrega('');
        setListaItemsPedidos([]);
        setTotalGeralCalculado(0);
    }, []);

    const salvar = useCallback(async () => {
        let dataToSend = {
            id,
            dataCriacao,
            codigo,
            status,
            valorTotal: totalGeralCalculado,
            tipoEntrega,
            dataEntrega,
            idEndereco: endereco ? endereco.id : null,
            statusEntrega: statusEntrega
        };
        const data = JSON.stringify(dataToSend);
        if (idParam == null) {
            await api
                .post(baseURL, data, {
                    headers: { 'Content-Type': 'application/json' },
                })
                .then(function (response) {
                    mensagemSucesso(`Pedido cadastrado com sucesso!`);
                    navigate(`/listagem-pedidos`);
                })
                .catch(function (error) {
                    if (error.response) {
                        mensagemErro(error.response.data);
                    } else {
                        mensagemErro("Erro ao cadastrar o pedido.");
                    }
                });
        } else {
            await api
                .put(`${baseURL}/${idParam}`, data, {
                    headers: { 'Content-Type': 'application/json' },
                })
                .then(function (response) {
                    mensagemSucesso(`Pedido atualizado com sucesso!`);
                    navigate(`/listagem-pedidos`);
                })
                .catch(function (error) {
                    if (error.response) {
                        mensagemErro(error.response.data);
                    } else {
                        mensagemErro("Erro ao atualizar o pedido.");
                    }
                });
        }
    }, [id, dataCriacao, codigo, status, totalGeralCalculado, tipoEntrega, dataEntrega, endereco, statusEntrega, idParam, baseURL, navigate]);

    const buscar = useCallback(async () => {
        setListaItemsPedidos([]);
        try {
            const enderecosResponse = await api.get(`${BASE_URL}/enderecos`);
            setListaEnderecos(enderecosResponse.data);
            if (idParam != null) {
                const pedidoResponse = await api.get(`${baseURL}/${idParam}`);
                const pedidoData = pedidoResponse.data;
                setId(pedidoData.id);
                setDataCriacao(toDate(pedidoData.dataCriacao));
                setCodigo(pedidoData.codigo);
                setStatus(pedidoData.status);
                setValorTotal(pedidoData.valorTotal || 0);
                setTipoEntrega(pedidoData.tipoEntrega);
                setDataEntrega(toDate(pedidoData.dataEntrega));
                setStatusEntrega(pedidoData.statusEntrega || '');
                if (pedidoData.idEndereco) {
                    setEndereco(getById(pedidoData.idEndereco, enderecosResponse.data));
                } else {
                    setEndereco(null);
                }
                
                const itemsComSubtotal = pedidoData.pedidos.map(item => ({
                    ...item,
                    subtotal: (item.quantidade || 0) * (item.precoUnitario || 0)
                }));
                setListaItemsPedidos(itemsComSubtotal);
                
                const novoTotalGeral = itemsComSubtotal.reduce((acc, item) => acc + (item.subtotal || 0), 0);
                setTotalGeralCalculado(novoTotalGeral);
            }
        } catch (error) {
            console.error("Erro ao buscar dados:", error);
            mensagemErro("Erro ao carregar dados do pedido ou listas de apoio.");
        }
    }, [idParam, baseURL, setListaEnderecos, setId, setDataCriacao, setCodigo, setStatus, setValorTotal, setTipoEntrega, setDataEntrega, setEndereco, setStatusEntrega, setListaItemsPedidos, setTotalGeralCalculado]);

    useEffect(() => {
        const novoTotalGeral = listaItemsPedidos.reduce((acc, item) => acc + (item.subtotal || 0), 0);
        setTotalGeralCalculado(novoTotalGeral);
    }, [listaItemsPedidos]);

    const excluirItem = useCallback(async (idItem) => {
        try {
            await api.delete(`${BASE_URL}/itemsPedidos/${idItem}`);
            mensagemSucesso('Item removido com sucesso!');
            setListaItemsPedidos(prevItems => {
                const novaLista = prevItems.filter(item => item.id !== idItem);
                return novaLista;
            });
        } catch (error) {
            mensagemErro('Erro ao remover o item.');
            console.error(error);
        }
    }, []);

    const confirmarPagamento = useCallback(async () => {
        let url = `${baseURL}/confirmar_pagamento/${id}`;
        const data = { formaPagamento: 'credito' };
        await axios.put(url, data, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        })
        .then(function (response) {
            mensagemSucesso(`Pagamento do pedido ${id} confirmado com sucesso!`);
            setStatus(response.data.status);
            setStatusEntrega(response.data.statusEntrega);
            setValorTotal(response.data.valorTotal);
        })
        .catch(function (error) {
            mensagemErro(`Erro ao confirmar pagamento: ${error.response?.data?.message || 'Erro desconhecido'}`);
        });
    }, [id, baseURL, setStatus, setStatusEntrega, setValorTotal]);

    const confirmarEntrega = useCallback(async () => {
        let url = `${baseURL}/confirmar_entrega/${id}`;
        await axios.put(url, {}, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        })
        .then(function (response) {
            mensagemSucesso(`Entrega do pedido ${id} confirmada com sucesso!`);
            setStatus(response.data.status);
            setStatusEntrega(response.data.statusEntrega);
            setDataEntrega(toDate(response.data.dataEntrega));
        })
        .catch(function (error) {
            mensagemErro(`Erro ao confirmar entrega: ${error.response?.data?.message || 'Erro desconhecido'}`);
        });
    }, [id, baseURL, setStatus, setStatusEntrega, setDataEntrega]);

    useEffect(() => {
        buscar();
    }, [idParam, buscar]);

    return (
        <div className='container'>
            <Card title='Cadastro de Pedido'>
                <div className='row'>
                    <div className='col-lg-12'>
                        <div className='bs-component'>
                            <FormGroup label='Data da Criação: ' htmlFor='inputDataCriacao'>
                                <input
                                    disabled
                                    type='date'
                                    id='inputDataCriacao'
                                    value={toDate(dataCriacao)}
                                    className='form-control'
                                    name='dataCriacao'
                                    onChange={(e) => setDataCriacao(e.target.value)}
                                />
                            </FormGroup>
                            <FormGroup label='Código: ' htmlFor='inputCodigo'>
                                <input
                                    disabled
                                    type='text'
                                    id='inputCodigo'
                                    value={codigo}
                                    className='form-control'
                                    name='codigo'
                                    onChange={(e) => setCodigo(e.target.value)}
                                />
                            </FormGroup>
                            <FormGroup label='Status do Pedido: ' htmlFor='inputStatus'>

                                <select
                                    id='inputStatus'
                                    value={status}
                                    className='form-select'
                                    name='status'
                                    onChange={(e) => setStatus(e.target.value)}
                                >
                                    {statusPedidoOptions.map((option) => (
                                        <option value={option.value} key={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </FormGroup>
                            <FormGroup label='Tipo de Entrega: ' htmlFor='inputTipoEntrega'>

                                <select
                                    id='inputTipoEntrega'
                                    value={tipoEntrega}
                                    className='form-select'
                                    name='tipoEntrega'
                                    onChange={(e) => setTipoEntrega(e.target.value)}
                                >
                                    <option value="" key="vazio"> -- Selecione o Tipo de Entrega -- </option>
                                    <option value="delivery" key="delivery">Delivery</option>
                                    <option value="busca no estabelecimento" key="busca no estabelecimento">Busca no estabelecimento</option>
                                </select>
                            </FormGroup>
                            <FormGroup label='Data da Entrega: ' htmlFor='inputDataEntrega'>
                                <input
                                    type='date'
                                    id='inputDataEntrega'
                                    value={toDate(dataEntrega)}
                                    className='form-control'
                                    name='dataEntrega'
                                    onChange={(e) => setDataEntrega(e.target.value)}
                                />
                            </FormGroup>
                            <FormGroup label='Endereco de entrega: ' htmlFor='inputEndereco'>

                                <select
                                    id='inputEndereco'
                                    value={endereco?.id || ''}
                                    className='form-select'
                                    name='endereco'
                                    onChange={(e) => setEndereco(getById(e.target.value, listaEnderecos))}
                                >
                                    <option value="" key="0"> -- Selecione um Endereço -- </option>
                                    {listaEnderecos.map((end) => (
                                        <option value={end.id} key={end.id}>{`${end.logradouro}, ${(end.numero === "s/n" || end.numero === "") ? "s/n" : "nº " + end.numero} - ${end.bairro}, ${end.cidade}/${end.uf}`}</option>
                                    ))}
                                </select>
                            </FormGroup>
                            <FormGroup label='Status da Entrega: ' htmlFor='inputStatusEntrega'>
                                <input
                                    disabled
                                    type='text'
                                    id='inputStatusEntrega'
                                    value={formatText(statusEntrega)}
                                    className='form-control'
                                    name='statusEntrega'
                                />
                            </FormGroup>
                        </div>
                    </div>
                </div>
                <h2>Itens do Pedido:</h2>
                <table className='table table-hover'>
                    <thead>
                        <tr>
                            <th scope='col'>Produto</th>
                            <th scope='col'>Quantidade</th>
                            <th scope='col'>Preço Unitário</th>
                            <th scope='col'>Subtotal</th>
                            <th scope='col'>Detalhes / Imagem</th>
                            <th scope='col'>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {listaItemsPedidos.map((dado) => (
                            <tr key={dado.id}>
                                <td>{dado.nomeProduto}</td>
                                <td>{dado.quantidade}</td>
                                <td>R$ {dado.precoUnitario?.toFixed(2) || '0.00'}</td>
                                <td>R$ {dado.subtotal?.toFixed(2) || '0.00'}</td>
                                <td>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <img
                                            src={dado.produtoCompleto?.imagem || imagemErro}
                                            alt={dado.nomeProduto}
                                            style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                        />
                                        <ProductDropdown product={dado.produtoCompleto} />
                                    </div>
                                </td>
                                <td>
                                    <Stack spacing={1} padding={0} direction='row'>
                                        <IconButton
                                            aria-label='delete'
                                            style={{ color: "red" }}
                                            onClick={() => excluirItem(dado.id)}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </Stack>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div style={{ textAlign: 'right', marginTop: '20px', fontSize: '1.2em', fontWeight: 'bold', color: 'white' }}>
                    Total Geral do Pedido: R$ {totalGeralCalculado.toFixed(2)}
                </div>
                <Stack spacing={1} padding={1} direction='row'>
                    {status === 'pagamento pendente' && (
                        <button
                            onClick={confirmarPagamento}
                            type='button'
                            className='btn btn-success'
                        >
                            Confirmar Pagamento
                        </button>
                    )}
                    {status === 'entrega pendente' && (
                        <button
                            onClick={confirmarEntrega}
                            type='button'
                            className='btn btn-info'
                        >
                            Confirmar Entrega
                        </button>
                    )}
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
            </Card>
        </div>
    );
}

export default CadastroPedidos;