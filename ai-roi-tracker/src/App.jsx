import { useState, useEffect } from 'react'
import Dashboard from './components/Dashboard'
import WorkflowList from './components/WorkflowList'
import WorkflowForm from './components/WorkflowForm'
import WorkflowDetail from './components/WorkflowDetail'
import EmptyState from './components/EmptyState'
import { DEMO_WORKFLOWS, emptyWorkflow } from './lib/demoData'
import { loadWorkflows, saveWorkflows, clearWorkflows } from './lib/storage'

// Simple state-based "router" — no backend, no URLs to manage.
// view: 'dashboard' | 'list' | 'detail' | 'add' | 'edit'
export default function App() {
  const [workflows, setWorkflows] = useState(() => loadWorkflows() || [])
  const [view, setView] = useState('dashboard')
  const [activeId, setActiveId] = useState(null)

  // Persist to localStorage whenever workflows change.
  useEffect(() => {
    saveWorkflows(workflows)
  }, [workflows])

  const hasData = workflows.length > 0
  const active = workflows.find((w) => w.id === activeId)
  const editing = view === 'edit' ? active : null

  function goDashboard() {
    setView('dashboard')
    setActiveId(null)
  }

  function openDetail(id) {
    setActiveId(id)
    setView('detail')
  }

  function loadDemo() {
    setWorkflows(DEMO_WORKFLOWS)
    setView('dashboard')
  }

  function resetAll() {
    if (!confirm('Clear all workflows and start fresh?')) return
    clearWorkflows()
    setWorkflows([])
    goDashboard()
  }

  function saveWorkflow(wf) {
    setWorkflows((prev) => {
      const exists = prev.some((w) => w.id === wf.id)
      return exists ? prev.map((w) => (w.id === wf.id ? wf : w)) : [...prev, wf]
    })
    openDetail(wf.id)
  }

  function deleteWorkflow(id) {
    if (!confirm('Delete this workflow?')) return
    setWorkflows((prev) => prev.filter((w) => w.id !== id))
    goDashboard()
  }

  // Empty state takes over entirely on first run.
  if (!hasData && view !== 'add') {
    return (
      <div className="app">
        <Header view="dashboard" setView={() => {}} hasData={false} />
        <EmptyState onAdd={() => setView('add')} onLoadDemo={loadDemo} />
      </div>
    )
  }

  return (
    <div className="app">
      <Header
        view={view}
        setView={(v) => {
          setActiveId(null)
          setView(v)
        }}
        hasData={hasData}
        onReset={resetAll}
        onLoadDemo={loadDemo}
      />

      {view === 'dashboard' && (
        <Dashboard workflows={workflows} onSelect={openDetail} onAdd={() => setView('add')} />
      )}

      {view === 'list' && (
        <WorkflowList workflows={workflows} onSelect={openDetail} onAdd={() => setView('add')} />
      )}

      {view === 'detail' && active && (
        <WorkflowDetail
          workflow={active}
          onBack={goDashboard}
          onEdit={(id) => {
            setActiveId(id)
            setView('edit')
          }}
          onDelete={deleteWorkflow}
        />
      )}

      {(view === 'add' || view === 'edit') && (
        <WorkflowForm
          key={editing ? editing.id : 'new'}
          initial={editing || emptyWorkflow()}
          isEdit={!!editing}
          onSave={saveWorkflow}
          onCancel={hasData ? goDashboard : () => setView('dashboard')}
        />
      )}
    </div>
  )
}

function Header({ view, setView, hasData, onReset, onLoadDemo }) {
  const tab = view === 'list' ? 'list' : 'dashboard'
  return (
    <div className="topbar">
      <div className="brand">
        <span className="logo">✦</span>
        AI Worth It?
      </div>
      {hasData && (
        <>
          <div className="nav">
            <button
              className={tab === 'dashboard' ? 'active' : ''}
              onClick={() => setView('dashboard')}
            >
              Dashboard
            </button>
            <button
              className={tab === 'list' ? 'active' : ''}
              onClick={() => setView('list')}
            >
              Workflows
            </button>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn sm ghost" onClick={onLoadDemo} title="Replace with sample data">
              Demo data
            </button>
            <button className="btn sm ghost" onClick={onReset}>
              Reset
            </button>
          </div>
        </>
      )}
    </div>
  )
}
