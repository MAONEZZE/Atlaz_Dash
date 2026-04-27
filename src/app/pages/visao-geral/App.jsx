import { useState, useMemo } from 'react'
import { Icon } from '../../components/Charts'
import { FilterBar } from '../../components/Filters'
import { useDashboardData } from '../../hooks/useDashboardData'

function currency(n) { return 'R$ ' + n.toLocaleString('pt-BR', { maximumFractionDigits: 0 }) }
function kmoney(n) {
  if (n >= 1_000_000) return 'R$ ' + (n / 1_000_000).toFixed(2).replace('.', ',') + 'M'
  return 'R$ ' + (n / 1000).toFixed(0) + 'k'
}
function num(n) { return n.toLocaleString('pt-BR') }

function OpCard({ icon, label, value, meta, unit, accent = 'var(--b-500)', delay = 0 }) {
  const pct = meta > 0 ? (value / meta) * 100 : 0
  const falta = Math.max(meta - value, 0)
  const pctClamped = Math.min(pct, 100)
  const atingido = pct >= 100
  return (
    <div className="opcard" style={{ animationDelay: `${delay}ms` }}>
      <div className="opcard-head">
        <div className="op-ico" style={{ color: accent }}><Icon name={icon} size={16} /></div>
        <div className="op-label">{label}</div>
      </div>
      <div className="op-value">
        <span className="num">{num(value)}</span>
        {unit && <span className="op-unit">{unit}</span>}
        <span className="op-meta">/ {num(meta)}</span>
      </div>
      <div className="op-bar">
        <div className="op-fill" style={{ width: `${pctClamped}%`, background: atingido ? 'var(--success)' : accent }} />
      </div>
      <div className="op-foot">
        <span className="op-pct num" style={{ color: atingido ? 'var(--success)' : 'var(--n-800)' }}>{pct.toFixed(1)}%</span>
        <span className="op-rest">
          {atingido ? 'meta atingida' : <>faltam <span className="num">{num(falta)}</span></>}
        </span>
      </div>
    </div>
  )
}

function PeriodToggle({ value, onChange }) {
  const opts = [['dia', 'Dia'], ['semana', 'Semana'], ['mes', 'Mês']]
  return (
    <div className="ptoggle">
      {opts.map(([k, label]) => (
        <button key={k} className={value === k ? 'on' : ''} onClick={() => onChange(k)}>{label}</button>
      ))}
    </div>
  )
}

function Loading() {
  return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', color: 'var(--n-400)', fontSize: 14 }}>Carregando...</div>
}

export default function App() {
  const { data, loading, error } = useDashboardData()
  const [topPeriod, setTopPeriod]   = useState('mes')
  const [opsPeriod, setOpsPeriod]   = useState('mes')
  const [vendorFilter, setVendorFilter] = useState('todos')
  const [hallMode, setHallMode]     = useState('closer')

  if (loading) return <Loading />
  if (error || !data) return <div style={{ padding: 40, color: 'var(--danger)' }}>Erro ao carregar dados.</div>

  const {
    VENDEDORES        = [],
    RANKING_COTA      = [],
    CLOSER_OPS        = {},
    SDRS              = [],
    SDR_RANKING       = [],
    OPS_METRICS       = {},
    META_TOTAL        = 0,
    META_ATINGIDA     = 0,
    GESTAO_VISUAL     = [],
    GESTAO_ESTRATEGICA= [],
  } = data

  const vendorById = Object.fromEntries(VENDEDORES.map(v => [v.id, v]))
  const sdrById    = Object.fromEntries(SDRS.map(v => [v.id, v]))

  const ranking    = [...RANKING_COTA].sort((a, b) => b.pct - a.pct)
  const rankingTop3 = ranking.slice(0, 3)
  const sdrTop3    = [...SDR_RANKING].sort((a, b) => b.score - a.score).slice(0, 3)

  const ops = OPS_METRICS[opsPeriod] || {}
  const metaPct = META_TOTAL > 0 ? (META_ATINGIDA / META_TOTAL) * 100 : 0

  const hallData      = hallMode === 'closer' ? rankingTop3 : sdrTop3
  const hallPeople    = hallMode === 'closer' ? vendorById  : sdrById
  const hallMetric    = hallMode === 'closer' ? (r) => `${r.pct.toFixed(1)}%`    : (r) => `${r.score.toFixed(1)} pts`
  const hallSubMetric = hallMode === 'closer' ? (r) => kmoney(r.fat)             : (r) => `${r.reunioes} reuniões`

  return (
    <div className="dash">
      <header className="topbar">
        <div className="topbar-inner">
          <div className="brand">
            <div className="brand-mark">D</div>
            <div className="brand-name">Dash <em>SrPamplona</em><span>.</span></div>
          </div>
          <nav className="topnav">
            <a className="item active" href="/">Visão geral</a>
            <a className="item" href="/prevendas.html">Pré-vendas</a>
            <a className="item" href="/vendas.html">Vendas</a>
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
            <h1>Visão geral</h1>
            <div className="sub">Central de comando comercial · Abril, 2026</div>
          </div>
        </div>

        <FilterBar />

        {/* Row 1 — Hero: Meta + Vendas + Hall */}
        <div className="grid stg" style={{ marginBottom: 28 }}>
          <div className="card span-5 hero">
            <div className="eyebrow">Meta do mês · Fat. líquido</div>
            <div className="hero-value num">{currency(META_ATINGIDA)}</div>
            <div className="hero-sub">
              <span className="delta up"><Icon name="arrow_up" size={10} />12,4%</span>
              vs. mês anterior
              <span className="dot-sep" />
              <span className="num">{num(ranking.reduce((s, r) => s + (GESTAO_VISUAL.find(x => x.id === r.id)?.venda || 0) + (GESTAO_ESTRATEGICA.find(x => x.id === r.id)?.venda || 0), 0))} vendas no mês</span>
            </div>
            <div className="hero-bar">
              <div className="hero-fill" style={{ width: `${Math.min(metaPct, 100)}%` }} />
              <div className="hero-target" style={{ left: '100%' }} />
            </div>
            <div className="hero-foot">
              <div><div className="lbl">Atingido</div><div className="val num">{metaPct.toFixed(1)}%</div></div>
              <div><div className="lbl">Falta</div><div className="val num">{kmoney(META_TOTAL - META_ATINGIDA)}</div></div>
              <div><div className="lbl">Meta</div><div className="val num">{kmoney(META_TOTAL)}</div></div>
              <div><div className="lbl">Ritmo diário necessário</div><div className="val num">{kmoney((META_TOTAL - META_ATINGIDA) / 7)}</div></div>
            </div>
          </div>

          <div className="card span-3 sales-card">
            <div className="card-header">
              <h3>Quantidade de vendas</h3>
              <div className="dot-btn"><Icon name="dots" size={14} /></div>
            </div>
            <div className="sales-big num">{ops.vendas?.realizado ?? 0}</div>
            <div className="sales-sub">
              de <span className="num">{ops.vendas?.meta ?? 0}</span> vendas previstas ·&nbsp;
              <span className="num" style={{ color: 'var(--n-900)', fontWeight: 500 }}>
                {ops.vendas ? ((ops.vendas.realizado / ops.vendas.meta) * 100).toFixed(0) : 0}%
              </span>
            </div>
            <div className="op-bar" style={{ marginTop: 18 }}>
              <div className="op-fill" style={{
                width: `${ops.vendas ? Math.min((ops.vendas.realizado / ops.vendas.meta) * 100, 100) : 0}%`,
                background: 'var(--b-500)',
              }} />
            </div>
            <div className="sales-dots">
              {Array.from({ length: ops.vendas?.meta ?? 0 }).map((_, i) => (
                <span key={i} className={i < (ops.vendas?.realizado ?? 0) ? 'on' : ''} />
              ))}
            </div>
          </div>

          <div className="card span-4 hall-card">
            <div className="card-header">
              <h3>Hall dos campeões</h3>
              <div className="tiny-toggle">
                <button className={hallMode === 'closer' ? 'on' : ''} onClick={() => setHallMode('closer')}>Closer</button>
                <button className={hallMode === 'sdr'    ? 'on' : ''} onClick={() => setHallMode('sdr')}>SDR</button>
              </div>
            </div>
            <div className="hall-podium">
              {[1, 0, 2].map((idx, pos) => {
                const r = hallData[idx]
                if (!r) return <div key={pos} />
                const p = hallPeople[r.id]
                if (!p) return <div key={pos} />
                const isFirst = idx === 0
                const rankLabel = idx === 0 ? '1º' : idx === 1 ? '2º' : '3º'
                return (
                  <div key={pos} className={'hp' + (isFirst ? ' first' : '')}>
                    <div className="hp-av" style={{ background: p.cor }}>
                      {p.avatar}
                      <span className="hp-rank">{rankLabel}</span>
                    </div>
                    <div className="hp-name">{p.nome.split(' ')[0]}</div>
                    <div className="hp-metric num">{hallMetric(r)}</div>
                    <div className="hp-sub">{hallSubMetric(r)}</div>
                  </div>
                )
              })}
            </div>
            <div className="hall-footnote">
              {hallMode === 'closer' ? 'Ranking por % da cota atingida' : 'Ranking por performance de pré-vendas'}
            </div>
          </div>
        </div>

        {/* Row 2 — Operacional */}
        <div className="section-head">
          <div>
            <div className="eyebrow">Operação · Pré-vendas</div>
            <h2 className="section-title">Indicadores do funil</h2>
          </div>
          <PeriodToggle value={opsPeriod} onChange={setOpsPeriod} />
        </div>
        <div className="ops-grid stg" style={{ marginBottom: 28 }}>
          <OpCard icon="hash"  label="Leads captados"      value={ops.numeros?.realizado ?? 0}    meta={ops.numeros?.meta ?? 0}    accent="#10B981" delay={40}  />
          <OpCard icon="phone" label="Ligações agendadas"  value={ops.ligacoes?.realizado ?? 0}   meta={ops.ligacoes?.meta ?? 0}   accent="#2551D8" delay={100} />
          <OpCard icon="cal"   label="Reuniões agendadas"  value={ops.reunioes?.realizado ?? 0}   meta={ops.reunioes?.meta ?? 0}   accent="#3B6EF0" delay={160} />
          <OpCard icon="share" label="Indicações captadas" value={ops.indicacoes?.realizado ?? 0} meta={ops.indicacoes?.meta ?? 0} accent="#8B5CF6" delay={220} />
        </div>

        {/* Row 3 — Ranking Closers */}
        <div className="grid stg" style={{ marginBottom: 28 }}>
          <div className="card span-12 flush">
            <div style={{ padding: '22px 24px 0' }}>
              <div className="card-header" style={{ marginBottom: 0 }}>
                <div>
                  <h3>Ranking · Closers</h3>
                  <div className="hint" style={{ marginTop: 2 }}>Performance comercial por closer · clique para detalhes</div>
                </div>
                <div className="hint">{ranking.length} closers</div>
              </div>
            </div>
            <table className="tbl closers-tbl" style={{ marginTop: 14 }}>
              <thead>
                <tr>
                  <th style={{ width: 48, paddingLeft: 24 }}>#</th>
                  <th style={{ width: 320 }}>Closer</th>
                  <th className="right c-op">L.A</th>
                  <th className="right c-op">L.R</th>
                  <th className="right c-op">R.A</th>
                  <th className="right c-op">R.R</th>
                  <th className="right c-op">IND</th>
                  <th className="right c-op" style={{ width: 90 }}>Fat.</th>
                  <th className="right" style={{ paddingRight: 24, width: 200 }}>% atingido</th>
                </tr>
              </thead>
              <tbody>
                {ranking.map((r, i) => {
                  const v = vendorById[r.id]
                  if (!v) return null
                  const ops2 = CLOSER_OPS[r.id] || {}
                  const pctClamped = Math.min(r.pct, 150)
                  const lrPct = ops2.la > 0 ? (ops2.lr / ops2.la) * 100 : 0
                  const rrPct = ops2.ra > 0 ? (ops2.rr / ops2.ra) * 100 : 0
                  return (
                    <tr key={r.id}>
                      <td className="num" style={{ color: 'var(--n-400)', paddingLeft: 24 }}>{String(i + 1).padStart(2, '0')}</td>
                      <td>
                        <div className="chip-avatar">
                          <div className="av" style={{ background: v.cor }}>{v.avatar}</div>
                          {v.nome}
                        </div>
                      </td>
                      <td className="right c-op"><span className="la-pill num">{ops2.la}</span></td>
                      <td className="right c-op num">
                        <span className="op-stack">
                          <span>{ops2.lr}</span>
                          <span className="op-stack-sub">{lrPct.toFixed(0)}%</span>
                        </span>
                      </td>
                      <td className="right c-op num">{ops2.ra}</td>
                      <td className="right c-op num">
                        <span className="op-stack">
                          <span>{ops2.rr}</span>
                          <span className="op-stack-sub">{rrPct.toFixed(0)}%</span>
                        </span>
                      </td>
                      <td className="right c-op num" style={{ color: 'var(--n-700)' }}>{ops2.ind}</td>
                      <td className="right num" style={{ fontWeight: 500, color: 'var(--n-900)' }}>{kmoney(r.fat)}</td>
                      <td className="right" style={{ paddingRight: 24 }}>
                        <div className="heat">
                          <div className="bar">
                            <span style={{
                              width: `${(pctClamped / 150) * 100}%`,
                              background: r.pct >= 100 ? 'var(--success)' : r.pct >= 70 ? 'var(--b-500)' : r.pct >= 50 ? 'var(--warning)' : 'var(--danger)',
                            }} />
                          </div>
                          <span style={{ color: r.pct >= 100 ? 'var(--success)' : 'var(--n-700)', fontWeight: r.pct >= 100 ? 600 : 500, minWidth: 52 }}>
                            {r.pct.toFixed(1)}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Row 4 — Ranking SDRs */}
        <div className="grid stg">
          <div className="card span-12 flush">
            <div style={{ padding: '22px 24px 0' }}>
              <div className="card-header" style={{ marginBottom: 0 }}>
                <div>
                  <h3>Ranking · SDRs</h3>
                  <div className="hint" style={{ marginTop: 2 }}>Performance de prospecção por SDR · clique para detalhes</div>
                </div>
                <div className="hint">{SDR_RANKING.length} SDRs</div>
              </div>
            </div>
            <table className="tbl closers-tbl" style={{ marginTop: 14 }}>
              <thead>
                <tr>
                  <th style={{ width: 48, paddingLeft: 24 }}>#</th>
                  <th style={{ width: 260 }}>SDR</th>
                  <th className="right c-op">CON</th>
                  <th className="right c-op">ACE</th>
                  <th className="right c-op">INM</th>
                  <th className="right c-op">FUP</th>
                  <th className="right c-op">NUM</th>
                  <th className="right c-op">IND</th>
                  <th className="right c-op" style={{ width: 96 }}>L.A</th>
                  <th className="right" style={{ paddingRight: 24, width: 110 }}>Score</th>
                </tr>
              </thead>
              <tbody>
                {[...SDR_RANKING].sort((a, b) => b.ligacoes - a.ligacoes).map((r, i) => {
                  const s = sdrById[r.id]
                  if (!s) return null
                  const acePct = r.con > 0 ? (r.ace / r.con) * 100 : 0
                  return (
                    <tr key={r.id}>
                      <td className="num" style={{ color: 'var(--n-400)', paddingLeft: 24 }}>{String(i + 1).padStart(2, '0')}</td>
                      <td>
                        <div className="chip-avatar">
                          <div className="av" style={{ background: s.cor }}>{s.avatar}</div>
                          {s.nome}
                        </div>
                      </td>
                      <td className="right c-op num">{r.con}</td>
                      <td className="right c-op num">
                        <span className="op-stack">
                          <span>{r.ace}</span>
                          <span className="op-stack-sub">{acePct.toFixed(0)}%</span>
                        </span>
                      </td>
                      <td className="right c-op num">{r.inm}</td>
                      <td className="right c-op num">{r.fup}</td>
                      <td className="right c-op num">{r.numeros}</td>
                      <td className="right c-op num" style={{ color: 'var(--n-700)' }}>{r.indicacoes}</td>
                      <td className="right c-op"><span className="la-pill num">{r.ligacoes}</span></td>
                      <td className="right" style={{ paddingRight: 24 }}>
                        <span className="score-chip num">{r.score.toFixed(1)}</span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}
