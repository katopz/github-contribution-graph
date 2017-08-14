const daysInMonth = (month, year) => new Date(year, month, 0).getDate()
const isLeapYear = year => (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0
const totalDaysInYear = year => (isLeapYear(year) ? 366 : 365)

export { daysInMonth, isLeapYear, totalDaysInYear }
