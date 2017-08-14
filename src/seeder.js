// This is mock data for testing purpose
import { totalDaysInYear } from './helper'

const getBoxes = year => {
  const colors = ['#eeeeee', '#c6e48b', '#7bc96f', '#239a3b', '#196127']
  const getColorFromContributeTime = contributeTime => {
    const maxContributions = 20
    const total = colors.length - 1
    const time = Math.min(contributeTime, maxContributions) / maxContributions
    console.log(contributeTime, time)
    return colors[Math.floor(time * total)]
  }
  const contributeOrNot = (count, at) => (count === 0 ? 'No contributions' : `${count} contributions`)

  const totalDays = totalDaysInYear(year)
  const boxes = []
  for (let i = 0; i <= totalDays; i++) {
    const contributeTime = Math.floor(20 * Math.random())
    boxes.push({
      id: `b${i}`,
      color: getColorFromContributeTime(contributeTime),
      data: `${contributeOrNot(contributeTime)} on ${new Date(year, 0, i).toDateString()}`
    })
  }

  return boxes
}

export { getBoxes }
