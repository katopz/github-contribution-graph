import SVG from 'svg.js'
import { GCGraph, drawGCGraph } from './graph'
import { CGTooltip } from './tooltip'

const gcg = {
  id: 'gcg',
  font: {
    family: 'Helvetica',
    size: 9
  },
  limit: 7,
  padding: 2,
  boxSize: 10
}

const graph = GCGraph(gcg.id)
document.body.appendChild(graph)

// Data
const MAX_DAY = 365
let boxes = []
for (let i = 0; i < MAX_DAY; i++) {
  boxes.push({
    color: ['#2ecc71', '#f1c40f', '#f39c12', '#e67e22', '#d35400', '#e74c3c'][Math.floor(Math.random() * 6)]
  })
}

// Tool tip
const tooltip = CGTooltip()
document.body.appendChild(tooltip)

const now = new Date()
drawGCGraph(
  Object.assign(gcg, {
    draw: SVG(gcg.id).size('100%', '100%'),
    tooltip,
    boxes,
    currentYear: now.getFullYear(),
    currentMonth: now.getMonth()
  })
)
