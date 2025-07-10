import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Stack from '@mui/material/Stack';
import Card from '../components/card';
import FormGroup from '../components/form-group';
import { IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ProductDropdown from '../components/ProductDropdown';
import { mensagemSucesso, mensagemErro } from '../components/toastr';
import '../custom.css';
import axios from 'axios';
import { BASE_URL } from '../config/axios';

function toDate(dateStr = "") {
    if (dateStr === undefined) {
        return new Date();
    }
    return dateStr.split('-').reverse().join('-');
}

function getById(id, list) {
    for (let i = 0; i < list.length; i++) {
        // eslint-disable-next-line
        if (list[i].id == id) {
            return list[i];
        }
    }
    return null;
}

function CadastroPedidos() {
    const { idParam } = useParams();
    const navigate = useNavigate();
    const baseURL = `${BASE_URL}/pedidos`;

    const [id, setId] = useState('');
    const [dataCriacao, setDataCriacao] = useState('');
    const [codigo, setCodigo] = useState('');
    const [status, setStatus] = useState('');
    const [valorTotal, setValorTotal] = useState('');
    const [tipoEntrega, setTipoEntrega] = useState('');
    const [dataEntrega, setDataEntrega] = useState('');
    const [endereco, setEndereco] = useState('');

    const [dados, setDados] = useState([]);
    const [listaEnderecos, setListaEnderecos] = useState([]);
    const [listaItensPedido, setListaItensPedido] = useState([]);

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
                    mensagemErro(error.response.data);
                });
        } else {
            await axios
                .put(`${baseURL}/${idParam}`, data, {
                    headers: { 'Content-Type': 'application/json' },
                })
                .then(function (response) {
                    mensagemSucesso(`Pedido cadastrado com sucesso!`);
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
            setDataCriacao(dados.dataCriacao);
            setCodigo(dados.codigo);
            setStatus(dados.status);
            setValorTotal(dados.valorTotal);
            setTipoEntrega(dados.tipoEntrega);
            setDataEntrega(dados.dataEntrega);
            setEndereco(dados.endereco);
        }
        await axios.get(`${BASE_URL}//enderecos`).then((response) => {
            setListaEnderecos(response.data);
        }).catch((a) => {
            //console.log(a);
        });
        await axios.get(`${BASE_URL}//itensPedido`).then((response) => {
            setListaItensPedido(response.data);
        }).catch((a) => {
            //console.log(a);
        });
    }

    async function excluirItem(idItem) {
        try {
            // Remove o item da lista de itens do pedido
            const novaListaItens = listaItensPedido.filter(item => item.id !== idItem);
            setListaItensPedido(novaListaItens);

            // Se necessário, faz uma requisição para excluir o item da API
            await axios.delete(`${BASE_URL}//itensPedido/${idItem}`)
                .then(() => {
                    mensagemSucesso('Item removido com sucesso!');
                })
                .catch((error) => {
                    mensagemErro('Erro ao remover o item.');
                });
        } catch (error) {
            mensagemErro('Erro ao remover o item.');
        }
    }

    useEffect(() => {
        buscar(); // eslint-disable-next-line
    }, [id]);

    if (!dados) return null;

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
                                    value={toDate(codigo)}
                                    className='form-control'
                                    name='codigo'
                                    onChange={(e) => setCodigo(toDate(e.target.value))}
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
                                    onChange={(e) => setDataEntrega(toDate(e.target.value))}
                                />
                            </FormGroup>
                            <FormGroup label='Endereco de entrega: ' htmlFor='inputEndereco'>
                                <div className="select-arrow-wrapper">
                                    <select
                                        id='inputEndereco'
                                        value={endereco?.id || 0}
                                        className='form-control'
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
                                    <div className={`arrow ${isEnderecoOpen ? 'open' : ''}`}></div>
                                </div>
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
                        {listaItensPedido.map((dado) => (
                            <tr key={dado.id}>
                                <td>{dado.estoque.produto.nome}</td>
                                <td>{dado.quantidade}</td>
                                <td>{dado.estoque.produto.preco}</td>
                                <td>
                                    <ProductDropdown product={dado.estoque.produto} />
                                </td>
                                <td>
                                    <Stack spacing={1} padding={0} direction='row'>
                                        <IconButton
                                            aria-label='delete'
                                            style={{ color: "red" }}
                                            onClick={() => excluirItem(dado.id)} // Adicionado o evento de exclusão
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