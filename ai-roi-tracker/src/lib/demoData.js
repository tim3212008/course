// Realistic sample workflows so the app is useful the instant it opens.
// Tuned so the portfolio tells a story: a couple of clear wins, a quiet keeper,
// and one workflow (AI meeting notes) that quietly costs more than it saves.

export const DEMO_WORKFLOWS = [
  {
    id: 'demo-support',
    name: 'Drafting support replies',
    description: 'AI writes a first draft of customer support emails; an agent reviews and sends.',
    frequency: 60,
    frequencyUnit: 'week',
    minutesWithout: 12,
    minutesWith: 4,
    hourlyCost: 38,
    aiCost: 25,
    quality: 4,
    attributedRevenue: 0,
  },
  {
    id: 'demo-product',
    name: 'Writing product descriptions',
    description: 'Generating SEO product copy for the store from a few bullet points.',
    frequency: 70,
    frequencyUnit: 'week',
    minutesWithout: 15,
    minutesWith: 6,
    hourlyCost: 40,
    aiCost: 110,
    quality: 4,
    attributedRevenue: 300,
  },
  {
    id: 'demo-research',
    name: 'Customer research summaries',
    description: 'Summarizing survey responses and reviews into a short readout.',
    frequency: 4,
    frequencyUnit: 'month',
    minutesWithout: 35,
    minutesWith: 22,
    hourlyCost: 50,
    aiCost: 12,
    quality: 3,
    attributedRevenue: 0,
  },
  {
    id: 'demo-meeting',
    name: 'AI meeting notes',
    description: 'Auto-transcribing calls — but the notes need heavy cleanup before they’re usable.',
    frequency: 20,
    frequencyUnit: 'month',
    minutesWithout: 10,
    minutesWith: 13,
    hourlyCost: 40,
    aiCost: 30,
    quality: 2,
    attributedRevenue: 0,
  },
]

// A blank workflow with sensible defaults for the Add form.
export function emptyWorkflow() {
  return {
    id: `wf-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    name: '',
    description: '',
    frequency: '',
    frequencyUnit: 'week',
    minutesWithout: '',
    minutesWith: '',
    hourlyCost: 40,
    aiCost: '',
    quality: 3,
    attributedRevenue: '',
  }
}
