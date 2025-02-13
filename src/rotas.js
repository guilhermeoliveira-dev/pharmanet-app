import React from 'react';

import TelaErro from './views/erro';
import Login from './views/login';
import LandingPage from './views/landing-page';

import ListagemFuncionarios from './views/listagem-funcionarios';
import ListagemFarmacias from './views/listagem-farmacias';
import ListagemProdutos from './views/listagem-produtos';
import ListagemClientes from './views/listagem-clientes';
import ListagemCategorias from './views/listagem-categorias';
import ListagemCargos from './views/listagem-cargos';
import ListagemEstoques from './views/listagem-estoques';
import ListagemPedidos from './views/listagem-pedidos';
import ListagemFornecedores from './views/listagem-fornecedores'
import ListagemPermissoes from './views/listagem-permissoes'
import ListagemVendas from './views/listagem-vendas';

import ListagemCarrinho from './views/listagem-carrinho';

import CadastroFuncionarios from './views/cadastro-funcionarios';
import CadastroCategorias from './views/cadastro-categorias';
import CadastroFarmacias from './views/cadastro-farmacias';
import CadastroClientes from './views/cadastro-clientes';
import CadastroCargos from './views/cadastro-cargos';
import CadastroEstoques from './views/cadastro-estoques';
import CadastroProdutos from './views/cadastro-produtos';
import CadastroPedidos from './views/cadastro-pedidos';
import CadastroFornecedores from './views/cadastro-fornecedores';
import CadastroPermissoes from './views/cadastro-permissoes';
// import CadastroVendas from './views/cadastro-vendas';

import { Route, Routes, BrowserRouter } from 'react-router-dom';

function Rotas(props) {
	return (
		<BrowserRouter>
			<Routes>
				<Route
					path='/login'
					element={<Login />}
				/> 

				{/* Cadastros */}
				<Route
					path='/cadastro-funcionarios/:idParam?'
					element={<CadastroFuncionarios />}
				/>
				<Route
					path='/cadastro-categorias/:idParam?'
					element={<CadastroCategorias />}
				/>
				<Route
					path='/cadastro-farmacias/:idParam?'
					element={<CadastroFarmacias />}
				/>
				<Route
					path='/cadastro-clientes/:idParam?'
					element={<CadastroClientes />}
				/>
				<Route
					path='/cadastro-cargos/:idParam?'
					element={<CadastroCargos />}
				/>
				<Route
					path='/cadastro-estoques/:idParam?'
					element={<CadastroEstoques />}
				/>
				<Route
					path='/cadastro-produtos/:idParam?'
					element={<CadastroProdutos />}
				/>
				<Route
					path='/cadastro-pedidos/:idParam?'
					element={<CadastroPedidos />}
				/>
				<Route
					path='/cadastro-fornecedores/:idParam?'
					element={<CadastroFornecedores />}
				/>
				<Route
					path='/cadastro-permissoes/:idParam?'
					element={<CadastroPermissoes />}
				/>
				{/* <Route
					path='/cadastro-vendas/:idParam?'
					element={<CadastroVendas />}
				/> */}

				{/* Listagens */}
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
				<Route
					path='/listagem-fornecedores/'
					element={<ListagemFornecedores />}
				/>
				<Route
					path='/listagem-permissoes/'
					element={<ListagemPermissoes />}
				/>
				<Route
					path='/listagem-vendas/'
					element={<ListagemVendas />}
				/>
				<Route
					path='/carrinho/'
					element={<ListagemCarrinho />}
				/>
				<Route
					path='/'
					element={<LandingPage />}
				/>
				<Route
					path="*"
					element={<TelaErro />}
				/>
			</Routes>
		</BrowserRouter>
	);
}

export default Rotas;