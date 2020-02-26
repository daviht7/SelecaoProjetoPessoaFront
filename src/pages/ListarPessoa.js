import React, { useState, useEffect } from 'react';

import api from '../services/api'
import { parseISO, format } from 'date-fns'

import "./style.css"

import { toast } from 'react-toastify';

export default function ListarPessoa({ history }) {

  const [pessoas, setPessoas] = useState([]);

  useEffect(() => {

    async function load() {

      const response = await api.get("/pessoa");

      const lista = await response.data

      lista.map(p => {
        const obj =
        {
          dataNascimentoFormatada: format(parseISO(p.dataNascimento), "dd/MM/yyyy")
        };
        return Object.assign(p, obj)
      });

      setPessoas(lista);
    }

    load();

  }, [])

  async function deletar(id) {

    try {

      await api.delete(`/pessoa/${id}`)

      let l = pessoas.filter(x => x.id !== id)
      setPessoas(l)

      toast.success("Pessoa deletada com sucesso!");

    } catch (err) {
      toast.error("Ocorreu um erro ao tentar deletar a pessoa.");
    }

  }

  return (
    <>
      <h1>Listagem de Pessoas</h1>

      <div className="form-group col-md-3">
        <button type="button" onClick={() => history.push("/add/0")} className="btnCad">Cadastrar</button>
      </div>

      <table className="table table-hover">
        <thead>
          <tr>
            <th scope="col">Nome</th>
            <th scope="col">E-mail</th>
            <th scope="col">CPF</th>
            <th scope="col">Data Nascimento</th>
            <th scope="col">Naturalidade</th>
            <th scope="col">Ações</th>
          </tr>
        </thead>
        <tbody>
          {pessoas.map(p => (
            <tr key={p.id}>
              <td>{p.nome}</td>
              <td>{p.email}</td>
              <td>{p.cpf}</td>
              <td>{p.dataNascimentoFormatada}</td>
              <td>{p.naturalidade}</td>
              <td>
                <button onClick={() => history.push(`/add/${p.id}`)}>Editar</button>
                <button onClick={() => deletar(p.id)}>Deletar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
