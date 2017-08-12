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
  const draw = SVG(id).size('100%', '100%')

  let index = 0

  boxes.map(box => {
    // move
    const i = (boxSize + padding) * (index % limit)
    const j = (boxSize + padding) * Math.floor(index / limit)

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
