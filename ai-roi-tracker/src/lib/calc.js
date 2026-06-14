// ---------------------------------------------------------------------------
// The math behind every verdict. Kept in one place, in plain terms.
// ---------------------------------------------------------------------------

const WEEKS_PER_MONTH = 4.33

// Thresholds that split the value-vs-cost quadrant. Picked to be sensible for
// a small business: a tool costing $50+/mo is a "real" line item, and a
// workflow returning $300+/mo of value is a "big" win.
export const COST_HIGH = 50
export const VALUE_HIGH = 300

// Turn whatever cadence the user picked into runs per month.
export function runsPerMonth(wf) {
  const n = Number(wf.frequency) || 0
  return wf.frequencyUnit === 'week' ? n * WEEKS_PER_MONTH : n
}

// The full picture for one workflow: every number a screen might want.
export function computeMetrics(wf) {
  const runs = runsPerMonth(wf)
  const minutesWithout = Number(wf.minutesWithout) || 0
  const minutesWith = Number(wf.minutesWith) || 0
  const hourlyCost = Number(wf.hourlyCost) || 0
  const aiCost = Number(wf.aiCost) || 0
  const revenue = Number(wf.attributedRevenue) || 0

  const minutesSavedPerTask = minutesWithout - minutesWith
  const hoursSavedPerMonth = (minutesSavedPerTask * runs) / 60
  const timeValue = hoursSavedPerMonth * hourlyCost
  const monthlyValue = timeValue + revenue
  const monthlyNet = monthlyValue - aiCost
  // ROI as a ratio of net return to spend. Undefined when nothing is spent.
  const roiPct = aiCost > 0 ? (monthlyNet / aiCost) * 100 : null

  // Break-even: how many runs a month before the AI cost is covered.
  const valuePerRun = runs > 0 ? monthlyValue / runs : 0
  const breakEvenRuns = valuePerRun > 0 ? aiCost / valuePerRun : null

  return {
    runs,
    minutesSavedPerTask,
    hoursSavedPerMonth,
    timeValue,
    monthlyValue,
    monthlyNet,
    roiPct,
    valuePerRun,
    breakEvenRuns,
    aiCost,
    revenue,
  }
}

// The four verdicts, with the color + meaning each carries.
export const VERDICTS = {
  Expand: {
    label: 'Expand',
    color: '#16a34a',
    bg: '#dcfce7',
    tagline: 'Clear win — do more of this.',
  },
  Optimize: {
    label: 'Optimize',
    color: '#d97706',
    bg: '#fef3c7',
    tagline: 'Worth it, but trim the cost.',
  },
  Keep: {
    label: 'Keep',
    color: '#2563eb',
    bg: '#dbeafe',
    tagline: 'Minor help — just keep an eye on it.',
  },
  Reconsider: {
    label: 'Reconsider',
    color: '#dc2626',
    bg: '#fee2e2',
    tagline: 'Costs more than it returns.',
  },
}

// Assign a verdict from the value-vs-cost quadrant. Anything losing money is
// always a "Reconsider" no matter where it lands.
export function getVerdict(metrics) {
  const { monthlyValue, aiCost, monthlyNet } = metrics

  if (monthlyNet <= 0) {
    return {
      key: 'Reconsider',
      reason: 'This is costing more than the time and revenue it brings back.',
    }
  }

  const highValue = monthlyValue >= VALUE_HIGH
  const highCost = aiCost >= COST_HIGH

  if (highValue && !highCost) {
    return {
      key: 'Expand',
      reason: 'Big payoff for a small spend — lean into this one.',
    }
  }
  if (highValue && highCost) {
    return {
      key: 'Optimize',
      reason: 'It pays off, but the AI bill is high — try a cheaper model or batch the work.',
    }
  }
  if (!highValue && !highCost) {
    return {
      key: 'Keep',
      reason: 'A modest, low-cost helper. Nothing to fix — just monitor it.',
    }
  }
  // low value, high cost, but still net-positive
  return {
    key: 'Optimize',
    reason: 'The return is thin for what you spend — worth trimming the cost.',
  }
}

// Everything a card / detail view needs in one object.
export function analyze(wf) {
  const metrics = computeMetrics(wf)
  const verdict = getVerdict(metrics)
  return { ...wf, metrics, verdict }
}

// ---- formatting helpers (plain-English friendly) --------------------------

export function money(n) {
  const v = Math.round(n)
  const sign = v < 0 ? '-' : ''
  return `${sign}$${Math.abs(v).toLocaleString()}`
}

export function moneySigned(n) {
  const v = Math.round(n)
  const sign = v > 0 ? '+' : v < 0 ? '-' : ''
  return `${sign}$${Math.abs(v).toLocaleString()}`
}

export function hours(n) {
  const v = Math.round(n * 10) / 10
  return `${v} ${v === 1 ? 'hour' : 'hours'}`
}

// "pays for itself after ~3 uses a month"
export function breakEvenSentence(metrics) {
  const { breakEvenRuns, aiCost, monthlyNet } = metrics
  if (aiCost <= 0) return 'There’s no AI cost here, so every bit of time saved is pure gain.'
  if (breakEvenRuns == null || monthlyNet <= -aiCost) {
    return 'At the moment it isn’t saving enough to cover its cost.'
  }
  const n = Math.max(1, Math.ceil(breakEvenRuns))
  return `Pays for itself after about ${n} ${n === 1 ? 'use' : 'uses'} a month.`
}
