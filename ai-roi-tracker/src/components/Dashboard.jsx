import Quadrant from './Quadrant'
import { analyze, moneySigned, money, hours } from '../lib/calc'

// The portfolio view: one big headline number, the two callouts that carry the
// "aha", and the quadrant.
export default function Dashboard({ workflows, onSelect, onAdd }) {
  const analyzed = workflows.map(analyze)
  const totalNet = analyzed.reduce((s, w) => s + w.metrics.monthlyNet, 0)
  const totalHours = analyzed.reduce((s, w) => s + w.metrics.hoursSavedPerMonth, 0)

  // Biggest win = highest net. Biggest leak = lowest net (only if it's a loss).
  const sorted = [...analyzed].sort((a, b) => b.metrics.monthlyNet - a.metrics.monthlyNet)
  const win = sorted[0]
  const worst = sorted[sorted.length - 1]
  const leak = worst && worst.metrics.monthlyNet < 0 ? worst : null

  const headlineSub = buildHeadlineSentence(totalNet, totalHours, leak, win)

  return (
    <div>
      <div className="headline">
        <p className="label">Net monthly impact across {analyzed.length}{' '}
          {analyzed.length === 1 ? 'workflow' : 'workflows'}
        </p>
        <p className={`big ${totalNet >= 0 ? 'pos' : 'neg'}`}>{moneySigned(totalNet)}/mo</p>
        <p className="sub">{headlineSub}</p>
      </div>

      <div className="callouts">
        <div
          className="card callout"
          style={{ cursor: win ? 'pointer' : 'default' }}
          onClick={() => win && onSelect(win.id)}
        >
          <p className="eyebrow">🏆 Biggest win</p>
          {win ? (
            <>
              <p className="name">{win.name}</p>
              <p className="amount pos">{moneySigned(win.metrics.monthlyNet)}/mo</p>
              <p className="muted small" style={{ margin: '4px 0 0' }}>
                Saving you about {hours(win.metrics.hoursSavedPerMonth)} a month.
              </p>
            </>
          ) : (
            <p className="muted">Add a workflow to see your top performer.</p>
          )}
        </div>

        <div
          className="card callout"
          style={{ cursor: leak ? 'pointer' : 'default' }}
          onClick={() => leak && onSelect(leak.id)}
        >
          <p className="eyebrow">💸 Biggest leak</p>
          {leak ? (
            <>
              <p className="name">{leak.name}</p>
              <p className="amount neg">{moneySigned(leak.metrics.monthlyNet)}/mo</p>
              <p className="muted small" style={{ margin: '4px 0 0' }}>
                This one costs more than it gives back — open it to see why.
              </p>
            </>
          ) : (
            <>
              <p className="name">None right now 🎉</p>
              <p className="muted small" style={{ margin: '4px 0 0' }}>
                Every workflow is paying for itself.
              </p>
            </>
          )}
        </div>
      </div>

      <Quadrant analyzed={analyzed} onSelect={onSelect} />

      <div style={{ textAlign: 'center', marginTop: 6 }}>
        <button className="btn primary" onClick={onAdd}>
          + Add a workflow
        </button>
      </div>
    </div>
  )
}

function buildHeadlineSentence(totalNet, totalHours, leak, win) {
  const parts = []
  if (totalNet >= 0) {
    parts.push(
      `You're netting ${moneySigned(totalNet)} a month from AI — roughly ${hours(
        totalHours,
      )} of work saved.`,
    )
  } else {
    parts.push(
      `Right now AI is costing you ${money(Math.abs(totalNet))} more a month than it's giving back.`,
    )
  }
  if (leak) {
    parts.push(`But “${leak.name}” is costing more than it saves — here's why.`)
  } else if (win) {
    parts.push(`“${win.name}” is your standout — consider doing more of it.`)
  }
  return parts.join(' ')
}
