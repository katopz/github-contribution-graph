import SVG from 'svg.js'

const gcg = {
  id: 'gcg',
  limit: 52,
  padding: 2,
  boxSize: 8
}

const GCGraph = id => {
  var element = document.createElement('div')
  element.innerHTML = 'Hi!!'
  element.id = id

  return element
}

const drawGCGraph = ({ id, boxSize, boxes, limit, padding }) => {
  // Canvas
  const draw = SVG(id).size('100%', '100%')

  // Months
  const monthX = 0
  const monthY = 10
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const currentMonth = new Date().getMonth()

  const slideMonths = months.slice(currentMonth, 12).concat(months.slice(0, currentMonth))

  let monthIndex = 0
  slideMonths.map(month => {
    let text = draw.text(slideMonths[monthIndex])
    text
      .font({
        family: 'Helvetica'
      })
      .move(monthX + monthIndex * 40, monthY)

    // next
    monthIndex++
  })

  // Boxes
  const boxX = 0
  const boxY = 40
  let index = 0
  boxes.map(box => {
    // move
    const i = boxX + (boxSize + padding) * (index % limit)
    const j = boxY + (boxSize + padding) * Math.floor(index / limit)

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

console.log(boxes)
drawGCGraph(
  Object.assign(gcg, {
    boxes
  })
)
