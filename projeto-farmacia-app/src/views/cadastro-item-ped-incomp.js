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

function getById(id, list) {
    for (let i = 0; i < list.length; i++) {
        if (list[i].id === id) {
            return list[i];
        }
    }
    return null;
}

function CadastroItensPedidos() {
    const { idParam } = useParams();

    const navigate = useNavigate();

    const baseURL = `${BASE_URL}jsonfake/itensPedido`;

    const [id, setId] = useState('');
    const [quantidade, setQuantidade] = useState('');
    const [precoUnitario, setPrecoUnitario] = useState('');
    const [idPedido, setIdPedido] = useState('');
    const [idEstoque, setIdEstoque] = useState('');
    const [idReceita, SetIdReceita] = useState('');

    const [dados, setDados] = useState([]);

    function inicializar() {
        if (idParam == null) {
            setId('');
            setQuantidade('');
            setPrecoUnitario('');
            setIdPedido('');
            setIdEstoque('');
            SetIdReceita('');
        } else {
            setId(dados.id);
            setQuantidade(dados.quantidade);
            setPrecoUnitario(dados.precoUnitario);
            setIdPedido(dados.idPedido);
            setIdEstoque(dados.idEstoque);
            SetIdReceita(dados.idReceita);
        }
    }

    async function salvar() {
        let data = { id, quantidade, precoUnitario, idPedido, idEstoque, idReceita };
        data = JSON.stringify(data);
        if (idParam == null) {
            await axios
                .post(baseURL, data, {
                    headers: { 'Content-Type': 'application/json' },
                })
                .then(function (response) {
                    mensagemSucesso(`Item de pedido ${id} cadastrado com sucesso!`);
                    navigate(`/listagem-itens-pedidos`);
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
                    mensagemSucesso(`Item de pedido ${id} alterado com sucesso!`);
                    navigate(`/listagem-itens-pedidos`);
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
            setQuantidade(dados.quantidade);
            setPrecoUnitario(dados.precoUnitario);
            setIdPedido(dados.idPedido);
            setIdEstoque(dados.idEstoque);
            SetIdReceita(dados.idReceita);
        }
    }
}

useEffect(() => {
    buscar(); // eslint-disable-next-line
}, [id]);

if (!dados) return null;

return (
    <div className='container'>
        <Card title='Cadastro de Item de Pedido'>
            <div className='row'>
                <div className='col-lg-12'>
                    <div className='bs-component'>
                        <FormGroup label='Quantidade: *' htmlFor='inputQuantidade'>
                            <input
                                //type='text'
                                id='inputQuantidade'
                                value={quantidade}
                                className='form-control'
                                name='quantidade'
                                onChange={(e) => setQuantidade(e.target.value)}
                            />
                        </FormGroup>
                        <FormGroup label='Preço Unitário: *' htmlFor='inputPrecoUnitario'>
                            <input
                                //type='text'
                                id='inputPrecoUnitario'
                                value={precoUnitario}
                                className='form-control'
                                name='precoUnitario'
                                onChange={(e) => setPrecoUnitario(e.target.value)}
                            />
                        </FormGroup>
                        <FormGroup label='Pedido: *' htmlFor='inputPedido'>
                            <input
                                //type='text'
                                id='inputPedido'
                                value={idPedido}
                                className='form-control'
                                name='idPedido'
                                onChange={(e) => setIdPedido(e.target.value)}
                            />
                        </FormGroup>
                        <FormGroup label='Estoque: *' htmlFor='inputEstoque'>
                            <input
                                //type='text'
                                id='inputEstoque'
                                value={idEstoque}
                                className='form-control'
                                name='idEstoque'
                                onChange={(e) => setIdEstoque(e.target.value)}
                            />
                        </FormGroup>
                        <FormGroup label='Receita: *' htmlFor='inputReceita'>
                            <input
                                //type='text'
                                id='inputReceita'
                                value={idReceita}
                                className='form-control'
                                name='idReceita'
                                onChange={(e) => SetIdReceita(e.target.value)}
                            />
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


export default CadastroFuncionarios;