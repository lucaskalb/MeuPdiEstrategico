import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import api from '../utils/axios';

interface PDICardProps {
  id?: string;
  name?: string;
  status?: string;
  createdAt?: string;
  isNew?: boolean;
  onClick?: () => void;
  onDelete?: () => void;
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

const DeleteButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  color: ${({ theme }) => theme.colors.error};
  padding: 0.5rem;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: ${({ theme }) => theme.colors.error}15;
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: ${({ theme }) => theme.colors.cardBackground};
  padding: 2rem;
  border-radius: 12px;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const ModalTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 1rem;
`;

const ModalText = styled.p`
  color: ${({ theme }) => theme.colors.secondary};
  margin-bottom: 1.5rem;
`;

const ModalButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
`;

const Button = styled.button<{ variant?: 'danger' | 'secondary' }>`
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  
  ${({ variant, theme }) =>
    variant === 'danger'
      ? `
        background-color: ${theme.colors.error};
        color: white;
        border: none;
        
        &:hover {
          background-color: ${theme.colors.error}dd;
        }
      `
      : `
        background-color: transparent;
        color: ${theme.colors.text};
        border: 1px solid ${theme.colors.border};
        
        &:hover {
          background-color: ${theme.colors.hover};
        }
      `}
`;

const PDICard: React.FC<PDICardProps> = ({ id, name, status, createdAt, isNew, onClick }) => {
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

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

  const handleDelete = async () => {
    try {
      await api.delete(`/api/pdis/${id}`);
      window.location.reload(); // Recarrega a página para atualizar a lista
    } catch (error) {
      console.error('Erro ao excluir PDI:', error);
    }
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteModal(true);
  };

  return (
    <>
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
          <DeleteButton onClick={handleDeleteClick}>
            <FiTrash2 size={18} />
          </DeleteButton>
        </CardFooter>
      </Card>

      {showDeleteModal && (
        <ModalOverlay onClick={() => setShowDeleteModal(false)}>
          <ModalContent onClick={e => e.stopPropagation()}>
            <ModalTitle>Confirmar exclusão</ModalTitle>
            <ModalText>
              Tem certeza que deseja excluir o PDI "{name}"? Esta ação não pode ser desfeita.
            </ModalText>
            <ModalButtons>
              <Button onClick={() => setShowDeleteModal(false)}>
                Cancelar
              </Button>
              <Button variant="danger" onClick={handleDelete}>
                Excluir
              </Button>
            </ModalButtons>
          </ModalContent>
        </ModalOverlay>
      )}
    </>
  );
};

export default PDICard; 