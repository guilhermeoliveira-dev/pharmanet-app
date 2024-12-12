import React from 'react';

import ListagemFuncionarios from './views/listagem-funcionarios';
import ListagemFarmacias from './views/listagem-farmacias';
import ListagemProdutos from './views/listagem-produtos';
import ListagemClientes from './views/listagem-clientes';
import ListagemCategorias from './views/listagem-categorias';

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
          path='listagem-farmacias/:idParam?' 
          element={<ListagemFarmacias />} 
        />
        <Route 
          path='/listagem-produtos/:idParam?' 
          element={<ListagemProdutos />} 
        />
        <Route
          path='/listagem-categorias/:idParam?'
          element={<ListagemCategorias />}
        />
        <Route
          path='/listagem-clientes/:idParam?'
          element={<ListagemClientes />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default Rotas;