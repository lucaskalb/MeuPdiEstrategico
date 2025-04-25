import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { FiPlus } from 'react-icons/fi';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface PDICardProps {
  id?: string;
  name?: string;
  status?: string;
  createdAt?: string;
  isNew?: boolean;
  onClick?: () => void;
}

const Card = styled.div<{ isNew?: boolean }>`
  background: ${({ theme, isNew }) => isNew ? 
    `linear-gradient(135deg, ${theme.colors.primary}15, ${theme.colors.primary}25)` : 
    theme.colors.cardBackground
  };
  border: 2px dashed ${({ theme, isNew }) => isNew ? theme.colors.primary : 'transparent'};
  border-radius: 12px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.2s;
  height: 200px;
  display: flex;
  flex-direction: column;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const CardTitle = styled.h3<{ isNew?: boolean }>`
  font-size: ${({ isNew }) => isNew ? '1.25rem' : '1.5rem'};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin: 0;
  word-break: break-word;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const CardContent = styled.div<{ isNew?: boolean }>`
  flex: 1;
  display: flex;
  flex-direction: column;
  ${({ isNew }) => isNew && `
    justify-content: center;
    align-items: center;
    text-align: center;
  `}
`;

const Status = styled.span<{ status: string }>`
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
  background-color: ${({ status, theme }) => {
    switch (status) {
      case 'DRAFT':
        return theme.colors.warning + '20';
      case 'IN_PROGRESS':
        return theme.colors.info + '20';
      case 'DONE':
        return theme.colors.success + '20';
      default:
        return theme.colors.secondary + '20';
    }
  }};
  color: ${({ status, theme }) => {
    switch (status) {
      case 'DRAFT':
        return theme.colors.warning;
      case 'IN_PROGRESS':
        return theme.colors.info;
      case 'DONE':
        return theme.colors.success;
      default:
        return theme.colors.secondary;
    }
  }};
`;

const CardFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: 1rem;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.secondary};
`;

const AddIcon = styled(FiPlus)`
  width: 2rem;
  height: 2rem;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 1rem;
`;

const NewCardText = styled.p`
  color: ${({ theme }) => theme.colors.secondary};
  margin: 0;
  font-size: 1rem;
`;

const PDICard: React.FC<PDICardProps> = ({ id, name, status, createdAt, isNew, onClick }) => {
  const navigate = useNavigate();

  if (isNew) {
    return (
      <Card isNew onClick={onClick}>
        <CardContent isNew>
          <AddIcon />
          <CardTitle isNew>Criar Novo PDI</CardTitle>
          <NewCardText>Comece um novo plano de desenvolvimento</NewCardText>
        </CardContent>
      </Card>
    );
  }

  const handleCardClick = () => {
    if (id) {
      navigate(`/pdi/${id}/chat`);
    }
  };

  return (
    <Card onClick={handleCardClick}>
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        {status && <Status status={status}>{status}</Status>}
      </CardHeader>
      <CardContent>
        {/* Conteúdo adicional pode ser adicionado aqui */}
      </CardContent>
      <CardFooter>
        <span>
          Criado em {createdAt && format(new Date(createdAt), "d 'de' MMMM", { locale: ptBR })}
        </span>
      </CardFooter>
    </Card>
  );
};

export default PDICard; 