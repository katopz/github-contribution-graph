import SVG from 'svg.js'

const gcg = {
  id: 'gcg',
  limit: 3,
  padding: 2,
  boxSize: 16
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
  console.log(currentMonth)
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

  // Box
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
drawGCGraph(
  Object.assign(gcg, {
    boxes: [{ color: 'red' }, { color: 'green' }, { color: 'blue' }, { color: 'red' }, { color: 'green' }, { color: 'blue' }]
  })
)
