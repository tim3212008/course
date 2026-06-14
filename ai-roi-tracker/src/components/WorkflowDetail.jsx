import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Cell,
  ResponsiveContainer,
  LabelList,
} from 'recharts'
import {
  analyze,
  money,
  moneySigned,
  hours,
  breakEvenSentence,
  VERDICTS,
} from '../lib/calc'
import VerdictBadge from './VerdictBadge'

// The numbers explained in plain English + a simple value-vs-cost bar.
export default function WorkflowDetail({ workflow, onBack, onEdit, onDelete }) {
  const { metrics, verdict } = analyze(workflow)
  const v = VERDICTS[verdict.key]

  const barData = [
    { label: 'Value it creates', amount: Math.round(metrics.monthlyValue), fill: '#16a34a' },
    { label: 'What you spend', amount: Math.round(metrics.aiCost), fill: '#dc2626' },
  ]

  return (
    <div>
      <button className="breadcrumb" onClick={onBack}>
        ← Back to dashboard
      </button>

      <div className="detail-head">
        <div>
          <h1 style={{ fontSize: 26, margin: '0 0 8px', letterSpacing: '-0.01em' }}>
            {workflow.name}
          </h1>
          {workflow.description && (
            <p className="muted" style={{ margin: 0, maxWidth: 520 }}>
              {workflow.description}
            </p>
          )}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn sm" onClick={() => onEdit(workflow.id)}>
            Edit
          </button>
          <button className="btn sm danger" onClick={() => onDelete(workflow.id)}>
            Delete
          </button>
        </div>
      </div>

      <div className="detail-grid">
        <div className="card explain">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <VerdictBadge verdictKey={verdict.key} size="lg" />
            <span className="muted">{v.tagline}</span>
          </div>

          <p className="lead">
            {metrics.monthlyNet >= 0
              ? `This is putting about ${moneySigned(metrics.monthlyNet)} a month back in your pocket.`
              : `This is costing you about ${money(Math.abs(metrics.monthlyNet))} more a month than it returns.`}
          </p>

          <p>{verdict.reason}</p>

          <p>
            Each time you do this, AI saves about{' '}
            <strong>{metrics.minutesSavedPerTask} minutes</strong>. You run it{' '}
            <strong>~{Math.round(metrics.runs)} times a month</strong>, which adds up to
            roughly <strong>{hours(metrics.hoursSavedPerMonth)}</strong> of work avoided —
            worth about <strong>{money(metrics.timeValue)}</strong> of someone's time.
            {metrics.revenue > 0 && (
              <> On top of that it brings in about <strong>{money(metrics.revenue)}</strong> of revenue a month.</>
            )}
          </p>

          <p style={{ color: v.color, fontWeight: 600 }}>{breakEvenSentence(metrics)}</p>

          <ul className="metric-list">
            <li>
              <span className="k">Time saved per task</span>
              <span className="v">{metrics.minutesSavedPerTask} min</span>
            </li>
            <li>
              <span className="k">Times run per month</span>
              <span className="v">~{Math.round(metrics.runs)}</span>
            </li>
            <li>
              <span className="k">Hours saved per month</span>
              <span className="v">{hours(metrics.hoursSavedPerMonth)}</span>
            </li>
            <li>
              <span className="k">Value created per month</span>
              <span className="v">{money(metrics.monthlyValue)}</span>
            </li>
            <li>
              <span className="k">AI cost per month</span>
              <span className="v">{money(metrics.aiCost)}</span>
            </li>
            <li>
              <span className="k">Net per month</span>
              <span
                className="v"
                style={{ color: metrics.monthlyNet >= 0 ? 'var(--pos)' : 'var(--neg)' }}
              >
                {moneySigned(metrics.monthlyNet)}
              </span>
            </li>
            <li>
              <span className="k">Return on the AI spend</span>
              <span className="v">
                {metrics.roiPct == null ? '—' : `${Math.round(metrics.roiPct)}%`}
              </span>
            </li>
          </ul>
        </div>

        <div className="card chart-wrap" style={{ paddingBottom: 18 }}>
          <p className="section-title">Value vs. cost</p>
          <p className="muted small" style={{ marginTop: 0 }}>
            What it gives back, next to what it costs.
          </p>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={barData} margin={{ top: 24, right: 16, left: 0, bottom: 0 }}>
              <XAxis
                dataKey="label"
                tick={{ fontSize: 12, fill: '#667085' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis hide />
              <Bar dataKey="amount" radius={[8, 8, 0, 0]} maxBarSize={90}>
                {barData.map((d, i) => (
                  <Cell key={i} fill={d.fill} />
                ))}
                <LabelList
                  dataKey="amount"
                  position="top"
                  formatter={(val) => money(val)}
                  style={{ fontSize: 13, fontWeight: 700, fill: '#1a1f2b' }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
