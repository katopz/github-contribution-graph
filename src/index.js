import { GCGraph, drawGCGraph } from './graph'
import { GCTooltip } from './tooltip'
import { config } from './config'
import { getBoxes } from './seeder'

// Config
const { id, width } = config

// Data
const boxes = getBoxes()

// Graph
const graph = GCGraph(id)
document.body.appendChild(graph)

// Tooltip
const tooltip = GCTooltip(width)
document.body.appendChild(tooltip)

// Inject
drawGCGraph(config, boxes, tooltip)
