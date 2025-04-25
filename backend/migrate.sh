#!/bin/bash

# Configurações do banco de dados
DB_HOST=${DB_HOST:-localhost}
DB_PORT=${DB_PORT:-5432}
DB_USER=${DB_USER:-postgres}
DB_PASSWORD=${DB_PASSWORD:-postgres}
DB_NAME=${DB_NAME:-meu_pdi}

# String de conexão
DB_STRING="postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}?sslmode=disable"

# Executa o comando migrate com os argumentos passados
migrate -verbose -database "${DB_STRING}" -path migrations "$@" 