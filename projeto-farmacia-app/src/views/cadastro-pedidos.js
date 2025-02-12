import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Stack from '@mui/material/Stack';

import Card from '../components/card';
import FormGroup from '../components/form-group';

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

function CadastroPedidos() {
    const { idParam } = useParams();

    const navigate = useNavigate();

    const baseURL = `${BASE_URL}jsonfake2/pedidos`;

    const [id, setId] = useState('');
    const [dataCriacao, setDataCriacao] = useState('');
    const [status, setStatus] = useState('');
    const [valorTotal, setValorTotal] = useState('');
    const [tipoEntrega, setTipoEntrega] = useState('');
    const [dataEntrega, setDataEntrega] = useState('');
    const [endereco, setEndereco] = useState('');

    const [dados, setDados] = useState([]);

    const [listaEnderecos, setListaEnderecos] = useState([]);


    function inicializar() {
        if (idParam == null) {
            setId('');
            setDataCriacao('');
            setStatus('');
            setValorTotal(0);
            setTipoEntrega('');
            setDataEntrega('');
            setEndereco(null);
        } else {
            setId(dados.id);
            setDataCriacao(dados.dataCriacao);
            setStatus(dados.status);
            setValorTotal(dados.valorTotal);
            setTipoEntrega(dados.tipoEntrega);
            setDataEntrega(dados.dataEntrega);
            setEndereco(dados.endereco);
        }
    }

    async function salvar() {
        let data = { id, dataCriacao, status, valorTotal, tipoEntrega, dataEntrega, endereco };
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
            setStatus(dados.status);
            setValorTotal(dados.valorTotal);
            setTipoEntrega(dados.tipoEntrega);
            setDataEntrega(dados.dataEntrega);
            setEndereco(dados.endereco);

        }
        await axios.get(`${BASE_URL}/jsonfake3/enderecos`).then((response) => {
            setListaEnderecos(response.data);
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
                                    type='text'
                                    id='inputTipoEntrega'
                                    value={tipoEntrega}
                                    className='form-control'
                                    name='tipoEntrega'
                                    onChange={(e) => setTipoEntrega(e.target.value)}
                                >
                                    <option value="delivery" key="delivery">Delivery</option>
                                    <option value="busca no estabelecimento" key="busca no estabelecimento">Busca no estabelecimento</option>
                                </select>
                            </FormGroup>
                            <FormGroup label='Data da Entrega: ' htmlFor='inputDataEntrega'>
                                <input
                                    type='text'
                                    id='inputDataEntrega'
                                    value={toDate(dataEntrega)}
                                    className='form-control'
                                    name='dataEntrega'
                                    onChange={(e) => setDataEntrega(toDate(e.target.value))}
                                />
                            </FormGroup>
                            <FormGroup label='Endereco de entrega: ' htmlFor='inputEndereco'>
                                <select
                                    type='text'
                                    id='inputEndereco'
                                    value={endereco == null ? 0 : endereco.id}
                                    className='form-control'
                                    name='endereco'
                                    onChange={(e) => setEndereco(e.target.value)}
                                >
                                    {listaEnderecos.map((cat) => (
                                        <option value={cat.id} key={cat.id}>{`${cat.logradouro},  ${cat.numero == "s/n" ? "s/n" : "nº "+cat.numero}`}</option>
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

export default CadastroPedidos;