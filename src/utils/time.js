const getDateWithoutTimeString = ({date = new Date()} = {}) => {
  return date.toISOString().split('T')[0];
}

const getTomorrowDateWithoutTimeString = () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().split('T')[0];
}

const time = {
  getDateWithoutTimeString,
  getTomorrowDateWithoutTimeString,
}

export default time;
