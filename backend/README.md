# Meu PDI Backend

Backend do sistema Meu PDI Estratégico desenvolvido com Go, Fiber, GORM e PostgreSQL.

## Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo [LICENSE](LICENSE) para mais detalhes.

### Uso Comercial

Este software é de código aberto e pode ser usado livremente para fins comerciais. A licença MIT permite:

- Uso comercial
- Modificação
- Distribuição
- Uso privado
- Sublicenciamento

A única exigência é manter o aviso de copyright original e a licença em todas as cópias ou partes substanciais do software.

## Tecnologias Utilizadas

- Go
- Fiber (Framework Web)
- GORM (ORM)
- PostgreSQL
- JWT (Autenticação)
- Migrate (Migrações de Banco de Dados)

## Requisitos

- Go (versão 1.16 ou superior)
- PostgreSQL
- Make (opcional, para usar os comandos de build)

## Instalação

1. Clone o repositório
2. Instale as dependências:
```bash
go mod download
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```
Edite o arquivo `.env` com suas configurações.

## Executando o Projeto

Para iniciar o servidor:

```bash
go run main.go
```

O servidor estará disponível em `http://localhost:3000`

## Migrações

Para executar as migrações do banco de dados:

```bash
migrate -database "postgres://user:password@localhost:5432/dbname?sslmode=disable" -path migrations up
```

## Estrutura do Projeto

```
.
├── cmd/            # Ponto de entrada da aplicação
├── internal/       # Código interno da aplicação
│   ├── config/    # Configurações
│   ├── models/    # Modelos de dados
│   ├── handlers/  # Handlers HTTP
│   ├── middleware/# Middleware
│   └── services/  # Lógica de negócio
├── migrations/    # Migrações do banco de dados
└── pkg/           # Código compartilhado
```

## Contribuição

Contribuições são bem-vindas! Por favor, leia as diretrizes de contribuição antes de enviar um pull request. 