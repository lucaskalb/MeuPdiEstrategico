import React, { useEffect, useState } from 'react';
import styled, { DefaultTheme } from 'styled-components';
import { useNavigate, useParams } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';
import { FiArrowLeft, FiMessageSquare } from 'react-icons/fi';
import api from '../utils/axios';

interface ThemedProps {
  theme: DefaultTheme;
}

type Theme = 'light' | 'dark';

interface Goal {
  description: string;
  skills: {
    hard_skills: string[];
    soft_skills: string[];
  };
  alignment: string;
  action_plan: string[];
  key_results: string[];
}

interface PDIContent {
  goals: Goal[];
  self_assessment_questions: string[];
}

interface PDI {
  id: string;
  name: string;
  content?: string;
  status: string;
}

const Container = styled.div<{ theme: Theme }>`
  min-height: 100vh;
  height: 100vh;
  background-color: ${({ theme }) => theme === 'dark' ? '#343541' : '#ffffff'};
  color: ${({ theme }) => theme === 'dark' ? '#fff' : '#1a1a1a'};
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const TopBar = styled.div<{ theme: DefaultTheme }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 1rem;
  background: ${({ theme }) => theme === 'dark' ? '#202123' : '#ffffff'};
  border-bottom: 1px solid ${({ theme }) => theme === 'dark' ? '#4b4b4b' : '#e5e5e5'};
  height: 4rem;

  @media (min-width: 768px) {
    padding: 1rem 2rem;
  }
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
  min-width: 0;
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  margin-left: 0.5rem;
`;

const BackButton = styled.button<{ theme: DefaultTheme }>`
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
  min-width: 32px;
  justify-content: center;

  &:hover {
    background-color: ${({ theme }) => theme === 'dark' ? '#2a2b32' : '#f1f5f9'};
  }

  span {
    display: none;
    @media (min-width: 768px) {
      display: inline;
    }
  }
`;

const PDIName = styled.input<{ theme: DefaultTheme }>`
  flex: 1;
  margin: 0 0.5rem;
  padding: 0.5rem;
  background: transparent;
  border: none;
  color: ${({ theme }) => theme === 'dark' ? '#fff' : '#1a1a1a'};
  font-size: 1rem;
  font-weight: 600;
  outline: none;
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (min-width: 768px) {
    font-size: 1.25rem;
    margin: 0 1rem;
  }

  &:focus {
    background-color: ${({ theme }) => theme === 'dark' ? '#2a2b32' : '#f1f5f9'};
    border-radius: 4px;
  }
`;

const ChatButton = styled.button<{ theme: DefaultTheme }>`
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  color: ${({ theme }) => theme === 'dark' ? '#fff' : '#1a1a1a'};
  font-size: 1rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 4px;
  transition: all 0.2s;
  min-width: 32px;

  &:hover {
    background-color: ${({ theme }) => theme === 'dark' ? '#2a2b32' : '#f1f5f9'};
  }
`;

const Content = styled.div<{ theme: Theme }>`
  flex: 1;
  max-width: 800px;
  width: 100%;
  margin: 5rem auto 2rem;
  padding: 0 2rem;
  overflow-y: auto;

  h1 {
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 1rem;
  }

  h2 {
    font-size: 1.25rem;
    font-weight: 600;
    margin-top: 2rem;
    margin-bottom: 1rem;
    color: ${({ theme }) => theme === 'dark' ? '#fff' : '#1a1a1a'};
  }

  h3 {
    font-size: 1.1rem;
    font-weight: 500;
    margin-top: 1.5rem;
    margin-bottom: 0.75rem;
    color: ${({ theme }) => theme === 'dark' ? '#e5e5e5' : '#374151'};
  }

  ul {
    list-style-type: disc;
    margin-left: 1.5rem;
    margin-bottom: 1rem;
  }

  li {
    margin-bottom: 0.5rem;
    line-height: 1.5;
  }

  p {
    margin-bottom: 1rem;
    line-height: 1.5;
  }

  section {
    margin-bottom: 2rem;
    padding: 1rem;
    background: ${({ theme }) => theme === 'dark' ? '#2a2b32' : '#f9fafb'};
    border-radius: 0.5rem;
    border: 1px solid ${({ theme }) => theme === 'dark' ? '#4b4b4b' : '#e5e5e5'};
  }

  &::-webkit-scrollbar {
    width: 2px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: transparent;
    transition: all 0.2s ease-in-out;
  }

  &:hover::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)'};
  }
`;

const PDIView: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { theme } = useTheme();
  const [pdi, setPdi] = useState<PDI | null>(null);
  const [pdiContent, setPdiContent] = useState<PDIContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPDI = async () => {
      try {
        const response = await api.get(`/api/pdis/${id}`);
        setPdi(response.data);
        if (response.data.content) {
          try {
            const parsedContent = JSON.parse(response.data.content);
            if (parsedContent && typeof parsedContent === 'object') {
              setPdiContent(parsedContent);
            } else {
              console.error('Conteúdo do PDI não está no formato esperado');
            }
          } catch (parseError) {
            console.error('Erro ao fazer parse do conteúdo do PDI:', parseError);
          }
        }
      } catch (error) {
        console.error('Erro ao carregar PDI:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchPDI();
    }
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

  const renderContent = () => {
    if (!pdiContent || !pdiContent.goals || !pdiContent.self_assessment_questions) {
      return (
        <section>
          <h2>Nenhum conteúdo definido</h2>
          <p>Use o chat para começar a definir seus objetivos.</p>
        </section>
      );
    }

    return (
      <>
        {pdiContent.goals.map((goal, index) => (
          <section key={index}>
            <h2 align="center">{goal.description}</h2>
            
            <h3><b>Skills</b></h3>
            <div>
              <h4><b>Hard Skills</b></h4>
              <ul>
                {goal.skills.hard_skills.map((skill, idx) => (
                  <li key={idx}>{skill}</li>
                ))}
              </ul>

              <h4><b>Soft Skills</b></h4>
              <ul>
                {goal.skills.soft_skills.map((skill, idx) => (
                  <li key={idx}>{skill}</li>
                ))}
              </ul>
            </div>

            <h4><b>Alinhamento</b></h4>
            <p>{goal.alignment}</p>

            <h4><b>Plano de ação</b></h4>
            <ul>
              {goal.action_plan.map((action, idx) => (
                <li key={idx}>{action}</li>
              ))}
            </ul>

            <h4><b>Key Results</b></h4>
            <ul>
              {goal.key_results.map((result, idx) => (
                <li key={idx}>{result}</li>
              ))}
            </ul>
          </section>
        ))}

        <section>
          <h2>Questões de Autoavaliação</h2>
          <ul>
            {pdiContent.self_assessment_questions.map((question, index) => (
              <li key={index}>{question}</li>
            ))}
          </ul>
        </section>
      </>
    );
  };

  if (isLoading || !pdi) {
    return (
      <Container theme={theme}>
        <TopBar theme={theme}>
          <BackButton theme={theme} onClick={() => navigate(-1)}>
            <FiArrowLeft />
            <span>Voltar</span>
          </BackButton>
        </TopBar>
      </Container>
    );
  }

  return (
    <Container theme={theme}>
      <TopBar theme={theme}>
        <LeftSection>
          <BackButton theme={theme} onClick={() => navigate(-1)}>
            <FiArrowLeft />
            <span>Voltar</span>
          </BackButton>
          <PDIName
            theme={theme}
            value={pdi.name}
            onChange={handleNameChange}
            onBlur={handleNameBlur}
            onKeyPress={handleKeyPress}
          />
        </LeftSection>
        <RightSection>
          <ChatButton theme={theme} onClick={() => navigate(`/pdi/${id}/chat`)}>
            <FiMessageSquare size={20} />
          </ChatButton>
        </RightSection>
      </TopBar>

      <Content theme={theme}>
        {renderContent()}
      </Content>
    </Container>
  );
};

export default PDIView; 