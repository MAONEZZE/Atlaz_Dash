# PRD: Migração Dash SrPamplona — Vite + Banco de Dados Real

## Introduction

Migrar o dashboard comercial SrPamplona da arquitetura atual (CDN React via unpkg + Babel no browser + dados mock em `data.jsx`) para um projeto React moderno com Vite, substituindo os dados estáticos por um banco de dados real acessado via API. O resultado deve rodar localmente com `npm run dev`, manter as 3 páginas separadas (Visão Geral, Pré-Vendas, Vendas), e preservar 100% do design visual existente.

---

## Goals

- Converter o projeto de CDN React para Vite com hot reload e build otimizado
- Eliminar `data.jsx` estático — todos os dados vêm do banco via hooks React
- Remover os itens "Produtos" e "Relatórios" da navegação (apenas 3 páginas)
- Manter o design/UI 100% fiel ao estado atual — zero mudanças visuais
- Rodar localmente com `npm run dev` sem configuração além de variáveis de ambiente

---

## User Stories

### US-001: Estrutura do projeto Vite multi-page
**Descrição:** Como desenvolvedor, quero um projeto Vite configurado para servir as 3 páginas do dashboard, substituindo os arquivos HTML atuais.

**Critérios de aceitação:**
- [ ] Projeto criado com `npm create vite@latest` (template React)
- [ ] `vite.config.js` configurado com `build.rollupOptions.input` apontando para 3 entradas: `index.html` (Visão Geral), `prevendas.html`, `vendas.html`
- [ ] `npm run dev` inicia o servidor e as 3 páginas respondem em URLs distintas
- [ ] `npm run build` conclui sem erros
- [ ] `styles.css` copiado para `src/styles.css` e importado no entry point de cada página
- [ ] Arquivo `Pré-vendas.html` renomeado para `prevendas.html` (evitar encoding de acento em paths Vite); links de navegação atualizados accordingly

### US-002: Migrar componentes compartilhados para ES modules
**Descrição:** Como desenvolvedor, quero que `charts.jsx` e `filters.jsx` sejam módulos ES com exports nomeados, sem uso de `Object.assign(window, ...)`.

**Critérios de aceitação:**
- [ ] `charts.jsx` → `src/components/Charts.jsx` com `export { Icon, Donut, ProjectionChart }`
- [ ] `filters.jsx` → `src/components/Filters.jsx` com exports nomeados de: `FilterBar`, `useFilters`, `loadFilters`, `FILTER_DEFAULTS`, `OPT_PERIOD`, `OPT_CANAL`, `OPT_RESP`, `OPT_PRODUTO`, `OPT_ETAPA`, `OPT_STATUS`, `OPT_TIPO_RECEITA`, `OPT_TICKET`, `OPT_ATIVIDADE`
- [ ] Nenhum `window.*` global restante nesses arquivos
- [ ] Imports funcionam corretamente nos 3 entry points de página

### US-003: Migrar página Visão Geral
**Descrição:** Como desenvolvedor, quero que `app.jsx` seja um componente React moderno com imports explícitos, sem dependência de globals.

**Critérios de aceitação:**
- [ ] `app.jsx` → `src/pages/visao-geral/App.jsx`
- [ ] Todos os globals (`VENDEDORES`, `RANKING_COTA`, `CLOSER_OPS`, etc.) substituídos por imports dos hooks de dados (US-009)
- [ ] `ReactDOM.createRoot` no entry point `src/pages/visao-geral/main.jsx`
- [ ] Página renderiza identicamente ao estado atual (layout, cores, números)
- [ ] Verificar no browser usando dev-browser skill

### US-004: Migrar página Pré-vendas
**Descrição:** Como desenvolvedor, quero que `prevendas.jsx` seja um componente React moderno.

**Critérios de aceitação:**
- [ ] `prevendas.jsx` → `src/pages/prevendas/AppPV.jsx`
- [ ] Todos os globals (`FUNIS_POR_CANAL`) substituídos por imports dos hooks de dados
- [ ] `ReactDOM.createRoot` no entry point `src/pages/prevendas/main.jsx`
- [ ] Página renderiza identicamente ao estado atual
- [ ] Verificar no browser usando dev-browser skill

### US-005: Migrar página Vendas
**Descrição:** Como desenvolvedor, quero que `vendas.jsx` seja um componente React moderno.

**Critérios de aceitação:**
- [ ] `vendas.jsx` → `src/pages/vendas/AppVendas.jsx`
- [ ] Todos os globals (`FIN_RESUMO`, `MESES_FIN`, `PRODUTOS`, `RECEITA_POR_CANAL`, `FIN_BREAKDOWN`, `TABELA_FIN_MENSAL`) substituídos por imports dos hooks
- [ ] `ReactDOM.createRoot` no entry point `src/pages/vendas/main.jsx`
- [ ] Página renderiza identicamente ao estado atual
- [ ] Verificar no browser usando dev-browser skill

### US-006: Remover "Produtos" e "Relatórios" da navegação
**Descrição:** Como usuário, quero ver apenas 3 links ativos na nav: Visão geral, Pré-vendas e Vendas.

**Critérios de aceitação:**
- [ ] Os `<a>` de "Produtos" e "Relatórios" removidos das 3 páginas (App.jsx, AppPV.jsx, AppVendas.jsx)
- [ ] Nav renderiza com exatamente 3 itens: Visão geral · Pré-vendas · Vendas
- [ ] Espaçamento e estilo da nav permanecem iguais (sem ajustes de CSS)
- [ ] Verificar no browser usando dev-browser skill

### US-007: Configurar banco de dados Supabase
**Descrição:** Como desenvolvedor, quero um schema PostgreSQL (via Supabase) que represente todas as entidades de dados do dashboard.

> **Pré-requisito:** Escolher entre Supabase local (Docker) ou Supabase cloud free tier antes de começar. Ver Open Questions.

**Critérios de aceitação:**
- [ ] Supabase projeto criado e acessível
- [ ] Migration SQL em `supabase/migrations/001_initial_schema.sql` com as tabelas listadas em FR-4
- [ ] Migration aplicada com sucesso (`supabase db reset` ou via Supabase dashboard)
- [ ] `.env.local` criado com `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`
- [ ] `.env.local` adicionado ao `.gitignore`

**Tabelas a criar:**
```
vendedores, sdrs, ranking_cota, closer_ops, sdr_ranking,
ops_metrics, metas_mes, funis_canal, funil_etapas,
funil_kpis, funil_aux_blocos, meses_financeiros,
receita_canal, fin_resumo, fin_breakdown,
tabela_fin_linhas, produtos
```

### US-008: Seed do banco com dados do data.jsx
**Descrição:** Como desenvolvedor, quero que o banco seja populado com todos os dados atualmente hardcoded em `data.jsx`.

**Critérios de aceitação:**
- [ ] Script de seed criado em `supabase/seed.sql` com todos os `INSERT INTO` para cada tabela
- [ ] Seed executável via `supabase db reset` (que aplica migrations + seed) ou `npm run seed`
- [ ] Após o seed, query em cada tabela principal retorna pelo menos 1 linha
- [ ] Os valores numéricos do seed batem com os do `data.jsx` (ex: `META_TOTAL = 1000000`, `META_ATINGIDA = 761000`)

### US-009: Camada de hooks de dados (Supabase → React)
**Descrição:** Como desenvolvedor, quero hooks React que abstraiam as queries ao Supabase e exponham `{ data, loading, error }`.

**Critérios de aceitação:**
- [ ] `src/lib/supabase.js` — cliente Supabase inicializado com as variáveis de ambiente
- [ ] `src/hooks/useDashboardData.js` — retorna todos os dados necessários para Visão Geral: `{ vendedores, rankingCota, closerOps, sdrs, sdrRanking, opsMetrics, meta, gestaoVisual, gestaoEstrategica, loading, error }`
- [ ] `src/hooks/usePrevéendasData.js` — retorna `{ funisPorCanal, loading, error }`
- [ ] `src/hooks/useVendasData.js` — retorna `{ finResumo, mesesFin, produtos, receitaCanal, finBreakdown, tabelaFinMensal, loading, error }`
- [ ] Enquanto `loading === true`, componentes exibem um estado de carregamento simples (ex: texto "Carregando..." ou opacidade reduzida no container)
- [ ] `data.jsx` removido do projeto após todos os hooks funcionarem

### US-010: Conectar Visão Geral ao banco real
**Descrição:** Como usuário, quero que a página Visão Geral exiba dados do banco de dados.

**Critérios de aceitação:**
- [ ] `App.jsx` usa `useDashboardData()` — zero constantes hardcoded de dados de negócio
- [ ] Estado de loading visível enquanto os dados carregam
- [ ] Após carregamento, os dados exibidos são idênticos aos do seed (mesmos números)
- [ ] Verificar no browser usando dev-browser skill

### US-011: Conectar Pré-vendas ao banco real
**Descrição:** Como usuário, quero que a página Pré-vendas exiba dados do banco de dados.

**Critérios de aceitação:**
- [ ] `AppPV.jsx` usa `usePrevendasData()` — zero constantes hardcoded
- [ ] Estado de loading visível
- [ ] Dados exibidos idênticos ao seed
- [ ] Verificar no browser usando dev-browser skill

### US-012: Conectar Vendas ao banco real
**Descrição:** Como usuário, quero que a página Vendas exiba dados do banco de dados.

**Critérios de aceitação:**
- [ ] `AppVendas.jsx` usa `useVendasData()` — zero constantes hardcoded
- [ ] Estado de loading visível
- [ ] Dados exibidos idênticos ao seed
- [ ] Verificar no browser usando dev-browser skill

---

## Functional Requirements

- **FR-1:** O bundler deve ser Vite com configuração multi-page (3 entradas HTML)
- **FR-2:** Cada página tem seu próprio entry point em `src/pages/<nome>/main.jsx`
- **FR-3:** Componentes compartilhados ficam em `src/components/` com exports nomeados (sem globals `window.*`)
- **FR-4:** Banco de dados: Supabase (PostgreSQL). Configurado via `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` em `.env.local`
- **FR-5:** A navegação das 3 páginas contém exatamente: Visão geral, Pré-vendas, Vendas — sem Produtos ou Relatórios
- **FR-6:** Zero dados hardcoded nos componentes de página — tudo via hooks que consultam o Supabase
- **FR-7:** Cada hook expõe `{ data, loading, error }` — os componentes devem tratar o estado `loading`
- **FR-8:** `npm run dev` inicia o projeto sem configuração além do `.env.local`
- **FR-9:** As métricas calculadas de `data.jsx` (ex: `TAXA_PLAT`, `IMPOSTO`, `LIQ_VENDIDO`, `COMISSOES`, `MARGEM_OP`) são armazenadas no banco como valores calculados no seed SQL, não recomputadas no frontend

---

## Non-Goals (Fora do Escopo)

- Autenticação ou sistema de login
- Filtros da barra de filtros conectados ao banco (a UI de filtros existe mas não altera queries — isso é trabalho futuro)
- Deploy em produção (apenas local)
- Qualquer nova funcionalidade ou tela além das 3 existentes
- Testes automatizados (unitários ou E2E)
- Refatoração do CSS ou do design visual
- Refatoração da lógica interna dos componentes (migração 1:1)
- SSR ou Next.js (apenas Vite SPA)

---

## Technical Considerations

**Estrutura de arquivos resultante:**
```
Atlaz_Dash/
├── src/
│   ├── components/
│   │   ├── Charts.jsx       ← migrado de charts.jsx
│   │   └── Filters.jsx      ← migrado de filters.jsx
│   ├── hooks/
│   │   ├── useDashboardData.js
│   │   ├── usePrevendasData.js
│   │   └── useVendasData.js
│   ├── lib/
│   │   └── supabase.js
│   ├── pages/
│   │   ├── visao-geral/
│   │   │   ├── main.jsx
│   │   │   └── App.jsx
│   │   ├── prevendas/
│   │   │   ├── main.jsx
│   │   │   └── AppPV.jsx
│   │   └── vendas/
│   │       ├── main.jsx
│   │       └── AppVendas.jsx
│   └── styles.css
├── index.html               ← entrada Visão Geral
├── prevendas.html           ← entrada Pré-vendas (renomeado de Pré-vendas.html)
├── vendas.html              ← entrada Vendas
├── supabase/
│   ├── migrations/
│   │   └── 001_initial_schema.sql
│   └── seed.sql
├── vite.config.js
├── package.json
└── .env.local               ← não commitado
```

**Vite multi-page config:**
```js
// vite.config.js
import { resolve } from 'path'
export default {
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        prevendas: resolve(__dirname, 'prevendas.html'),
        vendas: resolve(__dirname, 'vendas.html'),
      }
    }
  }
}
```

**Supabase — opções para ambiente local:**
- **Opção A (recomendada):** Supabase cloud free tier — sem Docker, acesso imediato via browser. Criar projeto em supabase.com, copiar URL e anon key para `.env.local`.
- **Opção B:** Supabase local com Docker (`supabase start`) — totalmente offline, requer Docker instalado.

**Métricas computadas no data.jsx:** Arrays como `TAXA_PLAT`, `IMPOSTO`, `LIQ_VENDIDO` são calculados via `FAT_BRUTO.map(v => v * 0.032)`. No banco, esses valores serão inseridos já calculados no seed SQL (não recomputados no frontend), mantendo a lógica idêntica.

**Renomeação `Pré-vendas.html` → `prevendas.html`:** O acento no nome do arquivo pode causar problemas de encoding em Vite/Rollup. Renomear o arquivo e atualizar o `href` de navegação de `"Pré-vendas.html"` para `"prevendas.html"` nas 3 páginas.

---

## Success Metrics

- `npm run dev` inicia sem erros em menos de 5 segundos
- As 3 páginas renderizam no browser com visual pixel-a-pixel idêntico ao estado atual
- Os dados exibidos vêm do banco Supabase (verificável: alterar um valor no banco e recarregar a página reflete a mudança)
- `npm run build` conclui sem warnings críticos
- `data.jsx` não existe mais no projeto

---

## Open Questions

1. **Supabase local ou cloud?** Confirmar se Docker está disponível na máquina de desenvolvimento. Se sim, usar `supabase start`. Se não, usar Supabase cloud free tier. Isso determina como iniciar US-007.

2. **Estado de loading:** Como exibir enquanto os dados carregam? Sugestão padrão: container com `opacity: 0.4` + cursor de espera. Alternativa: skeleton screens (mais trabalhoso). Confirmar antes de US-009.

3. **Filtros globais e banco:** A `FilterBar` persiste período/canal no `localStorage` e emite eventos. Por ora, esses filtros não alteram as queries ao Supabase (non-goal). Confirmar se isso está ok para a versão inicial.
