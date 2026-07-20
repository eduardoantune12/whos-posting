import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await api.post('register/', { username, email, password });
      navigate('/login'); // Redireciona silenciosamente para o login
    } catch (error) {
      console.error("Erro ao registrar:", error);
      // Agora o erro aparece na tela para o usuário ver!
      setError("Erro ao criar conta. O usuário ou e-mail pode já existir.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200">
      <form onSubmit={handleRegister} className="bg-white p-8 rounded shadow-md w-80">
        <h2 className="text-2xl font-bold mb-4 text-blue-600">Criar Conta</h2>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <input
          type="text"
          placeholder="Usuário"
          className="block w-full border p-2 mb-2 rounded"
          onChange={(e) => setUsername(e.target.value)}
          required
          autoComplete="username"
        />
        <input
          type="email"
          placeholder="E-mail"
          className="block w-full border p-2 mb-2 rounded"
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />
        <input
          type="password"
          placeholder="Senha (mín 6 caracteres)"
          className="block w-full border p-2 mb-4 rounded"
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength="6"
          autoComplete="new-password" // Resolve o aviso amarelo do console
        />

        <button type="submit" className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 mb-4">
          Cadastrar
        </button>

        <p className="text-center text-sm text-gray-600">
          Já tem uma conta?{' '}
          <span
            className="text-blue-600 font-bold cursor-pointer hover:underline"
            onClick={() => navigate('/login')}
          >
            Faça login
          </span>
        </p>
      </form>
    </div>
  );
}

export default Register;