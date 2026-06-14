import { useState } from 'react'
import {
  analyze,
  moneySigned,
  money,
  hours,
  breakEvenSentence,
} from '../lib/calc'
import VerdictBadge from './VerdictBadge'

// Guided add/edit form. Every keystroke updates the live ROI preview on the
// right so the value is obvious before saving.
export default function WorkflowForm({ initial, onSave, onCancel, isEdit }) {
  const [wf, setWf] = useState(initial)

  const set = (key) => (e) => {
    const value = e.target.value
    setWf((prev) => ({ ...prev, [key]: value }))
  }

  const { metrics, verdict } = analyze(wf)
  const hasInputs =
    wf.name.trim() &&
    Number(wf.frequency) > 0 &&
    (Number(wf.minutesWithout) > 0 || Number(wf.minutesWith) > 0)

  const canSave = wf.name.trim().length > 0

  return (
    <div>
      <button className="breadcrumb" onClick={onCancel}>
        ← Back
      </button>
      <h1 style={{ fontSize: 24, margin: '0 0 18px', letterSpacing: '-0.01em' }}>
        {isEdit ? 'Edit workflow' : 'Add an AI workflow'}
      </h1>

      <div className="form-layout">
        <div className="card form-card">
          <div className="field">
            <label>
              What's the task?{' '}
              <span className="hint">— the thing you use AI for</span>
            </label>
            <input
              value={wf.name}
              onChange={set('name')}
              placeholder="e.g. Drafting support replies"
              autoFocus
            />
          </div>

          <div className="field">
            <label>
              A quick description <span className="hint">— optional</span>
            </label>
            <textarea
              value={wf.description}
              onChange={set('description')}
              rows={2}
              placeholder="AI writes a first draft, a person reviews and sends."
            />
          </div>

          <div className="field">
            <label>How often do you do this?</label>
            <div className="inline-unit">
              <input
                type="number"
                min="0"
                value={wf.frequency}
                onChange={set('frequency')}
                placeholder="e.g. 20"
              />
              <select value={wf.frequencyUnit} onChange={set('frequencyUnit')}>
                <option value="week">times / week</option>
                <option value="month">times / month</option>
              </select>
            </div>
          </div>

          <div className="field-row">
            <div className="field">
              <label>
                Minutes the old way{' '}
                <span className="hint">— without AI</span>
              </label>
              <input
                type="number"
                min="0"
                value={wf.minutesWithout}
                onChange={set('minutesWithout')}
                placeholder="e.g. 12"
              />
            </div>
            <div className="field">
              <label>
                Minutes with AI{' '}
                <span className="hint">— include review time</span>
              </label>
              <input
                type="number"
                min="0"
                value={wf.minutesWith}
                onChange={set('minutesWith')}
                placeholder="e.g. 4"
              />
            </div>
          </div>

          <div className="field-row">
            <div className="field">
              <label>
                Hourly cost of the person{' '}
                <span className="hint">— pay + overhead</span>
              </label>
              <input
                type="number"
                min="0"
                value={wf.hourlyCost}
                onChange={set('hourlyCost')}
                placeholder="40"
              />
            </div>
            <div className="field">
              <label>
                Monthly AI/tool cost{' '}
                <span className="hint">— for this task</span>
              </label>
              <input
                type="number"
                min="0"
                value={wf.aiCost}
                onChange={set('aiCost')}
                placeholder="e.g. 25"
              />
            </div>
          </div>

          <div className="field-row">
            <div className="field">
              <label>
                Quality of the AI output{' '}
                <span className="hint">— optional, 1–5</span>
              </label>
              <select value={wf.quality} onChange={set('quality')}>
                <option value="1">1 — needs lots of fixing</option>
                <option value="2">2 — rough</option>
                <option value="3">3 — okay</option>
                <option value="4">4 — good</option>
                <option value="5">5 — great</option>
              </select>
            </div>
            <div className="field">
              <label>
                Extra revenue it brings{' '}
                <span className="hint">— optional, per month</span>
              </label>
              <input
                type="number"
                min="0"
                value={wf.attributedRevenue}
                onChange={set('attributedRevenue')}
                placeholder="0"
              />
            </div>
          </div>

          <div className="form-actions">
            <button
              className="btn primary"
              disabled={!canSave}
              onClick={() => onSave(wf)}
              style={{ opacity: canSave ? 1 : 0.5 }}
            >
              {isEdit ? 'Save changes' : 'Save workflow'}
            </button>
            <button className="btn ghost" onClick={onCancel}>
              Cancel
            </button>
          </div>
        </div>

        {/* live preview */}
        <div className="card preview">
          <h3>Live preview</h3>
          {hasInputs ? (
            <>
              <p
                className="net"
                style={{ color: metrics.monthlyNet >= 0 ? 'var(--pos)' : 'var(--neg)' }}
              >
                {moneySigned(metrics.monthlyNet)}
                <span style={{ fontSize: 16, color: 'var(--muted)', fontWeight: 600 }}>
                  {' '}
                  /mo
                </span>
              </p>
              <p className="net-sub">net value, after the AI cost</p>

              <div style={{ marginBottom: 14 }}>
                <VerdictBadge verdictKey={verdict.key} size="lg" />
              </div>

              <div className="stat-rows">
                <div className="stat-row">
                  <span className="k">Time saved each time</span>
                  <span className="v">{metrics.minutesSavedPerTask} min</span>
                </div>
                <div className="stat-row">
                  <span className="k">Hours saved a month</span>
                  <span className="v">{hours(metrics.hoursSavedPerMonth)}</span>
                </div>
                <div className="stat-row">
                  <span className="k">Value created</span>
                  <span className="v">{money(metrics.monthlyValue)}/mo</span>
                </div>
                <div className="stat-row">
                  <span className="k">AI cost</span>
                  <span className="v">{money(metrics.aiCost)}/mo</span>
                </div>
              </div>

              <div className="plain">{breakEvenSentence(metrics)}</div>
            </>
          ) : (
            <p className="muted small">
              Fill in how often this runs and the minutes with vs. without AI —
              your verdict will appear here instantly.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
