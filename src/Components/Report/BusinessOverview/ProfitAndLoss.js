import React, { useCallback, useEffect, useMemo } from 'react';
import { Button } from 'primereact/button';
import { Col, Row, Table } from 'react-bootstrap';
import { Calendar } from 'primereact/calendar';
import PdfIcon from '../../../Assets/Images/pdf-icon.svg';
import EmailIcon from '../../../Assets/Images/email-icon.svg';
import ArrowIcon from '../../../Assets/Images/left_arrow.svg';
import { useDispatch, useSelector } from 'react-redux';
import {
  getProfitLossReportData,
  setProfitLossReportDateRange,
} from 'Store/Reducers/Report/BusinessOverview/BusinessOverviewSlice';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';

const ProfitAndLoss = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { profitAndLossReportData, profitLossReportDateRange } = useSelector(
    ({ businessOverviewReports }) => businessOverviewReports,
  );

  const currentDate =
    profitLossReportDateRange?.length > 0 &&
    !!profitLossReportDateRange[0] &&
    !!profitLossReportDateRange[1]
      ? moment(profitLossReportDateRange[0])?.format('DD-MM-YYYY') +
        ' to ' +
        moment(profitLossReportDateRange[1])?.format('DD-MM-YYYY')
      : moment().format('DD-MM-YYYY');

  const fetchRequiredData = useCallback(
    (startDate = '', endDate = '') => {
      dispatch(
        getProfitLossReportData({
          start_date: startDate,
          end_date: endDate,
        }),
      );
    },
    [dispatch],
  );

  useEffect(() => {
    const startDate =
      profitLossReportDateRange?.length && profitLossReportDateRange[0]
        ? moment(profitLossReportDateRange[0])?.format('YYYY-MM-DD')
        : '';
    const endDate =
      profitLossReportDateRange?.length && profitLossReportDateRange[1]
        ? moment(profitLossReportDateRange[1])?.format('YYYY-MM-DD')
        : '';

    fetchRequiredData(startDate, endDate);
  }, []);

  const handleProfitLossReportDateRange = useCallback(
    e => {
      dispatch(setProfitLossReportDateRange(e?.value));

      if (
        (e?.value?.[0] !== null && e?.value?.[1] !== null) ||
        e?.value === null
      ) {
        const startDate =
          e?.value?.length && e?.value[0]
            ? moment(e?.value[0])?.format('YYYY-MM-DD')
            : '';
        const endDate =
          e?.value?.length && e?.value[1]
            ? moment(e?.value[1])?.format('YYYY-MM-DD')
            : '';

        fetchRequiredData(startDate, endDate);
      }
    },
    [dispatch, fetchRequiredData],
  );

  const totalCalculations = useMemo(() => {
    let totalIncome = 0;
    let totalExpense = 0;

    if (profitAndLossReportData?.income) {
      totalIncome = profitAndLossReportData.income.reduce((acc, curr) => {
        return (acc += curr.amount);
      }, 0);
    }

    if (profitAndLossReportData?.expense) {
      totalExpense = profitAndLossReportData.expense.reduce((acc, curr) => {
        return (acc += curr.amount);
      }, 0);
    }

    const netProfit = totalIncome - totalExpense;

    return { totalIncome, totalExpense, netProfit };
  }, [profitAndLossReportData]);

  return (
    <div className="main_Wrapper">
      <div className="table_main_Wrapper">
        <div className="top_filter_wrap">
          <Row className="align-items-center gy-3">
            <Col xl={3}>
              <div className="back_page">
                <div className="btn_as_text d-flex align-items-center">
                  <Button
                    className="btn_transparent pe-3"
                    onClick={() => {
                      navigate('/reports');
                    }}
                  >
                    <img src={ArrowIcon} alt="ArrowIcon" />
                  </Button>
                  <div class="page_title d-flex align-items-center">
                    <h2 class="m-0 pe-2">Profit & Loss</h2>
                    <span>As of {`${currentDate}`}</span>
                  </div>
                </div>
              </div>
            </Col>
            <Col xl={9}>
              <div className="right_filter_wrapper">
                <ul className="expenses_ul">
                  <li>
                    <div className="date_select text-end">
                      <Calendar
                        value={profitLossReportDateRange}
                        placeholder="Select Date Range"
                        onChange={e => {
                          handleProfitLossReportDateRange(e);
                        }}
                        showIcon
                        showButtonBar
                        selectionMode="range"
                        dateFormat="dd-mm-yy"
                        readOnlyInput
                      />
                    </div>
                  </li>
                  <li>
                    <Button className="btn_border_dark filter_btn">
                      <img src={PdfIcon} alt="" /> Save As PDF
                    </Button>
                  </li>
                  <li>
                    <button className="btn_border_dark">
                      <img src={EmailIcon} alt="EmailIcon" /> Send Email
                    </button>
                  </li>
                </ul>
              </div>
            </Col>
          </Row>
        </div>
        <div className="table_profit_loss">
          <Col
            md={6}
            xs={12}
            className="income_wrap d-flex flex-column justify-content-between"
          >
            <div>
              <div className="profit-income-title">
                <h5 className="m-0">Income</h5>
              </div>
              <Table className="account_table">
                <thead>
                  <tr>
                    <th>Income Account</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {profitAndLossReportData?.income?.length > 0 &&
                    profitAndLossReportData?.income?.map(income => {
                      return (
                        <tr>
                          <td>{income.account_name}</td>
                          <td className="text-end">{income.amount}</td>
                        </tr>
                      );
                    })}
                  <tr>
                    <td></td>
                    <td className="text-end fw-bold">
                      {`₹ ${totalCalculations.totalIncome}`}
                    </td>
                  </tr>
                </tbody>
              </Table>
            </div>
            <div>
              <div className="profit_data d-flex justify-content-between">
                <h5 className="m-0">Gross Profit GP</h5>
                <h5 className="m-0">{`₹ ${totalCalculations.totalIncome}`}</h5>
              </div>
              <div className="table-bottom d-flex justify-content-end">
                <h5 className="m-0 fw-bold">
                  <span className="pe-2"> Total</span>{' '}
                  {`₹ ${totalCalculations.totalIncome}`}
                </h5>
              </div>
            </div>
          </Col>
          <Col
            md={6}
            xs={12}
            className="ps-0 d-flex flex-column justify-content-between"
          >
            <div>
              <div className="profit-income-title">
                <h5 className="m-0">Expense</h5>
              </div>
              <Table className="account_table">
                <thead>
                  <tr>
                    <th>Expense Account</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {profitAndLossReportData?.expense?.length > 0 &&
                    profitAndLossReportData?.expense?.map(expense => {
                      return (
                        <tr>
                          <td>{expense.account_name}</td>
                          <td className="text-end">{expense.amount}</td>
                        </tr>
                      );
                    })}
                  <tr>
                    <td></td>
                    <td className="text-end fw-bold">{`₹ ${totalCalculations.totalExpense}`}</td>
                  </tr>
                </tbody>
              </Table>
            </div>
            <div>
              <div className="profit_data d-flex justify-content-between">
                <h5 className="m-0">Net Profit Np</h5>
                <h5 className="m-0">{`₹ ${totalCalculations.netProfit}`}</h5>
              </div>
              <div className="table-bottom d-flex justify-content-end">
                <h5 className="m-0 fw-bold">
                  <span className="pe-2"> Total</span>{' '}
                  {`₹ ${totalCalculations.totalExpense}`}
                </h5>
              </div>
            </div>
          </Col>
        </div>
      </div>
    </div>
  );
};

export default ProfitAndLoss;
