import React, { useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('token/', { username, password });

      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);

      localStorage.setItem('username', username);

      console.log("Token armazenado com sucesso!");
      navigate('/');
    } catch (err) {
      console.error("Erro no login:", err.response?.data);
      alert("Usuário ou senha inválidos!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded shadow-md w-80">
        <h2 className="text-2xl font-bold mb-4 text-blue-600">Whos_Posting</h2>
        <input
          type="text"
          placeholder="Usuário"
          className="block w-full border p-2 mb-2 rounded"
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Senha"
          className="block w-full border p-2 mb-4 rounded"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 mb-4">
          Entrar
        </button>

        <p className="text-center text-sm text-gray-600">
          Não tem uma conta?{' '}
          <span
            className="text-blue-600 font-bold cursor-pointer hover:underline"
            onClick={() => navigate('/register')}
          >
            Cadastre-se
          </span>
        </p>
      </form>
    </div>
  );
}

export default Login;