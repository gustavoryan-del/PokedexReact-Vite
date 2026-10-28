# Pokédex React + Vite

Pokédex interativa feita com **React + Vite**, no visual de uma Pokédex física: carcaça vermelha, lente azul, LEDs e uma tela LCD onde a lista de Pokémon é exibida.

**Integrantes da dupla:**

- Nome do integrante 1
- Nome do integrante 2

## Como executar

Pré-requisito: [Node.js](https://nodejs.org/) 18 ou superior.

```bash
npm install
npm run dev
```

Depois, abra no navegador o endereço exibido no terminal. Por padrão do Vite: **http://localhost:5173**

Outros comandos:

```bash
npm run build     # gera a versão de produção em dist/
npm run preview   # serve a versão de produção localmente
```

> As imagens dos Pokémon, as fontes e os dados complementares da PokéAPI vêm da internet (veja "Fontes externas"). Sem conexão, a Pokédex continua funcionando com os dados do JSON, mas sem imagens e sem o painel complementar.

## Funcionalidades

### Requisitos do enunciado

| Requisito | Como foi atendido |
| --- | --- |
| Exibir os Pokémon dos dados | Grade de cards com ID, nome, tipos e os 6 atributos (HP, Ataque, Defesa, Atq. Esp., Def. Esp. e Velocidade) |
| Pesquisa por nome ou ID | Campo de busca que filtra a lista enquanto o usuário digita (aceita também `#025`) |
| Filtro por tipo | Chips com todos os tipos do `pokedex-data.json`; tipos sem Pokémon ficam desabilitados |
| Detalhes do Pokémon | Modal com imagem, ID, nome, tipos, barras dos 6 atributos e total |
| Treinadores | Modal com nome, insígnias e os Pokémon de cada treinador (clicar no Pokémon abre os detalhes) |
| Nenhum Pokémon encontrado | Mensagem na tela com botão "Limpar filtros" |
| Interface responsiva | Layout adaptado para desktop, tablet e celular |
| Identidade visual própria | Tema Pokédex, cores por tipo, animações e botões com efeito de pressionar |

### Desafios opcionais

| Desafio | Como foi atendido |
| --- | --- |
| Favoritos | Botão de Poké Bola nos cards e nos detalhes ("Capturado"), contador no topo e filtro "Só capturados". Fica salvo no `localStorage` |
| Comparação | Ícone de comparação nos cards seleciona até 2 Pokémon; o botão "Comparar" abre um modal com os atributos lado a lado, destaque do maior valor, total e resumo de quem lidera |
| Ordenação | Seletor por Número, Nome, HP, Ataque, Defesa, Atq. Esp., Def. Esp. e Velocidade, com botão de ordem crescente/decrescente. O atributo ordenado fica em destaque nos cards |
| Pokémon aleatório | Botão "Aleatório" sorteia um Pokémon (dentro dos filtros ativos, se houver) e abre os detalhes |
| Dark Mode | Botão no topo alterna entre o tema escuro (padrão) e um tema claro com tela de LCD verde-claro. A escolha fica salva |
| Responsividade avançada | Breakpoints para celular, tablet, desktop e telas largas; alvos de toque de 44px em telas touch; áreas seguras (notch) em celulares |
| API externa | Os detalhes buscam na PokéAPI altura, peso, habilidades, categoria e descrição (veja abaixo) |

Outros detalhes: navegação nos detalhes com botões Anterior/Próximo e setas ← → do teclado; modais com foco preso e fechamento por `Esc`; cards navegáveis pelo teclado; respeito a `prefers-reduced-motion`.

## Dados utilizados

Os dados principais vêm do arquivo [`src/data/pokedex-data.json`](src/data/pokedex-data.json), importado diretamente em `App.jsx`. Ele contém Pokémon, atributos, tipos, treinadores e insígnias. Nenhum banco de dados é necessário.

## Fontes externas

- **PokéAPI** (https://pokeapi.co): usada apenas para **complementar** os detalhes de um Pokémon, em dois endpoints:
  - `GET https://pokeapi.co/api/v2/pokemon/{id}`: altura, peso e habilidades;
  - `GET https://pokeapi.co/api/v2/pokemon-species/{id}`: categoria (ex.: "Seed Pokémon") e texto da Pokédex, usados em inglês, como a API os retorna.

  As respostas ficam em cache em memória durante a sessão. Se a requisição falhar, o painel mostra um aviso e o restante da aplicação continua funcionando com o `pokedex-data.json`. A lógica está em `src/hooks/usePokemonExtra.js`.
- **Imagens dos Pokémon:** repositório de sprites da PokéAPI (artes oficiais), carregadas por URL no formato `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/{id}.png`.
- **Fontes tipográficas:** [Chakra Petch](https://fonts.google.com/specimen/Chakra+Petch) e [Press Start 2P](https://fonts.google.com/specimen/Press+Start+2P), pelo Google Fonts (`index.html`).

## Organização do projeto

```text
src/
├── assets/images/          # Logo da Pokédex
├── components/
│   ├── ComparisonModal.jsx # Comparação lado a lado de 2 Pokémon
│   ├── Icons.jsx           # Ícones SVG (comparar, dado, sol, lua)
│   ├── Modal.jsx           # Modal acessível reutilizado nas janelas
│   ├── Pokeball.jsx        # Ícone de Poké Bola em SVG
│   ├── PokemonCard.jsx     # Card da lista (ID, nome, tipos, atributos, ações)
│   ├── PokemonDetails.jsx  # Detalhes + dados da PokéAPI
│   ├── PokemonList.jsx     # Grade de cards e estado vazio
│   ├── SearchBar.jsx       # Busca, ordenação e chips de filtro por tipo
│   ├── TrainersModal.jsx
│   └── TypeBadge.jsx       # Etiqueta colorida de tipo
├── css/                    # Um arquivo de estilo por componente + index.css (tokens, temas e carcaça)
├── data/
│   └── pokedex-data.json
├── hooks/
│   ├── useCaptured.js      # Pokémon capturados (com localStorage)
│   ├── usePokemonExtra.js  # Consulta à PokéAPI (com cache e tratamento de erro)
│   └── useTheme.js         # Tema claro/escuro (com localStorage)
├── utils/
│   └── pokemon.js          # Imagens, IDs, tipos, atributos, ordenação e formatações
├── App.jsx                 # Estados globais, filtragem/ordenação e composição da tela
└── main.jsx
```

## Conceitos de React utilizados

Componentes funcionais, props, `useState`, `useEffect`, `useMemo`, `useCallback`, `useRef`, hooks personalizados (`useCaptured`, `useTheme`, `usePokemonExtra`), renderização de listas com `map()`, eventos, estados derivados (lista filtrada e ordenada), consumo de API com `fetch` e `AbortController`, e portal (`createPortal`) para os modais.

## Dependências

Apenas as do template React + Vite. Nenhuma biblioteca adicional foi instalada.
