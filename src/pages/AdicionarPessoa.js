import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import moment from 'moment'
import { toast } from 'react-toastify';
import * as yup from 'yup';

import "./style.css"
import api from '../services/api'

export default function AdicionarPessoa({ match, history }) {

  const [nome, setNome] = useState("")
  const [id, setId] = useState(match.params.id)
  const [cpf, setCpf] = useState("")
  const [email, setEmail] = useState("")
  const [dataNascimento, setDataNascimento] = useState("")
  const [naturalidade, setNaturalidade] = useState("")
  const [nacionalidade, setNacionalidade] = useState("")
  const [sexo, setSexo] = useState("")
  const [erros, setErros] = useState([])

  useEffect(() => {
    console.log("entrou")
    erros.map(e => {
      toast.error(e)
    })
    

  },[erros])

  function preencherObjeto(pessoa) {
    setNome(pessoa.nome);
    setCpf(pessoa.cpf);
    setEmail(pessoa.email);
    setNaturalidade(pessoa.naturalidade);
    setNacionalidade(pessoa.nacionalidade);
    setDataNascimento(pessoa.dataNascimento);
    setId(pessoa.id);
    setSexo(pessoa.sexo);
  }

  const regexCPF = /([0-9]{2}[\.]?[0-9]{3}[\.]?[0-9]{3}[\/]?[0-9]{4}[-]?[0-9]{2})|([0-9]{3}[\.]?[0-9]{3}[\.]?[0-9]{3}[-]?[0-9]{2})/gm;
  const date_regex = /^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/;

  function cpfValidate(cpf) {
    return cpf.length > 10
  }

  yup.addMethod(yup.string, "cpf", function (message) {
    return yup.mixed().test("cpf", message || "número de CPF inválido", value => cpfValidate(value));
  });


  let schema = yup.object().shape({
    nome: yup.string().required("O campo Nome é obrigatório."),
    email: yup.string().email("E-mail precisa estar no formato correto"),
    cpf: yup.string()
      .transform(function removeNonNumericalChar(value) {
        return this.isType(value) && value !== null ? value.replace(/\D/g, "") : value;
      })
      .matches(regexCPF, "formato inválido do CPF")
      .cpf("Informe um CPF válido."),
    dataNascimento: yup.string()
      .matches(date_regex, "formato inválido da Data")
  })

  useEffect(() => {

    async function load() {

      if (match.params.id != 0) {
        const response = await api.get(`/pessoa/${match.params.id}`)
        response.data.dataNascimento = moment(response.data.dataNascimento).format('DD/MM/YYYY');
        preencherObjeto(response.data)
      }
    }

    load();

  }, [match.params.id])

  function handleLimpar() {
    preencherObjeto({
      nome: "",
      cpf: "",
      email: "",
      dataNascimento: "",
      nacionalidade: "",
      naturalidade: "",
      sexo: ""
    })
  }

  async function atualizarPessoa() {

    await schema
      .validate({ nome, cpf, email, dataNascimento }, { abortEarly: false })
      .then(async function (e) {
        setErros([])

        if (id != 0) {
          console.log(id, nome, cpf, dataNascimento, email, naturalidade, nacionalidade)
          const response = await api.put(`/pessoa/${id}`,
            {
              id,
              nome,
              cpf,
              dataNascimento: moment(dataNascimento, "DD/MM/YYYY").format("YYYY-MM-DD"),
              email,
              naturalidade,
              nacionalidade,
              sexo
            })
          response.data.dataNascimento = moment(response.data.dataNascimento).format('DD/MM/YYYY');
          preencherObjeto(response.data)
          toast.success("Pessoa atualizada com sucesso!")
        } else {

          const response = await api.post(`/pessoa`, {
            nome,
            cpf,
            dataNascimento: moment(dataNascimento, "DD/MM/YYYY").format("YYYY-MM-DD"),
            email,
            naturalidade,
            nacionalidade,
            sexo
          })
          response.data.dataNascimento = moment(response.data.dataNascimento).format('DD/MM/YYYY');
          preencherObjeto(response.data)
          toast.success("Pessoa Adicionada com sucesso!")
          history.push(`/add/${response.data.id}`)

        }

      })
      .catch(errors => {
        if (errors.errors != undefined) {
          setErros(errors.errors)
        } else {
          console.log(errors)
          toast.error("Ocorreu algum erro ao tentar cadastrar, verifique se o CPF já existe.")
        }
      });
  }

  return (
    <>
      <Link to="/">Voltar</Link>
      <hr />
      <h1>{id != 0 ? "Atualizar" : "Cadastrar"} Pessoa</h1>
      <form>
        <div className="form-row">
          <div className="form-group col-md-6">
            <label htmlFor="nome">Nome:*</label>
            <input type="text" className="form-control" placeholder="Nome" value={nome} onChange={(e) => setNome(e.target.value)} />
          </div>
          <div className="form-group col-md-6">
            <label htmlFor="cpf">CPF:* (sem pontos)</label>
            <input disabled={id != 0} type="text" className="form-control" placeholder="CPF" value={cpf} onChange={(e) => setCpf(e.target.value)} />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group col-md-6">
            <label htmlFor="email">Email:</label>
            <input type="email" className="form-control" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="form-group col-md-6">
            <label htmlFor="dataNascimento">Data de Nascimento:*</label>
            <input type="text" className="form-control" placeholder="Data de Nascimento" value={dataNascimento} onChange={(e) => setDataNascimento(e.target.value)} />
          </div>
          <div className="form-group col-md-6">
            <label htmlFor="nacionalidade">Nacionalidade :</label>
            <input type="text" className="form-control" placeholder="nacionalidade" value={nacionalidade} onChange={(e) => setNacionalidade(e.target.value)} />
          </div>
          <div className="form-group col-md-6">
            <label htmlFor="naturalidade">Naturalidade :</label>
            <input type="text" className="form-control" placeholder="Naturalidade" value={naturalidade} onChange={(e) => setNaturalidade(e.target.value)} />
          </div>
          <div class="form-group col-md-6">
            <label htmlFor="sexo">Sexo : </label>
            <select
              className="form-control"
              onChange={(e) => setSexo(e.target.value)}
              value={sexo}>
              <option value="" >Selecione</option>
              <option value="M">Masculino</option>
              <option value="F">Feminino</option>
            </select>
          </div>
        </div>
      </form>

      <button className="col-md-6 btncad"
        onClick={atualizarPessoa}> {id != 0 ? "Atualizar" : "Cadastrar"}
      </button>
      <button className="col-md-6 btnlimpar" onClick={handleLimpar}>Limpar</button>

    </>
  );
}
