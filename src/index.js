import SVG from 'svg.js'
import { GCGraph, drawGCGraph } from './graph'
import { CGTooltip } from './tooltip'
import { config } from './config'
import { getBoxes } from './seeder'

// Config
const { id, w, h, bubbleWidth } = config
const now = new Date()
const currentYear = now.getFullYear()
const currentMonth = now.getMonth()

// Data
const boxes = getBoxes(currentYear)

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
