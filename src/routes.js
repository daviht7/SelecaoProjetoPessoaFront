import React from 'react';
import { Switch,Route,BrowserRouter } from 'react-router-dom';

import AdicionarPessoa from './pages/AdicionarPessoa';
import ListarPessoa from './pages/ListarPessoa';

export default function Routes() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={ListarPessoa} />
        <Route path="/add/:id" component={AdicionarPessoa} />
      </Switch>
    </BrowserRouter>
  );
}
