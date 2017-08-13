// This is mock data for testing purpose
const getBoxes = currentYear => {
  const contributeOrNot = (count, at) => (count === 0 ? 'No contributions' : `${count} contributions`)
  const MAX_DAY = 365
  let boxes = []
  for (let i = 0; i < MAX_DAY; i++) {
    boxes.push({
      color: ['#ecf0f1', '#2ecc71', '#f1c40f', '#f39c12', '#e67e22', '#d35400', '#e74c3c'][Math.floor(Math.random() * 7)],
      data: `${contributeOrNot(Math.floor(10 * Math.random()))} on ${new Date(currentYear, 0, i).toDateString()}`
    })
  }

  return boxes
}

export { getBoxes }
