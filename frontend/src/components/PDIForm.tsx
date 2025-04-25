import React, { useState } from 'react';
import MarkdownRenderer from './MarkdownRenderer';

interface PDIFormProps {
  onSubmit: (data: any) => void;
}

const PDIForm: React.FC<PDIFormProps> = ({ onSubmit }) => {
  const [content, setContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ content });
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700">
            Conteúdo
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            rows={10}
          />
        </div>
        <button
          type="submit"
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Salvar
        </button>
      </form>

      <div className="mt-8">
        <h3 className="text-lg font-medium text-gray-900">Preview</h3>
        <div className="mt-4 p-4 border rounded-md">
          <MarkdownRenderer content={content} />
        </div>
      </div>
    </div>
  );
};

export default PDIForm; 