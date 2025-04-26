import React, { useEffect, useState, useCallback } from 'react';
import styled from 'styled-components';
import { useNavigate, useParams } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';
import { FiHome, FiMessageSquare, FiEye } from 'react-icons/fi';
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  MarkerType,
  Position,
} from 'reactflow';
import 'reactflow/dist/style.css';
import api from '../utils/axios';

type Theme = 'light' | 'dark';

const Container = styled.div<{ theme: Theme }>`
  min-height: 100vh;
  height: 100vh;
  background-color: ${({ theme }) => theme === 'dark' ? '#343541' : '#ffffff'};
  color: ${({ theme }) => theme === 'dark' ? '#fff' : '#1a1a1a'};
  display: flex;
  flex-direction: column;
  overflow: hidden;
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
  gap: 0.5rem;
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

const ActionButton = styled.button<{ theme: Theme }>`
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

const MindmapContainer = styled.div`
  flex: 1;
  width: 100%;
  height: calc(100vh - 64px);
`;

const AddNodeButton = styled.button<{ theme: Theme }>`
  position: absolute;
  bottom: 2rem;
  right: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  background-color: ${props => props.theme.primary};
  color: white;
  border: none;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  
  &:hover {
    background-color: ${props => props.theme.primaryDark};
  }
`;

interface PDI {
  id: string;
  name: string;
  content?: string;
}

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
}

const nodeStyle = (color: string) => ({
  background: color,
  color: 'white',
  border: 'none',
  borderRadius: '20px',
  padding: '12px 20px',
  fontSize: '14px',
  width: 'auto',
  maxWidth: '250px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
});

const createInitialNodes = (pdiName: string, content?: PDIContent): Node[] => {
  if (!content || !content.goals) {
    return [{
      id: 'root',
      type: 'default',
      data: { label: pdiName },
      position: { x: 50, y: 300 },
      style: nodeStyle('#2196F3'),
    }];
  }

  const nodes: Node[] = [
    {
      id: 'root',
      type: 'default',
      data: { label: pdiName },
      position: { x: 50, y: content.goals.length > 1 ? 
        400 * Math.floor(content.goals.length / 2) : 400 },
      style: nodeStyle('#2196F3'),
      sourcePosition: Position.Right,
    },
  ];

  const baseX = 400;
  const verticalSpacing = 1000;
  const horizontalSpacing = 350;
  const sectionSpacing = 250;

  content.goals.forEach((goal, goalIndex) => {
    const baseY = goalIndex * verticalSpacing;

    // Objetivo principal (goal)
    nodes.push({
      id: `goal-${goalIndex}`,
      type: 'default',
      data: { label: goal.description },
      position: { x: baseX, y: baseY },
      style: nodeStyle('#2196F3'),
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
    });

    // Seções principais
    const sections = [
      { id: 'alignment', label: 'Alinhamento', color: '#FF4081', offsetY: -sectionSpacing * 1.5 },
      { id: 'action-plan', label: 'Plano de ação', color: '#673AB7', offsetY: -sectionSpacing * 0.5 },
      { id: 'skills', label: 'Skills', color: '#FF9800', offsetY: sectionSpacing * 0.5 },
      { id: 'krs', label: 'KRs', color: '#009688', offsetY: sectionSpacing * 1.5 }
    ];

    sections.forEach(section => {
      const sectionY = baseY + section.offsetY;
      
      // Nó da seção
      nodes.push({
        id: `${section.id}-${goalIndex}`,
        type: 'default',
        data: { label: section.label },
        position: { x: baseX + horizontalSpacing, y: sectionY },
        style: nodeStyle(section.color),
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
      });

      // Itens da seção
      let items: string[] = [];
      let itemStyle = '';
      
      switch (section.id) {
        case 'alignment':
          items = [goal.alignment];
          itemStyle = '#FF80AB';
          break;
        case 'action-plan':
          items = goal.action_plan;
          itemStyle = '#9575CD';
          break;
        case 'skills': {
          const allSkills = [];
          if (goal.skills.hard_skills.length > 0) {
            allSkills.push(`Hard Skills:\n- ${goal.skills.hard_skills.join('\n- ')}`);
          }
          if (goal.skills.soft_skills.length > 0) {
            allSkills.push(`Soft Skills:\n- ${goal.skills.soft_skills.join('\n- ')}`);
          }
          items = [allSkills.join('\n\n')].filter(Boolean);
          itemStyle = '#FFB74D';
          break;
        }
        case 'krs':
          items = goal.key_results;
          itemStyle = '#4DB6AC';
          break;
      }

      // Adiciona os itens
      items.forEach((item, index) => {
        if (!item) return;

        const itemSpacing = 100; // Espaçamento vertical entre itens
        const itemOffsetY = (index - (items.length - 1) / 2) * itemSpacing;

        nodes.push({
          id: `${section.id}-item-${goalIndex}-${index}`,
          type: 'default',
          data: { 
            label: item,
          },
          position: {
            x: baseX + horizontalSpacing * 2,
            y: sectionY + itemOffsetY // Adiciona o offset vertical
          },
          style: {
            ...nodeStyle(itemStyle),
            width: 'auto',
            maxWidth: '300px',
            padding: '12px 20px',
            whiteSpace: 'pre-line',
          },
          targetPosition: Position.Left,
        });
      });
    });
  });

  return nodes;
};

const createInitialEdges = (content?: PDIContent): Edge[] => {
  if (!content || !content.goals) {
    return [];
  }

  const edges: Edge[] = [];

  content.goals.forEach((goal, goalIndex) => {
    // Conectar root ao goal com curva suave e animação
    edges.push({
      id: `root-goal-${goalIndex}`,
      source: 'root',
      target: `goal-${goalIndex}`,
      type: 'default',
      style: { 
        stroke: '#2196F3', 
        strokeWidth: 2,
        opacity: 0.8,
      },
      animated: true,
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: '#2196F3',
      },
    });

    // Conectar goal às seções com curvas suaves
    const sections = ['alignment', 'action-plan', 'skills', 'krs'];
    sections.forEach(section => {
      edges.push({
        id: `goal-${section}-${goalIndex}`,
        source: `goal-${goalIndex}`,
        target: `${section}-${goalIndex}`,
        type: 'default',
        style: { 
          stroke: '#2196F3', 
          strokeWidth: 2,
          opacity: 0.8,
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: '#2196F3',
        },
      });

      // Conectar seção aos seus itens com curvas suaves
      let itemCount = section === 'skills' ? 1 :
        section === 'alignment' ? 1 :
        section === 'action-plan' ? goal.action_plan.length :
        goal.key_results.length;

      for (let i = 0; i < itemCount; i++) {
        edges.push({
          id: `${section}-item-${goalIndex}-${i}`,
          source: `${section}-${goalIndex}`,
          target: `${section}-item-${goalIndex}-${i}`,
          type: 'default',
          style: { 
            stroke: '#2196F3', 
            strokeWidth: 2,
            opacity: 0.8,
          },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: '#2196F3',
          },
        });
      }
    });
  });

  return edges;
};

const PDIMindmap: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const theme = useTheme();
  const [pdi, setPDI] = useState<PDI>({ id: '', name: '' });
  const [pdiContent, setPdiContent] = useState<PDIContent | null>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  useEffect(() => {
    const fetchPDI = async () => {
      try {
        const response = await api.get(`/api/pdis/${id}`);
        setPDI(response.data);
        if (response.data.content) {
          try {
            const parsedContent = JSON.parse(response.data.content);
            setPdiContent(parsedContent);
            setNodes(createInitialNodes(response.data.name, parsedContent));
            setEdges(createInitialEdges(parsedContent));
          } catch (error) {
            console.error('Erro ao fazer parse do conteúdo do PDI:', error);
          }
        } else {
          setNodes(createInitialNodes(response.data.name));
          setEdges([]);
        }
      } catch (error) {
        console.error('Erro ao carregar PDI:', error);
      }
    };

    if (id) {
      fetchPDI();
    }
  }, [id]);

  const handleNameChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setPDI(prev => ({ ...prev, name: e.target.value }));
    setNodes(nds =>
      nds.map(node =>
        node.id === 'root'
          ? { ...node, data: { ...node.data, label: e.target.value } }
          : node
      )
    );
  };

  const handleNameBlur = async () => {
    try {
      await api.put(`/api/pdis/${id}`, { name: pdi.name });
    } catch (error) {
      console.error('Erro ao atualizar nome do PDI:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      (e.target as HTMLInputElement).blur();
    }
  };

  const onConnect = useCallback(
    (params: Connection) => setEdges(eds => addEdge(params, eds)),
    [setEdges]
  );

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
          <ActionButton theme={theme} onClick={() => navigate(`/pdi/${id}/chat`)}>
            <FiMessageSquare size={20} />
          </ActionButton>
          <ActionButton theme={theme} onClick={() => navigate(`/pdi/${id}`)}>
            <FiEye size={20} />
          </ActionButton>
        </RightSection>
      </TopBar>
      <MindmapContainer>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
          minZoom={0.1}
          maxZoom={1.5}
          defaultViewport={{ x: 0, y: 0, zoom: 0.7 }}
          nodesDraggable={true}
          elementsSelectable={true}
          snapToGrid={true}
          snapGrid={[15, 15]}
          defaultEdgeOptions={{
            type: 'smoothstep',
            animated: false,
            style: { 
              stroke: '#2196F3', 
              strokeWidth: 2,
              opacity: 0.8,
            },
            markerEnd: {
              type: MarkerType.ArrowClosed,
              color: '#2196F3',
            },
          }}
        >
          <Background color="#aaa" gap={16} />
          <Controls />
        </ReactFlow>
      </MindmapContainer>
    </Container>
  );
};

export default PDIMindmap;