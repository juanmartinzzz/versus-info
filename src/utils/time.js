const getDateWithoutTimeString = ({date = new Date()} = {}) => {
  return date.toISOString().split('T')[0];
}

const getTomorrowDateWithoutTimeString = () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().split('T')[0];
}

/**
 * Returns the month like Jan, Feb, Mar, etc. and the day of the given date in a human-readable format.
 * @param {Date} date - The date to get the month and day of.
 * @returns {string} The month and day of the given date in a human-readable format.
 */
const getHumanMonthShortAndDay = (date = new Date()) => {
  const month = date.toLocaleString('default', { month: 'short' });
  const day = date.getDate();
  return `${month} ${day}`;
}

const time = {
  getHumanMonthShortAndDay,
  getDateWithoutTimeString,
  getTomorrowDateWithoutTimeString,
}

export default time;
