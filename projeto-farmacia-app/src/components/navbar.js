import React from 'react';
import 'bootswatch/dist/slate/bootstrap.css';
import NavbarItem from './navbarItem';
import IconePharmanet from '../img/logo-pharmanet.svg';
import Dropdown from 'react-bootstrap/Dropdown';

function Navbar(props) {
    return (
        <div className='navbar navbar-expand-lg fixed-top navbar-dark bg-primary'>
            <div className='container'>
                <a href='/' className='navbar-brand'>
                    <img
                        src={IconePharmanet}
                        width="30"
                        height="30"
                        className="d-inline-block align-top"
                        alt="Logo PharmaNET"
                    />
                    PharmaNET
                </a>

                <button
                    className='navbar-toggler'
                    type='button'
                    data-toggle='collapse'
                    data-target='#navbarResponsive'
                    aria-controls='navbarResponsive'
                    aria-expanded='false'
                    aria-label='Toggle navigation'
                >
                    <span className='navbar-toggler-icon'></span>
                </button>

                <div className='collapse navbar-collapse' id='navbarResponsive'>
                    <ul className='navbar-nav mx-auto'>
                        <NavbarItem
                            render='true'
                            href='/listagem-permissoes'
                            label='Permissões'
                        />
                        <NavbarItem
                            render='true'
                            href='/listagem-cargos'
                            label='Cargos'
                        />
                        <NavbarItem
                            render='true'
                            href='/listagem-farmacias'
                            label='Farmácias'
                        />
                        <NavbarItem
                            render='true'
                            href='/listagem-funcionarios'
                            label='Funcionários'
                        />
                        <NavbarItem
                            render='true'
                            href='/listagem-fornecedores'
                            label='Fornecedores'
                        />
                        <NavbarItem
                            render='true'
                            href='/listagem-estoques'
                            label='Estoques'
                        />
                        <NavbarItem
                            render='true'
                            href='/listagem-categorias'
                            label='Categorias'
                        />
                        <NavbarItem
                            render='true'
                            href='/listagem-produtos'
                            label='Produtos'
                        />
                        <NavbarItem
                            render='true'
                            href='/listagem-pedidos'
                            label='Pedidos'
                        />
                        <NavbarItem
                            render='true'
                            href='/listagem-vendas'
                            label='Vendas'
                        />
                        <NavbarItem
                            render='true'
                            href='/listagem-clientes'
                            label='Clientes'
                        />
                    </ul>
                    <Dropdown>
                        <Dropdown.Toggle id="dropdown">
                            Usuário
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            <Dropdown.Item href="#/action-1">Entrar</Dropdown.Item>
                            <Dropdown.Item href="#/action-2">Sair</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
            </div>
        </div>
    );
}

export default Navbar;