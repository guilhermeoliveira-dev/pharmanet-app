import React from 'react';
// import ImagemErro from '../img/imagem-erro.png';
import ImagemErro from '../img/mxstery.gif';

function TelaErro() {
    return (
        <div className='container d-flex flex-column justify-content-center align-items-center'>
            <h1 className='text-center'>Ops! Você tentou acessar um endereço inválido!</h1>
            <br />
            <img 
                src={ImagemErro} 
                alt="Erro, este endereço é inválido" 
                className='img-fluid'
            />
        </div>
    );
}

export default TelaErro;