import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import { useTheme } from '../hooks/useTheme';
import { FiSun, FiMoon } from 'react-icons/fi';
import { useAuth } from '../hooks/useAuth';

interface ThemedProps {
  theme: 'light' | 'dark';
}

const Container = styled.div<ThemedProps>`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background-color: ${({ theme }) => theme === 'dark' ? '#1a1a1a' : '#f8f9fa'};
  color: ${({ theme }) => theme === 'dark' ? '#fff' : '#1a1a1a'};
  transition: all 0.3s ease;

  @media (max-width: 768px) {
    padding: 0;
  }
`;

const Card = styled.div<ThemedProps>`
  width: 100%;
  max-width: 400px;
  background: ${({ theme }) => theme === 'dark' ? '#242424' : '#ffffff'};
  border-radius: 16px;
  padding: 2rem;
  box-shadow: ${({ theme }) => 
    theme === 'dark' 
      ? '0 8px 32px rgba(0, 0, 0, 0.2)' 
      : '0 8px 32px rgba(0, 0, 0, 0.1)'
  };
  transition: all 0.3s ease;

  @media (max-width: 768px) {
    max-width: 100%;
    min-height: 100vh;
    border-radius: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
`;

const Title = styled.h1<ThemedProps>`
  font-size: 2rem;
  color: ${({ theme }) => theme === 'dark' ? '#fff' : '#1a1a1a'};
  margin-bottom: 2rem;
  text-align: center;
  font-weight: 600;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label<ThemedProps>`
  font-size: 0.875rem;
  color: ${({ theme }) => theme === 'dark' ? '#a0aec0' : '#4a5568'};
  font-weight: 500;
  margin-bottom: 0.25rem;
`;

const Input = styled.input<ThemedProps>`
  padding: 0.875rem;
  background-color: ${({ theme }) => theme === 'dark' ? '#1a1a1a' : '#ffffff'};
  border: 1px solid ${({ theme }) => theme === 'dark' ? '#333' : '#e2e8f0'};
  border-radius: 8px;
  font-size: 1rem;
  color: ${({ theme }) => theme === 'dark' ? '#fff' : '#1a1a1a'};
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
  }

  &::placeholder {
    color: ${({ theme }) => theme === 'dark' ? '#666' : '#a0aec0'};
  }
`;

const ErrorMessage = styled.span`
  color: #ef4444;
  font-size: 0.875rem;
  margin-top: 0.25rem;
`;

const Button = styled.button<ThemedProps>`
  background-color: #3b82f6;
  color: white;
  padding: 1rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  &:hover {
    background-color: #2563eb;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    background-color: ${({ theme }) => theme === 'dark' ? '#4b5563' : '#cbd5e0'};
    cursor: not-allowed;
    transform: none;
  }
`;

const ThemeToggle = styled.button<ThemedProps>`
  position: fixed;
  top: 1rem;
  right: 1rem;
  background: transparent;
  border: none;
  color: ${({ theme }) => theme === 'dark' ? '#fff' : '#1a1a1a'};
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s;

  &:hover {
    background-color: ${({ theme }) => theme === 'dark' ? '#333' : '#e2e8f0'};
  }
`;

const LinkText = styled(Link)<ThemedProps>`
  color: #3b82f6;
  text-decoration: none;
  font-size: 0.875rem;
  text-align: center;
  margin-top: 1rem;
  display: block;

  &:hover {
    text-decoration: underline;
  }
`;

const Login: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login({
        email: formData.email,
        password: formData.password,
      });
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao fazer login');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <Container theme={theme}>
      <ThemeToggle theme={theme} onClick={toggleTheme}>
        {theme === 'dark' ? <FiSun /> : <FiMoon />}
      </ThemeToggle>
      <Card theme={theme}>
        <Title theme={theme}>Login</Title>
        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <Label theme={theme} htmlFor="email">E-mail</Label>
            <Input
              theme={theme}
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Seu e-mail"
            />
          </InputGroup>
          <InputGroup>
            <Label theme={theme} htmlFor="password">Senha</Label>
            <Input
              theme={theme}
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Sua senha"
            />
          </InputGroup>
          {error && <ErrorMessage>{error}</ErrorMessage>}
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Entrando...' : 'Entrar'}
          </Button>
          <Link to="/criar-conta">Não tem uma conta? Crie uma agora</Link>
        </Form>
      </Card>
    </Container>
  );
};

export default Login; 