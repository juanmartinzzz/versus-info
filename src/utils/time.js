
/**
 * ALWAYS returns UTC time minus 5 hours.
 * @returns {Date} The current local date and time.
 */
const getCurrentUtcDateTimeMinus5Hours = () => {
  const date = new Date();
  date.setHours(date.getHours() - 5);

  return date;
}

const getDateWithoutTimeString = ({date = getCurrentUtcDateTimeMinus5Hours()} = {}) => {
  const dateWithoutTime = date.toISOString().split('T')[0];

  return dateWithoutTime;
}

const getTomorrowDateWithoutTimeString = ({date = getCurrentUtcDateTimeMinus5Hours()} = {}) => {
  const tomorrow = date;
  tomorrow.setDate(tomorrow.getDate() + 1);

  return tomorrow.toISOString().split('T')[0];
}

/**
 * Returns the month like Jan, Feb, Mar, etc. and the day of the given date in a human-readable format.
 * @param {Date} date - The date to get the month and day of.
 * @returns {string} The month and day of the given date in a human-readable format.
 */
const getHumanMonthShortAndDay = ({date = getCurrentUtcDateTimeMinus5Hours()} = {}) => {
  const month = date.toLocaleString('default', { month: 'short' });
  const day = date.getDate();
  return `${month} ${day}`;
}

const time = {
  getHumanMonthShortAndDay,
  getDateWithoutTimeString,
  getCurrentUtcDateTimeMinus5Hours,
  getTomorrowDateWithoutTimeString,
}

export default time;
