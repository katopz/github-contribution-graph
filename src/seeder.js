// This is mock data for testing purpose
import { totalDaysInYear } from './helper'

const getBoxes = year => {
  const contributeOrNot = (count, at) => (count === 0 ? 'No contributions' : `${count} contributions`)
  const totalDays = totalDaysInYear(year)
  const boxes = []
  for (let i = 0; i <= totalDays; i++) {
    boxes.push({
      id: `b${i}`,
      color: ['#ecf0f1', '#2ecc71', '#f1c40f', '#f39c12', '#e67e22', '#d35400', '#e74c3c'][Math.floor(Math.random() * 7)],
      data: `${contributeOrNot(Math.floor(10 * Math.random()))} on ${new Date(year, 0, i).toDateString()}`
    })
  }

  return boxes
}

export { getBoxes }
