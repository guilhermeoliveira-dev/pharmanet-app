import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Stack from '@mui/material/Stack';
import Card from '../components/card';
import FormGroup from '../components/form-group';
import { mensagemSucesso, mensagemErro } from '../components/toastr';

import api from '../config/axios';

function Login() {
  const navigate = useNavigate();
  const [login, setLogin] = useState('');
  const [senha, setSenha] = useState('');

  const logar = () => {
    if (!login || !senha) {
        mensagemErro("Login e Senha são obrigatórios.");
        return;
    }
    
    const data = {
      email: login,
      senha: senha
    };

    api.post('/usuarios/auth', data)
      .then((response) => {
        localStorage.setItem("authToken", response.data.token);
        mensagemSucesso(`Usuário ${login} logado com sucesso!`);
        navigate('/');
      })
      .catch(function (error) {
        const statusCode = error.response?.status;
        let errorMessage = error.response?.data?.message || error.response?.data || error.message || "Erro desconhecido.";
        
        if (statusCode === 401) {
             errorMessage = "Credenciais inválidas. Verifique seu email e senha.";
        }
        mensagemErro(`Erro: ${errorMessage}`);
      });
  };

  const cancelar = () => {
    setLogin('');
    setSenha('');
  };

  const handleCadastro = () => {
    navigate('/cadastro-clientes');
  }

  return (
    <div
      className='container'
      style={{
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <div className='col-lg-4'>
        <Card title='Acesso'>
          <div className='row'>
            <div className='bs-component'>
              <FormGroup label='Login: *' htmlFor='inputLogin'>
                <input
                  type='text'
                  id='inputLogin'
                  value={login}
                  className='form-control'
                  name='login'
                  onChange={(e) => setLogin(e.target.value)}
                />
              </FormGroup>
              <FormGroup label='Senha: *' htmlFor='inputSenha'>
                <input
                  type='password'
                  id='inputSenha'
                  value={senha}
                  className='form-control'
                  name='senha'
                  onChange={(e) => setSenha(e.target.value)}
                />
              </FormGroup>
              <Stack spacing={2} padding={1} direction='column' alignItems='center'>
                <Stack spacing={1} direction='row'>
                  <button
                    onClick={logar}
                    type='button'
                    className='btn btn-success'
                    style={{ width: '100px' }}
                  >
                    Entrar
                  </button>
                  <button
                    onClick={cancelar}
                    type='button'
                    className='btn btn-danger'
                    style={{ width: '100px' }}
                  >
                    Cancelar
                  </button>
                </Stack>
                <div>Não possui conta?</div>
                <button
                  onClick={handleCadastro}
                  type='button'
                  className='btn btn-primary'
                >
                  Cadastre-se
                </button>
              </Stack>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default Login;