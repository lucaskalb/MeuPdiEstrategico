import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';
import { FiPlus } from 'react-icons/fi';
import PDICard from '../components/PDICard';
import Topbar from '../components/Topbar';
import Sidebar from '../components/Sidebar';
import api from '../utils/axios';

interface PDI {
  id: string;
  name: string;
  status: string;
  created_at: string;
}

const Container = styled.div`
  min-height: 100vh;
  padding: 2rem;
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
`;

const Content = styled.div`
  margin-top: 80px;
  padding: 0 1rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  color: ${({ theme }) => theme.colors.text};
  font-weight: 600;
`;

const CreateButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    opacity: 0.9;
  }

  &:disabled {
    background-color: ${({ theme }) => theme.colors.secondary};
    cursor: not-allowed;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 4rem 2rem;
  background: ${({ theme }) => theme.colors.background};
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
`;

const EmptyStateTitle = styled.h2`
  font-size: 1.5rem;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 1rem;
`;

const EmptyStateText = styled.p`
  color: ${({ theme }) => theme.colors.secondary};
  margin-bottom: 2rem;
`;

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [pdis, setPdis] = useState<PDI[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const userNickname = localStorage.getItem('userNickname') || 'Usuário';

  useEffect(() => {
    fetchPDIs();
  }, []);

  const fetchPDIs = async () => {
    try {
      const response = await api.get('/api/pdis');
      setPdis(response.data);
    } catch (error) {
      console.error('Erro ao buscar PDIs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getNextPDINumber = () => {
    const novoPDIPattern = /^Novo PDI( #(\d+))?$/;
    let maxNumber = 0;

    pdis.forEach(pdi => {
      const match = pdi.name.match(novoPDIPattern);
      if (match) {
        const number = match[2] ? parseInt(match[2], 10) : 1;
        maxNumber = Math.max(maxNumber, number);
      }
    });

    return maxNumber + 1;
  };

  const handleCreatePDI = async () => {
    try {
      const nextNumber = getNextPDINumber();
      const pdiName = nextNumber === 1 ? 'Novo PDI' : `Novo PDI #${nextNumber}`;
      
      const response = await api.post('/api/pdis', {
        name: pdiName,
        status: 'DRAFT'
      });
      navigate(`/pdi/${response.data.id}/chat`);
    } catch (error) {
      console.error('Erro ao criar PDI:', error);
    }
  };

  const handleAvatarClick = () => {
    setIsSidebarOpen(true);
  };

  if (isLoading) {
    return (
      <Container>
        <Topbar onMenuClick={handleAvatarClick} userNickname={userNickname} />
        <Content>
          <Header>
            <Title>Meus PDIs</Title>
            <CreateButton disabled>
              <FiPlus size={20} />
              Carregando...
            </CreateButton>
          </Header>
        </Content>
      </Container>
    );
  }

  return (
    <Container>
      <Topbar onMenuClick={handleAvatarClick} userNickname={userNickname} />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} userNickname={userNickname} />
      <Content>
        {pdis.length === 0 ? (
          <EmptyState>
            <EmptyStateTitle>Nenhum PDI encontrado</EmptyStateTitle>
            <EmptyStateText>
              Crie seu primeiro PDI para começar a planejar seu desenvolvimento profissional.
            </EmptyStateText>
            <CreateButton onClick={handleCreatePDI}>
              <FiPlus size={20} />
              Criar Primeiro PDI
            </CreateButton>
          </EmptyState>
        ) : (
          <>
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
              <PDICard
                isNew
                onClick={handleCreatePDI}
              />
            </Grid>
          </>
        )}
      </Content>
    </Container>
  );
};

export default Dashboard; 