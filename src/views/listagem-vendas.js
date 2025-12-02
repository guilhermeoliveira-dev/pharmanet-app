import React from 'react';
import Card from '../components/card';
import { mensagemSucesso, mensagemErro } from '../components/toastr';
import '../custom.css';
import Stack from '@mui/material/Stack';
import { IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
// import axios from 'axios';
import { BASE_URL } from '../config/axios';
import api from '../config/axios';

const baseURL = `${BASE_URL}/vendas`;

function ListagemVendas() {
  const [dados, setDados] = React.useState(null);

  async function excluir(id) {
    let url = `${baseURL}/${id}`;
    await api
      .delete(url)
      .then(function (response) {
        mensagemSucesso(`Venda excluída com sucesso!`);
        setDados(
          dados.filter((dado) => {
            return dado.id !== id;
          })
        );
      })
      .catch(function (error) {
        mensagemErro(`Erro ao excluir a venda: ${error.response ? (error.response.data.message || JSON.stringify(error.response.data)) : error.message}`);
      });
  }

  React.useEffect(() => {
    api.get(baseURL).then((response) => {
      setDados(response.data);
    }).catch(error => {
        console.error("Erro ao carregar vendas na listagem:", error);
        mensagemErro("Erro ao carregar vendas.");
    });
  }, []);

  if (!dados) return null;
  return (
    <div className='container'>
      <Card title='Listagem de Vendas'>
        <div className='row'>
          <div className='col-lg-12'>
            <div className='bs-component'>
              <table className='table table-hover'>
                <thead>
                  <tr>
                    <th scope='col'>Pedido</th>
                    <th scope='col'>Pagamento</th>
                    <th scope='col'>Data da Venda</th>
                    {/* <th scope='col'>Ações</th> */}
                  </tr>
                </thead>
                <tbody>
                  {dados.map((dado) => (
                    <tr key={dado.id}>
                      <td>{dado.codigo}</td>
                      <td>{"R$" + (dado.valor || 0).toFixed(2)}</td>
                      <td>{dado.dataVenda}</td>
                      {/* <td>
                        <Stack spacing={1} padding={0} direction='row'>
                          <IconButton
                            aria-label='delete'
                            style={{ color: "red"}}
                            onClick={() => excluir(dado.id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Stack>
                      </td> */}
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

export default ListagemVendas;