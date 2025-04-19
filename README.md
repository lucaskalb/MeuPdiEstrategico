# Meu PDI Estratégico

Sistema de Planejamento e Desenvolvimento Individual (PDI) para gestão de carreira e desenvolvimento profissional.

## Visão Geral

O Meu PDI Estratégico é uma aplicação web que auxilia profissionais a planejarem e acompanharem seu desenvolvimento profissional através de um PDI (Plano de Desenvolvimento Individual). O sistema permite:

- Definição de objetivos profissionais
- Criação de planos de ação
- Acompanhamento de progresso
- Feedback e avaliações
- Gestão de competências

## Estrutura do Projeto

O projeto é dividido em duas partes principais:

```
meu-pdi-estrategico/
├── frontend/          # Aplicação Next.js
│   ├── src/          # Código fonte
│   ├── public/       # Arquivos estáticos
│   └── package.json  # Dependências
├── backend/          # API Go
│   ├── cmd/         # Ponto de entrada
│   ├── internal/    # Código interno
│   └── pkg/         # Código compartilhado
└── docs/            # Documentação
```

## Requisitos

- Node.js 18.x
- Go 1.21
- PostgreSQL 15
- npm 9.x

## Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/meu-pdi-estrategico.git
cd meu-pdi-estrategico
```

2. Instale o frontend:
```bash
cd frontend
npm install
```

3. Instale o backend:
```bash
cd ../backend
go mod download
```

## Desenvolvimento

Para iniciar o ambiente de desenvolvimento:

1. Inicie o backend:
```bash
cd backend
go run cmd/main.go
```

2. Em outro terminal, inicie o frontend:
```bash
cd frontend
npm run dev
```

O frontend estará disponível em `http://localhost:3000` e o backend em `http://localhost:8080`.

## Scripts Disponíveis

### Frontend
- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Gera a build de produção
- `npm run test` - Executa os testes
- `npm run lint` - Executa o linter

### Backend
- `go run cmd/main.go` - Inicia o servidor
- `go test ./...` - Executa os testes
- `go build -o bin/backend cmd/main.go` - Gera o binário

## Tecnologias Principais

### Frontend
- Next.js 14
- React 18
- TypeScript 5
- Tailwind CSS
- Jest
- ESLint
- Prettier

### Backend
- Go 1.21
- Gin
- GORM
- PostgreSQL
- JWT
- Testify

## Contribuição

Por favor, leia o [CONTRIBUTING.md](CONTRIBUTING.md) para detalhes sobre como contribuir com o projeto.

## Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes. 