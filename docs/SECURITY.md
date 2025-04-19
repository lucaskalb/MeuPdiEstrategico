# Política de Segurança

## Reportando Vulnerabilidades

Agradecemos os pesquisadores de segurança que ajudam a manter nosso projeto seguro. Se você encontrar uma vulnerabilidade de segurança, por favor, siga estas diretrizes:

### Como Reportar

1. **Não divulgue publicamente** a vulnerabilidade até que ela seja corrigida
2. Envie um email para [seu-email@exemplo.com] com o assunto "VULNERABILIDADE: Meu PDI"
3. Inclua o máximo de detalhes possível sobre a vulnerabilidade:
   - Descrição detalhada
   - Passos para reproduzir
   - Impacto potencial
   - Sugestões de correção (se aplicável)

### O que esperar

- Responderemos dentro de 48 horas
- Manteremos você informado sobre o progresso da correção
- Reconheceremos sua contribuição após a correção (se desejar)

## Vulnerabilidades Conhecidas

Nenhuma vulnerabilidade conhecida no momento.

## Boas Práticas de Segurança

### Para Desenvolvedores

1. **Dependências**
   - Mantenha todas as dependências atualizadas
   - Use `npm audit` e `go mod tidy` regularmente
   - Configure dependabot para atualizações automáticas

2. **Código**
   - Valide todos os inputs do usuário
   - Use HTTPS em todas as comunicações
   - Implemente proteção CSRF no frontend
   - Use prepared statements no backend
   - Implemente rate limiting

3. **Autenticação e Autorização**
   - Use JWT com algoritmos fortes
   - Implemente refresh tokens
   - Use senhas com hash seguro
   - Implemente RBAC

4. **Banco de Dados**
   - Use conexões SSL/TLS
   - Implemente backup regular
   - Use princípio do menor privilégio
   - Monitore logs de acesso

### Para Administradores

1. **Configuração**
   - Use variáveis de ambiente para dados sensíveis
   - Mantenha os servidores atualizados
   - Configure firewalls adequadamente
   - Monitore logs de acesso

2. **Backup**
   - Implemente backup regular do banco de dados
   - Teste restauração periodicamente
   - Armazene backups de forma segura

## Atualizações de Segurança

Todas as atualizações de segurança serão documentadas no [CHANGELOG.md](CHANGELOG.md).

## Auditorias de Segurança

- Realizamos auditorias de segurança regulares
- Usamos ferramentas de análise estática de código
- Mantemos um registro de todas as vulnerabilidades reportadas e corrigidas 