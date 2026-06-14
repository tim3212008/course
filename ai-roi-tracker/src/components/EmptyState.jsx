// First-run screen: a friendly nudge plus a one-click demo.
export default function EmptyState({ onAdd, onLoadDemo }) {
  return (
    <div className="empty">
      <div className="emoji">📊</div>
      <h2>Is your AI actually worth it?</h2>
      <p>
        Add the everyday tasks where you use AI — writing, support, research — and
        we'll tell you, in plain English, which ones are paying off and which are
        quietly costing you money.
      </p>
      <div className="actions">
        <button className="btn primary" onClick={onAdd}>
          + Add your first workflow
        </button>
        <button className="btn" onClick={onLoadDemo}>
          Load demo data
        </button>
      </div>
      <p className="muted small" style={{ marginTop: 22 }}>
        No account, no setup. Everything stays in your browser.
      </p>
    </div>
  )
}
