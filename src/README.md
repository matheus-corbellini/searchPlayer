# Estrutura do Projeto Search Player

## 📁 Organização das Pastas

### `/components`

Componentes reutilizáveis da aplicação.

- Componentes UI básicos (Button, Input, Modal, etc.)
- Componentes específicos do domínio
- Cada componente deve ter seu próprio arquivo CSS/SCSS se necessário

### `/pages`

Páginas/rotas da aplicação.

- Cada página representa uma rota específica
- Páginas são compostas por componentes
- Exemplo: Home, Search, Player, etc.

### `/routes`

Configuração de roteamento da aplicação.

- Definição das rotas
- Configuração de navegação
- Proteção de rotas

### `/contexts`

Contextos React para gerenciamento de estado global.

- Contextos para autenticação, tema, etc.
- Providers para compartilhar estado entre componentes

### `/hooks`

Custom hooks React.

- Hooks reutilizáveis para lógica de negócio
- Hooks para integração com APIs
- Hooks para gerenciamento de estado local

### `/types`

Definições de tipos TypeScript.

- Interfaces e tipos compartilhados
- Tipos para APIs e dados
- Enums e constantes tipadas

### `/lib`

Funções utilitárias e helpers.

- Funções de formatação
- Utilitários de validação
- Helpers para manipulação de dados

### `/services`

Serviços para comunicação externa.

- APIs e integrações
- Serviços de autenticação
- Clientes HTTP

## 🎨 CSS Global

### `index.css`

- Variáveis CSS (cores, tipografia, espaçamentos)
- Reset CSS e estilos base
- Suporte a modo escuro
- Estilos para elementos HTML básicos
- Classes utilitárias (container, margins, paddings)
- Layout principal da aplicação (.App)

## 📝 Convenções

1. **Nomenclatura**: Use PascalCase para componentes e camelCase para funções/arquivos
2. **Importações**: Use os arquivos `index.ts` para exportações organizadas
3. **CSS**: Prefira CSS Modules ou styled-components para componentes específicos
4. **Tipos**: Defina interfaces em `/types` e importe onde necessário
5. **Hooks**: Crie hooks customizados para lógica reutilizável

## 🚀 Próximos Passos

1. Instalar dependências adicionais conforme necessário
2. Configurar roteamento (React Router)
3. Implementar sistema de temas
4. Configurar testes
5. Adicionar documentação de componentes
