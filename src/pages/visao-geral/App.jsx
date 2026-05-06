import { useState, useMemo } from 'react'
import { Icon } from '../../components/Charts'
import { FilterBar } from '../../components/Filters'
import { DataState } from '../../components/DataState'
import { useDashboardData } from '../../hooks/useDashboardData'
import { useUserInfo } from '../../hooks/useUserInfo'
import { useSalesGoals } from '../../hooks/useSalesGoals'
import { useTeamGoals } from '../../hooks/useTeamGoals'

function kmoney(n) {
  if (n >= 1_000_000) return 'R$ ' + (n / 1_000_000).toFixed(2).replace('.', ',') + 'M'
  return 'R$ ' + (n / 1000).toFixed(0) + 'k'
}
function num(n) { return n.toLocaleString('pt-BR') }

function OpCard({ icon, label, value, meta, accent = 'var(--b-500)', delay = 0 }) {
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

function UserAvatar({ user, className = 'avatar' }) {
  if (user?.imageUrl) {
    return <img className={`${className} avatar-img`} src={user.imageUrl} alt={user.nome} />
  }
  const initials = user?.nome?.split(' ').map(w => w[0]).slice(0, 2).join('') || '??'
  return <div className={className} style={user?.cor ? { background: user.cor } : {}}>{initials}</div>
}

export default function App() {
  const { data, loading: dashLoading, error: dashError, refetch: dashRefetch } = useDashboardData()
  const { users, closers, sdrs }                                                = useUserInfo()
  const { goals }                                                               = useSalesGoals()
  const { teamTotals }                                                          = useTeamGoals()
  const [hallMode, setHallMode]                                                 = useState('closer')

  const loading = dashLoading
  const error   = dashError
  const refetch = dashRefetch

  const META_TOTAL = goals?.meta_total ?? 0

  const sdrTotals = teamTotals?.SDR ?? {}

  const sdrGoalTotals = useMemo(() => {
    const list = goals?.list?.filter(g => g.Cargo === 'SDR') ?? []
    return {
      numeros:    list.reduce((s, g) => s + (g.Meta_Numeros   ?? 0), 0),
      ligacoes:   list.reduce((s, g) => s + (g.Meta_Ligacoes  ?? 0), 0),
      reunioes:   list.reduce((s, g) => s + (g.Meta_Reunioes  ?? 0), 0),
      indicacoes: list.reduce((s, g) => s + (g.Meta_Indicacoes ?? 0), 0),
    }
  }, [goals])

  const nameToId = useMemo(
    () => Object.fromEntries(users.map(u => [u.nome.toLowerCase(), u.id])),
    [users]
  )

  const CLOSER_OPS = useMemo(() => {
    const map = {}
    ;(data?.rawClosers ?? []).forEach(c => {
      const id = nameToId[c.Nome?.toLowerCase()] || c.Nome?.toLowerCase()
      if (!id) return
      map[id] = {
        lr:  c['Ligações\nRealizadas']  ?? 0,
        ra:  c['Reuniões\nAgendadas']   ?? 0,
        rr:  c['Reuniões\nRealizadas']  ?? 0,
        ind: c['Indicações']            ?? 0,
      }
    })
    return map
  }, [data, nameToId])

  const SDR_RANKING = useMemo(() => {
    return (data?.rawSdrs ?? []).map(s => {
      const id  = nameToId[s.Nome?.toLowerCase()] || s.Nome?.toLowerCase()
      const con = s['Conexões\nEnviadas']   ?? 0
      const ace = s['Conexões\nAceitas']    ?? 0
      const inm = s['InMails\nEnviados']    ?? 0
      const fup = s['Follow-ups']           ?? 0
      const num = s['Números\nCaptados']    ?? 0
      const lig = s['Ligações\nAgendadas']  ?? 0
      const reu = s['Reuniões\nAgendadas']  ?? 0
      const ind = s['Indicações\nCaptadas'] ?? 0
      const abd = s['Abordagens']           ?? 0
      const score = lig * 3 + ind * 2 + num * 1 + ace * 0.5 + abd * 0.3
      return { id, con, ace, inm, fup, numeros: num, ligacoes: lig, reunioes: reu, indicacoes: ind, abordagens: abd, score }
    })
  }, [data, nameToId])

  const allUserById = useMemo(() => Object.fromEntries(users.map(u => [u.id, u])), [users])
  const vendorById  = useMemo(
    () => closers.length > 0
      ? Object.fromEntries(closers.map(u => [u.id, u]))
      : {},
    [closers]
  )
  const sdrById = useMemo(
    () => sdrs.length > 0
      ? Object.fromEntries(sdrs.map(u => [u.id, u]))
      : {},
    [sdrs]
  )

  const closerRanking = useMemo(() =>
    closers
      .map(u => ({ ...u, ...(CLOSER_OPS[u.id] ?? {}) }))
      .sort((a, b) => (b.rr ?? 0) - (a.rr ?? 0)),
    [closers, CLOSER_OPS]
  )

  const closerTop3 = closerRanking.slice(0, 3)
  const sdrTop3    = useMemo(() => [...SDR_RANKING].sort((a, b) => b.score - a.score).slice(0, 3), [SDR_RANKING])

  const hallData      = hallMode === 'closer' ? closerTop3 : sdrTop3
  const hallPeople    = hallMode === 'closer' ? vendorById  : sdrById
  const hallMetric    = hallMode === 'closer' ? (r) => `${r.rr ?? 0} R.R`     : (r) => `${r.score?.toFixed(1)} pts`
  const hallSubMetric = hallMode === 'closer' ? (r) => `${r.ra ?? 0} agendadas` : (r) => `${r.reunioes ?? 0} reuniões`

  const mesLabel    = new Date().toLocaleString('pt-BR', { month: 'long', year: 'numeric' })
  const currentUser = users[0] || null

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
              <UserAvatar user={currentUser} className="avatar" />
              <div className="who">
                <div className="name">{currentUser?.nome || '—'}</div>
                <div className="role">{currentUser?.cargo || ''}</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="main">
        <div className="head">
          <div>
            <h1>Visão geral</h1>
            <div className="sub">Central de comando comercial · {mesLabel}</div>
          </div>
        </div>

        <FilterBar />

        <DataState loading={loading} error={error} onRetry={refetch}>

          {/* Row 1 — Meta + Hall */}
          <div className="grid stg" style={{ marginBottom: 28 }}>
            <div className="card span-4 hero">
              <div className="eyebrow">Meta do mês · Closers</div>
              <div className="hero-value num">{kmoney(META_TOTAL)}</div>
              <div className="hero-sub">meta de faturamento mensal</div>
              <div className="hero-foot">
                <div><div className="lbl">Closers</div><div className="val num">{closers.length}</div></div>
                <div><div className="lbl">SDRs</div><div className="val num">{sdrs.length}</div></div>
              </div>
            </div>

            <div className="card span-8 hall-card">
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
                  const p = hallPeople[r.id] || allUserById[r.id]
                  if (!p) return <div key={pos} />
                  const isFirst   = idx === 0
                  const rankLabel = idx === 0 ? '1º' : idx === 1 ? '2º' : '3º'
                  return (
                    <div key={pos} className={'hp' + (isFirst ? ' first' : '')}>
                      <div className="hp-av-wrap">
                        <UserAvatar user={p} className="hp-av" />
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
                {hallMode === 'closer' ? 'Ranking por reuniões realizadas' : 'Ranking por performance de pré-vendas'}
              </div>
            </div>
          </div>

          {/* Row 2 — Operacional SDR */}
          <div className="section-head">
            <div>
              <div className="eyebrow">Operação · Pré-vendas</div>
              <h2 className="section-title">Indicadores do funil</h2>
            </div>
          </div>
          <div className="ops-grid stg" style={{ marginBottom: 28 }}>
            <OpCard icon="hash"  label="Números captados"    value={sdrTotals.numeros_captados     ?? 0} meta={sdrGoalTotals.numeros    ?? 0} accent="#10B981" delay={40}  />
            <OpCard icon="phone" label="Ligações agendadas"  value={sdrTotals.ligacoes_agendadas  ?? 0} meta={sdrGoalTotals.ligacoes   ?? 0} accent="#2551D8" delay={100} />
            <OpCard icon="users" label="Abordagens"          value={sdrTotals.abordagens          ?? 0} meta={0}                              accent="#3B6EF0" delay={160} />
            <OpCard icon="share" label="Indicações captadas" value={sdrTotals.indicacoes_captadas ?? 0} meta={sdrGoalTotals.indicacoes ?? 0} accent="#8B5CF6" delay={220} />
          </div>

          {/* Row 3 — Ranking Closers */}
          <div className="grid stg" style={{ marginBottom: 28 }}>
            <div className="card span-12 flush">
              <div style={{ padding: '22px 24px 0' }}>
                <div className="card-header" style={{ marginBottom: 0 }}>
                  <div>
                    <h3>Ranking · Closers</h3>
                    <div className="hint" style={{ marginTop: 2 }}>Performance por closer · reuniões realizadas</div>
                  </div>
                  <div className="hint">{closerRanking.length} closers</div>
                </div>
              </div>
              <table className="tbl closers-tbl" style={{ marginTop: 14 }}>
                <thead>
                  <tr>
                    <th style={{ width: 48, paddingLeft: 24 }}>#</th>
                    <th style={{ width: 320 }}>Closer</th>
                    <th className="right c-op">L.R</th>
                    <th className="right c-op">R.A</th>
                    <th className="right c-op">R.R</th>
                    <th className="right c-op" style={{ paddingRight: 24 }}>IND</th>
                  </tr>
                </thead>
                <tbody>
                  {closerRanking.map((r, i) => {
                    const v = vendorById[r.id] || allUserById[r.id]
                    if (!v) return null
                    const rrPct = (r.ra ?? 0) > 0 ? ((r.rr ?? 0) / r.ra) * 100 : 0
                    return (
                      <tr key={r.id}>
                        <td className="num" style={{ color: 'var(--n-400)', paddingLeft: 24 }}>{String(i + 1).padStart(2, '0')}</td>
                        <td>
                          <div className="chip-avatar">
                            <UserAvatar user={v} className="av" />
                            {v.nome}
                          </div>
                        </td>
                        <td className="right c-op num">{r.lr ?? 0}</td>
                        <td className="right c-op num">{r.ra ?? 0}</td>
                        <td className="right c-op num">
                          <span className="op-stack">
                            <span>{r.rr ?? 0}</span>
                            <span className="op-stack-sub">{rrPct.toFixed(0)}%</span>
                          </span>
                        </td>
                        <td className="right c-op num" style={{ color: 'var(--n-700)', paddingRight: 24 }}>{r.ind ?? 0}</td>
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
                    <div className="hint" style={{ marginTop: 2 }}>Performance de prospecção por SDR</div>
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
                    <th className="right c-op">L.A</th>
                    <th className="right c-op">R.A</th>
                    <th className="right c-op">IND</th>
                    <th className="right c-op">ABD</th>
                    <th className="right" style={{ paddingRight: 24, width: 110 }}>Score</th>
                  </tr>
                </thead>
                <tbody>
                  {[...SDR_RANKING].sort((a, b) => b.score - a.score).map((r, i) => {
                    const s = sdrById[r.id] || allUserById[r.id]
                    if (!s) return null
                    const acePct = r.con > 0 ? (r.ace / r.con) * 100 : 0
                    return (
                      <tr key={r.id}>
                        <td className="num" style={{ color: 'var(--n-400)', paddingLeft: 24 }}>{String(i + 1).padStart(2, '0')}</td>
                        <td>
                          <div className="chip-avatar">
                            <UserAvatar user={s} className="av" />
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
                        <td className="right c-op"><span className="la-pill num">{r.ligacoes}</span></td>
                        <td className="right c-op num">{r.reunioes}</td>
                        <td className="right c-op num" style={{ color: 'var(--n-700)' }}>{r.indicacoes}</td>
                        <td className="right c-op num">{r.abordagens}</td>
                        <td className="right" style={{ paddingRight: 24 }}>
                          <span className="score-chip num">{r.score?.toFixed(1)}</span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </DataState>
      </main>
    </div>
  )
}
