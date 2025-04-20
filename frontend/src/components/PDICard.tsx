import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ThemedProps {
  theme: 'light' | 'dark';
}

interface PDICardProps {
  id: string;
  name: string;
  status: string;
  createdAt: string;
}

const Card = styled.div<ThemedProps>`
  background: ${({ theme }) => theme === 'dark' ? '#242424' : '#ffffff'};
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: ${({ theme }) => 
    theme === 'dark' 
      ? '0 4px 6px rgba(0, 0, 0, 0.1)' 
      : '0 4px 6px rgba(0, 0, 0, 0.05)'
  };
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => 
      theme === 'dark' 
        ? '0 6px 8px rgba(0, 0, 0, 0.2)' 
        : '0 6px 8px rgba(0, 0, 0, 0.1)'
    };
  }
`;

const Title = styled.h3<ThemedProps>`
  color: ${({ theme }) => theme === 'dark' ? '#fff' : '#1a1a1a'};
  margin-bottom: 0.5rem;
  font-size: 1.25rem;
  font-weight: 600;
`;

const Status = styled.span<{ status: string }>`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
  background-color: ${({ status }) => {
    switch (status) {
      case 'DRAFT':
        return '#e2e8f0';
      case 'PENDING':
        return '#fef3c7';
      case 'IN_PROGRESS':
        return '#dbeafe';
      case 'DONE':
        return '#dcfce7';
      default:
        return '#e2e8f0';
    }
  }};
  color: ${({ status }) => {
    switch (status) {
      case 'DRAFT':
        return '#4a5568';
      case 'PENDING':
        return '#92400e';
      case 'IN_PROGRESS':
        return '#1e40af';
      case 'DONE':
        return '#166534';
      default:
        return '#4a5568';
    }
  }};
`;

const Date = styled.span<ThemedProps>`
  color: ${({ theme }) => theme === 'dark' ? '#a0aec0' : '#718096'};
  font-size: 0.875rem;
  margin-top: 0.5rem;
  display: block;
`;

const PDICard: React.FC<PDICardProps> = ({ id, name, status, createdAt }) => {
  const { theme } = useTheme();
  
  const formatDate = (dateString: string): string => {
    try {
      const date = parseISO(dateString);
      return format(date, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
    } catch (error) {
      console.error('Erro ao formatar data:', error);
      return 'Data inválida';
    }
  };

  return (
    <Link to={`/pdi/${id}/chat`} style={{ textDecoration: 'none' }}>
      <Card theme={theme}>
        <Title theme={theme}>{name}</Title>
        <Status status={status}>{status}</Status>
        <Date theme={theme}>Criado em: {formatDate(createdAt)}</Date>
      </Card>
    </Link>
  );
};

export default PDICard; 