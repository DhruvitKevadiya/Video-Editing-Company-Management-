import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Tag } from 'primereact/tag';
import React, { memo } from 'react';
import { Col, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setAssignWorkedEditingData } from 'Store/Reducers/UserFlow/AssignedWorkedSlice';

const UpComingProject = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { userUpcomingProjectsList } = useSelector(
    ({ userDashboard }) => userDashboard,
  );

  const orderNumberTemplate = rowData => {
    return (
      <div className="d-flex align-items-center justify-content-between">
        <div
          className="cursor_pointer hover_column_text"
          onClick={() => {
            navigate(
              `${
                rowData?.inquiry_type === 1
                  ? '/project-work-editing/'
                  : '/project-work-exposing/'
              }${rowData?._id}`,
            );
            dispatch(setAssignWorkedEditingData({}));
          }}
        >
          {rowData?.inquiry_no}
        </div>
        {rowData?.is_new && (
          <div className="new_record_update">
            <Tag severity="info" value="New"></Tag>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <Col xl={4} md={6}>
        <div className="table_main_Wrapper">
          <div className="top_filter_wrap">
            <Row className="align-items-center g-2">
              <Col md={10}>
                <h4 className="m-0">Up Coming Assigned Projects</h4>
              </Col>
              <Col md={2}>
                <h4 className="text-end m-0">
                  {userUpcomingProjectsList?.list?.length}
                </h4>
              </Col>
            </Row>
          </div>
          <div className="data_table_wrapper max_height assigned_projects_table">
            <DataTable
              value={userUpcomingProjectsList?.list}
              sortField="price"
              sortOrder={1}
              rows={10}
            >
              <Column
                field="inquiry_no"
                header="Order No"
                sortable
                body={orderNumberTemplate}
              ></Column>
              <Column
                field="couple_name"
                header="Couple Name"
                sortable
              ></Column>
              <Column
                field="create_date"
                header="Create Date"
                sortable
              ></Column>
              <Column field="due_date" header="Due Date" sortable></Column>
            </DataTable>
          </div>
        </div>
      </Col>
    </>
  );
};

export default memo(UpComingProject);
