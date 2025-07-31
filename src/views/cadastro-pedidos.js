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
import axios from 'axios';
import { BASE_URL } from '../config/axios';
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
    const [isTipoEntregaOpen, setIsTipoEntregaOpen] = useState(false);
    const [isEnderecoOpen, setIsEnderecoOpen] = useState(false);
    const [isStatusPedidoOpen, setIsStatusPedidoOpen] = useState(false);
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
            await axios
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
            await axios
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
            const enderecosResponse = await axios.get(`${BASE_URL}/enderecos`);
            setListaEnderecos(enderecosResponse.data);
            if (idParam != null) {
                const pedidoResponse = await axios.get(`${baseURL}/${idParam}`);
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
                const itemsResponse = await axios.get(`${BASE_URL}/itemsPedidos`);
                const itemsDoPedidoAtual = itemsResponse.data.filter(item => item.idPedidoCompra === pedidoData.id);
                const itemsComDetalhesProduto = await Promise.all(itemsDoPedidoAtual.map(async (item) => {
                    try {
                        const productResponse = await axios.get(`${BASE_URL}/produtos/${item.idProduto}`);
                        const product = productResponse.data;
                        const preco = product.preco || 0;
                        const subtotal = item.quantidade * preco;
                        return {
                            ...item,
                            nomeProduto: product.nome,
                            precoUnitario: preco,
                            subtotal: subtotal,
                            produtoCompleto: product
                        };
                    } catch (error) {
                        console.error(`Erro ao buscar produto para o item ${item.idProduto}:`, error);
                        return {
                            ...item,
                            nomeProduto: 'Produto não encontrado',
                            precoUnitario: 0,
                            subtotal: 0,
                            produtoCompleto: null
                        };
                    }
                }));
                setListaItemsPedidos(itemsComDetalhesProduto);
                const novoTotalGeral = itemsComDetalhesProduto.reduce((acc, item) => acc + item.subtotal, 0);
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
            await axios.delete(`${BASE_URL}/itemsPedidos/${idItem}`);
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
                                <div className="select-arrow-wrapper">
                                    <select
                                        id='inputStatus'
                                        value={status}
                                        className='form-control'
                                        name='status'
                                        onChange={(e) => setStatus(e.target.value)}
                                        onClick={() => setIsStatusPedidoOpen(!isStatusPedidoOpen)}
                                        onBlur={() => setIsStatusPedidoOpen(false)}
                                    >
                                        {statusPedidoOptions.map((option) => (
                                            <option value={option.value} key={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                    <div className={`arrow ${isStatusPedidoOpen ? 'open' : ''}`}></div>
                                </div>
                            </FormGroup>
                            <FormGroup label='Tipo de Entrega: ' htmlFor='inputTipoEntrega'>
                                <div className="select-arrow-wrapper">
                                    <select
                                        id='inputTipoEntrega'
                                        value={tipoEntrega}
                                        className='form-control'
                                        name='tipoEntrega'
                                        onChange={(e) => setTipoEntrega(e.target.value)}
                                        onClick={() => setIsTipoEntregaOpen(!isTipoEntregaOpen)}
                                        onBlur={() => setIsTipoEntregaOpen(false)}
                                    >
                                        <option value="" key="vazio"> -- Selecione o Tipo de Entrega -- </option>
                                        <option value="delivery" key="delivery">Delivery</option>
                                        <option value="busca no estabelecimento" key="busca no estabelecimento">Busca no estabelecimento</option>
                                    </select>
                                    <div className={`arrow ${isTipoEntregaOpen ? 'open' : ''}`}></div>
                                </div>
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
                                <div className="select-arrow-wrapper">
                                    <select
                                        id='inputEndereco'
                                        value={endereco?.id || ''}
                                        className='form-control'
                                        name='endereco'
                                        onChange={(e) => setEndereco(getById(e.target.value, listaEnderecos))}
                                        onClick={() => setIsEnderecoOpen(!isEnderecoOpen)}
                                        onBlur={() => setIsEnderecoOpen(false)}
                                    >
                                        <option value="" key="0"> -- Selecione um Endereço -- </option>
                                        {listaEnderecos.map((end) => (
                                            <option value={end.id} key={end.id}>{`${end.logradouro}, ${end.numero === "s/n" ? "s/n" : "nº " + end.numero} - ${end.bairro}, ${end.cidade}/${end.uf}`}</option>
                                        ))}
                                    </select>
                                    <div className={`arrow ${isEnderecoOpen ? 'open' : ''}`}></div>
                                </div>
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