import React from 'react';

import ListagemFuncionarios from './views/listagem-funcionarios';
import ListagemFarmacias from './views/listagem-farmacias';
import ListagemProdutos from './views/listagem-produtos';
import ListagemClientes from './views/listagem-clientes';
import ListagemCategorias from './views/listagem-categorias';
import ListagemCargos from './views/listagem-cargos';
import ListagemEstoques from './views/listagem-estoques';
import ListagemPedidos from './views/listagem-pedidos';

import Login from './views/login';
import CadastroFuncionario from './views/cadastro-funcionario';

import { Route, Routes, BrowserRouter } from 'react-router-dom';

function Rotas(props) {
  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path='/login' 
          element={<Login />} 
        />
        <Route
          path='/cadastro-funcionarios/:idParam?'
          element={<CadastroFuncionario />}
        />


        
        <Route 
          path='/listagem-funcionarios' 
          element={<ListagemFuncionarios />} 
        />
        <Route 
          path='listagem-farmacias/' 
          element={<ListagemFarmacias />} 
        />
        <Route 
          path='/listagem-produtos/' 
          element={<ListagemProdutos />} 
        />
        <Route 
          path='/listagem-estoques/' 
          element={<ListagemEstoques />} 
        />
        <Route
          path='/listagem-categorias/'
          element={<ListagemCategorias />}
        />
        <Route
          path='/listagem-clientes/'
          element={<ListagemClientes />}
        />
        <Route
          path='/listagem-cargos/'
          element={<ListagemCargos />}
        />
        <Route
          path='/listagem-pedidos/'
          element={<ListagemPedidos />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default Rotas;