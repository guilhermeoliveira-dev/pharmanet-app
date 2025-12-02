import React from 'react';
import Stack from '@mui/material/Stack';
import Card from '../components/card';
import FormGroup from '../components/form-group';
import { mensagemSucesso, mensagemErro } from '../components/toastr';

import  api from '../config/axios';

class Login extends React.Component {
  state = {
    login: '',
    senha: '',
  };

  logar = () => {
    const data = {
      email: this.state.login,
      senha: this.state.senha
    }
    api.post('/usuarios/auth', data)
    .then((response) => {
      localStorage.setItem("authToken", response.data.token);
      mensagemSucesso(`Usuário ${this.state.login} logado com sucesso!`);
    })
      .catch(function (error) {
        mensagemErro(`Erro: ${error}`);
      });

  };

  cancelar = () => {
    this.setState({
      login: '',
      senha: '',
    });
  };

  render() {
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
                    value={this.state.login}
                    className='form-control'
                    name='login'
                    onChange={(e) => this.setState({ login: e.target.value })}
                  />
                </FormGroup>
                <FormGroup label='Senha: *' htmlFor='inputSenha'>
                  <input
                    type='password'
                    id='inputSenha'
                    value={this.state.senha}
                    className='form-control'
                    name='senha'
                    onChange={(e) => this.setState({ senha: e.target.value })}
                  />
                </FormGroup>
                <Stack spacing={2} padding={1} direction='column' alignItems='center'>
                  <Stack spacing={1} direction='row'>
                    <button
                      onClick={this.logar}
                      type='button'
                      className='btn btn-success'
                      style={{ width: '100px' }}
                    >
                      Entrar
                    </button>
                    <button
                      onClick={this.cancelar}
                      type='button'
                      className='btn btn-danger'
                      style={{ width: '100px' }}
                    >
                      Cancelar
                    </button>
                  </Stack>
                  <div>Não possui conta?</div>
                  <button
                    onClick={() => console.log('ainda não fizemos o redirecionamento')}
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
}

export default Login;