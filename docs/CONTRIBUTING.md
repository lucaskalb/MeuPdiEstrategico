# Diretrizes de Contribuição

Obrigado pelo seu interesse em contribuir com o Meu PDI Estratégico! Este documento fornece um conjunto de diretrizes para contribuir com o projeto.

## Estrutura do Projeto

O projeto é organizado como um monorepo com os seguintes diretórios:

- `frontend`: Aplicação React + Vite
- `backend`: API Go + Fiber

## Como Contribuir

1. **Fork** o repositório
2. Crie uma **branch** para sua feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. **Push** para a branch (`git push origin feature/AmazingFeature`)
5. Abra um **Pull Request**

## Padrões de Código

### Frontend
- Siga o [Guia de Estilo do React](https://reactjs.org/docs/code-splitting.html)
- Use TypeScript para todo o código novo
- Mantenha os componentes pequenos e reutilizáveis
- Escreva testes para novos componentes e funcionalidades

### Backend
- Siga as [Diretrizes de Código Go](https://golang.org/doc/effective_go.html)
- Use interfaces quando apropriado
- Escreva testes unitários e de integração
- Documente funções e tipos públicos

## Commits

- Use o formato de commit convencional
- Separe o assunto do corpo com uma linha em branco
- Limite o assunto a 50 caracteres
- Use o presente do indicativo ("Add feature" não "Added feature")
- Use o corpo para explicar o que e por que, não como

## Pull Requests

- Descreva claramente as mudanças propostas
- Inclua screenshots para mudanças visuais
- Atualize a documentação relevante
- Certifique-se de que todos os testes passam
- Solicite revisão de pelo menos um mantenedor

## Ambiente de Desenvolvimento

Certifique-se de que seu ambiente de desenvolvimento está configurado corretamente:

1. Instale as dependências do frontend:
```bash
cd frontend
npm install
```

2. Instale as dependências do backend:
```bash
cd backend
go mod download
```

3. Configure o banco de dados PostgreSQL

## Testes

Execute os testes antes de enviar um PR:

```bash
# Frontend
cd frontend
npm test

# Backend
cd backend
go test ./...
```

## Issues

- Use o template de issue apropriado
- Forneça informações detalhadas sobre o problema
- Inclua passos para reproduzir o problema
- Adicione screenshots quando relevante

## Código de Conduta

Por favor, leia e siga nosso [Código de Conduta](CODE_OF_CONDUCT.md).

## Perguntas?

Se você tiver dúvidas, abra uma issue ou entre em contato com os mantenedores.

## Reportando Bugs

Por favor, use o template de issue de bug para reportar problemas. Inclua:
- Descrição detalhada do bug
- Passos para reproduzir
- Comportamento esperado
- Screenshots ou logs (se aplicável)
- Informações do ambiente

## Sugerindo Melhorias

Use o template de issue de feature para sugerir melhorias. Inclua:
- Descrição da feature
- Problema que resolve
- Solução proposta
- Alternativas consideradas

## Licença

Ao contribuir, você concorda que suas contribuições serão licenciadas sob a licença MIT do projeto. 