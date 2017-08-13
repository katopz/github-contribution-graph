import SVG from 'svg.js'
import { daysInMonth } from './helper'

const gcg = {
  id: 'gcg',
  font: {
    family: 'Helvetica',
    size: 9
  },
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

const drawGCGraph = ({ id, font, boxSize, boxes, limit, padding }) => {
  // Canvas
  const draw = SVG(id).size('100%', '100%')

  // Global
  const boxSizePadding = boxSize + padding
  let offsetX = 0
  const offsetY = 26

  // Days
  const dayOffsetX = offsetX
  const dayOffsetY = offsetY
  let dayY = boxSizePadding
  const drawDays = ['Mon', 'Wed', 'Fri']
  drawDays.map((day, index) => {
    const text = draw.text(day)
    text.font(font).move(dayOffsetX, dayOffsetY + dayY)
    dayY += boxSizePadding * 2
  })
  offsetX += 26

  const now = new Date()
  const currentYear = now.getFullYear()
  const currentMonth = now.getMonth()

  // Months
  const monthOffsetX = offsetX
  const monthOffsetY = 10
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const months = monthNames.map((name, i) => ({ name, days: daysInMonth(i, currentYear) }))

  const slideMonths = months.slice(currentMonth, 12).concat(months.slice(0, currentMonth))

  let daysInMonthSum = 0
  slideMonths.map((month, index) => {
    const monthX = Math.floor(daysInMonthSum / 7) * boxSizePadding
    let text = draw.text(slideMonths[index].name)
    text.font(font).move(monthOffsetX + monthX, monthOffsetY)

    // next
    daysInMonthSum += month.days
  })

  // Boxes
  const boxOffsetX = offsetX
  const boxOffsetY = offsetY
  boxes.map((box, index) => {
    if (index < 300) console.log(index)
    // move
    const i = boxOffsetX + boxSizePadding * (index % limit)
    const j = boxOffsetY + boxSizePadding * Math.floor(index / limit)

    // shape
    draw.rect(boxSize, boxSize).move(i, j).fill(box.color)
  })
}

document.body.appendChild(GCGraph(gcg.id))
const MAX_DAY = 364
let boxes = []
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
