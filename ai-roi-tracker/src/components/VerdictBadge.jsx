import { VERDICTS } from '../lib/calc'

export default function VerdictBadge({ verdictKey, size }) {
  const v = VERDICTS[verdictKey]
  if (!v) return null
  return (
    <span
      className="badge"
      style={{
        background: v.bg,
        color: v.color,
        fontSize: size === 'lg' ? '14px' : undefined,
        padding: size === 'lg' ? '7px 14px' : undefined,
      }}
      title={v.tagline}
    >
      <span style={{ width: 8, height: 8, borderRadius: 99, background: v.color }} />
      {v.label}
    </span>
  )
}
