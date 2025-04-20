import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate, useParams } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';
import { FiArrowLeft } from 'react-icons/fi';
import api from '../utils/axios';

interface ThemedProps {
  theme: 'light' | 'dark';
}

interface PDI {
  id: string;
  name: string;
  status: string;
}

const Container = styled.div<ThemedProps>`
  min-height: 100vh;
  background-color: ${({ theme }) => theme === 'dark' ? '#1a1a1a' : '#f8f9fa'};
  color: ${({ theme }) => theme === 'dark' ? '#fff' : '#1a1a1a'};
`;

const TopBar = styled.div<ThemedProps>`
  display: flex;
  align-items: center;
  padding: 1rem 2rem;
  background: ${({ theme }) => theme === 'dark' ? '#242424' : '#ffffff'};
  box-shadow: ${({ theme }) => 
    theme === 'dark' 
      ? '0 4px 6px rgba(0, 0, 0, 0.1)' 
      : '0 4px 6px rgba(0, 0, 0, 0.05)'
  };
`;

const BackButton = styled.button<ThemedProps>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: transparent;
  border: none;
  color: ${({ theme }) => theme === 'dark' ? '#fff' : '#1a1a1a'};
  font-size: 1rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 4px;
  transition: all 0.2s;

  &:hover {
    background-color: ${({ theme }) => theme === 'dark' ? '#333' : '#f1f5f9'};
  }
`;

const PDIName = styled.input<ThemedProps>`
  flex: 1;
  margin: 0 1rem;
  padding: 0.5rem;
  background: transparent;
  border: none;
  color: ${({ theme }) => theme === 'dark' ? '#fff' : '#1a1a1a'};
  font-size: 1.25rem;
  font-weight: 600;
  outline: none;

  &:focus {
    background-color: ${({ theme }) => theme === 'dark' ? '#333' : '#f1f5f9'};
    border-radius: 4px;
  }
`;

const ChatContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
`;

const PDIChat: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { theme } = useTheme();
  const [pdi, setPdi] = useState<PDI | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPDI = async () => {
      try {
        const response = await api.get(`/api/pdis/${id}`);
        setPdi(response.data);
      } catch (error) {
        console.error('Erro ao carregar PDI:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPDI();
  }, [id]);

  const handleNameChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!pdi) return;
    setPdi({ ...pdi, name: e.target.value });
  };

  const handleNameBlur = async () => {
    if (!pdi) return;
    try {
      await api.patch(`/api/pdis/${id}`, { name: pdi.name });
    } catch (error) {
      console.error('Erro ao atualizar nome do PDI:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleNameBlur();
    }
  };

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  if (!pdi) {
    return <div>PDI não encontrado</div>;
  }

  return (
    <Container theme={theme}>
      <TopBar theme={theme}>
        <BackButton theme={theme} onClick={() => navigate('/dashboard')}>
          <FiArrowLeft /> Voltar
        </BackButton>
        <PDIName
          theme={theme}
          value={pdi.name}
          onChange={handleNameChange}
          onBlur={handleNameBlur}
          onKeyPress={handleKeyPress}
        />
      </TopBar>
      <ChatContainer>
        {/* Componente de chat será adicionado posteriormente */}
      </ChatContainer>
    </Container>
  );
};

export default PDIChat; 