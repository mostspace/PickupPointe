const dayjs = require("dayjs");

const calculateMinutesDifference = (start, end) => {
  const startDate = new Date(start);
  const endDate = new Date(end);

  const diffMs = endDate - startDate;

  return Math.round(diffMs / 1000 / 60);
};

const getDifferenceHour = (closeTime) => {
  if (!closeTime) return 0;

  const adjustTargetHours = new Date(closeTime).getUTCHours() - 8;
  const targetHours = adjustTargetHours < 0 ? adjustTargetHours + 24 : adjustTargetHours;
  const targetMinutes = new Date(closeTime).getUTCMinutes();

  const now = new Date();
  // Adjust for UTC-8 (Pacific Time)
  const adjustedHours = now.getUTCHours() - 8;
  const adjustedMinutes = now.getUTCMinutes();

  // Handle negative adjustedHours (rollover to previous day)
  const currentHours = adjustedHours < 0 ? adjustedHours + 24 : adjustedHours;
  const currentMinutes = adjustedMinutes;

  let diffHours = targetHours - currentHours;

  if (diffHours < 0) {
    return 0; 
  }

  if (targetMinutes < currentMinutes) {
    diffHours -= 1; 
  }

  console.log(
    "targetHours-----------------------",
    targetHours, 
    now, 
    currentHours, 
    closeTime, 
    diffHours
  );

  return diffHours;
};


const getStartAndEndOfDayUTC = () => {
  const now = new Date();
  const startOfDay = new Date(Date.UTC(now.getFullYear(), now.getUTCMonth(), now.getUTCDate()) + 8 * 60 * 60 * 1000);
  const endOfDay = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 23, 59, 0, 0) + 8 * 60 * 60 * 1000);
  
  return {startOfDay, endOfDay}
}


const getDaysFromWeekDays = (month, weekday) => {
  const weekdaysMap = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
  };
  const startOfMonth = dayjs(month).startOf('month');
  const endOfMonth = dayjs(month).endOf('month');

  let weekdays = [];
  let currentDay = startOfMonth;

  while (currentDay.isBefore(endOfMonth) || currentDay.isSame(endOfMonth, 'day')) {
    if (currentDay.day() === weekdaysMap[weekday]) {
      weekdays.push(currentDay.format("YYYY-MM-DD"));
    }
    currentDay = currentDay.add(1, 'day');
  }

  return weekdays;
}

const getPeriodDateRange = (periodType) => {
  const now = dayjs();
  let startDate;

  switch (periodType) {
    case 'Today':
      startDate = now.startOf('day');
      break;
    case 'This week':
      startDate = now.startOf('week');
      break;
    case 'Last week':
      startDate = now.subtract(1, 'week').startOf('week');
      break;
    case 'Last month':
      startDate = now.subtract(1, 'month').startOf('month');
      break;
    case 'Last quarter':
      const currentQuarter = Math.floor((now.month() + 3) / 3);
      startDate = now.startOf('quarter');
      break;
    case 'Last year':
      startDate = now.startOf('year');
      break;
    default:
      startDate = null;
  }

  return { startDate };
};

module.exports = {
  calculateMinutesDifference,
  getDifferenceHour,
  getStartAndEndOfDayUTC,
  getDaysFromWeekDays,
  getPeriodDateRange
};
