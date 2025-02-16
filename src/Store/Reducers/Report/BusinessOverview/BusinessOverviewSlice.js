import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import axios from 'axios';

let initialState = {
  profitAndLossReportData: {},
  profitLossReportDateRange: [],
};

export const getProfitLossReportData = createAsyncThunk(
  'reports/profit-loss',
  data => {
    return new Promise((resolve, reject) => {
      axios
        .post('reports/profit-loss', data)
        .then(({ data }) => {
          if (data?.err === 0) {
            resolve({ data: data?.data });
          } else {
            toast.error(data?.msg);
            reject(data);
          }
        })
        .catch(errors => {
          toast.error(errors);
          reject(errors);
        });
    });
  },
);

const businessOverviewReportsSlice = createSlice({
  name: 'businessOverviewReports',
  initialState,
  reducers: {
    setProfitLossReportDateRange: (state, action) => {
      state.profitLossReportDateRange = action.payload;
    },
  },
  extraReducers: {
    [getProfitLossReportData.pending]: state => {
      state.businessOverviewLoading = true;
    },
    [getProfitLossReportData.rejected]: state => {
      state.profitAndLossReportData = {};
      state.businessOverviewLoading = false;
    },
    [getProfitLossReportData.fulfilled]: (state, action) => {
      state.profitAndLossReportData = action.payload?.data;
      state.businessOverviewLoading = false;
    },
  },
});

export const { setProfitLossReportDateRange } =
  businessOverviewReportsSlice.actions;

export default businessOverviewReportsSlice.reducer;
