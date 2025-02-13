import React, { useState, useCallback, useMemo } from 'react';
import 'bootswatch/dist/slate/bootstrap.css';
import NavbarItem from './navbarItem';
import IconePharmanet from '../img/logo-pharmanet.svg';
import Dropdown from 'react-bootstrap/Dropdown';
import { FaShoppingCart } from "react-icons/fa";

const Navbar = () => {
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

    const toggleMobileMenu = useCallback(() => {
        setMobileMenuOpen(prev => !prev);
    }, []);

    const menuItems = useMemo(() => [
        { href: '/listagem-permissoes', label: 'Permissões' },
        { href: '/listagem-cargos', label: 'Cargos' },
        { href: '/listagem-farmacias', label: 'Farmácias' },
        { href: '/listagem-funcionarios', label: 'Funcionários' },
        { href: '/listagem-fornecedores', label: 'Fornecedores' },
        { href: '/listagem-estoques', label: 'Estoques' },
        { href: '/listagem-categorias', label: 'Categorias' },
        { href: '/listagem-produtos', label: 'Produtos' },
        { href: '/listagem-pedidos', label: 'Pedidos' },
        { href: '/listagem-vendas', label: 'Vendas' },
        { href: '/listagem-clientes', label: 'Clientes' },
    ], []);

    const renderCartButton = (isMobile = false) => (
        <a href="/carrinho" className={`btn btn-dark ${isMobile ? 'd-lg-none' : 'd-none d-lg-flex'}`}>
            <FaShoppingCart size={20} />
        </a>
    );

    const renderUserDropdown = (isMobile = false) => (
        <Dropdown className={isMobile ? 'd-lg-none' : 'd-none d-lg-flex'}>
            <Dropdown.Toggle id="dropdown" className="btn btn-dark">
                Usuário
            </Dropdown.Toggle>
            <Dropdown.Menu>
                <Dropdown.Item href="/login">Entrar</Dropdown.Item>
                <Dropdown.Item href="/">Sair</Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
    );

    return (
        <div className='navbar navbar-expand-lg fixed-top navbar-dark bg-primary'>
            <div className='container'>
                <a href='/' className='navbar-brand'>
                    <img
                        src={IconePharmanet}
                        width="28"
                        height="28"
                        className="d-inline-block align-middle"
                        alt="Logo PharmaNET"
                    />
                    PharmaNET
                </a>

                <div className="d-flex align-items-center gap-2">
                    {renderCartButton(true)}
                    {renderUserDropdown(true)}
                    <button
                        className='navbar-toggler'
                        type='button'
                        onClick={toggleMobileMenu}
                        aria-label='Toggle navigation'
                    >
                        <span className='navbar-toggler-icon'></span>
                    </button>
                </div>

                <div className={`collapse navbar-collapse ${isMobileMenuOpen ? 'show' : ''}`} id='navbarResponsive'>
                    <ul className='navbar-nav mx-auto'>
                        {menuItems.map((item, index) => (
                            <NavbarItem
                                key={index}
                                render={true}
                                href={item.href}
                                label={item.label}
                            />
                        ))}
                    </ul>

                    <div className="d-flex align-items-center gap-3">
                        {renderCartButton()}
                        {renderUserDropdown()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Navbar;