import React, { useCallback, useEffect } from 'react';
import moment from 'moment';
import Loader from 'Components/Common/Loader';
import ExposingCalendar from './ExposingCalendar';
import { useDispatch, useSelector } from 'react-redux';
import { TabView, TabPanel } from 'primereact/tabview';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import {
  setMonthAsPerSelectedEmployee,
  setSelectedEmployee,
  setSelectedEmployeeEvents,
} from 'Store/Reducers/Calendar/CalendarSlice';
import {
  exposingEmployeeList,
  getExposingItemList,
} from 'Store/Reducers/Exposing/ExposingFlow/ExposingSlice';

export default function Calender() {
  const dispatch = useDispatch();

  const { exposingItemLoading, exposingEmployeeLoading } = useSelector(
    ({ exposing }) => exposing,
  );

  useEffect(() => {
    // dispatch(getEmployeeList());
    dispatch(exposingEmployeeList());
  }, []);

  // const showItemsNameandCompanyName = item => {
  //   let buttonTooltip = `${item?.item_name} - ${item?.client_name}`;

  //   if (buttonTooltip?.length > 30) {
  //     return (
  //       <Button
  //         tooltip={buttonTooltip}
  //         tooltipOptions={{ position: 'top' }}
  //         className="btn_transparent text_dark item_name_with_tooltip"
  //       >
  //         {`${item?.item_name} - ${item?.client_name}`}
  //       </Button>
  //     );
  //   } else {
  //   return buttonTooltip;
  //   }
  // };

  const handleEmployeeEvents = useCallback(
    async selectedData => {
      dispatch(setSelectedEmployee(selectedData));
      const res = await dispatch(
        getExposingItemList({
          employee_id: selectedData?._id ? selectedData?._id : '',
        }),
      );
      let selectedEmployeeEventsData = [];
      let months = [];

      if (res?.payload?.length) {
        selectedEmployeeEventsData = res?.payload?.map((item, index) => {
          const orderStartDate = item?.order_start_date
            ? new Date(item?.order_start_date)
            : '';
          const orderEndDate = item?.order_end_date
            ? new Date(item?.order_end_date)
            : '';

          if (orderStartDate) {
            const startDateMonth = moment(orderStartDate).format('MM-DD-YYYY');
            months.push(startDateMonth);
          }

          return {
            ...item,
            id: index,
            title: `${item?.item_name} - ${item?.client_name}`,
            allDay: true,
            start: orderStartDate,
            end: orderEndDate,
          };
        });
      }

      const sortedDates = months?.length
        ? months?.sort((date1, date2) => {
            return moment(date1, 'MM-DD-YYYY').diff(
              moment(date2, 'MM-DD-YYYY'),
            );
          })[0]
        : moment().format('MM-DD-YYYY');

      dispatch(setMonthAsPerSelectedEmployee(sortedDates));
      dispatch(setSelectedEmployeeEvents(selectedEmployeeEventsData));
    },
    [dispatch],
  );

  return (
    <>
      {(exposingItemLoading || exposingEmployeeLoading) && <Loader />}
      <div className="main_Wrapper">
        <div className="calender_Wrapper">
          <TabView>
            <TabPanel header="Exposing Calendar">
              <ExposingCalendar handleEmployeeEvents={handleEmployeeEvents} />
            </TabPanel>
            {/* <TabPanel header="Editing Calendar">
              <EditingCalendar />
            </TabPanel> */}
          </TabView>
        </div>
      </div>
    </>
  );
}
