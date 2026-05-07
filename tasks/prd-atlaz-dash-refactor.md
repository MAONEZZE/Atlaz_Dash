# PRD: Refatoração Atlaz_Dash — Integração com Atlaz_Dash_Backend

## 1. Introdução / Visão Geral

Frontend `Atlaz_Dash` (Vite + React multi-page) hoje busca dados chamando webhooks `n8n.learningbrands.cloud` direto, com fallback silencioso para mocks em `src/mock/*`. Backend `Atlaz_Dash_Backend` (FastAPI) já está em produção em `https://dash-api.learningbrands.cloud/` e oferece todos os endpoints necessários, com normalização e DTOs estáveis.

Esta refatoração:
- Migra todas as chamadas para o backend via `apiClient.js`
- Remove mocks e dependências n8n direto
- Atualiza DTOs e componentes para a shape atual do backend (mudou desde versão anterior)
- Adiciona estados de loading e erro visíveis na UI

Resultado: dashboard 100% funcional consumindo dados reais via API única.

---

## 2. Goals

- Centralizar acesso a dados no backend; zero chamadas n8n direto no frontend
- Atualizar todos os 7 hooks para usar `apiClient.js` + endpoints atuais
- Atualizar JSDoc DTOs em `src/dtos/` para refletir shape atual
- Atualizar componentes (`App.jsx`, `AppVendas.jsx`, `AppPV.jsx`) para nova shape (CLOSER/SDR, finance, funis)
- Remover `src/mock/` por completo
- Adicionar spinner global + banner de erro por página
- `VITE_API_BASE_URL=https://dash-api.learningbrands.cloud` configurado via `.env`

---

## 3. Endpoint Mapping (Backend Atual)

| Frontend Hook | Antes (n8n) | Agora (backend) | Método | Query params |
|---|---|---|---|---|
| `useDashboardData` | `webhook/statistic` (POST) | `/metrics` | GET | `data_inicio`, `data_fim`, `responsavel`, `produto`, `etapa_do_funil`, `status_do_negocio`, `tipo_de_receita`, `faixa_de_ticket`, `tipo_de_atividade` |
| `useUserInfo` | `webhook/user/info` | `/users` | GET | — |
| `useUserStats` | `webhook/user/statistics/{id}` | `/users/{id}/metrics` | GET | `data_inicio`, `data_fim` |
| `useSalesGoals` | `webhook/sales/goals` | `/goals/fat` | GET | — |
| `useTeamGoals` | `webhook/team/goals` | `/goals/metrics` | GET | — |
| `useVendasData` | `webhook-test/sales/values` | `/sales/values` | GET | `data_inicio`, `data_fim`, `canal`, `produto` | **Requer `X-API-Key` header** |
| `usePrevendasData` | `webhook-test/pre_sales` | `/pre-sales/funnels` | GET | `data_inicio`, `data_fim` |

**Health check:** `GET /health` retorna `{status:"ok"}`.

**Autenticação:** `GET /sales/values` requer header `X-API-Key: <valor>`. Demais endpoints são públicos.

**CORS:** backend permite apenas `GET` e `OPTIONS`; headers aceitos: `Content-Type`, `Accept`, `X-API-Key`.

---

## 4. User Stories

### US-001: Configurar variáveis de ambiente e `apiClient.js`

**Description:** Como dev, quero URL do backend e API key configuradas via `.env`, e `apiClient.js` suportando headers customizados para autenticação.

**Acceptance Criteria:**
- [ ] Deletar `.env.example` da raiz do projeto
- [ ] Criar/atualizar `.env` na raiz com valores reais:
  - `VITE_API_BASE_URL=https://dash-api.learningbrands.cloud`
  - `VITE_SALES_API_KEY=<valor real da chave>` (para header `X-API-Key` em `/sales/values`)
  - REMOVER `VITE_IMG_JACOB_TOKEN`, `VITE_IMG_JONATHAN_TOKEN`, `VITE_IMG_ALEX_TOKEN`, `VITE_IMG_JENNIFER_TOKEN` (backend já entrega `imagem_url` completa)
- [ ] Verificar `.env` em `.gitignore` (não commitar)
- [ ] Atualizar `src/lib/apiClient.js`: função `request()` aceitar `headers` customizados opcionais (mesclados com os defaults)
- [ ] `apiGet` e `apiPost` repassar `headers` das options para `request()`
- [ ] Confirmar que `apiClient.js` lê `import.meta.env.VITE_API_BASE_URL` (já implementado)
- [ ] `npm run dev` sobe sem erro; `apiGet('/health')` retorna `{status: "ok"}`

### US-002: Atualizar DTOs para shape atual do backend

**Description:** Como dev, quero `src/dtos/*.js` refletindo a shape real retornada pelos endpoints atuais.

**Acceptance Criteria:**
- [ ] `src/dtos/statistics.js`:
  - `FrontendCloserStatisticDTO` apenas com: `Nome`, `"Ligações\nRealizadas"`, `"Reuniões\nAgendadas"`, `"Reuniões\nRealizadas"`, `Indicações`
  - `FrontendSdrStatisticDTO` com: `Nome`, `"Conexões\nEnviadas"`, `"Conexões\nAceitas"`, `"InMails\nEnviados"`, `"Follow-ups"`, `"Números\nCaptados"`, `"Ligações\nAgendadas"`, `"Reuniões\nAgendadas"`, `"Indicações\nCaptadas"`, `Abordagens`
  - Remover refs a campos antigos: CLOSER `Vendas`/`Faturamento`/`Ticket Médio`/`Taxa Conversão`/`No-Show`/`Follow-ups`/`Reuniões`; SDR `Mensagens Enviadas`/`Taxa Agendamento`
- [ ] `src/dtos/goals.js`:
  - `SalesGoalsDTO`: `Nome`, `Cargo`, `Meta_Mensal`, `Meta_Numeros`, `Meta_Leads`, `Meta_Ligacoes`, `Meta_Reunioes`, `Meta_Indicacoes`
  - `TeamGoalsResponseDTO` envolve `data: TeamGoalsDTO[]`
  - Documentar que `/goals/metrics` retorna `{SDR:{}, Closer:{}}` shape RAW (sem wrapper `data`)
- [ ] `src/dtos/users.js`:
  - `UserInfoDTO`: `id`, `nome`, `cargo`, `imagem_url` (URL completa, sem token logic)
  - `UserStatisticsResponseDTO`: `{user_id, nome, cargo, statistics: {CLOSER:[], SDR:[]}}`
- [ ] `src/dtos/sales.js`:
  - `FinancialSummaryDTO`: `bruto`, `liquido`, `vendido`, `vendas`, `deltaLiquido`, `deltaBruto`, `deltaVendas`, `margem`, `deltaMargem`, `taxaPlataforma`, `ticketMedio`, `emNegociacaoValor`, `emNegociacaoQtd`, `comissaoSDR`, `comissaoCloser`, `comissaoTotal`, `margemOpValor`
  - `FinancialMonthDTO`: `m`, `bruto`, `liquido`, `vendido`, `previsto`, `atual`
  - `ProductRevenueDTO`: `nome`, `bruto`, `liquido`, `vendas`, `pct`, `cor`
  - `ProductsTotalDTO`: `bruto`, `liquido`, `vendas` (novo)
  - `ChannelRevenueDTO`: `id`, `nome`, `bruto`, `liquido`, `vendas`, `cor`
  - `FinancialBreakdownDTO`: `item`, `valor`, `tipo` (`"entrada"|"saida"|"resultado"`)
  - `MonthlyFinancialTableRowDTO`: `id`, `nome`, `tipo` (`"entrada"|"saida"|"subtotal"|"resultado"`), `valores`, `total`
  - `MonthlyFinancialTableDTO`: `meses[]`, `mesAtualIdx`, `linhas[]`
  - `SalesFinanceResponseDTO`: `FIN_RESUMO`, `MESES_FIN`, `PRODUTOS`, `PRODUTOS_TOTAL`, `RECEITA_POR_CANAL`, `FIN_BREAKDOWN`, `TABELA_FIN_MENSAL`
- [ ] `src/dtos/preSales.js`:
  - `FUNIS_POR_CANAL` é OBJETO com chaves `linkedin/instagram/indicacao/whatsapp/outros` (não array)
  - `ChannelFunnelDTO`: `id`, `nome`, `cor`, `corAcc`, `sub`, `etapas[{id,nome,v}]`, `kpis[{id,l,meta,auxRef}]`, `aux{titulo, blocos[{l,v,fmt}]}`
  - `FunnelFmt`: `"num"|"pct"|"dec"|"h"|"dias"`
- [ ] Constantes `EMPTY_*` atualizadas para nova shape
- [ ] Lint passa

### US-003: Remover mocks e fallback silencioso

**Description:** Como dev, quero remover toda a pasta `src/mock/` para garantir que UI sempre exiba dados reais ou erro explícito.

**Acceptance Criteria:**
- [ ] `src/mock/` deletada (incluindo `dashboard.js`, `prevendas.js`, `vendas.js`)
- [ ] `grep -R "from .*mock" src/` retorna zero
- [ ] `npm run build` passa sem import quebrado

### US-004: Componente shared `<DataState>` para loading e erro

**Description:** Como dev, quero componente reutilizável que mostra spinner durante loading e banner de erro quando chamada falha, padronizando UX em todas as 3 páginas.

**Acceptance Criteria:**
- [ ] Criar `src/components/DataState.jsx` recebendo `{loading, error, onRetry, children}`
- [ ] `loading=true` → spinner centralizado (CSS puro, border + animation)
- [ ] `error` truthy → banner com mensagem ("Falha ao carregar dados.") + botão "Recarregar" que chama `onRetry()` (refetch via hook, NÃO `window.location.reload()`)
- [ ] Ambos falsos → renderiza `children`
- [ ] CSS reusa tokens existentes em `src/styles.css`
- [ ] Lint passa
- [ ] Verificar visualmente no navegador usando dev-browser skill

### US-005: Refatorar `useDashboardData` para `GET /metrics`

**Description:** Como dev, quero hook de Visão Geral consumindo `GET /metrics` em vez de n8n direto.

**Acceptance Criteria:**
- [ ] Substituir `fetch(API_URL)` por `apiGet('/metrics', params)` do `apiClient.js`
- [ ] Mapear estado de filtros para query params snake_case PT: `data_inicio`, `data_fim`, `responsavel`, `produto`, `etapa_do_funil`, `status_do_negocio`, `tipo_de_receita`, `faixa_de_ticket`, `tipo_de_atividade`
- [ ] Manter lógica de período (dia/semana/mes/trim/sem/ano/custom) → converte para `data_inicio`/`data_fim` em ms
- [ ] Manter chamada paralela do mês anterior via `/metrics` para deltas
- [ ] Remover `import { mockDashboard }` e fallback; em erro propagar `error` truthy
- [ ] Hook retorna `{data, prevData, loading, error, refetch}`; `data`/`prevData` `null` em erro
- [ ] Filtros `'todos'`/`'todas'` omitidos do payload (comportamento atual mantido)
- [ ] Lint passa

### US-006: Refatorar `useUserInfo` para `GET /users`

**Description:** Como dev, quero lista de usuários via backend.

**Acceptance Criteria:**
- [ ] Substituir `fetch(n8n)` por `apiGet('/users')`
- [ ] Backend retorna `imagem_url` completa (já com `?token=...` quando aplicável) — REMOVER `TOKEN_MAP` e `buildImageUrl` do hook
- [ ] `normalizeUser` lê `imagem_url` direto (renomear chave de saída para `imageUrl` se componentes esperam camelCase)
- [ ] Filtros de cargo: `cargo === 'Closer'` e `cargo === 'SDR'` (capitalizado, conforme retorno do backend)
- [ ] Em erro: `users=[]`, `error` truthy
- [ ] Hook retorna `{users, closers, sdrs, loading, error, refetch}`
- [ ] Lint passa

### US-007: Refatorar `useUserStats` para `GET /users/{id}/metrics`

**Description:** Como dev, quero stats por usuário via backend.

**Acceptance Criteria:**
- [ ] Substituir `fetch(${BASE_URL}/${id})` por `apiGet(\`/users/${id}/metrics\`, {data_inicio, data_fim})`
- [ ] Hook aceita `data_inicio`/`data_fim` opcionais como argumentos (passados pela página de Visão Geral)
- [ ] Em erro por usuário: `statsById[id] = null` (mantém erro isolado)
- [ ] Hook retorna `{statsById, loading, error, refetch}` (`error` agregado se TODOS falharem)
- [ ] Resposta tem shape `{user_id, nome, cargo, statistics:{CLOSER:[], SDR:[]}}` — armazenar `statistics` ou objeto completo conforme uso atual
- [ ] Lint passa

### US-008: Refatorar `useSalesGoals` para `GET /goals/fat`

**Description:** Como dev, quero metas individuais via backend.

**Acceptance Criteria:**
- [ ] Substituir `fetch(GOALS_URL)` por `apiGet('/goals/fat')`
- [ ] Resposta `{data: SalesGoalsDTO[]}` — manter normalização atual (`meta_total`, `byName`, `list`)
- [ ] Lookup de Closer: `Cargo === 'Closer'` (capitalizado, sem `.toLowerCase()`)
- [ ] Em erro: `goals=null`, `error` truthy
- [ ] Hook retorna `{goals, loading, error, refetch}`
- [ ] Lint passa

### US-009: Refatorar `useTeamGoals` para `GET /goals/metrics`

**Description:** Como dev, quero totais agregados do time via backend, ciente da nova shape.

**Acceptance Criteria:**
- [ ] Substituir `fetch(TEAM_GOALS_URL)` por `apiGet('/goals/metrics')`
- [ ] Adaptar para shape RAW: `{SDR:{...}, Closer:{...}}` (sem `data` wrapper)
- [ ] Hook retorna `{teamTotals, loading, error, refetch}` onde `teamTotals = {SDR, Closer}` ou `null` em erro
- [ ] Em erro: `teamTotals=null`, `error` truthy
- [ ] Lint passa

### US-010: Refatorar `useVendasData` para `GET /sales/values`

**Description:** Como dev, quero dados financeiros via backend, enviando API key obrigatória no header.

**Acceptance Criteria:**
- [ ] Substituir `fetch(API_URL)` por `apiGet('/sales/values', params, { headers: { 'X-API-Key': import.meta.env.VITE_SALES_API_KEY } })`
- [ ] Hook aceita filtros opcionais `data_inicio`, `data_fim`, `canal`, `produto`
- [ ] Se `VITE_SALES_API_KEY` não estiver definido, logar aviso no console e propagar `error` (não chamar API sem key — retornaria 401)
- [ ] Remover `import { mockVendas }` e fallback
- [ ] Em erro (401 incluso): `data=null`, `error` truthy com mensagem descritiva
- [ ] Hook retorna `{data, loading, error, refetch}`
- [ ] Lint passa

### US-011: Refatorar `usePrevendasData` para `GET /pre-sales/funnels`

**Description:** Como dev, quero dados de funil via backend.

**Acceptance Criteria:**
- [ ] Substituir `fetch(API_URL)` por `apiGet('/pre-sales/funnels', {data_inicio, data_fim})`
- [ ] Hook aceita filtros opcionais `data_inicio`, `data_fim`
- [ ] Remover `import { mockPrevendas }` e fallback
- [ ] Em erro: `data=null`, `error` truthy
- [ ] Hook retorna `{data, loading, error, refetch}`
- [ ] Lint passa

### US-012: Atualizar Visão Geral (`pages/visao-geral/App.jsx`) para nova shape

**Description:** Como usuário, quero a página Visão Geral renderizando corretamente com campos atualizados de CLOSER/SDR e totais do time.

**Acceptance Criteria:**
- [ ] Remover/refatorar consumidores de campos CLOSER inexistentes: `Vendas`, `Faturamento`, `"Ticket\nMédio"`, `"Taxa\nConversão"`, `No-Show`, `Follow-ups`, `Reuniões` (genérico). Usar apenas: `"Ligações\nRealizadas"`, `"Reuniões\nAgendadas"`, `"Reuniões\nRealizadas"`, `Indicações`
- [ ] Atualizar consumidores SDR: usar `"Conexões\nEnviadas"`, `"Conexões\nAceitas"`, `"InMails\nEnviados"`, `Follow-ups`, `"Números\nCaptados"`, `"Ligações\nAgendadas"`, `"Reuniões\nAgendadas"`, `"Indicações\nCaptadas"`, `Abordagens` (sumiram: `"Mensagens\nEnviadas"`, `"Taxa\nAgendamento"`)
- [ ] Atualizar consumo de `teamTotals` para `{SDR, Closer}` em vez de objeto plano (`teamTotals.SDR.numeros_captados`, etc.)
- [ ] **Remover** cards/colunas que dependiam de campos inexistentes no novo backend (Faturamento, Ticket Médio, Taxa Conversão, No-Show, Vendas, Reuniões genérico, Mensagens Enviadas, Taxa Agendamento). NÃO substituir por placeholder zerado; remover do JSX
- [ ] Envolver conteúdo principal em `<DataState loading={...} error={...} onRetry={refetch}>`
- [ ] Lint passa
- [ ] Verificar visualmente no navegador usando dev-browser skill (Visão Geral renderiza dados reais sem console errors)

### US-013: Atualizar Vendas (`pages/vendas/AppVendas.jsx`) para nova shape

**Description:** Como usuário, quero página Vendas renderizando com nova shape do `/sales/values`.

**Acceptance Criteria:**
- [ ] `FIN_RESUMO`: usar novos campos (`bruto`, `liquido`, `vendido`, `vendas`, `deltaLiquido`, `deltaBruto`, `deltaVendas`, `margem`, `deltaMargem`, `taxaPlataforma`, `ticketMedio`, `emNegociacaoValor`, `emNegociacaoQtd`, `comissaoSDR`, `comissaoCloser`, `comissaoTotal`, `margemOpValor`); remover refs a `parcelasAnt`, `totalLiquido`, `margemOp`
- [ ] `MESES_FIN`: ler `m`, `bruto`, `liquido`, `vendido`, `previsto`, `atual` (em vez de `label`, `mesIdx`, `valor`)
- [ ] `RECEITA_POR_CANAL`: ler `id`, `nome`, `bruto`, `liquido`, `vendas`, `cor` (calcular `pct` no front se exibido, ou remover do display)
- [ ] `PRODUTOS`: ler `nome`, `bruto`, `liquido`, `vendas`, `pct`, `cor`; usar `PRODUTOS_TOTAL` se totais necessários
- [ ] `TABELA_FIN_MENSAL`: ler `meses[]`, `mesAtualIdx`, `linhas[{id,nome,tipo,valores,total}]` (em vez de `colunas`/`linhas[{label,valores}]`)
- [ ] `FIN_BREAKDOWN`: ler `item`, `valor`, `tipo` (em vez de `label`, `cor`)
- [ ] Envolver em `<DataState onRetry={refetch}>`
- [ ] Lint passa
- [ ] Verificar visualmente no navegador usando dev-browser skill (Vendas renderiza dados reais)

### US-014: Atualizar Pré-Vendas (`pages/prevendas/AppPV.jsx`) para nova shape

**Description:** Como usuário, quero página Pré-Vendas renderizando com `FUNIS_POR_CANAL` como objeto.

**Acceptance Criteria:**
- [ ] Trocar iteração de array `FUNIS_POR_CANAL.map(...)` por leitura por chave: `Object.values(FUNIS_POR_CANAL)` ou acesso direto (`linkedin`, `instagram`, `indicacao`, `whatsapp`, `outros`)
- [ ] Usar campos novos por canal: `id`, `nome`, `cor`, `corAcc`, `sub`, `etapas[{id,nome,v}]`, `kpis[{id,l,meta,auxRef}]`, `aux{titulo, blocos[{l,v,fmt}]}` — em vez de `canal`, `etapas[{label,valor,fmt}]`, `kpis[{label,valor,fmt}]`, `aux[{titulo,itens[]}]`
- [ ] Renderizar etapas usando `nome` como label e `v` como valor
- [ ] Renderizar KPIs com regra: se `kpi.auxRef` existir, fazer lookup em `aux.blocos` por id e usar `bloco.v` como valor (e `bloco.fmt` para formatação); senão usar `kpi.meta` como valor
- [ ] Renderizar bloco aux com `titulo` e `blocos[{l, v, fmt}]`
- [ ] Envolver em `<DataState onRetry={refetch}>`
- [ ] Lint passa
- [ ] Verificar visualmente no navegador usando dev-browser skill (Pré-Vendas renderiza dados reais)

### US-015: Validação end-to-end das 3 páginas

**Description:** Como dev, quero confirmar que as 3 páginas funcionam contra backend de produção sem erros.

**Acceptance Criteria:**
- [ ] `npm run dev`; abrir `index.html`, `prevendas.html`, `vendas.html`
- [ ] Network tab: TODAS as requisições vão para `https://dash-api.learningbrands.cloud/*`; ZERO para `n8n.learningbrands.cloud`
- [ ] Console limpo (sem warnings React de keys/PropTypes/undefined)
- [ ] Loading visível durante fetch; banner de erro aparece se backend indisponível (testar bloqueando rede no DevTools)
- [ ] `npm run build` passa
- [ ] Verificar visualmente no navegador usando dev-browser skill

---

## 5. Functional Requirements

- **FR-1:** Frontend chama backend via `VITE_API_BASE_URL` (default `https://dash-api.learningbrands.cloud`)
- **FR-1b:** `GET /sales/values` exige header `X-API-Key: ${VITE_SALES_API_KEY}`; sem key → não chamar, propagar error
- **FR-1c:** CORS backend permite apenas `GET` e `OPTIONS`, headers `Content-Type`, `Accept`, `X-API-Key` — não enviar outros headers customizados
- **FR-2:** Todas as chamadas HTTP passam por `src/lib/apiClient.js` (`apiGet`); proibido `fetch` direto fora de `apiClient.js`
- **FR-2b:** `apiClient.js` suporta `headers` customizados opcionais nas options (mesclados com defaults)
- **FR-3:** Filtros enviados como query params snake_case PT: `data_inicio`, `data_fim`, `responsavel`, `produto`, `etapa_do_funil`, `status_do_negocio`, `tipo_de_receita`, `faixa_de_ticket`, `tipo_de_atividade`, `canal`
- **FR-4:** Falha em chamada → hook retorna `error` truthy → UI exibe banner via `<DataState>`. PROIBIDO fallback silencioso para mock
- **FR-5:** Mapeamento de endpoints conforme tabela seção 3
- **FR-6:** Pasta `src/mock/` removida; nenhum import a `../mock/*`
- **FR-7:** DTOs em `src/dtos/*.js` espelham shape atual do backend (US-002)
- **FR-8:** Cada página renderiza 3 estados: loading (spinner), error (banner + recarregar), success (conteúdo)
- **FR-9:** Filtros com valor `'todos'`/`'todas'` omitidos do payload
- **FR-10:** Backend retorna `imagem_url` completa; frontend NÃO monta URL. `VITE_IMG_*_TOKEN` REMOVIDAS do `.env`
- **FR-10b:** Apenas arquivo `.env` (sem `.env.example`) com valores reais; `.env` NÃO commitado (`.gitignore`)
- **FR-12:** Cargo retornado pelo backend é capitalizado (`Closer`, `SDR`); comparações no frontend usam exata caixa (sem `.toLowerCase()`)
- **FR-13:** Hooks expõem `refetch()` para reexecutar a chamada; `<DataState>` recebe `onRetry={refetch}` para o botão "Recarregar" (sem `window.location.reload()`)
- **FR-14:** KPIs Pré-Vendas com `auxRef` resolvem valor via lookup em `aux.blocos[].id`; sem `auxRef`, usa `kpi.meta`
- **FR-11:** Chaves com `\n` literal preservadas ao consumir DTO de estatísticas (ex: `obj["Ligações\nRealizadas"]`)

---

## 6. Non-Goals (Fora de Escopo)

- Não criar novas features ou novas páginas
- Não alterar design visual ou layout (apenas ajustes mínimos quando campo do DTO sumiu)
- Não implementar autenticação/autorização (backend público read-only)
- Não adicionar React Query, SWR, Zustand ou qualquer biblioteca de estado/cache
- Não migrar para TypeScript
- Não escrever testes automatizados (verificação manual via navegador)
- Não alterar nada no projeto `Atlaz_Dash_Backend`
- Não configurar CI/CD nem deploy automático
- Não adicionar retry automático ou circuit breaker no apiClient
- Não rodar backend localmente (já rodando em produção)

---

## 7. Design Considerations

- `<DataState>`: usar classes/estilos já presentes em `src/styles.css`; spinner CSS puro (border + rotate animation)
- Banner de erro: cor de destaque consistente com `styles.css`; botão "Recarregar" simples (`window.location.reload()`)
- Manter visual atual; mudanças só onde campo do DTO sumiu (ex: card "Faturamento" da Visão Geral pode ser removido ou substituído por campo presente)
- Reusar `Charts.jsx` e `Filters.jsx` como estão

---

## 8. Technical Considerations

### Sequência sugerida

1. **US-001** — `.env` config
2. **US-002** — atualizar DTOs (referência para steps seguintes)
3. **US-004** — componente `<DataState>` (usado em todas as páginas)
4. **US-005 a US-011** — refatorar 7 hooks (podem ser paralelos, sem dependência entre si)
5. **US-012, US-013, US-014** — atualizar componentes das 3 páginas (depende dos hooks)
6. **US-003** — remover `src/mock/` (após hooks não importarem mais)
7. **US-015** — validação end-to-end

### Riscos

- **Campos removidos do CLOSER**: cards/visualizações com `Faturamento`, `Ticket Médio`, `Taxa Conversão` removidos do JSX (US-012)
- **Shape diferente em `/goals/metrics`**: único endpoint sem `data` wrapper — caso especial em `useTeamGoals`
- **CORS em dev local**: backend em produção aceita `cors_origins=https://dash.learningbrands.cloud`. Localhost (`http://localhost:5173`) pode receber 403 CORS. Solução: responsável do backend adicionar `http://localhost:5173` em `CORS_ORIGINS` no `.env` do backend (fora deste PRD)
- **API Key exposta no frontend**: `VITE_SALES_API_KEY` fica no bundle JS (visível no source). Risco aceitável para dashboard interno sem dados sensíveis
- **`VITE_IMG_*_TOKEN` removidas**: backend lê tokens das suas próprias envs para montar `imagem_url`

### apiClient existente

`src/lib/apiClient.js` já implementa:
- Timeout 15s via `AbortController`
- Headers padrão JSON
- `ApiError` (rede/HTTP) e `ValidationError` (422 com payload)
- Parse JSON tolerante
- Reusar como está

---

## 9. Success Metrics

- `grep -R "fetch(" src/ | grep -v apiClient.js` → zero linhas
- `grep -R "n8n.learningbrands.cloud" src/` → zero linhas
- `grep -R "from .*mock" src/` → zero linhas
- `src/mock/` não existe
- 100% das requisições HTTP no Network tab apontam para `https://dash-api.learningbrands.cloud/*`
- 3 páginas renderizam dados reais sem erros no console
- Backend offline → UI exibe banner de erro com botão "Recarregar"
- `npm run build` passa sem warnings

---

## 10. Decisões Resolvidas

1. **Cards do CLOSER sem campo no backend** → REMOVER do JSX (não substituir por placeholder zerado). Aplicado em US-012
2. **`auxRef` em KPIs Pré-Vendas** → fazer lookup em `aux.blocos[].id`; sem `auxRef`, usa `kpi.meta`. Aplicado em US-014 e FR-14
3. **Botão "Recarregar"** → `refetch` via hook (não `window.location.reload()`). Aplicado em US-004 + FR-13
4. **`.env`** → apenas `.env` com valores reais; `.env.example` deletado; `VITE_IMG_*_TOKEN` removidas. Aplicado em US-001 + FR-10/10b
5. **Cargo case** → `Closer` / `SDR` (capitalizado, conforme backend); sem `.toLowerCase()`. Aplicado em US-006/US-008 + FR-12
