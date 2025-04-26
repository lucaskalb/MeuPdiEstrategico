import React, { useEffect, useState, useRef, useCallback } from 'react';
import styled, { DefaultTheme } from 'styled-components';
import { useNavigate, useParams } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';
import { FiHome, FiSend, FiUser, FiMessageSquare, FiEye, FiGitBranch } from 'react-icons/fi';
import api from '../utils/axios';
import MarkdownRenderer from '../components/MarkdownRenderer';

type Theme = 'light' | 'dark';

interface ThemedProps {
  theme: Theme;
}

interface StyledMessageContentProps extends ThemedProps {
  children: React.ReactNode;
}

interface PDI {
  id: string;
  name: string;
  status: string;
}

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  status: string;
  created_at: string;
}

const Container = styled.div<ThemedProps>`
  min-height: 100vh;
  height: 100vh;
  background-color: ${({ theme }) => theme === 'dark' ? '#343541' : '#ffffff'};
  color: ${({ theme }) => theme === 'dark' ? '#fff' : '#1a1a1a'};
  display: flex;
  flex-direction: column;
  overflow: hidden;

  /* Estilização da barra de rolagem */
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

const TopBar = styled.div<{ theme: Theme }>`
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

const BackButton = styled.button<{ theme: Theme }>`
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

const PDIName = styled.input<{ theme: Theme }>`
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

const ChatContainer = styled.div`
  flex: 1;
  max-width: 800px;
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  padding: 0 1rem;
  margin-top: 4rem;
  height: calc(100vh - 4rem);
  position: relative;
`;

const MessagesContainer = styled.div<ThemedProps>`
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  padding: 1rem 0;
  gap: 1rem;
  margin-bottom: 6rem;

  /* Estilização da barra de rolagem */
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

const MessageWrapper = styled.div<{ role: 'user' | 'assistant' } & ThemedProps>`
  display: flex;
  padding: 1.5rem;
  background-color: ${({ role, theme }) => 
    role === 'assistant' 
      ? (theme === 'dark' ? '#444654' : '#f7f7f8')
      : 'transparent'
  };
  width: 100%;
`;

const Avatar = styled.div<{ role: 'user' | 'assistant' } & ThemedProps>`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
  background-color: ${({ role, theme }) => 
    role === 'assistant' 
      ? (theme === 'dark' ? '#10a37f' : '#10a37f')
      : (theme === 'dark' ? '#2a2b32' : '#f1f5f9')
  };
  color: ${({ role }) => role === 'assistant' ? '#fff' : 'inherit'};
`;

const MessageContent = styled.div<StyledMessageContentProps>`
  flex: 1;
  max-width: 800px;
  margin: 0 auto;
  line-height: 1.5;

  /* Estilos para o conteúdo do Markdown */
  .prose {
    color: inherit;
    
    h1, h2, h3, h4, h5, h6 {
      margin-top: 1rem;
      margin-bottom: 0.5rem;
      line-height: 1.2;
    }

    h1 {
      font-size: 1.5rem;
      font-weight: 600;
    }

    h2 {
      font-size: 1.25rem;
      font-weight: 600;
    }

    p {
      margin: 0.5rem 0;
      white-space: normal;
    }

    ul, ol {
      margin: 0.5rem 0;
      padding-left: 1.5rem;
      list-style-position: outside;
    }

    li {
      margin: 0.25rem 0;
    }
    
    pre {
      background-color: ${({ theme }) => theme === 'dark' ? '#2a2b32' : '#f1f5f9'};
      border-radius: 0.375rem;
      padding: 1rem;
      margin: 0.5rem 0;
      overflow-x: auto;
    }

    code {
      background-color: ${({ theme }) => theme === 'dark' ? '#2a2b32' : '#f1f5f9'};
      padding: 0.2em 0.4em;
      border-radius: 0.25rem;
      font-size: 0.875em;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
    }

    a {
      color: #2563eb;
      text-decoration: underline;
    }

    blockquote {
      border-left: 4px solid ${({ theme }) => theme === 'dark' ? '#4b4b4b' : '#e5e5e5'};
      padding-left: 1rem;
      margin: 0.5rem 0;
      color: ${({ theme }) => theme === 'dark' ? '#8e8ea0' : '#6b7280'};
    }

    * + * {
      margin-top: 0.5rem;
    }
  }
`;

const LoadingBar = styled.div<ThemedProps>`
  height: 1.25rem;
  background-color: ${({ theme }) => theme === 'dark' ? '#40414f' : '#e5e5e5'};
  border-radius: 0.375rem;
  margin-bottom: 0.75rem;
  animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  box-shadow: ${({ theme }) => theme === 'dark' 
    ? '0 1px 2px rgba(0, 0, 0, 0.2)' 
    : '0 1px 2px rgba(0, 0, 0, 0.1)'};

  @keyframes pulse {
    0%, 100% {
      opacity: ${({ theme }) => theme === 'dark' ? '0.9' : '0.8'};
    }
    50% {
      opacity: ${({ theme }) => theme === 'dark' ? '0.5' : '0.4'};
    }
  }
`;

const LoadingContent = styled.div`
  width: 100%;
  padding: 0.5rem 0;
`;

const LoadingDot = styled.div<ThemedProps>`
  width: 0.5rem;
  height: 0.5rem;
  background-color: ${({ theme }) => theme === 'dark' ? '#40414f' : '#e5e5e5'};
  border-radius: 50%;
  margin-right: 0.5rem;
  display: inline-block;
  animation: bounce 1.4s infinite ease-in-out both;
  box-shadow: ${({ theme }) => theme === 'dark' 
    ? '0 1px 2px rgba(0, 0, 0, 0.2)' 
    : '0 1px 2px rgba(0, 0, 0, 0.1)'};

  &:nth-child(1) {
    animation-delay: -0.32s;
  }

  &:nth-child(2) {
    animation-delay: -0.16s;
  }

  @keyframes bounce {
    0%, 80%, 100% { 
      transform: scale(0);
    } 
    40% { 
      transform: scale(1.0);
    }
  }
`;

const LoadingDots = styled.div`
  display: flex;
  align-items: center;
  margin-top: 0.5rem;
  padding-left: 0.25rem;
`;

const InputContainer = styled.div<{ theme: Theme }>`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1rem;
  background: ${({ theme }) => theme === 'dark' ? '#343541' : '#ffffff'};
  border-top: 1px solid ${({ theme }) => theme === 'dark' ? '#4b4b4b' : '#e5e5e5'};
  z-index: 10;

  @media (min-width: 768px) {
    padding: 1.5rem;
  }
`;

const InputWrapper = styled.div<{ theme: Theme }>`
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  gap: 0.5rem;
  background: ${({ theme }) => theme === 'dark' ? '#40414f' : '#f7f7f8'};
  border-radius: 0.5rem;
  padding: 0.5rem;
  border: 1px solid ${({ theme }) => theme === 'dark' ? '#4b4b4b' : '#e5e5e5'};

  @media (min-width: 768px) {
    gap: 1rem;
  }
`;

const MessageInput = styled.textarea<ThemedProps>`
  flex: 1;
  padding: 0.75rem;
  border: none;
  background: transparent;
  color: ${({ theme }) => theme === 'dark' ? '#fff' : '#1a1a1a'};
  font-size: 1rem;
  outline: none;
  resize: none;
  min-height: 24px;
  max-height: 200px;
  line-height: 1.5;

  /* Estilização da barra de rolagem */
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

  &::placeholder {
    color: ${({ theme }) => theme === 'dark' ? '#8e8ea0' : '#6b7280'};
  }
`;

const SendButton = styled.button<ThemedProps>`
  padding: 0.5rem;
  background: transparent;
  color: ${({ theme }) => theme === 'dark' ? '#fff' : '#1a1a1a'};
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover {
    background-color: ${({ theme }) => theme === 'dark' ? '#2a2b32' : '#f1f5f9'};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ViewButton = styled.button<{ theme: Theme }>`
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

const PDIChat: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { theme } = useTheme();
  const [pdi, setPdi] = useState<PDI | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [isAssistantResponding, setIsAssistantResponding] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await api.get(`/api/pdis/${id}/chat`);
        setMessages(response.data.messages);
      } catch (error) {
        console.error('Erro ao carregar mensagens:', error);
      }
    };

    if (id) {
      fetchMessages();
    }
  }, [id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [newMessage]);

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

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !id || isSending) return;

    const messageToSend = {
      content: newMessage,
      role: 'user'
    };

    // Adiciona a mensagem do usuário imediatamente
    const userMessage: Message = {
      id: 'temp-' + Date.now(),
      content: newMessage,
      role: 'user',
      status: 'PENDING',
      created_at: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsSending(true);
    setIsAssistantResponding(true);

    try {
      const response = await api.post(`/api/pdis/${id}/chat`, messageToSend);
      // Remove a mensagem temporária e adiciona as mensagens reais
      setMessages(prev => prev.filter(msg => msg.id !== userMessage.id));
      setMessages(prev => [...prev, ...response.data]);
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      // Remove a mensagem temporária em caso de erro
      setMessages(prev => prev.filter(msg => msg.id !== userMessage.id));
    } finally {
      setIsSending(false);
      setIsAssistantResponding(false);
    }
  };

  if (isLoading || !pdi) {
    return (
      <Container theme={theme}>
        <TopBar theme={theme}>
          <LeftSection>
            <BackButton theme={theme} onClick={() => navigate('/dashboard')}>
              <FiHome size={20} />
            </BackButton>
          </LeftSection>
        </TopBar>
      </Container>
    );
  }

  return (
    <Container theme={theme}>
      <TopBar theme={theme}>
        <LeftSection>
          <BackButton theme={theme} onClick={() => navigate('/dashboard')}>
            <FiHome size={20} />
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
          <ViewButton theme={theme} onClick={() => navigate(`/pdi/${id}/mindmap`)}>
            <FiGitBranch size={20} />
          </ViewButton>
          <ViewButton theme={theme} onClick={() => navigate(`/pdi/${id}`)}>
            <FiEye size={20} />
          </ViewButton>
        </RightSection>
      </TopBar>

      <ChatContainer>
        <MessagesContainer theme={theme}>
          {messages.map((message) => (
            <MessageWrapper key={message.id} role={message.role} theme={theme}>
              <Avatar role={message.role} theme={theme}>
                {message.role === 'assistant' ? <FiMessageSquare size={16} /> : <FiUser size={16} />}
              </Avatar>
              <MessageContent theme={theme}>
                <MarkdownRenderer content={message.content} />
              </MessageContent>
            </MessageWrapper>
          ))}
          {isAssistantResponding && (
            <MessageWrapper role="assistant" theme={theme}>
              <Avatar role="assistant" theme={theme}>
                <FiMessageSquare size={16} />
              </Avatar>
              <MessageContent theme={theme}>
                <LoadingContent>
                  <LoadingBar theme={theme} style={{ width: '85%' }} />
                  <LoadingBar theme={theme} style={{ width: '65%' }} />
                  <LoadingBar theme={theme} style={{ width: '45%' }} />
                  <LoadingDots>
                    <LoadingDot theme={theme} />
                    <LoadingDot theme={theme} />
                    <LoadingDot theme={theme} />
                  </LoadingDots>
                </LoadingContent>
              </MessageContent>
            </MessageWrapper>
          )}
          <div ref={messagesEndRef} />
        </MessagesContainer>

        <InputContainer theme={theme}>
          <InputWrapper theme={theme}>
            <MessageInput
              ref={textareaRef}
              theme={theme}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Digite sua mensagem..."
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              rows={1}
              disabled={isSending}
            />
            <SendButton
              theme={theme}
              onClick={handleSendMessage}
              disabled={!newMessage.trim() || isSending}
            >
              {isSending ? (
                <div className="animate-spin">
                  <FiSend size={20} />
                </div>
              ) : (
                <FiSend size={20} />
              )}
            </SendButton>
          </InputWrapper>
        </InputContainer>
      </ChatContainer>
    </Container>
  );
};

export default PDIChat; 
