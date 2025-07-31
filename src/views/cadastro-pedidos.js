import React, { useState, useEffect } from 'react';
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
                <img src={product.imagem != null ? product.imagem : imagemErro} alt={product.nome} style={{ width: '100px', height: '100px' }} />
            </Collapse>
        </div>
    );
};


function toDate(dateStr = "") {
    if (dateStr === undefined) {
        return new Date();
    }
    return dateStr.split('-').reverse().join('-');
}

function getById(id, list) {
    for (let i = 0; i < list.length; i++) {
        if (list[i].id === id) {
            return list[i];
        }
    }
    return null;
}

function CadastroPedidos() {
    const { idParam } = useParams();
    const navigate = useNavigate();
    const baseURL = `${BASE_URL}/pedidoCompras`;

    const [id, setId] = useState('');
    const [dataCriacao, setDataCriacao] = useState('');
    const [codigo, setCodigo] = useState('');
    const [status, setStatus] = useState('');
    const [valorTotal, setValorTotal] = useState('');
    const [tipoEntrega, setTipoEntrega] = useState('');
    const [dataEntrega, setDataEntrega] = useState('');
    const [endereco, setEndereco] = useState(null);

    const [dados, setDados] = useState({});
    const [listaEnderecos, setListaEnderecos] = useState([]);
    const [listaitemsPedidos, setListaitemsPedidos] = useState([]);

    const [isTipoEntregaOpen, setIsTipoEntregaOpen] = useState(false);
    const [isEnderecoOpen, setIsEnderecoOpen] = useState(false);

    function inicializar() {
        if (idParam == null) {
            setId('');
            setDataCriacao('');
            setCodigo('');
            setStatus('');
            setValorTotal(0);
            setTipoEntrega('');
            setDataEntrega('');
            setEndereco(null);
            setListaitemsPedidos([]);
        } else {
            setId(dados.id);
            setDataCriacao(dados.dataCriacao);
            setCodigo(dados.codigo);
            setStatus(dados.status);
            setValorTotal(dados.valorTotal);
            setTipoEntrega(dados.tipoEntrega);
            setDataEntrega(dados.dataEntrega);
            setEndereco(dados.endereco);
        }
    }

    async function salvar() {
        let data = { id, dataCriacao, codigo, status, valorTotal, tipoEntrega, dataEntrega, endereco };
        data = JSON.stringify(data);
        if (idParam == null) {
            await axios
                .post(baseURL, data, {
                    headers: { 'Content-Type': 'application/json' },
                })
                .then(function (response) {
                    mensagemSucesso(`Pedido cadastrado com sucesso!`);
                    navigate(`/listagem-categorias`);
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
                    navigate(`/listagem-categorias`);
                })
                .catch(function (error) {
                    if (error.response) {
                        mensagemErro(error.response.data);
                    } else {
                        mensagemErro("Erro ao atualizar o pedido.");
                    }
                });
        }
    }

    async function buscar() {
        setListaitemsPedidos([]);

        if (idParam != null) {
            await axios.get(`${baseURL}/${idParam}`).then((response) => {
                setDados(response.data);
                setId(response.data.id);
                setDataCriacao(response.data.dataCriacao);
                setCodigo(response.data.codigo);
                setStatus(response.data.status);
                setValorTotal(response.data.valorTotal);
                setTipoEntrega(response.data.tipoEntrega);
                setDataEntrega(response.data.dataEntrega);
                setEndereco(response.data.endereco);
            }).catch((a) => {
                console.log(a);
            });
        }

        await axios.get(`${BASE_URL}/enderecos`).then((response) => {
            setListaEnderecos(response.data);
        }).catch((a) => {
            console.log(a);
        });

        await axios.get(`${BASE_URL}/itemsPedidos`).then(async (response) => {
            const itemsDoPedidoAtual = response.data.filter(item => {
                return idParam ? item.idPedidoCompra === idParam : false;
            });

            const itemsComDetalhesProduto = await Promise.all(itemsDoPedidoAtual.map(async (item) => {
                try {
                    const productResponse = await axios.get(`${BASE_URL}/produtos/${item.idProduto}`);
                    const product = productResponse.data;
                    return {
                        ...item,
                        nomeProduto: product.nome,
                        precoUnitario: product.valorUnitario,
                        produtoCompleto: product
                    };
                } catch (error) {
                    console.error(`Erro ao buscar produto para o item ${item.idProduto}:`, error);
                    return {
                        ...item,
                        nomeProduto: 'Produto não encontrado',
                        precoUnitario: 0,
                        produtoCompleto: null
                    };
                }
            }));
            setListaitemsPedidos(itemsComDetalhesProduto);
        }).catch((a) => {
            console.log(a);
        });
    }

    async function excluirItem(idItem) {
        try {
            const novaListaItens = listaitemsPedidos.filter(item => item.id !== idItem);
            setListaitemsPedidos(novaListaItens);

            await axios.delete(`${BASE_URL}/itemsPedidos/${idItem}`)
                .then(() => {
                    mensagemSucesso('Item removido com sucesso!');
                    buscar();
                })
                .catch((error) => {
                    mensagemErro('Erro ao remover o item.');
                });
        } catch (error) {
            mensagemErro('Erro ao remover o item.');
        }
    }

    useEffect(() => {
        inicializar();
        buscar();
    }, [idParam]);


    return (
        <div className='container'>
            <Card title='Cadastro de Pedido'>
                <div className='row'>
                    <div className='col-lg-12'>
                        <div className='bs-component'>
                            <FormGroup label='Data da Criação: ' htmlFor='inputDataCriacao'>
                                <input
                                    disabled
                                    type='text'
                                    id='inputDataCriacao'
                                    value={toDate(dataCriacao)}
                                    className='form-control'
                                    name='dataCriacao'
                                    onChange={(e) => setDataCriacao(toDate(e.target.value))}
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
                            <FormGroup label='Status: ' htmlFor='inputStatus'>
                                <select
                                    disabled
                                    type='text'
                                    id='inputStatus'
                                    value={status}
                                    className='form-control'
                                    name='status'
                                    onChange={(e) => setStatus(e.target.value)}
                                >
                                    <option value="pagamento pendente">Pagamento Pendente</option>
                                    <option value="entrega pendente">Entrega Pendente</option>
                                    <option value="finalizado">Finalizado</option>
                                </select>
                            </FormGroup>
                            <FormGroup label='Valor Total: ' htmlFor='inputValorTotal'>
                                <input
                                    disabled
                                    type='number'
                                    id='inputValorTotal'
                                    value={valorTotal}
                                    className='form-control'
                                    name='valorTotal'
                                    onChange={(e) => setValorTotal(e.target.value)}
                                />
                            </FormGroup>
                            <FormGroup label='Tipo de Entrega: ' htmlFor='inputTipoEntrega'>

                                <select
                                    id='inputTipoEntrega'
                                    value={tipoEntrega}
                                    className='form-select'
                                    name='tipoEntrega'
                                    onChange={(e) => setTipoEntrega(e.target.value)}
                                    onClick={() => setIsTipoEntregaOpen(!isTipoEntregaOpen)}
                                    onBlur={() => setIsTipoEntregaOpen(false)}
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
                                    onChange={(e) => setDataEntrega(toDate(e.target.value))}
                                />
                            </FormGroup>
                            <FormGroup label='Endereco de entrega: ' htmlFor='inputEndereco'>
                                <select
                                    id='inputEndereco'
                                    value={endereco?.id || 0}
                                    className='form-select'
                                    name='endereco'
                                    onChange={(e) => setEndereco(getById(e.target.value, listaEnderecos))}
                                    onClick={() => setIsEnderecoOpen(!isEnderecoOpen)}
                                    onBlur={() => setIsEnderecoOpen(false)}
                                >
                                    <option value="0" key="0"> -- Selecione um Endereço -- </option>
                                    {listaEnderecos.map((cat) => (
                                        <option value={cat.id} key={cat.id}>{`${cat.logradouro}, ${cat.numero === "s/n" ? "s/n" : "nº " + cat.numero}`}</option>
                                    ))}
                                </select>
                            </FormGroup>

                        </div>
                    </div>
                </div>
                <h2>Itens:</h2>
                <table className='table table-hover'>
                    <thead>
                        <tr>
                            <th scope='col'>Produto</th>
                            <th scope='col'>Quantidade</th>
                            <th scope='col'>Preço</th>
                            <th scope='col'>Detalhes</th>
                            <th scope='col'>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {listaitemsPedidos.map((dado) => (
                            <tr key={dado.id}>
                                <td>{dado.nomeProduto}</td>
                                <td>{dado.quantidade}</td>
                                <td>{dado.precoUnitario}</td>
                                <td>
                                    <ProductDropdown product={dado.produtoCompleto} />
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