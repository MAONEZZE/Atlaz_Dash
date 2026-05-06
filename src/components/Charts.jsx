import { useState } from 'react'

export function Icon({ name, size = 16 }) {
  const paths = {
    home:      'M3 12l9-8 9 8v8a2 2 0 01-2 2h-4v-6h-6v6H5a2 2 0 01-2-2z',
    chart:     'M3 3v18h18 M7 14l3-3 3 3 5-5',
    users:     'M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2 M9 11a4 4 0 100-8 4 4 0 000 8z M22 21v-2a4 4 0 00-3-3.87 M16 3.13a4 4 0 010 7.75',
    pkg:       'M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z M3.3 7L12 12l8.7-5 M12 22V12',
    settings:  'M12 15a3 3 0 100-6 3 3 0 000 6z M19.4 15a1.6 1.6 0 00.3 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.6 1.6 0 00-1.8-.3 1.6 1.6 0 00-1 1.5V21a2 2 0 01-4 0v-.1a1.6 1.6 0 00-1-1.5 1.6 1.6 0 00-1.8.3l-.1-.1a2 2 0 11-2.8-2.8l.1-.1a1.6 1.6 0 00.3-1.8 1.6 1.6 0 00-1.5-1H3a2 2 0 010-4h.1a1.6 1.6 0 001.5-1 1.6 1.6 0 00-.3-1.8l-.1-.1a2 2 0 112.8-2.8l.1.1a1.6 1.6 0 001.8.3H9a1.6 1.6 0 001-1.5V3a2 2 0 014 0v.1a1.6 1.6 0 001 1.5 1.6 1.6 0 001.8-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.6 1.6 0 00-.3 1.8V9a1.6 1.6 0 001.5 1H21a2 2 0 010 4h-.1a1.6 1.6 0 00-1.5 1z',
    bell:      'M6 8a6 6 0 0112 0c0 7 3 9 3 9H3s3-2 3-9 M13.7 21a2 2 0 01-3.4 0',
    search:    'M11 19a8 8 0 100-16 8 8 0 000 16z M21 21l-4.3-4.3',
    download:  'M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4 M7 10l5 5 5-5 M12 15V3',
    filter:    'M22 3H2l8 9.5V19l4 2v-8.5L22 3z',
    calendar:  'M19 4H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2z M16 2v4 M8 2v4 M3 10h18',
    close:     'M18 6L6 18 M6 6l12 12',
    dots:      'M12 13a1 1 0 100-2 1 1 0 000 2z M19 13a1 1 0 100-2 1 1 0 000 2z M5 13a1 1 0 100-2 1 1 0 000 2z',
    arrow_up:  'M7 11l5-5 5 5 M12 6v12',
    arrow_dn:  'M7 13l5 5 5-5 M12 18V6',
    arrow_rt:  'M5 12h14 M13 6l6 6-6 6',
    chevron_l: 'M15 18l-6-6 6-6',
    chevron_r: 'M9 18l6-6-6-6',
    trophy:    'M8 21h8 M12 17v4 M17 4h4v3a4 4 0 01-4 4 M7 4H3v3a4 4 0 004 4 M7 4h10v7a5 5 0 01-10 0V4z',
    target:    'M12 21a9 9 0 100-18 9 9 0 000 18z M12 16a4 4 0 100-8 4 4 0 000 8z M12 13a1 1 0 100-2 1 1 0 000 2z',
    sparkle:   'M12 3v3 M12 18v3 M3 12h3 M18 12h3 M5.6 5.6l2.1 2.1 M16.3 16.3l2.1 2.1 M5.6 18.4l2.1-2.1 M16.3 7.7l2.1-2.1',
    phone:     'M22 16.92v3a2 2 0 01-2.18 2 19.8 19.8 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.8 12.8 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.8 12.8 0 002.81.7A2 2 0 0122 16.92z',
    cal:       'M19 4H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2z M16 2v4 M8 2v4 M3 10h18 M8 14h2 M14 14h2 M8 18h2',
    share:     'M18 8a3 3 0 100-6 3 3 0 000 6z M6 15a3 3 0 100-6 3 3 0 000 6z M18 22a3 3 0 100-6 3 3 0 000 6z M8.6 13.5l6.8 4 M15.4 6.5l-6.8 4',
    hash:      'M4 9h16 M4 15h16 M10 3L8 21 M16 3l-2 18',
  }
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d={paths[name]} />
    </svg>
  )
}

export function Donut({ data, size = 140, onHover }) {
  const total = data.reduce((s, d) => s + (d.valor ?? d.bruto ?? 0), 0)
  const thickness = 22
  const r = size / 2
  const innerR = r - thickness
  let a0 = -Math.PI / 2
  const segs = data.map(d => {
    const v = d.valor ?? d.bruto ?? 0
    const frac = total > 0 ? v / total : 0
    const a1 = a0 + frac * Math.PI * 2
    const large = frac > 0.5 ? 1 : 0
    const x0 = r + r * Math.cos(a0), y0 = r + r * Math.sin(a0)
    const x1 = r + r * Math.cos(a1), y1 = r + r * Math.sin(a1)
    const ix0 = r + innerR * Math.cos(a1), iy0 = r + innerR * Math.sin(a1)
    const ix1 = r + innerR * Math.cos(a0), iy1 = r + innerR * Math.sin(a0)
    const d_ = `M${x0},${y0} A${r},${r} 0 ${large} 1 ${x1},${y1} L${ix0},${iy0} A${innerR},${innerR} 0 ${large} 0 ${ix1},${iy1} Z`
    const seg = { d: d_, color: d.cor, valor: v, nome: d.nome, pct: frac * 100 }
    a0 = a1
    return seg
  })
  const [hi, setHi] = useState(null)

  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} style={{ display: 'block' }}>
        {segs.map((s, i) => (
          <path
            key={i}
            d={s.d}
            fill={s.color}
            opacity={hi === null || hi === i ? 1 : 0.35}
            style={{ transition: 'opacity 160ms ease', cursor: 'pointer' }}
            onMouseEnter={e => { setHi(i); onHover?.(s, e) }}
            onMouseLeave={() => { setHi(null); onHover?.(null) }}
          />
        ))}
      </svg>
      <div style={{
        position: 'absolute', inset: 0,
        display: 'grid', placeItems: 'center',
        pointerEvents: 'none',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 18, fontWeight: 600, color: 'var(--n-900)', letterSpacing: '-0.02em' }}>
            R$ {(total / 1000).toFixed(0)}k
          </div>
          <div style={{ fontSize: 10, color: 'var(--n-400)', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: 2 }}>
            total
          </div>
        </div>
      </div>
    </div>
  )
}

export function ProjectionChart({ data, w = 640, h = 220 }) {
  const pad = { t: 14, r: 12, b: 24, l: 40 }
  const iw = w - pad.l - pad.r
  const ih = h - pad.t - pad.b
  const maxY = Math.max(...data.map(d => Math.max(d.meta, d.fat))) * 1.08
  const xFor = i => pad.l + (i / (data.length - 1)) * iw
  const yFor = v => pad.t + ih - (v / maxY) * ih
  const barW = iw / data.length * 0.55

  const fatLine  = data.map((d, i) => `${i === 0 ? 'M' : 'L'}${xFor(i)},${yFor(d.fat)}`).join(' ')
  const metaLine = data.map((d, i) => `${i === 0 ? 'M' : 'L'}${xFor(i)},${yFor(d.meta)}`).join(' ')

  const grid = [0, 0.25, 0.5, 0.75, 1].map(f => ({ y: pad.t + ih - f * ih, v: maxY * f }))

  const [hi, setHi] = useState(null)

  return (
    <div style={{ position: 'relative' }}>
      <svg viewBox={`0 0 ${w} ${h}`} style={{ width: '100%', height: 'auto', display: 'block' }}>
        {grid.map((g, i) => (
          <g key={i}>
            <line x1={pad.l} y1={g.y} x2={w - pad.r} y2={g.y} stroke="var(--n-100)" strokeWidth="1" />
            <text x={pad.l - 8} y={g.y + 3} textAnchor="end" fontSize="10" fill="var(--n-400)" fontFamily="var(--font-mono)">
              {g.v >= 1000000 ? (g.v / 1000000).toFixed(1) + 'M' : (g.v / 1000).toFixed(0) + 'k'}
            </text>
          </g>
        ))}
        {data.map((d, i) => (
          <rect
            key={i}
            x={xFor(i) - barW / 2}
            y={yFor(d.meta)}
            width={barW}
            height={ih - (yFor(d.meta) - pad.t)}
            fill="var(--b-100)"
            opacity={hi === null || hi === i ? 1 : 0.5}
            style={{ transition: 'opacity 150ms ease' }}
          />
        ))}
        <path d={fatLine}  stroke="var(--b-600)" strokeWidth="2" fill="none" strokeLinejoin="round" strokeLinecap="round" />
        <path d={metaLine} stroke="var(--n-400)" strokeWidth="1" fill="none" strokeDasharray="3 3" />
        {data.map((d, i) => (
          <g key={i}>
            <circle
              cx={xFor(i)} cy={yFor(d.fat)}
              r={hi === i ? 4 : 2.5}
              fill="var(--n-0)"
              stroke="var(--b-600)"
              strokeWidth="1.75"
              style={{ transition: 'r 120ms ease' }}
            />
            <rect
              x={xFor(i) - barW / 2} y={pad.t}
              width={barW} height={ih}
              fill="transparent"
              onMouseEnter={() => setHi(i)}
              onMouseLeave={() => setHi(null)}
              style={{ cursor: 'crosshair' }}
            />
          </g>
        ))}
        {data.map((d, i) => i % 3 === 0 && (
          <text key={i} x={xFor(i)} y={h - 8} textAnchor="middle" fontSize="10" fill="var(--n-400)" fontFamily="var(--font-mono)">
            {String(d.dia).padStart(2, '0')}
          </text>
        ))}
        {hi !== null && (
          <line x1={xFor(hi)} y1={pad.t} x2={xFor(hi)} y2={pad.t + ih} stroke="var(--n-300)" strokeWidth="1" strokeDasharray="2 2" />
        )}
      </svg>
      {hi !== null && (
        <div style={{
          position: 'absolute',
          left: `${(xFor(hi) / w) * 100}%`,
          top: 0,
          transform: 'translate(-50%, -100%)',
          background: 'var(--n-900)',
          color: 'var(--n-0)',
          fontSize: 11,
          padding: '7px 10px',
          borderRadius: 6,
          whiteSpace: 'nowrap',
          boxShadow: '0 10px 28px rgba(14,18,24,0.22)',
          pointerEvents: 'none',
        }}>
          <div style={{ color: 'var(--n-300)', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Dia {String(data[hi].dia).padStart(2, '0')}
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', marginTop: 2 }}>
            Fat. R$ {(data[hi].fat / 1000).toFixed(0)}k
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', color: 'var(--n-400)', fontSize: 10 }}>
            Meta R$ {(data[hi].meta / 1000).toFixed(0)}k
          </div>
        </div>
      )}
    </div>
  )
}
