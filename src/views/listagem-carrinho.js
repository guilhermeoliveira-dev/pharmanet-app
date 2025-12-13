import React from 'react';
import Card from '../components/card';
import { mensagemSucesso, mensagemErro } from '../components/toastr';
import '../custom.css';
import { useNavigate, useParams } from 'react-router-dom';
import Stack from '@mui/material/Stack';
import { IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import Typography from '@mui/material/Typography';
import api from '../config/axios';
import { BASE_URL } from '../config/axios';
import { lerCarrinho, removerItem, limparCarrinho } from '../utils/carrinho-utils'; 

const baseURL = `${BASE_URL}/pedidoCompras`;

const ID_USUARIO_LOGADO_FAKE = 1;
const TIPO_ENTREGA_PADRAO = "delivery";

function ListagemCarrinho() {
    const navigate = useNavigate();
    const [itensCarrinho, setItensCarrinho] = React.useState([]);

    React.useEffect(() => {
        setItensCarrinho(lerCarrinho());
    }, []);

    function calcularPrecoTotal() {
        var total = 0;
        for (var i = 0; i < itensCarrinho.length; i++) {
            const preco = itensCarrinho[i].produto?.preco || 0;
            total += preco * itensCarrinho[i].quantidade;
        }
        return total;
    }

    function excluir(idProduto) {
        const novoCarrinho = removerItem(idProduto);
        setItensCarrinho(novoCarrinho);
        mensagemSucesso('Produto removido do carrinho com sucesso!');
    }
    
    function handleEsvaziarCarrinho() {
        setItensCarrinho(limparCarrinho());
        mensagemSucesso('Carrinho esvaziado com sucesso!');
    }

    async function confirmarPedido() {
        if (itensCarrinho.length === 0) {
            mensagemErro('O carrinho está vazio. Adicione um produto para confirmar o pedido.');
            return;
        }

        const itensFormatados = itensCarrinho.map(item => ({
            idProduto: item.produto.id,
            idReceita: item.idReceita || null, 
            quantidade: item.quantidade,
            precoUnitario: item.produto.preco, 
        }));

        const pedidoDTO = {
            idUsuario: ID_USUARIO_LOGADO_FAKE,
            tipoEntrega: TIPO_ENTREGA_PADRAO,
            itens: itensFormatados
        };

        try {
            const response = await api.post(`${baseURL}/carrinho`, pedidoDTO);

            mensagemSucesso(`Pedido ${response.data.codigo} cadastrado com sucesso!`);
            
            setItensCarrinho(limparCarrinho()); 
            navigate(`/listagem-pedidos`);

        } catch (error) {
            console.error('Erro na Confirmação de Pedido:', error.response);
            
            const responseData = error.response?.data;
            let errorMessage = "Erro desconhecido. Verifique o log do backend.";

            if (typeof responseData === 'string') {
                errorMessage = responseData; 
            } else if (responseData?.message) {
                errorMessage = responseData.message; 
            } else if (responseData) {
                errorMessage = JSON.stringify(responseData); 
            }

            mensagemErro(`Erro: ${errorMessage}`);
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
                                onClick={handleEsvaziarCarrinho}
                                disabled={itensCarrinho.length === 0}
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
                                    {itensCarrinho.length === 0 ? (
                                        <tr>
                                            <td colSpan="4" className="text-center">Seu carrinho está vazio.</td>
                                        </tr>
                                    ) : (
                                        itensCarrinho.map((dado) => (
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
                                        ))
                                    )}
                                </tbody>
                            </table>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginLeft: "20px", marginTop: "10px" }}>
                                <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.9rem', sm: '1rem' }, color: "white" }}>
                                    Total: R$ {calcularPrecoTotal().toFixed(2)}
                                </Typography>
                                <button
                                    type='button'
                                    className='btn btn-success'
                                    onClick={confirmarPedido}
                                    disabled={itensCarrinho.length === 0}
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