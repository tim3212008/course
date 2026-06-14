import { analyze, moneySigned, hours } from '../lib/calc'
import VerdictBadge from './VerdictBadge'

// The card list: name, monthly net (green/red) and verdict at a glance.
export default function WorkflowList({ workflows, onSelect, onAdd }) {
  const analyzed = workflows.map(analyze)

  return (
    <div>
      <div className="list-head">
        <div>
          <h1 style={{ fontSize: 24, margin: 0, letterSpacing: '-0.01em' }}>
            Your AI workflows
          </h1>
          <p className="muted small" style={{ margin: '4px 0 0' }}>
            {analyzed.length} {analyzed.length === 1 ? 'workflow' : 'workflows'} ·
            tap one to see the full breakdown
          </p>
        </div>
        <button className="btn primary" onClick={onAdd}>
          + Add workflow
        </button>
      </div>

      <div className="cards">
        {analyzed.map((wf) => (
          <div key={wf.id} className="card wf-card" onClick={() => onSelect(wf.id)}>
            <div className="top">
              <h3 className="wf-name">{wf.name}</h3>
              <VerdictBadge verdictKey={wf.verdict.key} />
            </div>
            {wf.description && <p className="wf-desc">{wf.description}</p>}
            <div style={{ marginTop: 'auto' }}>
              <div
                className="wf-net"
                style={{ color: wf.metrics.monthlyNet >= 0 ? 'var(--pos)' : 'var(--neg)' }}
              >
                {moneySigned(wf.metrics.monthlyNet)}
                <span className="per"> /mo net</span>
              </div>
              <p className="muted small" style={{ margin: '2px 0 0' }}>
                {wf.metrics.hoursSavedPerMonth >= 0
                  ? `Saves about ${hours(wf.metrics.hoursSavedPerMonth)} a month`
                  : `Adds about ${hours(Math.abs(wf.metrics.hoursSavedPerMonth))} of work a month`}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
