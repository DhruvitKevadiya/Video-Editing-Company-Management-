import React, { memo, useCallback, useMemo } from 'react';
import moment from 'moment';
import { useFormik } from 'formik';
import { Tag } from 'primereact/tag';
import { Col, Row } from 'react-bootstrap';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { Calendar } from 'primereact/calendar';
import { Checkbox } from 'primereact/checkbox';
import { InputText } from 'primereact/inputtext';
import { DataTable } from 'primereact/datatable';
import { ColumnGroup } from 'primereact/columngroup';
import { useDispatch, useSelector } from 'react-redux';
import { InputTextarea } from 'primereact/inputtextarea';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  addPaymentReceipt,
  editPaymentReceipt,
  listCompanyWiseInvoice,
  setAddReceiptPaymentData,
  setClearAddReceiptPaymentData,
  setClearEditReceiptPaymentData,
  setEditReceiptPaymentData,
  setIsGetInitialValuesReceiptPayment,
} from 'Store/Reducers/Accounting/ReceiptAndPayment/ReceiptAndPaymentSlice';
import Loader from 'Components/Common/Loader';
import { convertIntoNumber } from 'Helper/CommonHelper';
import ReactSelectSingle from '../../Common/ReactSelectSingle';
import { receiptPaymentSchema } from 'Schema/ReceiptPayment/receiptPaymentSchema';
import { getClientCompany } from 'Store/Reducers/Settings/CompanySetting/ClientCompanySlice';
import { InputNumber } from 'primereact/inputnumber';

const receiptPaymentType = [
  { label: 'Receipt', value: 1 },
  { label: 'Payment', value: 2 },
];
const paymentType = [
  { label: 'Cash', value: 1 },
  { label: 'Bank', value: 2 },
  { label: 'Cheque', value: 3 },
];

const ReceiptPaymentDetail = ({ initialValues }) => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { state, pathname } = useLocation();
  const locationPath = pathname?.split('/');

  const checkViewPermission =
    id && state?.iseView && locationPath[1] === 'view-receipt-payment';
  const checkEditPermission = id && locationPath[1] === 'edit-receipt-payment';

  const {
    addReceiptPaymentData,
    receiptPaymentLoading,
    editReceiptPaymentData,
    receiptPaymentNoLoading,
    addEditPaymentReceiptLoading,
    listCompanyWiseInvoiceLoading,
    isGetInitialValuesReceiptPayment,
  } = useSelector(({ receiptAndPayment }) => receiptAndPayment);

  const { clientCompanyLoading } = useSelector(
    ({ clientCompany }) => clientCompany,
  );

  const { accountLoading, accountList } = useSelector(({ account }) => account);

  const submitHandle = useCallback(
    async value => {
      const invoiceData = value?.invoice_receipt_info
        ?.map(item => {
          if (item?.select_receipt_invoice === true) {
            let payloadData = {
              invoice_amount: item?.amount,
              paid_amount: item?.paid_amount,
              ...(item?.partial_amount && {
                partial_amount: item?.partial_amount,
              }),
            };

            if (item?.invoice_id) {
              return {
                ...payloadData,
                receipt_invoice_id: item?._id,
                invoice_id: item?.invoice_id,
              };
            } else {
              return {
                ...payloadData,
                invoice_id: item?._id,
              };
            }
          }
        })
        ?.filter(item => item);

      const payload = {
        ...(id && { receipt_id: id }),
        client_company_id: value?.client_company_id,
        account_id: value?.account_id,
        payment_no: value?.payment_no,
        type: value?.type,
        payment_type: value?.payment_type,
        payment_date: moment(value?.payment_date).format('YYYY-MM-DD'),
        client_name: value?.client_name,
        amount: convertIntoNumber(value?.amount),
        // balance: convertIntoNumber(value?.balance),
        payment_receive_in: value?.payment_receive_in,
        remark: value?.remark,
        payment_invoice: invoiceData,
        // remaining_balance: value?.remaining_balance,
      };

      if (id) {
        const res = await dispatch(editPaymentReceipt(payload));

        if (res?.payload) {
          dispatch(
            setIsGetInitialValuesReceiptPayment({
              ...isGetInitialValuesReceiptPayment,
              edit: false,
            }),
          );
          dispatch(setClearEditReceiptPaymentData());
          navigate('/receipt-payment');
        }
      } else {
        const res = await dispatch(addPaymentReceipt(payload));

        if (res?.payload) {
          dispatch(
            setIsGetInitialValuesReceiptPayment({
              ...isGetInitialValuesReceiptPayment,
              add: false,
            }),
          );
          dispatch(setClearAddReceiptPaymentData());
          navigate('/receipt-payment');
        }
      }
    },
    [dispatch, id, isGetInitialValuesReceiptPayment, navigate],
  );

  const {
    values,
    errors,
    touched,
    setFieldValue,
    handleBlur,
    handleChange,
    handleSubmit,
  } = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validationSchema: receiptPaymentSchema,
    onSubmit: submitHandle,
  });

  const footerGroup = (
    <ColumnGroup>
      <Row>
        <Column className="text-end" footer="Total Amount" colSpan={5} />
        <Column
          footer={`₹ ${
            values?.total_paid_amount
              ? convertIntoNumber(values?.total_paid_amount)
              : 0
          }`}
        />
      </Row>
    </ColumnGroup>
  );

  const handleAccountData = useCallback(
    async e => {
      const fieldValue = e.target.value;

      const accountData = accountList?.list
        ?.map(
          ({ account }) =>
            account?.length > 0 &&
            account.find(item => {
              return item?._id === fieldValue;
            }),
        )
        .find(item => item);

      if (accountData && accountData?.related_entity_id) {
        const company_res = await dispatch(
          getClientCompany({
            client_company_id: accountData.related_entity_id,
          }),
        );

        const companyData = company_res?.payload?.data;

        if (companyData) {
          // const balance =
          //   convertIntoNumber(values?.amount) +
          //   (companyData?.opening_balance_type === 2
          //     ? convertIntoNumber(companyData?.opening_balance) * -1 // Making Negative number:
          //     : convertIntoNumber(companyData?.opening_balance));

          let commonFieldObj = {
            account_id: fieldValue,
            opening_balance_type: companyData.opening_balance_type,
            client_name: companyData.client_full_name,
            current_balance: accountData?.current_balance || 0,
            client_company_id: accountData.related_entity_id,
            // balance: balance,
          };

          const payload = {
            client_company_id: companyData._id,
            type: values.type,
          };

          // if (res?.payload) {
          //   const updateInvoice = handleReceiptPaymentInvoices(
          //     res?.payload,
          //     balance,
          //   );

          //   commonFieldObj = {
          //     ...commonFieldObj,
          //     ...updateInvoice,
          //   };
          // }

          const res = await dispatch(listCompanyWiseInvoice(payload));

          if (res?.payload) {
            const updatedInvoice = res?.payload?.map(item => {
              return {
                ...item,
                invoice_amount: item?.partial_amount
                  ? item?.partial_amount
                  : item?.amount,
              };
            });

            const updateInvoice = handleReceiptPaymentInvoices(
              updatedInvoice,
              values?.amount,
            );

            commonFieldObj = {
              ...commonFieldObj,
              ...updateInvoice,
            };
          }

          handleChangeFieldsData(commonFieldObj);
        }
      }
    },
    [dispatch, values.type, values?.amount, accountList?.list],
  );

  const handleReceiptPaymentInvoices = (invoiceData, totalBalance = 0) => {
    let partialAmount = convertIntoNumber(totalBalance); // manually entered Amount
    let totalPaidAmount = 0;
    let totalSelectedInvoices = 0;

    // const updatePaymentInvoice = invoiceData?.map(item => {
    //   if (totalBalance > 0) {
    //     // For calculation of partial amount:
    //     // partialAmount =
    //     //   convertIntoNumber(partialAmount) - convertIntoNumber(item?.amount);

    //     if (partialAmount > 0) {
    //       const itemAmount = item?.partial_amount
    //         ? item?.partial_amount
    //         : item?.amount;

    //       const calculatedPartialAmount = partialAmount - itemAmount;

    //       const pendingAmount =
    //         itemAmount > partialAmount
    //           ? convertIntoNumber(Math.abs(calculatedPartialAmount))
    //           : 0;

    //       const paidAmount = pendingAmount
    //         ? convertIntoNumber(partialAmount)
    //         : item?.amount;

    //       const invoiceItem = {
    //         ...item,
    //         select_receipt_invoice: true,
    //         paid_amount: paidAmount,
    //         invoice_date: moment(item?.invoice_date).format('YYYY-MM-DD'),
    //         partial_amount: pendingAmount,
    //         is_amount_paid: !pendingAmount ? true : false,
    //       };

    //       totalSelectedInvoices += 1; // For selected total rows:
    //       totalPaidAmount += paidAmount; // For calculation of total paid amount:
    //       partialAmount = calculatedPartialAmount; // For calculation of partial amount:

    //       return invoiceItem;
    //     } else {
    //       return {
    //         ...item,
    //         select_receipt_invoice: false,
    //         paid_amount: '',
    //         invoice_date: moment(item?.invoice_date).format('YYYY-MM-DD'),
    //         partial_amount: item?.partial_amount ? item?.partial_amount : 0,
    //         is_amount_paid: false,
    //       };
    //     }
    //   } else {
    //     return {
    //       ...item,
    //       select_receipt_invoice: false,
    //       paid_amount: '',
    //       invoice_date: moment(item?.invoice_date).format('YYYY-MM-DD'),
    //       partial_amount: item?.partial_amount ? item?.partial_amount : 0,
    //       is_amount_paid: false,
    //     };
    //   }
    // });

    const updatePaymentInvoice = invoiceData?.map(item => {
      if (totalBalance >= 0) {
        if (partialAmount >= 0) {
          const invoiceAmount = item?.invoice_amount;
          const calculatedPartialAmount = partialAmount - invoiceAmount;

          const pendingAmount =
            invoiceAmount > partialAmount
              ? convertIntoNumber(Math.abs(calculatedPartialAmount))
              : 0;

          const checkPartialAmount = pendingAmount === item?.amount;

          const paidAmount = pendingAmount
            ? convertIntoNumber(partialAmount)
            : invoiceAmount;

          const invoiceItem = {
            ...item,
            select_receipt_invoice: paidAmount ? true : false,
            paid_amount: paidAmount,
            invoice_date: moment(item?.invoice_date).format('YYYY-MM-DD'),
            partial_amount: !checkPartialAmount ? pendingAmount : 0,
            is_amount_paid: !pendingAmount ? true : false,
          };

          totalSelectedInvoices += 1; // For selected total rows:
          totalPaidAmount += paidAmount; // For calculation of total paid amount:
          partialAmount = calculatedPartialAmount; // For calculation of partial amount:

          return invoiceItem;
        } else {
          return {
            ...item,
            select_receipt_invoice: false,
            paid_amount: '',
            invoice_date: moment(item?.invoice_date).format('YYYY-MM-DD'),
            partial_amount: 0,
            is_amount_paid: false,
          };
        }
      } else {
        return {
          ...item,
          select_receipt_invoice: false,
          paid_amount: '',
          invoice_date: moment(item?.invoice_date).format('YYYY-MM-DD'),
          partial_amount: item?.partial_amount ? item?.partial_amount : 0,
          is_amount_paid: false,
        };
      }
    });

    return {
      // remaining_balance: totalBalance - convertIntoNumber(totalPaidAmount),
      total_paid_amount: convertIntoNumber(totalPaidAmount),
      total_selected_invoices: totalSelectedInvoices,
      invoice_receipt_info: updatePaymentInvoice,
    };
  };

  const checkboxTemplate = (data, row) => {
    const fieldName = row?.column?.props?.field;

    return <Checkbox name={fieldName} checked={data[fieldName]} disabled />;
  };

  const handleChangeFieldsData = (fieldObject = {}) => {
    if (id) {
      if (locationPath[1] === 'edit-receipt-payment') {
        dispatch(
          setEditReceiptPaymentData({
            ...editReceiptPaymentData,
            ...fieldObject,
          }),
        );
      }
    } else {
      dispatch(
        setAddReceiptPaymentData({
          ...addReceiptPaymentData,
          ...fieldObject,
        }),
      );
    }

    Object.keys(fieldObject)?.forEach(keys => {
      setFieldValue(keys, fieldObject[keys]);
    });
  };

  const accountOptions = useMemo(() => {
    if (accountList?.list) {
      const accountData = accountList?.list
        ?.map(item => {
          if (
            !['Bank Accounts (Banks)', 'Cash-in-hand'].includes(
              item?.group_name,
            ) &&
            item?.account?.length
          ) {
            return item?.account?.map(account => ({
              label: account?.account_name,
              value: account?._id,
            }));
          }
        })
        ?.filter(account => account)
        ?.flat();

      return accountData;
    }
  }, [accountList]);

  const invoiceAmountTemplate = rowData => {
    return (
      <div className="d-flex align-items-cente gap-2">
        <span>{`₹ ${rowData?.amount || 0}`}</span>
        {rowData?.is_amount_paid ? (
          <div className="new_record_update">
            <Tag severity="success" value="complete"></Tag>
          </div>
        ) : rowData?.partial_amount ? (
          <span style={{ color: '#c94444' }}>{`(₹ ${
            rowData?.partial_amount || 0
          } pending)`}</span>
        ) : (
          ''
        )}
      </div>
    );
  };

  const paidAmountTemplate = rowData => {
    return (
      <span>{rowData?.paid_amount ? `₹ ${rowData?.paid_amount}` : ''}</span>
    );
  };

  const handlePaymentTypeChange = useCallback(
    e => {
      let group = '';
      const name = e.target.name;
      const value = e.value;

      if (value === 2 || value === 3) {
        group = 'Bank Accounts (Banks)';
      } else {
        group = 'Cash-in-hand';
      }

      const paymentReceiveInData = accountList?.list
        ?.map(item => {
          if (item?.group_name === group && item?.account?.length) {
            return item?.account?.map(account => ({
              label: account?.account_name,
              value: account?._id,
            }));
          }
        })
        ?.filter(account => account)
        ?.flat();

      handleChangeFieldsData({
        [name]: value,
        payment_receiveIn_list: paymentReceiveInData,
      });
    },
    [accountList],
  );

  return (
    <>
      {(accountLoading ||
        clientCompanyLoading ||
        receiptPaymentLoading ||
        listCompanyWiseInvoiceLoading ||
        receiptPaymentNoLoading ||
        addEditPaymentReceiptLoading) && <Loader />}
      <div className="main_Wrapper">
        <div className="bg-white radius15 border h-100">
          <div className="billing_heading">
            <Row className="align-items-center gy-3">
              <Col sm={6}>
                <div class="page_title">
                  <h3 class="m-0">Record Receipt / Payment</h3>
                </div>
              </Col>
            </Row>
          </div>
          <div className="p20 p10-sm border-bottom">
            <Row>
              <Col lg={9}>
                <Row>
                  <Col lg={4}>
                    <Row>
                      <Col xl={6} lg={12} md={6}>
                        <div className="form_group mb-3">
                          <label>Payment No</label>
                          <InputText
                            placeholder="Payment No"
                            name="payment_no"
                            value={values?.payment_no}
                            className="input_wrap"
                            onChange={handleChange}
                            disabled={
                              checkViewPermission || checkEditPermission
                            }
                          />
                        </div>
                      </Col>
                      <Col xl={6} lg={12} md={6}>
                        <div className="form_group mb-3">
                          <label>Create Date</label>
                          <div className="date_select create_payment_date text-end">
                            <Calendar
                              name="payment_date"
                              placeholder="dd/mm/yyyy"
                              onChange={handleChange}
                              value={values?.payment_date}
                              showIcon
                              disabled={
                                checkViewPermission || checkEditPermission
                              }
                            />
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </Col>
                  {/* <Col lg={4} md={6}>
                    <div className="form_group mb-3">
                      <label>
                        Type <span className="text-danger fs-6">*</span>
                      </label>
                      <ReactSelectSingle
                        filter
                        name="type"
                        placeholder="Select Type"
                        value={values?.type}
                        options={receiptPaymentType}
                        onChange={e => {
                          setFieldValue('type', e.target.value);
                          handleType(e.target.value);
                        }}
                        onBlur={handleBlur}
                        disabled={checkViewPermission || checkEditPermission}
                      />
                      {touched?.type && errors?.type && (
                        <p className="text-danger">{errors?.type}</p>
                      )}
                    </div>
                  </Col>
                  <Col lg={4} md={6}>
                    <div className="form_group mb-3">
                      <label>
                        Company <span className="text-danger fs-6">*</span>
                      </label>
                      <ReactSelectSingle
                        filter
                        name="company_name"
                        value={values?.company_name}
                        options={values?.client_company_list}
                        onChange={e => {
                          setFieldValue('company_name', e.target.value);
                          handleCompanyData(e);
                        }}
                        placeholder="Select Company Name"
                        disabled={
                          !values?.type ||
                          checkViewPermission ||
                          checkEditPermission
                        }
                        onBlur={handleBlur}
                      />
                      {touched?.company_name && errors?.company_name && (
                        <p className="text-danger">{errors?.company_name}</p>
                      )}
                    </div>
                  </Col> */}

                  <Col lg={4} md={6}>
                    <div className="form_group mb-3">
                      <label>
                        Payment Type <span className="text-danger fs-6">*</span>
                      </label>
                      <ReactSelectSingle
                        filter
                        name="payment_type"
                        value={values?.payment_type}
                        options={paymentType}
                        onChange={e => {
                          setFieldValue('payment_type', e.value);
                          handlePaymentTypeChange(e);
                        }}
                        placeholder="Select Payment Type"
                        onBlur={handleBlur}
                        disabled={checkViewPermission || checkEditPermission}
                      />
                      {touched?.payment_type && errors?.payment_type && (
                        <p className="text-danger">{errors?.payment_type}</p>
                      )}
                    </div>
                  </Col>
                  <Col lg={4} md={6}>
                    <div className="form_group mb-3">
                      <label>
                        Payment Receive In{' '}
                        <span className="text-danger fs-6">*</span>
                      </label>
                      <ReactSelectSingle
                        filter
                        name="payment_receive_in"
                        value={values?.payment_receive_in}
                        options={values?.payment_receiveIn_list}
                        onChange={handleChange}
                        placeholder="Select Group"
                        onBlur={handleBlur}
                        disabled={checkViewPermission || checkEditPermission}
                      />
                      {touched?.payment_receive_in &&
                        errors?.payment_receive_in && (
                          <p className="text-danger">
                            {errors?.payment_receive_in}
                          </p>
                        )}
                    </div>
                  </Col>
                  <Col lg={4} md={6}>
                    <div className="form_group mb-3">
                      <label>
                        Type <span className="text-danger fs-6">*</span>
                      </label>
                      <ReactSelectSingle
                        filter
                        name="type"
                        placeholder="Select Type"
                        value={values?.type}
                        options={receiptPaymentType}
                        onChange={e => {
                          // setFieldValue('type', e.target.value);
                          // handleType(e.target.value);

                          handleChangeFieldsData({
                            type: e.value,
                          });
                        }}
                        onBlur={handleBlur}
                        disabled={checkViewPermission || checkEditPermission}
                      />
                      {touched?.type && errors?.type && (
                        <p className="text-danger">{errors?.type}</p>
                      )}
                    </div>
                  </Col>
                  <Col lg={4} md={6}>
                    <div className="form_group mb-3">
                      <label>
                        Account <span className="text-danger fs-6">*</span>
                      </label>
                      <ReactSelectSingle
                        filter
                        name="account_id"
                        value={values?.account_id}
                        options={accountOptions}
                        onChange={e => {
                          setFieldValue('account_id', e.target.value);
                          handleAccountData(e);
                        }}
                        placeholder="Select Account Name"
                        disabled={checkViewPermission || checkEditPermission}
                        onBlur={handleBlur}
                      />
                      {touched?.account_id && errors?.account_id && (
                        <p className="text-danger">{errors?.account_id}</p>
                      )}
                    </div>
                  </Col>
                  <Col lg={4} md={6}>
                    <div className="form_group mb-3">
                      <label>Client Name</label>
                      <InputText
                        name="client_name"
                        placeholder="Client Name"
                        value={values?.client_name}
                        onChange={handleChange}
                        className="input_wrap"
                        disabled={checkViewPermission || checkEditPermission}
                      />
                    </div>
                  </Col>
                  {/* <Col lg={4} md={6}>
                    <div className="form_group mb-3">
                      <label>
                        Payment Type <span className="text-danger fs-6">*</span>
                      </label>
                      <ReactSelectSingle
                        filter
                        name="payment_type"
                        value={values?.payment_type}
                        options={paymentType}
                        onChange={e => {
                          setFieldValue('payment_type', e?.target?.value);
                          handlePaymentTypeChange(e);
                        }}
                        placeholder="Select Payment Type"
                        onBlur={handleBlur}
                        disabled={checkViewPermission || checkEditPermission}
                      />
                      {touched?.payment_type && errors?.payment_type && (
                        <p className="text-danger">{errors?.payment_type}</p>
                      )}
                    </div>
                  </Col>
                  <Col lg={4} md={6}>
                    <div className="form_group mb-3">
                      <label>
                        Payment Receive In{' '}
                        <span className="text-danger fs-6">*</span>
                      </label>
                      <ReactSelectSingle
                        filter
                        name="payment_receive_in"
                        value={values?.payment_receive_in}
                        options={values?.account_list}
                        onChange={handleChange}
                        placeholder="Select Group"
                        onBlur={handleBlur}
                        disabled={checkViewPermission || checkEditPermission}
                      />
                      {touched?.payment_receive_in &&
                        errors?.payment_receive_in && (
                          <p className="text-danger">
                            {errors?.payment_receive_in}
                          </p>
                        )}
                    </div>
                  </Col> */}
                  <Col lg={4} md={6}>
                    <div className="form_group mb-3">
                      <label>
                        Amount <span className="text-danger fs-6">*</span>
                      </label>
                      <InputNumber
                        name="amount"
                        placeholder="Enter Amount"
                        value={values?.amount}
                        onChange={e => {
                          // const balance =
                          //   convertIntoNumber(e.target.value) +
                          //   convertIntoNumber(values?.opening_balance);

                          // const balance =
                          //   convertIntoNumber(e.target.value) +
                          //   (values?.opening_balance_type === 2
                          //     ? convertIntoNumber(values?.opening_balance) * -1 // Making Negative number:
                          //     : convertIntoNumber(values?.opening_balance));

                          const updateInvoice = handleReceiptPaymentInvoices(
                            values?.invoice_receipt_info,
                            e?.value,
                          );

                          const commonFieldObject = {
                            ...updateInvoice,
                            amount: e?.value,
                            // balance: balance,
                          };
                          handleChangeFieldsData(commonFieldObject);
                        }}
                        onBlur={handleBlur}
                        useGrouping={false}
                        minFractionDigits={0}
                        maxFractionDigits={2}
                        disabled={checkEditPermission || checkViewPermission}
                      />
                      {touched?.amount && errors?.amount && (
                        <p className="text-danger">{errors?.amount}</p>
                      )}
                    </div>
                  </Col>
                  <Col lg={4} md={6}>
                    <div className="form_group mb-3">
                      <label>Current Balance</label>
                      <div className="d-flex balance_info align-items-center gap-3">
                        <h2>
                          {Math.abs(convertIntoNumber(values?.current_balance))}
                        </h2>
                        <span className="opening_balance_type">
                          {values?.current_balance > 0 ? 'CR' : 'DB'}
                        </span>
                      </div>
                    </div>
                  </Col>
                </Row>
              </Col>
              <Col lg={3}>
                <div className="form_group mb-3">
                  <label htmlFor="Remark">Remark</label>
                  <InputTextarea
                    id="Remark"
                    name="remark"
                    value={values?.remark}
                    placeholder="Remark"
                    onChange={handleChange}
                    className="input_wrap"
                    rows={6}
                    disabled={checkViewPermission || checkEditPermission}
                  />
                </div>
              </Col>
            </Row>
          </div>
          <div className="billing_heading">
            <Row className="justify-content-between align-items-center">
              <Col lg={6}>
                <div className="Receipt_Payment_head_wrapper mb-3 mb-lg-0">
                  <div className="Receipt_Payment_head_txt">
                    <h3 className="m-0">Settle invoice with this payment</h3>
                  </div>
                  <div className="Receipt_Payment_invoice_txt">
                    <h5 className="m-0">
                      {values?.total_selected_invoices
                        ? values?.total_selected_invoices
                        : 0}{' '}
                      Invoices Selected
                    </h5>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
          <div className="data_table_wrapper max_height">
            <DataTable
              value={values?.invoice_receipt_info}
              sortField="price"
              sortOrder={1}
              rows={10}
              dataKey="id"
              // onSelectionChange={e => setSelectedProducts(e.value)}
              // selection={selectedProducts}
              footerColumnGroup={footerGroup}
            >
              {/* <Column
                selectionMode="multiple"
                headerStyle={{ width: '3rem' }}
              ></Column> */}
              <Column
                field="select_receipt_invoice"
                style={{ zIndex: '10', minWidth: '82px' }}
                body={checkboxTemplate}
                frozen
              ></Column>
              <Column
                field="invoice_date"
                header="Invoice Date"
                sortable
              ></Column>
              <Column field="invoice_no" header="Invoice No." sortable></Column>
              <Column field="order_no" header="Order No." sortable></Column>
              <Column
                field="amount"
                header="Invoice Amount"
                sortable
                body={invoiceAmountTemplate}
              ></Column>
              <Column
                field="paid_amount"
                header="Amount Paid"
                sortable
                body={paidAmountTemplate}
              ></Column>
            </DataTable>
          </div>
          <div className="title_right_wrapper button_padding_manage">
            <ul className="justify-content-end">
              <li>
                <Button
                  onClick={() => {
                    dispatch(
                      setIsGetInitialValuesReceiptPayment({
                        ...isGetInitialValuesReceiptPayment,
                        ...(id ? { edit: false } : { add: false }),
                      }),
                    );
                    navigate('/receipt-payment');
                  }}
                  className="btn_border_dark filter_btn"
                >
                  Exit Page
                </Button>
              </li>
              <li>
                <Button
                  type="submit"
                  className="btn_primary"
                  onClick={handleSubmit}
                  disabled={checkViewPermission || checkEditPermission}
                >
                  Save
                </Button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};
export default memo(ReceiptPaymentDetail);
