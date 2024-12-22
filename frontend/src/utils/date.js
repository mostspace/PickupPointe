import dayjs from 'dayjs';
import { isToday, isThisWeek, format } from 'date-fns';

export const getDaysFromWeekDays = (month, weekday) => {
  const weekdaysMap = {
    Sunday: 0,
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6,
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

export const convertToMinutes = (time, unit) => {
  switch (unit) {
    case 'days':
      return time * 24 * 60;
    case 'hours':
      return time * 60;
    case 'minutes':
      return time;
    default:
      return 0;
  }
};

export const formatChatTimestamp = (timestamp, showFull = false) => {
  const date = new Date(timestamp);
  
  if (isToday(date)) {
    return format(date, 'hh:mm a');
  } else if (isThisWeek(date)) {
    return format(date, showFull ? 'hh:mm a, EEE' : "EEE");
  } else {
    return format(date, showFull ? 'MM/dd/yyyy hh:mm a' : 'MM/dd/yyyy');
  }
};