import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';

let initialState = {
  commonLoading: false,
  userCompanyList: [],
};

/**
 * @desc Find User Company list
 */

export const findUserCompanyList = createAsyncThunk(
  'find-user-company-list',
  (data, { dispatch }) => {
    return new Promise((resolve, reject) => {
      axios
        .post('user/companylist', data)
        .then(({ data }) => {
          if (data?.err === 0) {
            resolve({ data: data.data });
          } else {
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

const commonSlice = createSlice({
  name: 'common',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.commonLoading = action.payload;
    },
    setUserCompanyList: (state, action) => {
      state.userCompanyList = action.payload;
    },
  },

  extraReducers: {
    [findUserCompanyList.pending]: (state, action) => {
      state.commonLoading = true;
      state.userCompanyList = [];
    },
    [findUserCompanyList.rejected]: (state, action) => {
      state.commonLoading = false;
      state.userCompanyList = [];
    },
    [findUserCompanyList.fulfilled]: (state, action) => {
      state.commonLoading = false;
      state.userCompanyList = action.payload?.data?.map(d => {
        return { label: d?.company_name, value: d?._id };
      });
    },
  },
});

export const { setLoading, setUserCompanyList } = commonSlice.actions;

export default commonSlice.reducer;
