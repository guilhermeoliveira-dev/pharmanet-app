import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Stack from '@mui/material/Stack';

import Card from '../components/card';
import FormGroup from '../components/form-group';

import { mensagemSucesso, mensagemErro } from '../components/toastr';

import '../custom.css';

import axios from 'axios';
import { BASE_URL } from '../config/axios';

function CadastroFuncionario() {
  const { idParam } = useParams();

  const navigate = useNavigate();

  const baseURL = `${BASE_URL}jsonfake/funcionarios`;

  const [id, setId] = useState('');
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [cpf, setCpf] = useState('');
  const [senha, setSenha] = useState('');
  const [senhaRepeticao, setSenhaRepeticao] = useState('');
  const [telefone, setTelefone] = useState('');
  //const [endereco, setEndereco] = useState('');
  //const [cargo, setCargo] = useState('');
  const [dataAdmissao, setDataAdmissao] = useState('');
  const [salario, setSalario] = useState(0);
  const [expediente, setExpediente] = useState('');
  //const [farmacia, setFarmacia] = useState('');

  const [dados, setDados] = useState([]);

  function inicializar() {
    if (idParam == null) {
      setId('');
      setNome('');
      setEmail('');
      setCpf('');
      setSenha('');
      setSenhaRepeticao('');
      setTelefone('');
      //setEndereco('');
      //setCargo('');
      setDataAdmissao('');
      setSalario('');
      setExpediente('');
      //setFarmacia('');
    } else {
      setId(dados.id);
      setNome(dados.nome);
      setEmail(dados.email);
      setCpf(dados.cpf);
      setSenha(dados.senha);
      setSenhaRepeticao(dados.senhaRepeticao);
      setTelefone(dados.telefone);
      //setEndereco(dados.endereco);
      //setCargo(dados.cargo);
      setDataAdmissao(new Date(Date.parse(dados.dataAdmissao)));
      setSalario(dados.salario);
      setExpediente(dados.expediente);
      //setFarmacia(dados.farmacia);
    }
  }

  async function salvar() {
    let data = { id, nome, email, cpf, senha, telefone, /*endereco, cargo, */dataAdmissao, salario, expediente, /*farmacia*/ };
    data = JSON.stringify(data);
    if (idParam == null) {
      await axios
        .post(baseURL, data, {
          headers: { 'Content-Type': 'application/json' },
        })
        .then(function (response) {
          mensagemSucesso(`Usuário ${nome} cadastrado com sucesso!`);
          navigate(`/listagem-funcionarios`);
        })
        .catch(function (error) {
          mensagemErro(error.response.data);
        });
    } else {
      await axios
        .put(`${baseURL}/${idParam}`, data, {
          headers: { 'Content-Type': 'application/json' },
        })
        .then(function (response) {
          mensagemSucesso(`Usuário ${nome} alterado com sucesso!`);
          navigate(`/listagem-funcionarios`);
        })
        .catch(function (error) {
          mensagemErro(error.response.data);
        });
    }
  }


  async function buscar() {
    if (idParam != null) {
      await axios.get(`${baseURL}/${idParam}`).then((response) => {
        setDados(response.data);
      }).catch((a) => {
        console.log(a);
      });
      setId(dados.id);
      setNome(dados.nome);
      setEmail(dados.email);
      setCpf(dados.cpf);
      setSenha(dados.senha);
      setSenhaRepeticao(dados.senhaRepeticao);
      setTelefone(dados.telefone);
      //setEndereco(dados.endereco);
      //setCargo(dados.cargo);
      setDataAdmissao(dados.dataAdmissao);
      setSalario(dados.salario);
      setExpediente(dados.expediente);
      //setFarmacia(dados.farmacia);
    }
  }

  useEffect(() => {
    buscar(); // eslint-disable-next-line
  }, [id]);

  if (!dados) return null;

  return (
    <div className='container'>
      <Card title='Cadastro de Funcionário'>
        <div className='row'>
          <div className='col-lg-12'>
            <div className='bs-component'>
              <FormGroup label='Nome: *' htmlFor='inputNome'>
                <input
                  type='text'
                  id='inputNome'
                  value={nome}
                  className='form-control'
                  name='nome'
                  onChange={(e) => setNome(e.target.value)}
                />
              </FormGroup>
              <FormGroup label='E-mail: *' htmlFor='inputEmail'>
                <input
                  type='text'
                  id='inputEmail'
                  value={email}
                  className='form-control'
                  name='email'
                  onChange={(e) => setEmail(e.target.value)}
                />
              </FormGroup>
              <FormGroup label='CPF: *' htmlFor='inputCpf'>
                <input
                  type='text'
                  maxLength='11'
                  id='inputCpf'
                  value={cpf}
                  className='form-control'
                  name='cpf'
                  onChange={(e) => setCpf(e.target.value)}
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
              <FormGroup label='Repita a Senha: *' htmlFor='inputRepitaSenha'>
                <input
                  type='password'
                  id='inputRepitaSenha'
                  value={senhaRepeticao}
                  className='form-control'
                  name='senhaRepeticao'
                  onChange={(e) => setSenhaRepeticao(e.target.value)}
                />
              </FormGroup>
              <FormGroup label='Telefone: ' htmlFor='inputTelefone'>
                <input
                  type='text'
                  id='inputTelefone'
                  value={telefone}
                  className='form-control'
                  name='telefone'
                  onChange={(e) => setTelefone(e.target.value)}
                />
              </FormGroup>
              {/*<FormGroup label='Endereço: *' htmlFor='inputEndereco'>
                <input
                  type='text'
                  id='inputEndereco'
                  value={endereco}
                  className='form-control'
                  name='endereco'
                  onChange={(e) => setEndereco(e.target.value)}
                />
              </FormGroup> */}
              {/* <FormGroup label='Cargo: *' htmlFor='inputCargo'>
                <input
                  type='text'
                  id='inputCargo'
                  value={cargo}
                  className='form-control'
                  name='cargo'
                  onChange={(e) => setCargo(e.target.value)}
                />
              </FormGroup> */}
              <FormGroup label='Data de Admissão: ' htmlFor='inputDataAdmissao'>
                <input
                  type='date'
                  id='inputDataAdmissao'
                  value={dataAdmissao}
                  className='form-control'
                  name='dataAdmissao'
                  onChange={(e) => setDataAdmissao(e.target.value)}
                />
              </FormGroup>
              <FormGroup label='Salário: *' htmlFor='inputSalario'>
                <input
                  type='number'
                  // min='0'
                  // max='10000000'
                  // step='0.01'
                  id='inputSalario'
                  value={salario}
                  className='form-control'
                  name='salario'
                  onChange={(e) => setSalario(e.target.value)}
                />
              </FormGroup>
              {/*
              //TODO: descobrir como fazer isso ser um dropdown pra escolher entre manhã, tarde, noite, madrugada ou sla oq mais
               */}
              <FormGroup label='Expediente: ' htmlFor='inputExpediente'>
                <select
                  type='text'
                  id='inputExpediente'
                  value={expediente}
                  className='form-control'
                  name='expediente'
                  onChange={(e) => setExpediente(e.target.value)}>
                  <option value="manha">Manhã</option>
                  <option value="tarde">Tarde</option>
                  <option value="noite">Noite</option>
                  <option value="madrugada">Madrugada</option>
                </select>

              </FormGroup>
              {/* <FormGroup label='Farmácia: ' htmlFor='inputFarmacia'>
                <input
                  type=''
                  id='inputFarmacia'
                  value={farmacia}
                  className='form-control'
                  name='expediente'
                  onChange={(e) => setExpediente(e.target.value)}
                />
              </FormGroup> */}
              {/* <FormGroup>
                <input
                  className='form-check-input'
                  type='checkbox'
                  id='checkAdmin'
                  checked={admin}
                  name='admin'
                  onChange={(e) => setAdmin(e.target.checked)}
                />
                Administrador
              </FormGroup> */}
              <Stack spacing={1} padding={1} direction='row'>
                <button
                  onClick={salvar}
                  type='button'
                  className='btn btn-success'
                >
                  Salvar
                </button>
                <button
                  onClick={inicializar}
                  type='button'
                  className='btn btn-danger'
                >
                  Cancelar
                </button>
              </Stack>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default CadastroFuncionario;