import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import { useNavigate, useParams } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';
import { FiArrowLeft, FiSend, FiUser, FiMessageSquare } from 'react-icons/fi';
import api from '../utils/axios';
import MarkdownRenderer from '../components/MarkdownRenderer';

interface ThemedProps {
  theme: 'light' | 'dark';
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
  background-color: ${({ theme }) => theme === 'dark' ? '#343541' : '#ffffff'};
  color: ${({ theme }) => theme === 'dark' ? '#fff' : '#1a1a1a'};
  display: flex;
  flex-direction: column;
`;

const TopBar = styled.div<ThemedProps>`
  display: flex;
  align-items: center;
  padding: 1rem 2rem;
  background: ${({ theme }) => theme === 'dark' ? '#202123' : '#ffffff'};
  border-bottom: 1px solid ${({ theme }) => theme === 'dark' ? '#4b4b4b' : '#e5e5e5'};
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
    background-color: ${({ theme }) => theme === 'dark' ? '#2a2b32' : '#f1f5f9'};
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
    background-color: ${({ theme }) => theme === 'dark' ? '#2a2b32' : '#f1f5f9'};
    border-radius: 4px;
  }
`;

const ChatContainer = styled.div`
  flex: 1;
  max-width: 800px;
  margin: 0 auto;
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  padding-bottom: 1rem;
`;

const MessageWrapper = styled.div<{ role: 'user' | 'assistant' } & ThemedProps>`
  display: flex;
  padding: 1.5rem;
  background-color: ${({ role, theme }) => 
    role === 'assistant' 
      ? (theme === 'dark' ? '#444654' : '#f7f7f8')
      : 'transparent'
  };
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

const InputContainer = styled.div<ThemedProps>`
  padding: 1.5rem;
  background: ${({ theme }) => theme === 'dark' ? '#343541' : '#ffffff'};
  border-top: 1px solid ${({ theme }) => theme === 'dark' ? '#4b4b4b' : '#e5e5e5'};
`;

const InputWrapper = styled.div<ThemedProps>`
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  gap: 1rem;
  background: ${({ theme }) => theme === 'dark' ? '#40414f' : '#f7f7f8'};
  border-radius: 0.5rem;
  padding: 0.5rem;
  border: 1px solid ${({ theme }) => theme === 'dark' ? '#4b4b4b' : '#e5e5e5'};
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

const PDIChat: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { theme } = useTheme();
  const [pdi, setPdi] = useState<PDI | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
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
    if (!newMessage.trim() || !id) return;

    const messageToSend = {
      content: newMessage,
      role: 'user'
    };

    try {
      const response = await api.post(`/api/pdis/${id}/chat`, messageToSend);
      setMessages(prev => [...prev, ...response.data]);
      setNewMessage('');
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
    }
  };

  if (isLoading || !pdi) {
    return (
      <Container theme={theme}>
        <TopBar theme={theme}>
          <BackButton theme={theme} onClick={() => navigate('/dashboard')}>
            <FiArrowLeft /> Voltar
          </BackButton>
        </TopBar>
      </Container>
    );
  }

  return (
    <Container theme={theme}>
      <TopBar theme={theme}>
        <BackButton theme={theme} onClick={() => navigate('/dashboard')}>
          <FiArrowLeft />
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
        <MessagesContainer>
          {messages.map((message) => (
            <MessageWrapper key={message.id} role={message.role} theme={theme}>
              <Avatar role={message.role} theme={theme}>
                {message.role === 'assistant' ? <FiMessageSquare size={16} /> : <FiUser size={16} />}
              </Avatar>
              <MessageContent theme={theme} children={<MarkdownRenderer content={message.content} />} />
            </MessageWrapper>
          ))}
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
            />
            <SendButton
              theme={theme}
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
            >
              <FiSend size={20} />
            </SendButton>
          </InputWrapper>
        </InputContainer>
      </ChatContainer>
    </Container>
  );
};

export default PDIChat; 
