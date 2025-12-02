import React from 'react';
import Card from '../components/card';
import { mensagemSucesso, mensagemErro } from '../components/toastr';
import '../custom.css';
import { useNavigate } from 'react-router-dom';
import Stack from '@mui/material/Stack';
import { IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
// import axios from 'axios';
import { BASE_URL } from '../config/axios';
import api from '../config/axios';
import { toDate } from '../utils/date-formatter';

function formatText(text) {
    if (!text) return '';
    return text.toLowerCase().split(' ').map(word => {
        return word.charAt(0).toUpperCase() + word.slice(1);
    }).join(' ');
}

const baseURL = `${BASE_URL}/pedidoCompras`;

function ListagemPedidos() {
  const navigate = useNavigate();
  const cadastrar = () => {
    navigate(`/cadastro-pedidos`);
  };
  const editar = (id) => {
    navigate(`/cadastro-pedidos/${id}`);
  };
  const [dados, setDados] = React.useState(null);

  async function excluir(id) {
    let url = `${baseURL}/${id}`;
    console.log(`Tentando excluir: ${url}`);
    await api
      .delete(url)
      .then(function (response) {
        mensagemSucesso(`Pedido ${id} excluído com sucesso!`);
        setDados(
          dados.filter((dado) => {
            return dado.id !== id;
          })
        );
      })
      .catch(function (error) {
        console.error(`Erro ao excluir o pedido ${id}:`, error.response ? error.response.data : error.message);
        mensagemErro(`Erro ao excluir o pedido: ${error.response ? (error.response.data.message || JSON.stringify(error.response.data)) : error.message}`);
      });
  }
  
  React.useEffect(() => {
    api.get(baseURL).then((response) => {
      setDados(response.data);
      console.log(response.data);
    }).catch(error => {
        console.error("Erro ao carregar pedidos na listagem:", error);
        mensagemErro("Erro ao carregar pedidos.");
    });
  }, []);

  if (!dados) return null;
  return (
    <div className='container'>
      <Card title='Listagem de Pedidos'>
        <div className='row'>
          <div className='col-lg-12'>
            <div className='bs-component'>
              <button
                type='button'
                className='btn btn-warning'
                onClick={() => cadastrar()}
              >
                Novo Pedido
              </button>
              <table className='table table-hover'>
                <thead>
                  <tr>
                    <th scope='col'>Código</th>
                    <th scope='col'>Valor Total</th>
                    <th scope='col'>Status do Pedido</th>
                    <th scope='col'>Status da Entrega</th>
                    <th scope='col'>Tipo de Entrega</th>
                    <th scope='col'>Data de Entrega</th>
                    <th scope='col'>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {dados.map((dado) => (
                    <tr key={dado.id}>
                      <td>{dado.codigo}</td>
                      <td>{"R$" + (dado.valorTotal || 0).toFixed(2)}</td>
                      <td>{formatText(dado.status)}</td>
                      <td>{formatText(dado.statusEntrega || '')}</td>
                      <td>{formatText(dado.tipoEntrega)}</td>
                      <td>{toDate(dado.dataEntrega) === "" ? "---" : toDate(dado.dataEntrega)}</td>
                      <td>
                        <Stack spacing={1} padding={0} direction='row'>
                          <IconButton
                            aria-label='edit'
                            style={{ color: "white" }}
                            onClick={() => editar(dado.id)}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            aria-label='delete'
                            style={{ color: "red" }}
                            onClick={() => excluir(dado.id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Stack>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default ListagemPedidos;