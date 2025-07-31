import React from 'react';
import Card from '../components/card';
import { mensagemSucesso, mensagemErro } from '../components/toastr';
import '../custom.css';
import { useNavigate, useParams } from 'react-router-dom';
import Stack from '@mui/material/Stack';
import { IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import { BASE_URL } from '../config/axios';

const baseURL = `${BASE_URL}/estoques`;

function ListagemCarrinho() {
    const { idParam } = useParams();
    const navigate = useNavigate();
    const [itensCarrinho, setItensCarrinho] = React.useState([]);

    React.useEffect(() => {
        const items = JSON.parse(localStorage.getItem('itensCarrinho'));
        if (items) {
            setItensCarrinho(items);
        }
    }, []);

    function calcularPrecoTotal() {
        var total = 0;
        for (var i = 0; i < itensCarrinho.length; i++) {
            total += itensCarrinho[i].produto.preco * itensCarrinho[i].quantidade;
        }
        return total;
    }

    async function salvarPedido() {
        let data = {
            itens: itensCarrinho.map(item => ({
                produtoId: item.produto.id,
                quantidade: item.quantidade
            })),
            total: calcularPrecoTotal()
        };
        
        if (idParam == null) {
            await axios.post(baseURL, data, {
                headers: { 'Content-Type': 'application/json' },
            })
                .then(function (response) {
                    mensagemSucesso(`Pedido cadastrado com sucesso!`);
                    navigate(`/listagem-pedidos`);
                })
                .catch(function (error) {
                    mensagemErro(error.response.data);
                });
        } else {
            await axios.put(`${baseURL}/${idParam}`, data, {
                headers: { 'Content-Type': 'application/json' },
            })
                .then(function (response) {
                    mensagemSucesso(`Pedido atualizado com sucesso!`); 
                    navigate(`/listagem-pedidos`);
                })
                .catch(function (error) {
                    mensagemErro(error.response.data);
                });
        }
    }

    async function excluir(id) {
        try {
            const novosItens = itensCarrinho.filter(item => item.produto.id !== id);
            setItensCarrinho(novosItens);
            localStorage.setItem('itensCarrinho', JSON.stringify(novosItens));
            mensagemSucesso('Produto removido do carrinho com sucesso!');
        } catch (error) {
            mensagemErro('Erro ao remover o produto do carrinho.');
        }
    }

    if (!itensCarrinho) return null; 
    return (
        <div className='container'>
            <Card title='Carrinho'>
                <div className='row'>
                    <div className='col-lg-12'>
                        <div className='bs-component'>
                            <button
                                type='button'
                                className='btn btn-warning'
                                onClick={() => {
                                    setItensCarrinho([]);
                                    localStorage.setItem('itensCarrinho', "[]");
                                    mensagemSucesso('Carrinho esvaziado com sucesso!');
                                }}
                            >
                                Esvaziar carrinho
                            </button>

                            <table className='table table-hover'>
                                <thead>
                                    <tr>
                                        <th scope='col'>Produto</th>
                                        <th scope='col'>Quantidade</th>
                                        <th scope='col'>Preço</th>
                                        <th scope='col'>Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {itensCarrinho.map((dado) => (
                                        <tr key={dado.produto.id}> 
                                            <td>{dado.produto.nome}</td> 
                                            <td>{dado.quantidade}</td>
                                            <td>R$ {dado.produto.preco.toFixed(2)}</td> 
                                            <td>
                                                <Stack spacing={1} padding={0} direction='row'>
                                                    <IconButton
                                                        aria-label='delete'
                                                        style={{ color: "red" }}
                                                        onClick={() => excluir(dado.produto.id)}
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </Stack>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginLeft: "20px", marginTop: "10px" }}>
                                <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.9rem', sm: '1rem' }, color: "white" }}>
                                    Total: R$ {calcularPrecoTotal().toFixed(2)}
                                </Typography>
                                <button
                                    type='button'
                                    className='btn btn-success'
                                    onClick={() => {
                                        salvarPedido();
                                        setItensCarrinho([]);
                                        localStorage.setItem('itensCarrinho', "[]");
                                    }}
                                >
                                    Confirmar pedido
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
}

export default ListagemCarrinho;