import React from 'react';
import MarkdownRenderer from './MarkdownRenderer';

interface PDIDetailProps {
  pdi: {
    id: string;
    name: string;
    content: string;
    status: string;
    createdAt: string;
    updatedAt: string;
  };
}

const PDIDetail: React.FC<PDIDetailProps> = ({ pdi }) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">{pdi.name}</h2>
        <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
          <span>Status: {pdi.status}</span>
          <span>Criado em: {new Date(pdi.createdAt).toLocaleDateString()}</span>
          <span>Atualizado em: {new Date(pdi.updatedAt).toLocaleDateString()}</span>
        </div>
      </div>

      <div className="prose max-w-none">
        <MarkdownRenderer content={pdi.content} />
      </div>
    </div>
  );
};

export default PDIDetail; 