'use client';

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const handleRegister = async () => {
    try {
      const response = await axios.post('/api/auth/register', { name, email, password });
      setSuccess('Usuário registrado com sucesso! Redirecionando para login...');
      
      // Redireciona para login após 2 segundos
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (error) {
      setError('Erro ao registrar. Tente novamente.');
    }
  };

  return (
    <div>
      <h1>Registrar</h1>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Nome"
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Senha"
      />
      {error && <p>{error}</p>}
      {success && <p>{success}</p>}
      <button onClick={handleRegister}>Registrar</button>
    </div>
  );
};

export default Register;
