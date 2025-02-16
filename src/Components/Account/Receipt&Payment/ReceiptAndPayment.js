import React, { useCallback, useEffect } from 'react';
import _ from 'lodash';
import moment from 'moment';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import Loader from 'Components/Common/Loader';
import { useNavigate } from 'react-router-dom';
import { Calendar } from 'primereact/calendar';
import { InputText } from 'primereact/inputtext';
import { DataTable } from 'primereact/datatable';
import { Col, Dropdown, Row } from 'react-bootstrap';
import PlusIcon from '../../../Assets/Images/plus.svg';
import EditIcon from '../../../Assets/Images/edit.svg';
import { useDispatch, useSelector } from 'react-redux';
import ActionBtn from '../../../Assets/Images/action.svg';
import CustomPaginator from 'Components/Common/CustomPaginator';
import {
  getReceiptPaymentlist,
  setClearAddReceiptPaymentData,
  setIsGetInitialValuesReceiptPayment,
  setReceiptAndPaymentCurrentPage,
  setReceiptAndPaymentDate,
  setReceiptAndPaymentPageLimit,
  setReceiptAndPaymentSearchParam,
} from 'Store/Reducers/Accounting/ReceiptAndPayment/ReceiptAndPaymentSlice';

export default function ReceiptAndPayment() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    receiptPaymentList,
    receiptAndPaymentDate,
    receiptPaymentLoading,
    receiptAndPaymentPageLimit,
    receiptAndPaymentCurrentPage,
    receiptAndPaymentSearchParam,
    isGetInitialValuesReceiptPayment,
  } = useSelector(({ receiptAndPayment }) => receiptAndPayment);

  const fetchRequiredData = useCallback(() => {
    dispatch(
      getReceiptPaymentlist({
        start: receiptAndPaymentCurrentPage,
        limit: receiptAndPaymentPageLimit,
        search: receiptAndPaymentSearchParam?.trim(),
        start_date:
          receiptAndPaymentDate?.length && receiptAndPaymentDate[0]
            ? moment(receiptAndPaymentDate[0])?.format('YYYY-MM-DD')
            : '',
        end_date:
          receiptAndPaymentDate?.length && receiptAndPaymentDate[1]
            ? moment(receiptAndPaymentDate[1])?.format('YYYY-MM-DD')
            : '',
      }),
    );
  }, [
    dispatch,
    receiptAndPaymentDate,
    receiptAndPaymentPageLimit,
    receiptAndPaymentCurrentPage,
    receiptAndPaymentSearchParam,
  ]);

  useEffect(() => {
    fetchRequiredData();
  }, []);

  const onPageChange = page => {
    if (page !== receiptAndPaymentCurrentPage) {
      let pageIndex = receiptAndPaymentCurrentPage;
      if (page?.page === 'Prev') pageIndex--;
      else if (page?.page === 'Next') pageIndex++;
      else pageIndex = page;
      dispatch(setReceiptAndPaymentCurrentPage(pageIndex));
      dispatch(
        getReceiptPaymentlist({
          start: pageIndex,
          limit: receiptAndPaymentPageLimit,
          search: receiptAndPaymentSearchParam?.trim(),
          start_date: receiptAndPaymentDate[0]
            ? moment(receiptAndPaymentDate[0])?.format('YYYY-MM-DD')
            : '',
          end_date: receiptAndPaymentDate[1]
            ? moment(receiptAndPaymentDate[1])?.format('YYYY-MM-DD')
            : '',
        }),
      );
    }
  };

  const onPageRowsChange = page => {
    const updatedCurrentPage = page === 0 ? 0 : 1;
    dispatch(setReceiptAndPaymentCurrentPage(updatedCurrentPage));
    dispatch(setReceiptAndPaymentPageLimit(page));

    const pageValue =
      page === 0
        ? receiptPaymentList?.totalRows
          ? receiptPaymentList?.totalRows
          : 0
        : page;
    const prevPageValue =
      receiptAndPaymentPageLimit === 0
        ? receiptPaymentList?.totalRows
          ? receiptPaymentList?.totalRows
          : 0
        : receiptAndPaymentPageLimit;

    if (
      prevPageValue < receiptPaymentList?.totalRows ||
      pageValue < receiptPaymentList?.totalRows
    ) {
      dispatch(
        getReceiptPaymentlist({
          start: updatedCurrentPage,
          limit: page,
          search: receiptAndPaymentSearchParam?.trim(),
          start_date: receiptAndPaymentDate[0]
            ? moment(receiptAndPaymentDate[0])?.format('YYYY-MM-DD')
            : '',
          end_date: receiptAndPaymentDate[1]
            ? moment(receiptAndPaymentDate[1])?.format('YYYY-MM-DD')
            : '',
        }),
      );
    }
  };

  const actionBodyTemplate = row => {
    return (
      <div className="dropdown_action_wrap">
        <Dropdown className="dropdown_common position-static">
          <Dropdown.Toggle id="dropdown-basic" className="action_btn">
            <img src={ActionBtn} alt="" />
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item
              onClick={() => {
                dispatch(
                  setIsGetInitialValuesReceiptPayment({
                    ...isGetInitialValuesReceiptPayment,
                    edit: false,
                  }),
                );
                navigate(`/edit-receipt-payment/${row?._id}`);
              }}
            >
              <img src={EditIcon} alt="EditIcon" /> Edit
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    );
  };

  const AccountTemplate = rowData => {
    return (
      <div
        className="cursor_pointer hover_text"
        onClick={() => {
          dispatch(
            setIsGetInitialValuesReceiptPayment({
              ...isGetInitialValuesReceiptPayment,
              view: false,
            }),
          );
          navigate(`/view-receipt-payment/${rowData?._id}`, {
            state: { iseView: true },
          });
        }}
      >
        {rowData?.account_name}
      </div>
    );
  };

  const paymentNoTemplate = rowData => {
    return <span>{rowData?.type === 1 ? 'Receipt' : 'Payment'}</span>;
  };

  const paymentTypeTemplate = rowData => {
    return (
      <span>
        {rowData?.payment_type === 1
          ? 'Cash'
          : rowData?.payment_type === 2
          ? 'Bank'
          : 'Cheque'}
      </span>
    );
  };

  // const statusBodyTemplate = rowData => {
  //   const Status = ReceiptAndPaymentStatus?.find(
  //     item => item?.value === rowData?.status,
  //   );

  //   return (
  //     Status && (
  //       <Tag
  //         value={Status?.label}
  //         className="cursor_pointer"
  //         severity={getSeverityReceiptAndPayment(Status?.label)}
  //       ></Tag>
  //     )
  //   );
  // };

  const handleReceiptAndPaymentDate = useCallback(
    e => {
      dispatch(setReceiptAndPaymentDate(e.value));

      if (
        (e?.value?.[0] !== null && e?.value?.[1] !== null) ||
        e?.value === null
      ) {
        dispatch(setReceiptAndPaymentCurrentPage(1));

        const startDate =
          e.value?.length && e.value[0]
            ? moment(e.value[0])?.format('YYYY-MM-DD')
            : '';
        const endDate =
          e.value?.length && e.value[1]
            ? moment(e.value[1])?.format('YYYY-MM-DD')
            : '';

        dispatch(
          getReceiptPaymentlist({
            start: 1,
            limit: receiptAndPaymentPageLimit,
            search: receiptAndPaymentSearchParam?.trim(),
            start_date: startDate,
            end_date: endDate,
          }),
        );
      }
    },
    [dispatch, receiptAndPaymentPageLimit, receiptAndPaymentSearchParam],
  );

  const handleDelete = useCallback(() => {
    // const deleteItemObj = {
    //   order_id: deleteId,
    // };
    // if (deleteId) {
    //   dispatch(deleteDataCollection(deleteItemObj))
    //     .then(response => {
    //       dispatch(
    //         geteditingList({
    //           start: editingCurrentPage,
    //           limit: editingPageLimit,
    //           isActive: '',
    //           search: editingSearchParam,
    //         }),
    //       );
    //     })
    //     .catch(error => {
    //       console.error('Error fetching delete data:', error);
    //     });
    // }
    // setDeletePopup(false);
  }, []);

  const handleSearchInput = async (e, pageLimit, selecteddate) => {
    dispatch(setReceiptAndPaymentCurrentPage(1));

    const startDate =
      selecteddate?.length && selecteddate[0]
        ? moment(selecteddate[0])?.format('YYYY-MM-DD')
        : '';
    const endDate =
      selecteddate?.length && selecteddate[1]
        ? moment(selecteddate[1])?.format('YYYY-MM-DD')
        : '';

    await dispatch(
      getReceiptPaymentlist({
        start: 1,
        limit: pageLimit,
        search: e.target.value?.trim(),
        start_date: startDate,
        end_date: endDate,
      }),
    );
  };

  const debounceHandleSearchInput = useCallback(
    _.debounce(handleSearchInput, 800),
    [],
  );

  return (
    <>
      {receiptPaymentLoading && <Loader />}
      <div className="main_Wrapper">
        <div className="table_main_Wrapper">
          <div className="top_filter_wrap">
            <Row className="align-items-center gy-3">
              <Col xl={3}>
                <div className="page_title">
                  <h3 className="m-0">Receipt / Payment</h3>
                </div>
              </Col>
              <Col xl={9}>
                <div className="right_filter_wrapper mt-2 mt-lg-0">
                  <ul className="receipt_ul">
                    <li>
                      <div className="date_select text-end">
                        <Calendar
                          id="ReceiptAndPaymentDate"
                          value={receiptAndPaymentDate}
                          placeholder="Select Date Range"
                          selectionMode="range"
                          dateFormat="dd-mm-yy"
                          onChange={e => {
                            handleReceiptAndPaymentDate(e);
                          }}
                          readOnlyInput
                          showButtonBar
                          showIcon
                        />
                      </div>
                    </li>
                    <li>
                      <div className="form_group">
                        <InputText
                          id="search"
                          placeholder="Search"
                          type="search"
                          className="input_wrap small search_wrap"
                          value={receiptAndPaymentSearchParam}
                          onChange={e => {
                            debounceHandleSearchInput(
                              e,
                              receiptAndPaymentPageLimit,
                              receiptAndPaymentDate,
                            );
                            dispatch(
                              setReceiptAndPaymentSearchParam(e.target.value),
                            );
                          }}
                        />
                      </div>
                    </li>
                    <li>
                      <Button
                        className="btn_primary"
                        onClick={() => {
                          dispatch(
                            setIsGetInitialValuesReceiptPayment({
                              ...isGetInitialValuesReceiptPayment,
                              add: false,
                            }),
                          );
                          dispatch(setClearAddReceiptPaymentData());
                          navigate('/create-receipt-payment');
                        }}
                      >
                        <img src={PlusIcon} alt="" /> Create Receipt / Payment
                      </Button>
                    </li>
                  </ul>
                </div>
              </Col>
            </Row>
          </div>
          <div className="data_table_wrapper">
            <DataTable
              value={receiptPaymentList?.list}
              sortField="price"
              sortOrder={1}
              rows={10}
            >
              <Column field="payment_no" header="Payment No." sortable></Column>
              <Column field="payment_date" header="Date" sortable></Column>
              <Column
                field="account_name"
                header="Account Name"
                body={AccountTemplate}
                sortable
              ></Column>
              <Column
                field="client_name"
                header="Client Name"
                sortable
              ></Column>
              <Column field="amount" header="Amount" sortable></Column>
              <Column
                field="type"
                header="Receipt / Payment"
                sortable
                body={paymentNoTemplate}
              ></Column>
              <Column
                field="payment_type"
                header="Payment Type"
                sortable
                body={paymentTypeTemplate}
              ></Column>
              {/* <Column
                field="status"
                header="Status"
                sortable
                body={statusBodyTemplate}
              ></Column> */}
              <Column
                field="action"
                header="Action"
                sortable
                body={actionBodyTemplate}
              ></Column>
            </DataTable>
            <CustomPaginator
              dataList={receiptPaymentList?.list}
              pageLimit={receiptAndPaymentPageLimit}
              onPageChange={onPageChange}
              onPageRowsChange={onPageRowsChange}
              currentPage={receiptAndPaymentCurrentPage}
              totalCount={receiptPaymentList?.totalRows}
            />
          </div>
        </div>
        {/* <ConfirmDeletePopup
          deletePopup={deletePopup}
          deleteId={deleteId}
          handleDelete={handleDelete}
          setDeletePopup={setDeletePopup}
        /> */}
      </div>
    </>
  );
}
