import SVG from 'svg.js'
import { daysInMonth } from './helper'

const gcg = {
  id: 'gcg',
  limit: 52,
  padding: 2,
  boxSize: 8
}

const GCGraph = id => {
  var element = document.createElement('div')
  element.innerHTML = 'Summary'
  element.id = id

  return element
}

const drawGCGraph = ({ id, boxSize, boxes, limit, padding }) => {
  // Canvas
  const draw = SVG(id).size('100%', '100%')

  const now = new Date()
  const currentYear = now.getFullYear()
  const currentMonth = new Date().getMonth()

  // Months
  const monthOffsetX = 0
  const monthOffsetY = 10
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const months = monthNames.map((name, i) => ({ name, days: daysInMonth(i, currentYear) }))

  const slideMonths = months.slice(currentMonth, 12).concat(months.slice(0, currentMonth))
  const boxSizePadding = boxSize + padding

  let monthIndex = 0
  let daysInMonthSum = 0
  slideMonths.map(month => {
    const monthX = Math.floor(daysInMonthSum / 7) * boxSizePadding
    let text = draw.text(slideMonths[monthIndex].name)
    text
      .font({
        family: 'Helvetica'
      })
      .move(monthOffsetX + monthX, monthOffsetY)

    // next
    monthIndex++
    daysInMonthSum += month.days
  })

  // Boxes
  const boxX = 0
  const boxY = 40
  let index = 0
  boxes.map(box => {
    // move
    const i = boxX + boxSizePadding * (index % limit)
    const j = boxY + boxSizePadding * Math.floor(index / limit)

    // shape
    draw.rect(boxSize, boxSize).move(i, j).fill(box.color)

    // next
    index++
  })
}

document.body.appendChild(GCGraph(gcg.id))
const MAX_DAY = 364
let boxes = new Array(MAX_DAY)
for (let i = 0; i < MAX_DAY; i++) {
  boxes.push({
    color: ['red', 'green', 'blue'][Math.floor(Math.random() * 3)]
  })
}

drawGCGraph(
  Object.assign(gcg, {
    boxes
  })
)
