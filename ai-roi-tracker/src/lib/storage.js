// Tiny localStorage wrapper. The whole app is client-side; this is the only
// persistence. Fails quietly (e.g. private mode) so the app still runs.

const KEY = 'ai-roi-tracker:workflows:v1'

export function loadWorkflows() {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function saveWorkflows(workflows) {
  try {
    localStorage.setItem(KEY, JSON.stringify(workflows))
  } catch {
    /* ignore — app keeps working from in-memory state */
  }
}

export function clearWorkflows() {
  try {
    localStorage.removeItem(KEY)
  } catch {
    /* ignore */
  }
}
