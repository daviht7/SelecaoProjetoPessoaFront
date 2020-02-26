import React from 'react';
import './App.css';

import Routes from './routes'

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {

  return (
      <main>
        <Routes />
        <ToastContainer />
      </main>
  );
}

export default App;
