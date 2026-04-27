import { useState, useEffect } from 'react'

const FILTER_STORAGE_KEY = 'dashcomp-filters-v1'

export const FILTER_DEFAULTS = {
  period: 'mes',
  dateRange: null,
  canal: 'todos',
  responsavel: 'todos',
  produto: 'todos',
  etapa: 'todas',
  status: 'todos',
  tipoReceita: 'todos',
  ticketFaixa: 'todos',
  atividade: 'todos',
}

export const OPT_PERIOD = [
  ['dia', 'Dia'], ['semana', 'Semana'], ['mes', 'Mês'],
  ['trim', 'Trimestre'], ['sem', 'Semestre'], ['ano', 'Ano'], ['custom', 'Personalizado'],
]
export const OPT_CANAL = [
  ['todos', 'Todos canais'],
  ['linkedin', 'LinkedIn'],
  ['instagram', 'Instagram'],
  ['indicacao', 'Indicação'],
  ['whatsapp', 'WhatsApp'],
  ['outros', 'Outros'],
]
export const OPT_RESP = [
  ['todos', 'Todos responsáveis'],
  ['closers', 'Equipe Closers'],
  ['sdrs', 'Equipe SDRs'],
]
export const OPT_PRODUTO = [
  ['todos', 'Todos produtos'],
  ['keepside', 'KeepSide'],
  ['aceleracao', 'Produto de Aceleração'],
  ['ativacao', 'Produto de Ativação'],
  ['entrada', 'Produto de Entrada'],
  ['boltique', 'Boltique'],
]
export const OPT_ETAPA = [
  ['todas', 'Todas etapas'],
  ['prospeccao', 'Prospecção'],
  ['qualificacao', 'Qualificação'],
  ['reuniao', 'Reunião'],
  ['proposta', 'Proposta'],
  ['fechamento', 'Fechamento'],
]
export const OPT_STATUS = [
  ['todos', 'Todos status'],
  ['em-negociacao', 'Em negociação'],
  ['ganho', 'Ganho'],
  ['perdido', 'Perdido'],
  ['cancelado', 'Cancelado'],
]
export const OPT_TIPO_RECEITA = [
  ['todos', 'Todas receitas'],
  ['bruta', 'Bruta'],
  ['liquida', 'Líquida'],
  ['parcelada', 'Parcelada'],
  ['recorrente', 'Recorrente'],
]
export const OPT_TICKET = [
  ['todos', 'Todos tickets'],
  ['baixo', 'Baixo (< R$ 10k)'],
  ['medio', 'Médio (R$ 10–50k)'],
  ['alto', 'Alto (> R$ 50k)'],
]
export const OPT_ATIVIDADE = [
  ['todos', 'Todas atividades'],
  ['ligacoes', 'Ligações'],
  ['reunioes', 'Reuniões'],
  ['indicacoes', 'Indicações'],
  ['numeros', 'Números captados'],
]

function labelOf(opts, key) {
  const f = opts.find(o => o[0] === key)
  return f ? f[1] : key
}

export function loadFilters() {
  try {
    const raw = localStorage.getItem(FILTER_STORAGE_KEY)
    if (!raw) return { ...FILTER_DEFAULTS }
    return { ...FILTER_DEFAULTS, ...JSON.parse(raw) }
  } catch {
    return { ...FILTER_DEFAULTS }
  }
}

function saveFilters(f) {
  try { localStorage.setItem(FILTER_STORAGE_KEY, JSON.stringify(f)) } catch {}
  window.dispatchEvent(new CustomEvent('filters-change', { detail: f }))
}

export function useFilters() {
  const [state, setState] = useState(() => loadFilters())
  useEffect(() => {
    const handler = (e) => setState(e.detail)
    const storageHandler = (e) => {
      if (e.key === FILTER_STORAGE_KEY) setState(loadFilters())
    }
    window.addEventListener('filters-change', handler)
    window.addEventListener('storage', storageHandler)
    return () => {
      window.removeEventListener('filters-change', handler)
      window.removeEventListener('storage', storageHandler)
    }
  }, [])
  const update = (patch) => {
    const next = { ...state, ...patch }
    saveFilters(next)
    setState(next)
  }
  const reset = () => {
    saveFilters({ ...FILTER_DEFAULTS })
    setState({ ...FILTER_DEFAULTS })
  }
  return [state, update, reset]
}

function ActiveChips({ filters, onClear, onClearAll }) {
  const active = []
  if (filters.canal !== 'todos')         active.push({ k: 'canal',        l: 'Canal',      v: labelOf(OPT_CANAL, filters.canal) })
  if (filters.responsavel !== 'todos')   active.push({ k: 'responsavel',  l: 'Resp.',      v: labelOf(OPT_RESP, filters.responsavel) })
  if (filters.produto !== 'todos')       active.push({ k: 'produto',      l: 'Produto',    v: labelOf(OPT_PRODUTO, filters.produto) })
  if (filters.etapa !== 'todas')         active.push({ k: 'etapa',        l: 'Etapa',      v: labelOf(OPT_ETAPA, filters.etapa) })
  if (filters.status !== 'todos')        active.push({ k: 'status',       l: 'Status',     v: labelOf(OPT_STATUS, filters.status) })
  if (filters.tipoReceita !== 'todos')   active.push({ k: 'tipoReceita',  l: 'Receita',    v: labelOf(OPT_TIPO_RECEITA, filters.tipoReceita) })
  if (filters.ticketFaixa !== 'todos')   active.push({ k: 'ticketFaixa', l: 'Ticket',     v: labelOf(OPT_TICKET, filters.ticketFaixa) })
  if (filters.atividade !== 'todos')     active.push({ k: 'atividade',    l: 'Atividade',  v: labelOf(OPT_ATIVIDADE, filters.atividade) })

  if (active.length === 0) return null
  return (
    <div className="fbar-active">
      <span className="fbar-active-lbl">
        {active.length} {active.length === 1 ? 'filtro ativo' : 'filtros ativos'}
      </span>
      <div className="fbar-active-chips">
        {active.map(a => (
          <button key={a.k} className="fbar-chip" onClick={() => onClear(a.k)}>
            <span className="fbar-chip-k">{a.l}:</span>
            <span className="fbar-chip-v">{a.v}</span>
            <span className="fbar-chip-x" aria-hidden>×</span>
          </button>
        ))}
      </div>
      <button className="fbar-clear-all" onClick={onClearAll}>Limpar tudo</button>
    </div>
  )
}

function PillSelect({ icon, label, value, opts, onChange, width }) {
  const [open, setOpen] = useState(false)
  const rootRef = { current: null }
  const active = value !== opts[0][0]

  useEffect(() => {
    if (!open) return
    const off = (e) => { if (!rootRef.current?.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', off)
    return () => document.removeEventListener('mousedown', off)
  }, [open])

  const current = opts.find(o => o[0] === value) || opts[0]
  return (
    <div
      className={`fbar-pill ${active ? 'is-active' : ''} ${open ? 'is-open' : ''}`}
      ref={el => { rootRef.current = el }}
      style={{ minWidth: width }}
    >
      <button className="fbar-pill-btn" onClick={() => setOpen(!open)}>
        {icon && <span className="fbar-pill-icon">{icon}</span>}
        <span className="fbar-pill-label">{label}</span>
        <span className="fbar-pill-value">{current[1]}</span>
        <svg className="fbar-pill-caret" width="10" height="6" viewBox="0 0 10 6" fill="none">
          <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <div className="fbar-pill-menu">
          {opts.map(([k, l]) => (
            <button
              key={k}
              className={`fbar-pill-opt ${k === value ? 'is-selected' : ''}`}
              onClick={() => { onChange(k); setOpen(false) }}
            >
              {l}
              {k === value && (
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2 6.5L5 9.5L10 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function PeriodSeg({ value, onChange }) {
  const items = OPT_PERIOD.filter(([k]) => k !== 'custom')
  return (
    <div className="fbar-seg" role="tablist">
      {items.map(([k, l]) => (
        <button key={k} className={value === k ? 'on' : ''} onClick={() => onChange(k)} role="tab" aria-selected={value === k}>
          {l}
        </button>
      ))}
      <button
        className={value === 'custom' ? 'on icon-only' : 'icon-only'}
        onClick={() => onChange('custom')}
        title="Período personalizado"
      >
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
          <rect x="2" y="3.5" width="12" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
          <path d="M2 6h12M5.5 2v3M10.5 2v3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  )
}

function FilterGroup({ label, opts, value, onChange }) {
  return (
    <div className="fbar-group">
      <div className="fbar-group-label">{label}</div>
      <div className="fbar-group-opts">
        {opts.map(([k, l]) => (
          <button
            key={k}
            className={`fbar-group-opt ${k === value ? 'is-selected' : ''}`}
            onClick={() => onChange(k)}
          >
            {l}
          </button>
        ))}
      </div>
    </div>
  )
}

function AdvancedDrawer({ open, onClose, filters, onUpdate }) {
  if (!open) return null
  return (
    <div className="fbar-drawer-overlay" onClick={onClose}>
      <aside className="fbar-drawer" onClick={e => e.stopPropagation()}>
        <header className="fbar-drawer-head">
          <div>
            <div className="eyebrow">Filtros avançados</div>
            <h3>Cruze os dados com precisão</h3>
          </div>
          <button className="fbar-drawer-close" onClick={onClose} aria-label="Fechar">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>
        </header>
        <div className="fbar-drawer-body">
          <FilterGroup label="Produto"           opts={OPT_PRODUTO}       value={filters.produto}      onChange={v => onUpdate({ produto: v })} />
          <FilterGroup label="Etapa do funil"    opts={OPT_ETAPA}         value={filters.etapa}        onChange={v => onUpdate({ etapa: v })} />
          <FilterGroup label="Status do negócio" opts={OPT_STATUS}        value={filters.status}       onChange={v => onUpdate({ status: v })} />
          <FilterGroup label="Tipo de receita"   opts={OPT_TIPO_RECEITA}  value={filters.tipoReceita}  onChange={v => onUpdate({ tipoReceita: v })} />
          <FilterGroup label="Faixa de ticket"   opts={OPT_TICKET}        value={filters.ticketFaixa}  onChange={v => onUpdate({ ticketFaixa: v })} />
          <FilterGroup label="Tipo de atividade" opts={OPT_ATIVIDADE}     value={filters.atividade}    onChange={v => onUpdate({ atividade: v })} />
        </div>
        <footer className="fbar-drawer-foot">
          <button className="fbar-btn-ghost" onClick={() => {
            ['produto', 'etapa', 'status', 'tipoReceita', 'ticketFaixa', 'atividade'].forEach(k => {
              onUpdate({ [k]: k === 'etapa' ? 'todas' : 'todos' })
            })
          }}>Limpar avançados</button>
          <button className="fbar-btn-primary" onClick={onClose}>Aplicar</button>
        </footer>
      </aside>
    </div>
  )
}

const FIcon = {
  calendar: <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><rect x="2" y="3.5" width="12" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.4" /><path d="M2 6.5h12M5.5 2v3M10.5 2v3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>,
  channel:  <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M8 2v12M3 5h10M3 11h10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>,
  user:     <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="5.5" r="2.5" stroke="currentColor" strokeWidth="1.4" /><path d="M3 13.5c.5-2.5 2.5-4 5-4s4.5 1.5 5 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>,
  sliders:  <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M2 4h10M2 8h7M2 12h4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /><circle cx="12" cy="4" r="1.5" fill="currentColor" /><circle cx="9" cy="8" r="1.5" fill="currentColor" /><circle cx="6" cy="12" r="1.5" fill="currentColor" /></svg>,
}

export function FilterBar({ children }) {
  const [filters, update, reset] = useFilters()
  const [advOpen, setAdvOpen] = useState(false)

  const advCount = [
    filters.produto !== 'todos',
    filters.etapa !== 'todas',
    filters.status !== 'todos',
    filters.tipoReceita !== 'todos',
    filters.ticketFaixa !== 'todos',
    filters.atividade !== 'todos',
  ].filter(Boolean).length

  const onClearKey = (k) => update({ [k]: k === 'etapa' ? 'todas' : 'todos' })

  return (
    <div className="fbar">
      <div className="fbar-main">
        <PeriodSeg value={filters.period} onChange={v => update({ period: v })} />
        <div className="fbar-div" />
        <PillSelect icon={FIcon.channel} label="Canal"  value={filters.canal}       opts={OPT_CANAL} onChange={v => update({ canal: v })}       width={170} />
        <PillSelect icon={FIcon.user}    label="Resp."  value={filters.responsavel} opts={OPT_RESP}  onChange={v => update({ responsavel: v })} width={180} />
        <div className="fbar-spacer" />
        <button
          className={`fbar-adv ${advCount > 0 ? 'has-active' : ''}`}
          onClick={() => setAdvOpen(true)}
        >
          <span className="fbar-adv-icon">{FIcon.sliders}</span>
          <span>Filtros avançados</span>
          {advCount > 0 && <span className="fbar-adv-count">{advCount}</span>}
        </button>
        {children}
      </div>
      <ActiveChips filters={filters} onClear={onClearKey} onClearAll={reset} />
      <AdvancedDrawer open={advOpen} onClose={() => setAdvOpen(false)} filters={filters} onUpdate={update} />
    </div>
  )
}
