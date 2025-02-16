import React, { memo } from 'react';
import moment from 'moment';
import { useSelector } from 'react-redux';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Calendar, momentLocalizer } from 'react-big-calendar';

moment.locale('en-GB');
const localizer = momentLocalizer(moment);

const CommonCalender = () => {
  const { selectedEmployeeEvents } = useSelector(({ calendar }) => calendar);

  // const handleSelect = ({ start, end }) => {
  //   const title = window.prompt('New Event name');
  //   if (title)
  //     setEventsData([
  //       ...eventsData,
  //       {
  //         start,
  //         end,
  //         title,
  //       },
  //     ]);
  // };

  return (
    <>
      <Calendar
        selectable
        views={['day', 'week', 'month']}
        defaultView="month"
        localizer={localizer}
        defaultDate={new Date()}
        // date={monthAsPerSelectedEmployee}
        events={selectedEmployeeEvents}
        // step={60}
        // timeslots={1}
        // min={new Date(2024, 8, 1, 0, 0)} // Min time
        // max={new Date(2024, 8, 1, 23, 59)} // Max time
        // onNavigate={date => dispatch(setMonthAsPerSelectedEmployee(date))}
        // onView={view => dispatch(setMonthAsPerSelectedEmployee(view))}
        // onSelectEvent={event => {
        //   alert(event.title);
        // }}
        // onSelectSlot={handleSelect}
      />
    </>
  );
};

export default memo(CommonCalender);
