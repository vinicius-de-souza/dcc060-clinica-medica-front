# Frontend - Clínica Médica

Interface simples e responsiva para o sistema de gestão da clínica médica.

## Funcionalidades

- ✅ **Gestão de pacientes**: listar, adicionar, editar e excluir
- ✅ **Design responsivo**: funciona no computador, tablet e celular
- ✅ **Busca em tempo real**: filtra pacientes instantaneamente
- ✅ **Validação de formulários**: mensagens claras de erro
- ✅ **Interface moderna**: layout limpo e animações suaves
- ✅ **Máscaras de entrada**: CPF e telefone formatados automaticamente

## Tecnologias usadas

- **HTML5** para a estrutura
- **CSS3** com Flexbox e Grid
- **JavaScript puro** (sem frameworks)
- **Font Awesome** para ícones

## Como usar

1. **Configurar URL da API**  
   No arquivo `script.js`, altere a variável `API_BASE_URL`:
   ```javascript
   const API_BASE_URL = 'http://localhost:3000/api';
   ```

2. **Subir o servidor local**  
   Exemplos:
   ```bash
   # Python
   python -m http.server 8080

   # Node.js
   npx http-server

   # Live Server (VS Code)
   # Clique com botão direito no index.html e selecione "Open with Live Server"
   ```

3. **Abrir no navegador**  
   Acesse `http://localhost:8080`

## Requisitos para integração com a API

- Backend rodando na URL configurada
- CORS habilitado no backend
- Endpoints funcionando:
  - `GET /api/pacientes`
  - `POST /api/pacientes`
  - `PUT /api/pacientes/:id`
  - `DELETE /api/pacientes/:id`

### Lista de pacientes
- Layout em grid
- Busca em tempo real
- Botões de editar e excluir
- Adaptável a qualquer tela

### Formulário de cadastro
- Campos obrigatórios
- Máscaras para CPF e telefone
- Feedback visual de sucesso/erro

### Modal de edição
- Campos preenchidos com dados atuais
- Mesma validação do formulário de cadastro
- Fundo desfocado
