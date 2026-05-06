import { Icon, Donut } from '../../components/Charts'
import { FilterBar } from '../../components/Filters'
import { DataState } from '../../components/DataState'
import { useVendasData } from '../../hooks/useVendasData'

function fmtVBR(n, compact = false) {
  if (compact && Math.abs(n) >= 1000000) return 'R$ ' + (n / 1000000).toFixed(2).replace('.', ',') + 'M'
  if (compact && Math.abs(n) >= 1000)    return 'R$ ' + Math.round(n / 1000) + 'k'
  const sign = n < 0 ? '-' : ''
  return sign + 'R$ ' + Math.abs(n).toLocaleString('pt-BR', { maximumFractionDigits: 0 })
}
function fmtNum(n) { return n.toLocaleString('pt-BR') }
function fmtDelta(v) { return (v > 0 ? '+' : '') + v.toFixed(1).replace('.', ',') + '%' }

function TabelaFinMensal({ data }) {
  const { meses, mesAtualIdx, linhas } = data
  const fmt = (v) => {
    if (v === 0) return '0,00'
    const neg = v < 0
    const abs = Math.abs(v)
    const str = abs.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    return (neg ? '−' : '') + str
  }
  return (
    <div className="fin-tbl-wrap">
      <table className="fin-tbl">
        <thead>
          <tr>
            <th className="fin-tbl-cat">Categoria</th>
            {meses.map((m, i) => (
              <th key={m} className={`fin-tbl-mo ${i === mesAtualIdx ? 'is-atual' : ''}`}>{m}</th>
            ))}
            <th className="fin-tbl-total">Total</th>
          </tr>
        </thead>
        <tbody>
          {linhas.map((ln) => (
            <tr key={ln.id} className={`fin-tbl-row tipo-${ln.tipo}`}>
              <td className="fin-tbl-cat">{ln.nome} <span className="fin-tbl-unit">(R$)</span></td>
              {ln.valores.map((v, i) => (
                <td key={i} className={`fin-tbl-val num ${i === mesAtualIdx ? 'is-atual' : ''} ${v === 0 ? 'is-zero' : ''}`}>{fmt(v)}</td>
              ))}
              <td className="fin-tbl-val fin-tbl-total num">{fmt(ln.total)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function StatChip({ label, value, tone, icon }) {
  return (
    <div className={`stat-chip ${tone ? 'chip-' + tone : ''}`}>
      <div className="stat-chip-label">
        {icon && <span className="stat-chip-icon">{icon}</span>}
        {label}
      </div>
      <div className="stat-chip-value num">{value}</div>
    </div>
  )
}

function FinKpi({ label, value, delta, sub, tone, suffix, delay = 0 }) {
  const up      = delta > 0
  const neutral = delta === 0 || delta === undefined
  return (
    <div className={`fin-kpi ${tone ? 'tone-' + tone : ''}`} style={{ animationDelay: `${delay}ms` }}>
      <div className="fin-kpi-label">{label}</div>
      <div className="fin-kpi-value">
        <span className="num">{value}</span>
        {suffix && <span className="fin-kpi-suffix">{suffix}</span>}
      </div>
      <div className="fin-kpi-foot">
        {!neutral && (
          <span className={`fin-delta ${up ? 'up' : 'down'}`}>
            <span className="arrow">{up ? '↑' : '↓'}</span>
            <span className="num">{fmtDelta(delta).replace('-', '')}</span>
          </span>
        )}
        {sub && <span className="fin-kpi-sub">{sub}</span>}
      </div>
    </div>
  )
}

function ReceitaMensalChart({ data }) {
  const W = 1040, H = 300, padL = 56, padR = 24, padT = 20, padB = 38
  const chartW = W - padL - padR, chartH = H - padT - padB
  const max = Math.max(...data.map(d => Math.max(d.bruto, d.vendido, d.previsto, d.liquido))) * 1.05
  const n = data.length
  const colW = chartW / n
  const barW = Math.min(16, colW * 0.22)
  const y = v => padT + chartH - (v / max) * chartH
  const x = i => padL + colW * i + colW / 2
  const linePath = data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${x(i)} ${y(d.previsto)}`).join(' ')
  const ticks = 4
  const tickVals = Array.from({ length: ticks + 1 }, (_, i) => (max / ticks) * i)

  return (
    <svg className="mensal-chart" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="brutoGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3B6EF0" /><stop offset="100%" stopColor="#2551D8" />
        </linearGradient>
        <linearGradient id="liqGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0F172A" /><stop offset="100%" stopColor="#1E293B" />
        </linearGradient>
      </defs>
      {tickVals.map((v, i) => (
        <g key={i}>
          <line x1={padL} x2={W - padR} y1={y(v)} y2={y(v)} stroke="var(--n-100)" strokeWidth="1" />
          <text x={padL - 10} y={y(v) + 3} textAnchor="end" className="axis-txt">{fmtVBR(v, true)}</text>
        </g>
      ))}
      {data.map((d, i) => {
        const cx = x(i)
        const isAtual = d.atual
        return (
          <g key={i}>
            <rect x={cx - barW - 2} y={y(d.bruto)} width={barW} height={chartH - (y(d.bruto) - padT)} rx="3" fill="url(#brutoGrad)" opacity={isAtual ? 1 : 0.75} />
            <rect x={cx + 2} y={y(d.liquido)} width={barW} height={chartH - (y(d.liquido) - padT)} rx="3" fill="url(#liqGrad)" opacity={isAtual ? 1 : 0.85} />
            {isAtual && (
              <g>
                <rect x={cx - colW/2 + 4} y={padT} width={colW - 8} height={chartH} fill="#2551D8" opacity="0.04" rx="4" />
                <text x={cx} y={y(d.bruto) - 10} textAnchor="middle" className="axis-txt" fill="#2551D8" style={{ fontWeight: 600 }}>{fmtVBR(d.bruto, true)}</text>
              </g>
            )}
            <text x={cx} y={H - padB + 20} textAnchor="middle" className="axis-txt" fill={isAtual ? 'var(--n-900)' : 'var(--n-500)'} style={{ fontWeight: isAtual ? 600 : 400 }}>{d.m}</text>
          </g>
        )
      })}
      <path d={linePath} fill="none" stroke="#10B981" strokeWidth="1.75" strokeDasharray="4 4" opacity="0.85" />
      {data.map((d, i) => <circle key={i} cx={x(i)} cy={y(d.previsto)} r="2.2" fill="#10B981" />)}
    </svg>
  )
}

function DonutProdutos({ data }) {
  const total = data.reduce((s, p) => s + p.bruto, 0)
  const R = 88, r = 58, cx = 120, cy = 120
  let acc = 0
  const arcs = data.filter(p => p.bruto > 0).map((p) => {
    const start = acc / total
    acc += p.bruto
    const end = acc / total
    const a0 = start * Math.PI * 2 - Math.PI / 2
    const a1 = end   * Math.PI * 2 - Math.PI / 2
    const large = (end - start) > 0.5 ? 1 : 0
    const x0 = cx + R * Math.cos(a0), y0 = cy + R * Math.sin(a0)
    const x1 = cx + R * Math.cos(a1), y1 = cy + R * Math.sin(a1)
    const xi1 = cx + r * Math.cos(a1), yi1 = cy + r * Math.sin(a1)
    const xi0 = cx + r * Math.cos(a0), yi0 = cy + r * Math.sin(a0)
    const d = `M ${x0} ${y0} A ${R} ${R} 0 ${large} 1 ${x1} ${y1} L ${xi1} ${yi1} A ${r} ${r} 0 ${large} 0 ${xi0} ${yi0} Z`
    return { d, cor: p.cor, p }
  })
  const top = data[0]
  return (
    <div className="donut-wrap">
      <svg viewBox="0 0 240 240" width="240" height="240">
        {arcs.map((a, i) => <path key={i} d={a.d} fill={a.cor} stroke="#fff" strokeWidth="2" />)}
        <text x={cx} y={cy - 4}  textAnchor="middle" className="donut-center-lbl">LÍDER</text>
        <text x={cx} y={cy + 14} textAnchor="middle" className="donut-center-val">{top.pct.toFixed(0)}%</text>
        <text x={cx} y={cy + 30} textAnchor="middle" className="donut-center-sub">{top.nome}</text>
      </svg>
      <div className="donut-legend">
        {data.map((p, i) => (
          <div key={i} className="leg-row">
            <span className="leg-dot" style={{ background: p.cor }} />
            <span className="leg-name">{p.nome}</span>
            <span className="leg-val num">{fmtVBR(p.bruto, true)}</span>
            <span className="leg-pct num">{p.pct.toFixed(1)}%</span>
            <span className="leg-n">{p.vendas} {p.vendas === 1 ? 'venda' : 'vendas'}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function CanaisBarras({ data }) {
  const total = data.reduce((s, c) => s + c.bruto, 0)
  const max   = Math.max(...data.map(c => c.bruto))
  return (
    <div className="canais-list">
      {data.map((c) => {
        const pct = (c.bruto / total) * 100
        const w   = (c.bruto / max) * 100
        return (
          <div key={c.id} className="canal-row">
            <div className="canal-row-head">
              <div className="canal-row-name"><span className="leg-dot" style={{ background: c.cor }} />{c.nome}</div>
              <div className="canal-row-meta"><span className="num">{fmtVBR(c.bruto, true)}</span><span className="canal-pct num">{pct.toFixed(1)}%</span></div>
            </div>
            <div className="canal-row-bar"><div className="canal-row-fill" style={{ width: `${w}%`, background: c.cor }} /></div>
            <div className="canal-row-foot">
              <span>Líquido <span className="num">{fmtVBR(c.liquido, true)}</span></span>
              <span>{c.vendas} {c.vendas === 1 ? 'venda' : 'vendas'}</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}

function FinBreakdownBlock({ data }) {
  return (
    <div className="fin-brk">
      {data.map((row, i) => {
        const isResult = row.tipo === 'resultado'
        const isOut    = row.tipo === 'saida'
        return (
          <div key={i} className={`fin-brk-row ${row.tipo}`}>
            <div className="fin-brk-label">
              {isResult && <span className="fin-brk-mark" />}
              {row.item}
            </div>
            <div className={`fin-brk-val num ${isOut ? 'neg' : isResult ? 'res' : ''}`}>
              {isOut ? '− ' : isResult ? '= ' : ''}
              {fmtVBR(Math.abs(row.valor))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default function AppVendas() {
  const { data, loading, error, refetch } = useVendasData()

  const {
    FIN_RESUMO        = {},
    MESES_FIN         = [],
    PRODUTOS          = [],
    PRODUTOS_TOTAL    = {},
    RECEITA_POR_CANAL = [],
    FIN_BREAKDOWN     = [],
    TABELA_FIN_MENSAL = {},
  } = data

  return (
    <DataState loading={loading} error={error} onRetry={refetch}>
    <div className="dash">
      <header className="topbar">
        <div className="topbar-inner">
          <div className="brand">
            <div className="brand-mark">D</div>
            <div className="brand-name">Dash <em>SrPamplona</em><span>.</span></div>
          </div>
          <nav className="topnav">
            <a className="item" href="/">Visão geral</a>
            <a className="item" href="/prevendas.html">Pré-vendas</a>
            <a className="item active" href="/vendas.html">Vendas</a>
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
            <h1>Vendas</h1>
            <div className="sub">Controle de receita, caixa previsto e performance comercial · Abril, 2026</div>
          </div>
        </div>

        <FilterBar />

        <div className="section-head" style={{ marginTop: 4 }}>
          <div><div className="eyebrow">Resumo financeiro</div><h2 className="section-title">Posição do mês</h2></div>
          <div className="hint">vs mês anterior</div>
        </div>
        <div className="fin-kpi-grid" style={{ marginBottom: 32 }}>
          <FinKpi label="Receita bruta"                value={fmtVBR(FIN_RESUMO.bruto ?? 0)}                              delta={FIN_RESUMO.deltaBruto}   sub="antes de taxas & impostos" tone="hero" delay={0}   />
          <FinKpi label="Faturamento Bruto Vendido"    value={fmtVBR(FIN_RESUMO.liquido ?? 0)}                            delta={FIN_RESUMO.deltaLiquido} sub="no mês"                             delay={40}  />
          <FinKpi label="Líquido Vendido no Mês"       value={(FIN_RESUMO.margem ?? 0).toFixed(1).replace('.', ',')}      delta={FIN_RESUMO.deltaMargem}  sub="líquido / bruto" suffix="%"         delay={80}  />
          <FinKpi label="Vendas"                       value={fmtNum(FIN_RESUMO.vendas ?? 0)}                             delta={FIN_RESUMO.deltaVendas}  sub={`ticket médio ${fmtVBR((FIN_RESUMO.bruto ?? 0) / (FIN_RESUMO.vendas || 1), true)}`} delay={120} />
        </div>

        <div className="stat-chip-grid" style={{ marginBottom: 32 }}>
          <StatChip label="Taxa de plataforma"  value={fmtVBR(FIN_RESUMO.taxaPlataforma ?? 0)}      tone="neg"  />
          <StatChip label="Ticket médio bruto"  value={fmtVBR(FIN_RESUMO.ticketMedio ?? 0)}         tone="info" />
          <StatChip label="Em negociação"       value={fmtVBR(FIN_RESUMO.emNegociacaoValor ?? 0)}   tone="warn" />
          <StatChip label="Qtd. em negociação"  value={fmtNum(FIN_RESUMO.emNegociacaoQtd ?? 0)}     tone="warn" />
          <StatChip label="Comissão SDR"        value={fmtVBR(FIN_RESUMO.comissaoSDR ?? 0)}         tone="neg"  />
          <StatChip label="Comissão Closer"     value={fmtVBR(FIN_RESUMO.comissaoCloser ?? 0)}      tone="neg"  />
          <StatChip label="Total comissões"     value={fmtVBR(FIN_RESUMO.comissaoTotal ?? 0)}       tone="neg"  />
          <StatChip label="Margem op. (R$)"     value={fmtVBR(FIN_RESUMO.margemOpValor ?? 0)}       tone="pos"  />
        </div>

        {TABELA_FIN_MENSAL?.linhas && (
          <div className="card span-12 fin-tbl-card" style={{ padding: '22px 24px 20px', marginBottom: 32 }}>
            <div className="card-header" style={{ marginBottom: 14 }}>
              <div>
                <div className="eyebrow">Detalhamento mensal</div>
                <h3 style={{ marginTop: 4 }}>Caixa previsto vs faturamento</h3>
              </div>
              <div className="hint">Mai/25 → Abr/26 · contratos "ganho"</div>
            </div>
            <TabelaFinMensal data={TABELA_FIN_MENSAL} />
          </div>
        )}

        {MESES_FIN.length > 0 && (
          <>
            <div className="section-head">
              <div><div className="eyebrow">Receita mensal</div><h2 className="section-title">Evolução, previsão vs realizado</h2></div>
              <div className="fin-legend">
                <span><i className="leg-sq" style={{ background: 'linear-gradient(#3B6EF0, #2551D8)' }} /> Bruto</span>
                <span><i className="leg-sq" style={{ background: 'linear-gradient(#0F172A, #1E293B)' }} /> Líquido</span>
                <span><i className="leg-line" /> Previsto</span>
              </div>
            </div>
            <div className="card span-12" style={{ padding: '28px 32px 16px', marginBottom: 32 }}>
              <ReceitaMensalChart data={MESES_FIN} />
            </div>
          </>
        )}

        {(PRODUTOS.length > 0 || RECEITA_POR_CANAL.length > 0) && (
          <div className="grid" style={{ marginBottom: 32 }}>
            <div className="card span-6" style={{ padding: '26px 28px' }}>
              <div className="card-header" style={{ marginBottom: 18 }}>
                <div>
                  <div className="eyebrow">Mix de produtos</div>
                  <h3 style={{ marginTop: 4 }}>Receita por produto</h3>
                </div>
                <div className="hint">{PRODUTOS.length} produtos · {fmtVBR(PRODUTOS_TOTAL.bruto ?? 0, true)} bruto</div>
              </div>
              {PRODUTOS.length > 0 && <DonutProdutos data={PRODUTOS} />}
            </div>
            <div className="card span-6" style={{ padding: '26px 28px' }}>
              <div className="card-header" style={{ marginBottom: 18 }}>
                <div>
                  <div className="eyebrow">Origem da receita</div>
                  <h3 style={{ marginTop: 4 }}>Receita por canal</h3>
                </div>
                <div className="hint">{RECEITA_POR_CANAL.length} canais</div>
              </div>
              {RECEITA_POR_CANAL.length > 0 && <CanaisBarras data={RECEITA_POR_CANAL} />}
            </div>
          </div>
        )}

        {FIN_BREAKDOWN.length > 0 && (
          <>
            <div className="section-head">
              <div><div className="eyebrow">Detalhamento</div><h2 className="section-title">Do bruto ao líquido</h2></div>
              <div className="hint">Abril, 2026</div>
            </div>
            <div className="card span-12" style={{ padding: '28px 32px', marginBottom: 40 }}>
              <FinBreakdownBlock data={FIN_BREAKDOWN} />
            </div>
          </>
        )}
      </main>
    </div>
    </DataState>
  )
}
