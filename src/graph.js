import { daysInMonth } from './helper'

const GCGraph = id => {
  const element = document.createElement('div')
  element.innerHTML = 'Summary'
  element.id = id

  return element
}

const drawGCGraph = (draw, { font, currentYear, currentMonth, boxSize, boxes, limit, padding, tooltip, monthNames }) => {
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
    element.data = box.data
    element.addClass('tooltip')
    const position = { x: i + boxSize - padding / 2, y: j }
    element.mouseover(e => tooltip.show(position, element.data))
    element.mouseout(e => tooltip.hide())
  })
}

export { GCGraph, drawGCGraph }
