// This is mock data for testing purpose
import { totalDaysInYear } from './helper'

const getBoxes = year => {
  const colors = ['#eeeeee', '#c6e48b', '#7bc96f', '#239a3b', '#196127']
  const getColorFromContributeTime = contributeTime => {
    const maxContributions = 20
    const total = colors.length - 1
    const time = Math.min(contributeTime, maxContributions) / maxContributions
    return colors[Math.floor(time * total)]
  }
  const contributeOrNot = (count, at) => (count === 0 ? 'No contributions' : `${count} contributions`)
  const getTooltipFromContributeTime = (i, contributeTime) => {
    const now = new Date()
    const month = now.getMonth()
    const date = now.getDate()
    const ymd = +new Date(year - 1, month, i + date)

    return `${contributeOrNot(contributeTime)} on ${new Date(ymd).toDateString()}`
  }

  const totalDays = totalDaysInYear(year)
  const boxes = []
  for (let i = 0; i <= totalDays; i++) {
    // Random activity
    const contributeTime = Math.floor(30 * Math.random())
    boxes.push({
      id: `b${i}`,
      color: getColorFromContributeTime(contributeTime),
      data: getTooltipFromContributeTime(i, contributeTime)
    })
  }

  return boxes
}

export { getBoxes }
