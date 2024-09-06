// src/pages/auth/LoginPage.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError('');

    if (!email || !password) {
      setError('Por favor, preencha todos os campos.');
      return;
    }

    try {
      const response = await axios.post('/api/auth/login', {
        email,
        password,
      });

      if (response.status === 200) {
        const { token } = response.data;
        localStorage.setItem('token', token);
        navigate('/'); // Redireciona para a página principal
      } else {
        setError('Credenciais inválidas ou erro de servidor.');
      }
    } catch (error) {
      setError('Credenciais inválidas ou erro de servidor.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md p-8">
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
        {error && <Alert variant="error" className="mb-4">{error}</Alert>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <Label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</Label>
            <Input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1"
              required
            />
          </div>
          <div className="mb-6">
            <Label htmlFor="password" className="block text-sm font-medium text-gray-700">Senha</Label>
            <Input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1"
              required
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-blue-500 text-white font-semibold rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Entrar
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default LoginPage;
