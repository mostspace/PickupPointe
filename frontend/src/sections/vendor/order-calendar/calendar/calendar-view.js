import React, { forwardRef, useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';
import CustomDateCell from './custom-date-cell';
import CustomDateHeader from './custom-date-header';
import CustomDayHeader from './custom-day-header';
import CustomEventComponent from './custom-event';
import './style.css';
import dayjs from "dayjs";

const localizer = momentLocalizer(moment);

const CalendarView = forwardRef((props, ref) => {
  const { locationInfo, calendarData, onServiceAvailabilityModalOpen, selectedDate } = props;
  const [checkedState, setCheckedState] = useState({});
  const [calendarEvent, setCalendarEvent] = useState([]);
  const [serviceData, setServiceData] = useState([]);

  useEffect(() => {
    setCalendarEvent(calendarData.result);
    setServiceData(calendarData.serviceData);
  }, [calendarData.result]);

  useEffect(() => {
    setCheckedState(calculateCheckedState());
  }, [calendarEvent]);

  const calculateCheckedState = () => {
    const checkedState = {};
    ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].forEach(day => {
      checkedState[day] = true;
    });

    calendarEvent.forEach(event => {
      const day = moment(event.date).format('ddd');
      checkedState[day] = true;
    });

    return checkedState;
  };

  const events = calendarEvent.map(item => {
    const { date, status, count, deliveryType } = item;
    const bgColor = status === 'Completed' ? 'rgba(76, 175, 80, 0.24)' : 'rgba(241, 161, 68, 0.24)';
    const textColor = status === 'Completed' ? '#4CAF50' : '#DD7E26';
    let title;
    if (status === 'Completed') {
      title = `${count} ${count > 1 ? deliveryType.replace("y", "ie") : deliveryType}${count > 1 ? "s" : ""} Completed`;
    } else {
      title = `${count} Scheduled ${count > 1 ? deliveryType.replace("y", "ie") : deliveryType}${count > 1 ? "s" : ""}`;
    }
    return {
      title: title,
      start: moment(date).startOf('day').toDate(),
      end: moment(date).endOf('day').toDate(),
      allDay: true,
      bgColor,
      // description: status === 'Pending' ? 'Pending' : 'Completed',
      // label: status.toLowerCase(),
      style: {
        backgroundColor: bgColor,
        borderColor: bgColor,
        color: textColor,
      },
    };
  });
console.log(events)
  return (
    <div className="App">
      <Calendar
        ref={ref}
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 870, overflowX: 'scroll', scrollBehavior: 'smooth', scrollbarWidth: 'thin', msScrollbarBaseColor: 'red'}}
        components={{
          event: CustomEventComponent,
          toolbar: () => null,
          header: ({ label }) => {
            const onSettingClick = (date) => {
              onServiceAvailabilityModalOpen(date, true);
            }
            return <CustomDayHeader
              label={label}
              onSettingClick={(date) => onSettingClick(date)}
              isChecked={checkedState[label]}
            />
          },
          month: {
            dateHeader: ({ label, date }) => {
              const eventForDate = calendarEvent.find(event =>
                moment(event.date).isSame(date, 'day')
              );
              const status = eventForDate ? eventForDate.status : null;
              return <CustomDateHeader label={label} status={status} />;
            },
          },
          dateCellWrapper: ({ children, value }) => {
            const eventForDate = calendarEvent.find(event =>
              moment(event.date).isSame(value, 'day')
            );
            const hasEvent = !!eventForDate;
            const date = dayjs(value).format("YYYY-MM-DD");
            const serviceInfo = serviceData.find(item => item.date === date);
            let serviceTime = {};

            const formatTime = (timeString) => timeString ? dayjs().hour(timeString.split(":")[0]).minute(timeString.split(":")[1]).format("h:mm A") : null;

            if (serviceInfo) {
              serviceTime.isPickup = serviceInfo.pickupTime.isAvailable;
              serviceTime.isDelivery = serviceInfo.deliveryTime.isAvailable;
              if (serviceInfo.pickupTime.isAvailable) {
                serviceTime.pickup = {
                  from: formatTime(serviceInfo.pickupTime.from),
                  to: formatTime(serviceInfo.pickupTime.to),
                };
              }
              if (serviceInfo.deliveryTime.isAvailable) {
                serviceTime.delivery = {
                  from: formatTime(serviceInfo.deliveryTime.from),
                  to: formatTime(serviceInfo.deliveryTime.to),
                };
              }
            } else {
              serviceTime.pickupDays = locationInfo?.pickup.days;
              serviceTime.isPickup = !!locationInfo?.pickup.days.find(day => day === dayjs(value).format("ddd"));
              serviceTime.deliveryDays = locationInfo?.delivery.days;
              serviceTime.isDelivery = !!locationInfo?.delivery.days.find(day => day === dayjs(value).format("ddd"));
              serviceTime.pickup = {
                from: dayjs(locationInfo?.pickup.from).format("h:mm A"),
                to: dayjs(locationInfo?.pickup.to).format("h:mm A"),
              };
              serviceTime.delivery = {
                from: dayjs(locationInfo?.delivery.from).format("h:mm A"),
                to: dayjs(locationInfo?.delivery.to).format("h:mm A"),
              };
            }

            const statusText = eventForDate ?
              eventForDate.status :
              (serviceInfo && !serviceInfo?.pickupTime?.isAvailable && !serviceInfo?.deliveryTime?.isAvailable ?
                "Blocked Out" :
                "");

            const isDisabled = dayjs(selectedDate).format("YYYY-MM") !== dayjs(date).format("YYYY-MM");
            const isPassed = dayjs().format("YYYY-MM-DD") > dayjs(value).format("YYYY-MM-DD");

            const onDoubleClick = () => {
              if (!isDisabled && !isPassed) {
                onServiceAvailabilityModalOpen(date, false);
              }
            }

            return (
              <CustomDateCell
                value={value}
                isDisabled={isDisabled}
                isPassed={isPassed}
                statusText={statusText}
                serviceTime={serviceTime}
                locationInfo={locationInfo}
                hasEvent={hasEvent}
                onDoubleClick={onDoubleClick}>
                {children}
              </CustomDateCell>
            );
          }
        }}
      />
    </div>
  );
});

export default CalendarView;
