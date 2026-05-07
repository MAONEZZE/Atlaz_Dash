// Pré-vendas — Central dinâmica de funis por canal
const { useState: usePS, useMemo: usePM } = React;

function fmtPV(n) { return n.toLocaleString('pt-BR'); }
function fmtVal(v, fmt) {
  if (fmt === 'pct')  return v.toFixed(1) + '%';
  if (fmt === 'dec')  return v.toFixed(1);
  if (fmt === 'h')    return v.toFixed(1) + 'h';
  if (fmt === 'dias') return v + ' dias';
  return fmtPV(v);
}

// ── KPI card dinâmico ────────────────────────────
function PVKpi({ label, value, meta, cor, delay = 0 }) {
  const pct = meta > 0 ? (value / meta) * 100 : 0;
  const falta = Math.max(meta - value, 0);
  const atingido = pct >= 100;
  return (
    <div className="pv-kpi" style={{ animationDelay: `${delay}ms` }}>
      <div className="pv-kpi-label">{label}</div>
      <div className="pv-kpi-value">
        <span className="num">{fmtPV(value)}</span>
        <span className="pv-kpi-meta num">/ {fmtPV(meta)}</span>
      </div>
      <div className="op-bar" style={{ marginTop: 10 }}>
        <div className="op-fill" style={{
          width: `${Math.min(pct, 100)}%`,
          background: atingido ? 'var(--success)' : cor,
        }} />
      </div>
      <div className="op-foot" style={{ marginTop: 8 }}>
        <span className="op-pct num" style={{ color: atingido ? 'var(--success)' : 'var(--n-800)' }}>
          {pct.toFixed(1)}%
        </span>
        <span className="op-rest">
          {atingido ? 'meta atingida' : <>faltam <span className="num">{fmtPV(falta)}</span></>}
        </span>
      </div>
    </div>
  );
}

// ── Funil dinâmico (SVG trapezoides verticais) ───
function FunnelDynamic({ canal }) {
  const stages = canal.etapas;
  const topo = stages[0].v;
  const W = 560, padTop = 8;
  const rowH = 48;
  const H = padTop * 2 + rowH * stages.length;
  const topW = 480, minW = 80;

  const drops = stages.slice(0, -1).map((s, i) => ({
    i, pct: (stages[i + 1].v / s.v) * 100, drop: 100 - (stages[i + 1].v / s.v) * 100,
  }));
  const worstIdx = drops.reduce((a, b) => b.drop > a.drop ? b : a, drops[0]).i;

  return (
    <div className="fnl-wrap">
      <svg className="fnl-svg" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="fnlGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor={canal.corAcc} />
            <stop offset="100%" stopColor={canal.cor} />
          </linearGradient>
          <linearGradient id="fnlGradWarn" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>
        </defs>
        {stages.map((s, i) => {
          const ratioTop = i === 0 ? 1 : stages[i - 1].v / topo;
          const ratioBot = s.v / topo;
          const vis = v => Math.max(minW / topW, Math.sqrt(v));
          const wTop = topW * vis(ratioTop);
          const wBot = topW * vis(ratioBot);
          const y = padTop + i * rowH;
          const cx = W / 2;
          const yBot = y + rowH - 2;
          const convNext = i < stages.length - 1 ? (stages[i + 1].v / s.v) * 100 : null;
          const convTopo = (s.v / topo) * 100;
          const isWorst = i === worstIdx;
          const baseOpacity = 0.96 - i * 0.04;

          return (
            <g key={s.id}>
              <polygon
                points={`${cx - wTop/2},${y} ${cx + wTop/2},${y} ${cx + wBot/2},${yBot} ${cx - wBot/2},${yBot}`}
                fill={isWorst ? 'url(#fnlGradWarn)' : 'url(#fnlGrad)'}
                opacity={baseOpacity}
              />
              <text x={cx} y={y + rowH/2 - 4} textAnchor="middle" className="fnl-stg-name" fill="#fff">
                {s.nome}
              </text>
              <text x={cx} y={y + rowH/2 + 13} textAnchor="middle" className="fnl-stg-val" fill="#fff">
                {fmtPV(s.v)}
              </text>

              {convNext !== null && (
                <g>
                  <line x1={cx + wBot/2 + 6} y1={yBot} x2={W - 6} y2={yBot}
                    stroke="var(--n-200)" strokeDasharray="2 3" />
                  <text x={W - 6} y={yBot - 6} textAnchor="end"
                    className={`fnl-conv ${isWorst ? 'warn' : ''}`}>
                    {convNext.toFixed(1)}%
                  </text>
                </g>
              )}

              <text x={6} y={y + rowH/2 + 4} textAnchor="start" className="fnl-acum">
                {convTopo.toFixed(1)}%
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// ── Bloco analítico lateral ──────────────────────
function CanalAnalytics({ canal }) {
  const s = canal.etapas;
  const topo = s[0].v;
  const fim  = s[s.length - 1].v;
  const convAcum = (fim / topo) * 100;

  // gargalo
  const drops = s.slice(0, -1).map((e, i) => ({
    from: e, to: s[i + 1], pct: (s[i + 1].v / e.v) * 100, drop: 100 - (s[i + 1].v / e.v) * 100,
  }));
  const worst = drops.reduce((a, b) => b.drop > a.drop ? b : a, drops[0]);

  // etapa com melhor avanço
  const best = drops.reduce((a, b) => b.pct > a.pct ? b : a, drops[0]);

  return (
    <aside className="fnl-aside">
      <div className="fnl-aside-head">
        <div className="eyebrow">Análise do canal</div>
        <h4>Conversão & gargalos</h4>
      </div>

      <div className="fnl-summary">
        <div className="fnl-sum-cell">
          <div className="lbl">Topo do funil</div>
          <div className="val num">{fmtPV(topo)}</div>
        </div>
        <div className="fnl-sum-cell">
          <div className="lbl">Fechamentos</div>
          <div className="val num" style={{ color: canal.cor }}>{fmtPV(fim)}</div>
        </div>
        <div className="fnl-sum-cell">
          <div className="lbl">Conv. acumulada</div>
          <div className="val num">{convAcum.toFixed(2)}%</div>
        </div>
      </div>

      <div className="fnl-highlight warn">
        <div className="hl-icon">▾</div>
        <div>
          <div className="hl-label">Maior gargalo</div>
          <div className="hl-body">
            <strong>{worst.from.nome}</strong> → <strong>{worst.to.nome}</strong>
          </div>
          <div className="hl-sub">
            Avanço de apenas <span className="num">{worst.pct.toFixed(1)}%</span>
            · perda de <span className="num">{fmtPV(worst.from.v - worst.to.v)}</span>
          </div>
        </div>
      </div>

      <div className="fnl-highlight good">
        <div className="hl-icon">▴</div>
        <div>
          <div className="hl-label">Melhor avanço</div>
          <div className="hl-body">
            <strong>{best.from.nome}</strong> → <strong>{best.to.nome}</strong>
          </div>
          <div className="hl-sub">
            Avanço de <span className="num">{best.pct.toFixed(1)}%</span>
          </div>
        </div>
      </div>

      <div className="fnl-aux-block">
        <div className="fnl-aux-title">{canal.aux.titulo}</div>
        <div className="fnl-aux-grid">
          {canal.aux.blocos.map(b => (
            <div key={b.l} className="fnl-aux-cell">
              <div className="lbl">{b.l}</div>
              <div className="val num">{fmtVal(b.v, b.fmt)}</div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}

// ── Tabela de etapas detalhadas ──────────────────
function EtapasTable({ canal }) {
  const s = canal.etapas;
  const topo = s[0].v;
  return (
    <div className="card span-12 flush">
      <div style={{ padding: '22px 24px 0' }}>
        <div className="card-header" style={{ marginBottom: 0 }}>
          <div>
            <h3>Etapas detalhadas · {canal.nome}</h3>
            <div className="hint" style={{ marginTop: 2 }}>Volume, conversão e queda entre etapas</div>
          </div>
          <div className="hint">{s.length} etapas</div>
        </div>
      </div>
      <table className="tbl closers-tbl" style={{ marginTop: 14 }}>
        <thead>
          <tr>
            <th style={{ width: 48, paddingLeft: 24 }}>#</th>
            <th>Etapa</th>
            <th className="right c-op" style={{ width: 100 }}>Volume</th>
            <th className="right c-op" style={{ width: 100 }}>% topo</th>
            <th className="right c-op" style={{ width: 110 }}>Avanço ant.</th>
            <th className="right c-op" style={{ width: 100 }}>Queda</th>
            <th className="right" style={{ paddingRight: 24, width: 180 }}>Distribuição</th>
          </tr>
        </thead>
        <tbody>
          {s.map((e, i) => {
            const convTopo = (e.v / topo) * 100;
            const convAnt = i === 0 ? null : (e.v / s[i - 1].v) * 100;
            const queda = i === 0 ? 0 : s[i - 1].v - e.v;
            return (
              <tr key={e.id}>
                <td className="num" style={{ color: 'var(--n-400)', paddingLeft: 24 }}>
                  {String(i + 1).padStart(2, '0')}
                </td>
                <td style={{ fontWeight: 500, color: 'var(--n-900)' }}>{e.nome}</td>
                <td className="right c-op num">{fmtPV(e.v)}</td>
                <td className="right c-op num">{convTopo.toFixed(1)}%</td>
                <td className="right c-op num">
                  {convAnt === null ? '—' : (
                    <span style={{ color: convAnt >= 70 ? 'var(--success)' : convAnt >= 40 ? 'var(--n-800)' : '#D97706' }}>
                      {convAnt.toFixed(1)}%
                    </span>
                  )}
                </td>
                <td className="right c-op num" style={{ color: 'var(--n-500)' }}>
                  {i === 0 ? '—' : fmtPV(queda)}
                </td>
                <td className="right" style={{ paddingRight: 24 }}>
                  <div className="etp-bar">
                    <div className="etp-fill" style={{
                      width: `${convTopo}%`,
                      background: canal.cor,
                      opacity: 0.85 - i * 0.05,
                    }} />
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function AppPV() {
  const [period, setPeriod] = usePS('mes');
  const [canalId, setCanalId] = usePS('linkedin');

  const canal = FUNIS_POR_CANAL[canalId];
  const lookup = usePM(() => Object.fromEntries(canal.etapas.map(e => [e.id, e.v])), [canal]);

  return (
    <div className="dash">
      {/* ── Topbar ──────────────────────── */}
      <header className="topbar">
        <div className="topbar-inner">
          <div className="brand">
            <div className="brand-mark">D</div>
            <div className="brand-name">Dash <em>SrPamplona</em><span>.</span></div>
          </div>
          <nav className="topnav">
            <a className="item" href="Dashcomp.html">Visão geral</a>
            <a className="item active" href="Pré-vendas.html">Pré-vendas</a>
            <a className="item" href="Vendas.html">Vendas</a>
            <a className="item" href="#">Produtos</a>
            <a className="item" href="#">Relatórios</a>
          </nav>
          <div className="topbar-right">
            <button className="btn-icon" title="Notificações"><Icon name="bell" /></button>
            <button className="btn-icon" title="Configurações"><Icon name="settings" /></button>
            <div className="user">
              <div className="avatar">AM</div>
              <div className="who">
                <div className="name">Ana Martins</div>
                <div className="role">Gerente comercial</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="main">
        <div className="head">
          <div>
            <h1>Pré-vendas</h1>
            <div className="sub">Central de inteligência operacional · conversão por canal · Abril, 2026</div>
          </div>
        </div>

        <FilterBar />

        {/* ── Seletor de canal ──────────────────── */}
        <div className="canal-select">
          <div className="canal-select-lbl">Funil</div>
          <div className="canal-tabs" role="tablist">
            {Object.values(FUNIS_POR_CANAL).map(c => (
              <button
                key={c.id}
                role="tab"
                aria-selected={canalId === c.id}
                className={`canal-tab ${canalId === c.id ? 'on' : ''}`}
                onClick={() => setCanalId(c.id)}
                style={canalId === c.id ? { '--cor-acc': c.cor } : {}}
              >
                <span className="canal-dot" style={{ background: c.cor }} />
                <span className="canal-name">{c.nome}</span>
              </button>
            ))}
          </div>
          <div className="canal-desc">{canal.sub}</div>
        </div>

        {/* ── Indicadores gerais dinâmicos ─────── */}
        <div className="section-head" style={{ marginTop: 4 }}>
          <div>
            <div className="eyebrow">Indicadores · {canal.nome}</div>
            <h2 className="section-title">Principais números do canal</h2>
          </div>
          <div className="hint">{canal.kpis.length} métricas</div>
        </div>
        <div className="pv-kpi-grid stg" style={{ marginBottom: 28 }}>
          {canal.kpis.map((k, i) => {
            // valor vem das etapas OU do bloco aux por auxRef
            let value = lookup[k.id];
            if (value === undefined && k.auxRef && canal.aux) {
              const aux = canal.aux.blocos.find(b => b.l.toLowerCase().includes(k.auxRef));
              // para LinkedIn, followups fica no aux.blocos[0]
              if (k.auxRef === 'followups') value = canal.aux.blocos[0].v;
              else value = aux ? aux.v : 0;
            }
            return (
              <PVKpi
                key={k.id}
                label={k.l}
                value={value ?? 0}
                meta={k.meta}
                cor={canal.cor}
                delay={i * 40}
              />
            );
          })}
        </div>

        {/* ── Bloco principal: funil + análise ─── */}
        <div className="section-head">
          <div>
            <div className="eyebrow">Funil de {canal.nome}</div>
            <h2 className="section-title">Conversão etapa a etapa</h2>
          </div>
          <div className="hint">
            Topo · <span className="num" style={{ color: 'var(--n-900)', fontWeight: 500 }}>
              {fmtPV(canal.etapas[0].v)}
            </span>
            {' · '} Fechamento · <span className="num" style={{ color: 'var(--n-900)', fontWeight: 500 }}>
              {fmtPV(canal.etapas[canal.etapas.length - 1].v)}
            </span>
          </div>
        </div>
        <div className="card span-12 fnl-block stg" style={{ marginBottom: 28 }}>
          <div className="fnl-grid">
            <FunnelDynamic canal={canal} />
            <CanalAnalytics canal={canal} />
          </div>
        </div>

        {/* ── Tabela detalhada por etapa ──────── */}
        <div className="grid stg" style={{ marginBottom: 28 }}>
          <EtapasTable canal={canal} />
        </div>
      </main>
    </div>
  );
}

const rootPV = ReactDOM.createRoot(document.getElementById('root'));
rootPV.render(<AppPV />);
