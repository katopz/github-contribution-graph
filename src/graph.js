import { daysInMonth } from './helper'
import SVG from 'svg.js'

const GCGraph = id => {
  const element = document.createElement('div')
  element.innerHTML = 'Contributions'
  element.id = id

  return element
}

const drawGCGraph = ({ id, w, h, font, year, month, boxSize, limit, padding, monthNames }, boxes, tooltip) => {
  // Canvas
  const draw = SVG(id).size(w, h)

  // Now
  const now = new Date()
  year = year || now.getFullYear()
  month = month || now.getMonth()

  // Global
  const boxSizePadding = boxSize + padding
  const monthHeight = 24
  let offsetX = 0
  let offsetY = 0

  // Days
  const dayOffsetX = offsetX
  const dayOffsetY = offsetY + monthHeight
  let dayY = boxSizePadding // Start at Sunday
  const drawDays = ['Mon', 'Wed', 'Fri']
  drawDays.map((day, index) => {
    const text = draw.text(day)
    text.font(font).move(dayOffsetX, dayOffsetY + dayY)
    dayY += boxSizePadding * 2
  })
  offsetX += 26

  // Months
  const monthOffsetX = offsetX
  const monthOffsetY = offsetY + 6
  const months = monthNames.map((name, i) => ({ name, days: daysInMonth(i, year) }))

  const slideMonths = months.slice(month, 12).concat(months.slice(0, month))

  let daysInMonthSum = 0
  slideMonths.map((month, index) => {
    const monthX = Math.floor(daysInMonthSum / 7) * boxSizePadding
    let text = draw.text(slideMonths[index].name)
    text.font(font).move(monthOffsetX + monthX, monthOffsetY)

    // next
    daysInMonthSum += month.days
  })
  offsetY += monthHeight

  // Boxes
  const boxOffsetX = offsetX
  const boxOffsetY = offsetY
  boxes.map((box, index) => {
    // Positions
    const i = boxOffsetX + boxSizePadding * Math.floor(index / limit)
    const j = boxOffsetY + boxSizePadding * (index % limit)

    // Shape
    const element = draw.rect(boxSize, boxSize).move(i, j).fill(box.color)
    element.id = box.id
    element.data = box.data

    // Tooltip
    if (!tooltip) return
    const position = { x: i + boxSize - padding / 2, y: j }
    element.mouseover(() => tooltip.show(box.id, position, element.data))
    element.click(() => tooltip.toggle(box.id, position, element.data))
    element.mouseout(() => tooltip.hide())
  })

  return draw
}

export { GCGraph, drawGCGraph }
