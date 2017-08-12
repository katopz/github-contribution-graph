import SVG from 'svg.js'

const gcg = {
  id: 'gcg',
  limit: 3,
  padding: 2
}

const GCGraph = () => {
  var element = document.createElement('div')
  element.innerHTML = 'Hi!!'
  element.id = gcg.id

  return element
}

const drawGCGraph = ({ boxSize, boxes, limit, padding }) => {
  const draw = SVG(gcg.id).size('100%', '100%')

  let index = 0

  boxes.map(box => {
    // move
    const i = boxSize * (index % limit) + padding
    const j = boxSize * Math.floor(index / limit) + padding

    // shape
    draw.rect(boxSize, boxSize).move(i, j).fill(box.color)

    // next
    index++
  })
}

document.body.appendChild(GCGraph())
drawGCGraph({
  limit: gcg.limit,
  padding: gcg.padding,
  boxSize: 16,
  boxes: [{ color: 'red' }, { color: 'green' }, { color: 'blue' }, { color: 'red' }, { color: 'green' }, { color: 'blue' }]
})
