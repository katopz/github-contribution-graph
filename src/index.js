import SVG from 'svg.js'
import { GCGraph, drawGCGraph } from './graph'
import { CGTooltip } from './tooltip'
import { config } from './config'

// Config
const { id, w, h, bubbleWidth } = config
const now = new Date()
const currentYear = now.getFullYear()
const currentMonth = now.getMonth()

// Data
const contributeOrNot = (count, at) => (count === 0 ? 'No contributions' : `${count} contributions`)
const MAX_DAY = 365
let boxes = []
for (let i = 0; i < MAX_DAY; i++) {
  boxes.push({
    color: ['#ecf0f1', '#2ecc71', '#f1c40f', '#f39c12', '#e67e22', '#d35400', '#e74c3c'][Math.floor(Math.random() * 7)],
    data: `${contributeOrNot(Math.floor(10 * Math.random()))} on ${new Date(currentYear, 0, i).toDateString()}`
  })
}

// Graph
const graph = GCGraph(id)
document.body.appendChild(graph)

// Tooltip
const tooltip = CGTooltip(bubbleWidth)
document.body.appendChild(tooltip)

// Inject
drawGCGraph(
  SVG(id).size(w, h),
  Object.assign(config, {
    tooltip,
    boxes,
    currentYear,
    currentMonth
  })
)
