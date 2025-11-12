<<<<<<< HEAD
# RPG Master Tools

Sistema completo de ferramentas para mestres de RPG usando React com TypeScript e Tailwind CSS. O site é totalmente estático e funciona no client-side, podendo ser hospedado em qualquer serviço de hospedagem estática como Netlify, Vercel ou GitHub Pages.

## 🎯 Funcionalidades

### 1. Painel de Iniciativa de Combate
- Lista de participantes ordenada por iniciativa
- Controles para adicionar, remover e editar participantes
- Marcador de turno atual com destaque visual
- Contador de rodadas
- Botões próximo/anterior turno
- Barra de vida editável para cada participante
- Marcadores de condições (veneno, sangramento, etc.)

### 2. Gerenciador de NPCs
- Formulário completo para criar fichas de NPC:
  - Nome, PV máximo, PV atual, CA, iniciativa
  - Atributos (FOR, DES, CON, INT, SAB, CAR)
  - Perícias principais
  - Habilidades especiais
- Lista de NPCs salvos
- Editar/excluir NPCs
- Adicionar NPCs diretamente ao combate

### 3. Sistema de Rolagem de Dados
- Botões para dados comuns (d4, d6, d8, d10, d12, d20, d100)
- Campo para rolagens customizadas (ex: "2d6+3")
- Histórico das últimas 10 rolagens
- Rolagem rápida de testes de atributo
- Exibição do resultado com detalhamento

### 4. Gerenciador de Encontros
- Criar encontros pré-definidos com múltiplos NPCs
- Salvar templates de encontros
- Iniciar encontro rapidamente (adiciona todos ao painel de iniciativa)
- Cálculo automático de XP baseado no número e nível dos NPCs

### 5. Caderno da Campanha
- Editor de texto para anotações da sessão
- Abas para diferentes categorias (Plot, NPCs, Locais, Tesouros, Outro)
- Sistema de busca nas anotações
- Auto-salvamento no localStorage

### 6. Bestiário Básico
- Lista de monstros pré-cadastrados (25+ monstros comuns)
- Filtros por tipo e nível de desafio
- Busca por nome, habilidades e perícias
- Adicionar ao combate com um clique

## 🚀 Tecnologias

- **React 18** - Biblioteca UI
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **Zustand** - Gerenciamento de estado
- **localStorage** - Persistência local
- **Vite** - Build tool
- **Lucide React** - Ícones
- **PWA** - Suporte a Progressive Web App (opcional)

## 📦 Instalação

1. Clone o repositório ou extraia os arquivos
2. Instale as dependências:
```bash
npm install
```

3. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

4. Acesse no navegador: `http://localhost:5173`

## 🔨 Build para Produção

```bash
npm run build
```

Os arquivos serão gerados na pasta `dist`.

## 🌐 Deploy

### Netlify
1. Execute `npm run build`
2. Arraste a pasta `dist` para o Netlify
3. Ou conecte com Git para deploy automático

### Vercel
1. Execute `npm run build`
2. Conecte o repositório ao Vercel
3. Configure o diretório de build como `dist`

### GitHub Pages
1. Execute `npm run build`
2. Configure o GitHub Actions para fazer deploy da pasta `dist`

## 💾 Persistência de Dados

Todos os dados são salvos no `localStorage` do navegador:
- NPCs
- Estado do combate
- Encontros
- Notas da campanha

**Importante:** Os dados são armazenados localmente no navegador. Cada usuário terá seus próprios dados. Para compartilhar dados entre dispositivos, use a função de Export/Import.

## 📤 Export/Import de Dados

- **Exportar:** Clique no botão de download no header para exportar todos os dados em JSON
- **Importar:** Clique no botão de upload no header para importar dados de um arquivo JSON

## 🎮 Como Usar

### Painel de Iniciativa
1. Adicione personagens com seus valores de iniciativa
2. Os personagens são automaticamente ordenados
3. Use os botões para avançar/retroceder turnos
4. Ajuste HP com os botões +1, +5, -1, -5
5. Adicione condições através do menu dropdown

### Gerenciador de NPCs
1. Clique em "Novo NPC" para criar uma ficha
2. Preencha os atributos e informações
3. Use o botão de espada para adicionar ao combate

### Roller de Dados
1. Digite uma expressão (ex: 1d20, 2d6+3)
2. Ou use os botões de rolagem rápida
3. Veja o histórico de todas as rolagens

### Gerenciador de Encontros
1. Crie encontros pré-definidos
2. Adicione NPCs aos encontros
3. Use o botão de play para iniciar o combate

### Caderno da Campanha
1. Crie notas por categoria
2. Use o editor de texto para anotações
3. Busque nas anotações usando a barra de busca
4. Filtre por categoria

### Bestiário
1. Navegue pelos monstros pré-cadastrados
2. Use os filtros para encontrar monstros específicos
3. Use a busca para encontrar por nome ou habilidades
4. Clique no botão de espada para adicionar ao combate

## 🎨 Estilo

- **Dark Theme** como padrão
- Cores: slate-900 (fundo), slate-700 (cards), emerald-500 (acentos)
- Fonte: Inter ou system fonts
- Ícones: Lucide React
- Design responsivo para mobile e desktop

## 📝 Estrutura do Projeto

```
src/
├── components/
│   ├── modules/         # Módulos principais
│   │   ├── InitiativeTracker.tsx
│   │   ├── NPCManager.tsx
│   │   ├── DiceRoller.tsx
│   │   ├── EncounterBuilder.tsx
│   │   ├── CampaignNotes.tsx
│   │   └── Bestiary.tsx
│   ├── Layout.tsx       # Layout principal
│   ├── Sidebar.tsx      # Sidebar colapsável
│   └── Header.tsx       # Header com controles
├── store/
│   └── store.ts         # Estado global (Zustand)
├── services/
│   └── storage.ts       # Serviços de localStorage
├── data/
│   └── monsters.ts      # Dados dos monstros
├── types/
│   └── index.ts         # Tipos TypeScript
├── App.tsx              # Componente principal
└── main.tsx             # Entry point
```

## 🔧 Configuração

### PWA
O PWA está configurado no `vite.config.ts`. Para ativar:
1. Adicione os ícones na pasta `public`
2. O service worker será gerado automaticamente no build

### Personalização
- Cores: Edite `tailwind.config.js` e `src/index.css`
- Monstros: Edite `src/data/monsters.ts` para adicionar mais monstros
- Estilos: Use as classes do Tailwind CSS

## 📄 Licença

Este projeto é de código aberto e está disponível para uso livre.

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou pull requests.

=======
# RPG-Master-Manager
>>>>>>> 557ba55fd9d519fa0aea0adc7ce40e53bb187da1
