import React, { memo, useEffect, useMemo, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import CommonCalender from './CommonCalender';
import { generateUniqueId } from 'Helper/CommonHelper';
// import ExportIcon from '../../Assets/Images/export.svg';
import { Accordion, AccordionTab } from 'primereact/accordion';

const ExposingCalendar = props => {
  const { handleEmployeeEvents } = props;

  const [employeesOptions, setEmployeesOptions] = useState([]);

  const { selectedEmployee } = useSelector(({ calendar }) => calendar);
  const { employeesList } = useSelector(({ exposing }) => exposing);

  useEffect(() => {
    if (employeesList?.length) {
      const updatedOptions = employeesList?.map(item => {
        return {
          ...item,
          // employee_name: `${item?.first_name ? item?.first_name : ''} ${
          //   item?.last_name ? item?.last_name : ''
          // }`,
          is_active: false,
          unique_id: generateUniqueId(),
        };
      });

      const allEmployeeOption = {
        employee_name: 'All Employees',
        value: 'All Employees',
        is_active: true,
        unique_id: generateUniqueId(),
      };
      const mergedOption = [allEmployeeOption, ...updatedOptions];

      handleEmployeeEvents(allEmployeeOption);
      setEmployeesOptions(mergedOption);
    }
  }, [employeesList]);

  const employeeListData = useMemo(() => {
    if (employeesOptions?.length) {
      return employeesOptions?.map(employee => {
        return (
          <li
            className={`hover_text ${
              employee?.is_active ? 'active_employee' : ''
            }`}
            onClick={() => {
              if (selectedEmployee?.unique_id !== employee?.unique_id) {
                const updatedEmployees = employeesOptions.map(item => {
                  if (item?.unique_id === employee?.unique_id) {
                    return {
                      ...item,
                      is_active: true,
                    };
                  }
                  return {
                    ...item,
                    is_active: false,
                  };
                });
                setEmployeesOptions(updatedEmployees);
                handleEmployeeEvents(employee);
              }
            }}
          >
            {employee?.employee_name}
          </li>
        );
      });
    }
    return [];
  }, [employeesOptions, selectedEmployee]);

  return (
    <div className="table_main_Wrapper bg-white">
      <div className="top_filter_wrap">
        <Row className="align-items-center">
          <Col md={3}>
            <div className="page_title">
              <h3 class="m-0">Exposing Calendar</h3>
            </div>
          </Col>
          {/* <Col md={9}>
            <div className="right_filter_wrapper">
              <ul>
                <li>
                  <li class="search_input_wrap">
                    <div class="form_group">
                      <InputText
                        placeholder="Search"
                        className="input_wrap search_wrap"
                      />
                    </div>
                  </li>
                </li>
                <li>
                  <Dropdown className="dropdown_common export_dropdown position-static">
                    <Dropdown.Toggle
                      id="dropdown-basic"
                      className="btn_border icon_btn"
                    >
                      <img src={ExportIcon} alt="" />
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                      <Dropdown.Item>PDF</Dropdown.Item>
                      <Dropdown.Item>XLS</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </li>
              </ul>
            </div>
          </Col> */}
        </Row>
      </div>
      <div className="calender_view_Wrapper">
        <div className="calender_filter_Wrap">
          <Accordion activeIndex={0}>
            <AccordionTab header="Employees">
              <ul>{employeeListData}</ul>
            </AccordionTab>
          </Accordion>
        </div>
        <div className="calender_main_wrap">
          <CommonCalender />
        </div>
      </div>
    </div>
  );
};
export default memo(ExposingCalendar);
