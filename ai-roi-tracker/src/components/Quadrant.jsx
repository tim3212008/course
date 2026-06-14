import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ReferenceArea,
  ResponsiveContainer,
  LabelList,
} from 'recharts'
import { VERDICTS, COST_HIGH, VALUE_HIGH, money } from '../lib/calc'

// The hero visual: every workflow plotted by monthly AI cost (x) against the
// monthly value it returns (y), colored by its verdict.
export default function Quadrant({ analyzed, onSelect }) {
  const data = analyzed.map((wf) => ({
    x: Math.max(wf.metrics.aiCost, 0),
    y: Math.max(wf.metrics.monthlyValue, 0),
    name: wf.name,
    id: wf.id,
    verdict: wf.verdict.key,
    color: VERDICTS[wf.verdict.key].color,
    net: wf.metrics.monthlyNet,
  }))

  const maxX = Math.max(COST_HIGH * 2, ...data.map((d) => d.x)) * 1.15 + 10
  const maxY = Math.max(VALUE_HIGH * 1.5, ...data.map((d) => d.y)) * 1.15 + 50

  return (
    <div className="card chart-wrap">
      <div className="chart-head">
        <div>
          <p className="section-title">Where your workflows land</p>
          <p className="muted small" style={{ margin: 0 }}>
            Up = more value. Right = more cost. Top-left is the sweet spot.
          </p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={380}>
        <ScatterChart margin={{ top: 16, right: 24, bottom: 36, left: 12 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#eef0f3" />

          {/* faint shading so the "good" corner reads instantly */}
          <ReferenceArea
            x1={0}
            x2={COST_HIGH}
            y1={VALUE_HIGH}
            y2={maxY}
            fill="#16a34a"
            fillOpacity={0.05}
          />
          <ReferenceArea
            x1={COST_HIGH}
            x2={maxX}
            y1={0}
            y2={VALUE_HIGH}
            fill="#dc2626"
            fillOpacity={0.05}
          />

          <ReferenceLine x={COST_HIGH} stroke="#cbd2da" strokeDasharray="4 4" />
          <ReferenceLine y={VALUE_HIGH} stroke="#cbd2da" strokeDasharray="4 4" />

          <XAxis
            type="number"
            dataKey="x"
            name="AI cost"
            domain={[0, maxX]}
            tickFormatter={(v) => `$${v}`}
            tick={{ fontSize: 12, fill: '#667085' }}
            label={{
              value: 'Monthly AI cost  →',
              position: 'bottom',
              offset: 14,
              fontSize: 12,
              fill: '#667085',
            }}
          />
          <YAxis
            type="number"
            dataKey="y"
            name="Value"
            domain={[0, maxY]}
            tickFormatter={(v) => `$${v}`}
            tick={{ fontSize: 12, fill: '#667085' }}
            label={{
              value: 'Monthly value  →',
              angle: -90,
              position: 'insideLeft',
              offset: 10,
              fontSize: 12,
              fill: '#667085',
            }}
          />
          <ZAxis range={[180, 180]} />
          <Tooltip cursor={{ strokeDasharray: '3 3' }} content={<QuadrantTip />} />

          <Scatter
            data={data}
            onClick={(p) => p && onSelect?.(p.id)}
            shape={(props) => <Dot {...props} />}
          >
            <LabelList
              dataKey="name"
              position="top"
              style={{ fontSize: 11, fill: '#475467', fontWeight: 600 }}
            />
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>

      <div className="legend">
        {Object.values(VERDICTS).map((v) => (
          <span className="item" key={v.label}>
            <span className="dot" style={{ background: v.color }} />
            {v.label}
          </span>
        ))}
      </div>
    </div>
  )
}

function Dot({ cx, cy, payload }) {
  if (cx == null || cy == null) return null
  return (
    <circle
      cx={cx}
      cy={cy}
      r={9}
      fill={payload.color}
      stroke="#fff"
      strokeWidth={2}
      style={{ cursor: 'pointer' }}
    />
  )
}

function QuadrantTip({ active, payload }) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <div className="chart-tip">
      <p className="t-name">{d.name}</p>
      <div className="t-row">
        <span>Value</span>
        <span>{money(d.y)}/mo</span>
      </div>
      <div className="t-row">
        <span>AI cost</span>
        <span>{money(d.x)}/mo</span>
      </div>
      <div className="t-row" style={{ color: d.net >= 0 ? '#16a34a' : '#dc2626' }}>
        <span>Net</span>
        <span>{money(d.net)}/mo</span>
      </div>
      <p className="muted small" style={{ margin: '6px 0 0' }}>
        {VERDICTS[d.verdict].label} · click to open
      </p>
    </div>
  )
}
