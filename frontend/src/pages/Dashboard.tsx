import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';
import { FiPlus } from 'react-icons/fi';
import PDICard from '../components/PDICard';
import api from '../utils/axios';

interface ThemedProps {
  theme: 'light' | 'dark';
}

interface PDI {
  id: string;
  name: string;
  status: string;
  created_at: string;
}

const Container = styled.div<ThemedProps>`
  min-height: 100vh;
  padding: 2rem;
  background-color: ${({ theme }) => theme === 'dark' ? '#1a1a1a' : '#f8f9fa'};
  color: ${({ theme }) => theme === 'dark' ? '#fff' : '#1a1a1a'};
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1<ThemedProps>`
  font-size: 2rem;
  color: ${({ theme }) => theme === 'dark' ? '#fff' : '#1a1a1a'};
  font-weight: 600;
`;

const CreateButton = styled.button<ThemedProps>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: #2563eb;
  }

  &:disabled {
    background-color: ${({ theme }) => theme === 'dark' ? '#4b5563' : '#cbd5e0'};
    cursor: not-allowed;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const EmptyState = styled.div<ThemedProps>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 4rem 2rem;
  background: ${({ theme }) => theme === 'dark' ? '#242424' : '#ffffff'};
  border-radius: 16px;
  box-shadow: ${({ theme }) => 
    theme === 'dark' 
      ? '0 8px 32px rgba(0, 0, 0, 0.2)' 
      : '0 8px 32px rgba(0, 0, 0, 0.1)'
  };
`;

const EmptyStateTitle = styled.h2<ThemedProps>`
  font-size: 1.5rem;
  color: ${({ theme }) => theme === 'dark' ? '#fff' : '#1a1a1a'};
  margin-bottom: 1rem;
`;

const EmptyStateText = styled.p<ThemedProps>`
  color: ${({ theme }) => theme === 'dark' ? '#a0aec0' : '#4a5568'};
  margin-bottom: 2rem;
`;

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [pdis, setPdis] = useState<PDI[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    const fetchPDIs = async () => {
      try {
        const response = await api.get('/api/pdis');
        setPdis(response.data);
      } catch (error) {
        console.error('Erro ao carregar PDIs:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPDIs();
  }, []);

  const handleCreateFirstPDI = async () => {
    setIsCreating(true);
    try {
      const response = await api.post('/api/pdis', {
        name: 'Meu primeiro PDI',
        status: 'DRAFT'
      });
      navigate(`/pdi/${response.data.id}/chat`);
    } catch (error) {
      console.error('Erro ao criar PDI:', error);
    } finally {
      setIsCreating(false);
    }
  };

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  return (
    <Container theme={theme}>
      <Header>
        <Title theme={theme}>Meus PDIs</Title>
        {pdis.length > 0 && (
          <CreateButton theme={theme} onClick={() => navigate('/pdi/new')}>
            <FiPlus /> Novo PDI
          </CreateButton>
        )}
      </Header>

      {pdis.length === 0 ? (
        <EmptyState theme={theme}>
          <EmptyStateTitle theme={theme}>Bem-vindo ao Meu PDI Estratégico!</EmptyStateTitle>
          <EmptyStateText theme={theme}>
            Você ainda não tem nenhum PDI. Clique no botão abaixo para criar seu primeiro plano de desenvolvimento individual.
          </EmptyStateText>
          <CreateButton theme={theme} onClick={handleCreateFirstPDI} disabled={isCreating}>
            <FiPlus /> Criar meu primeiro PDI
          </CreateButton>
        </EmptyState>
      ) : (
        <Grid>
          {pdis.map((pdi) => (
            <PDICard
              key={pdi.id}
              id={pdi.id}
              name={pdi.name}
              status={pdi.status}
              createdAt={pdi.created_at}
            />
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default Dashboard; 