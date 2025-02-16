import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';

let initialState = {
  accountList: {},
  accountLoading: false,
  isAddAccount: false,
  isUpdateAccount: false,
  isDeleteAccount: false,
  accountPageLimit: 0,
  accountCurrentPage: 0,
  accountSearchParam: '',
  selectedAccountData: {},
};

/**
 * @desc list-account
 * @param (limit, start, isActive,search)
 */

export const getAccountList = createAsyncThunk('account/list-account', data => {
  return new Promise((resolve, reject) => {
    axios
      .post('account/list-account', data)
      .then(res => {
        const { data, err, msg } = res?.data;

        const newObj = {
          list: data?.list ? data?.list : [],
          pageNo: data?.pageNo ? data?.pageNo : '',
          totalRows: data?.totalRows ? data?.totalRows : 0,
        };

        if (err === 0) {
          resolve({ data: newObj });
        } else {
          toast.error(msg);
          reject(data);
        }
      })
      .catch(errors => {
        toast.error(errors);
        reject(errors);
      });
  });
});

/**
 * @desc add-account
 */

export const addAccount = createAsyncThunk('account/add-account', data => {
  return new Promise((resolve, reject) => {
    axios
      .post('account/add-account', data)
      .then(({ data }) => {
        if (data?.err === 0) {
          resolve({ data: data?.data });
          toast.success(data?.msg);
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
});

/**
 * @desc edit-account
 */

export const editAccount = createAsyncThunk('account/edit-account', data => {
  return new Promise((resolve, reject) => {
    axios
      .post('account/edit-account', data)
      .then(({ data }) => {
        if (data?.err === 0) {
          resolve({ data: data?.data });
          toast.success(data?.msg);
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
});

/**
 * @desc delete-account
 */

export const deleteAccount = createAsyncThunk(
  'account/delete-account',
  data => {
    return new Promise((resolve, reject) => {
      axios
        .post('account/delete-account', data)
        .then(({ data }) => {
          if (data?.err === 0) {
            resolve({ data: data?.data });
            toast.success(data?.msg);
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

/**
 * @desc get-account
 */

export const getAccount = createAsyncThunk('account/get-account', data => {
  return new Promise((resolve, reject) => {
    axios
      .post('account/get-account', data)
      .then(res => {
        const { data, err, msg } = res?.data;

        if (err === 0) {
          resolve(data);
        } else {
          toast.error(msg);
          reject(data);
        }
      })
      .catch(errors => {
        toast.error(errors);
        reject(errors);
      });
  });
});

const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    setAccountCurrentPage: (state, action) => {
      state.accountCurrentPage = action.payload;
    },
    setAccountPageLimit: (state, action) => {
      state.accountPageLimit = action.payload;
    },
    setIsDeleteAccount: (state, action) => {
      state.isDeleteAccount = action.payload;
    },
    setIsUpdateAccount: (state, action) => {
      state.isUpdateAccount = action.payload;
    },
    setIsAddAccount: (state, action) => {
      state.isAddAccount = action.payload;
    },
    setAccountSearchParam: (state, action) => {
      state.accountSearchParam = action.payload;
    },
    setAccountList: (state, action) => {
      state.accountList = action.payload;
    },
  },
  extraReducers: {
    [getAccountList.pending]: state => {
      state.accountLoading = true;
    },
    [getAccountList.rejected]: state => {
      state.accountList = {};
      state.accountLoading = false;
    },
    [getAccountList.fulfilled]: (state, action) => {
      state.accountList = action.payload?.data;
      state.accountLoading = false;
    },
    [addAccount.pending]: state => {
      state.isAddAccount = false;
      state.accountLoading = true;
    },
    [addAccount.rejected]: state => {
      state.isAddAccount = false;
      state.accountLoading = false;
    },
    [addAccount.fulfilled]: state => {
      state.isAddAccount = true;
      state.accountLoading = false;
    },
    [editAccount.pending]: state => {
      state.isUpdateAccount = false;
      state.accountLoading = true;
    },
    [editAccount.rejected]: state => {
      state.isUpdateAccount = false;
      state.accountLoading = false;
    },
    [editAccount.fulfilled]: state => {
      state.isUpdateAccount = true;
      state.accountLoading = false;
    },
    [deleteAccount.pending]: state => {
      state.isDeleteAccount = false;
      state.accountLoading = true;
    },
    [deleteAccount.rejected]: state => {
      state.isDeleteAccount = false;
      state.accountLoading = false;
    },
    [deleteAccount.fulfilled]: state => {
      state.isDeleteAccount = true;
      state.accountLoading = false;
    },
    [getAccount.pending]: state => {
      state.selectedAccountData = {};
      state.accountLoading = true;
    },
    [getAccount.rejected]: state => {
      state.selectedAccountData = {};
      state.accountLoading = false;
    },
    [getAccount.fulfilled]: (state, action) => {
      state.selectedAccountData = action?.payload;
      state.accountLoading = false;
    },
  },
});

export const {
  setAccountCurrentPage,
  setAccountPageLimit,
  setIsAddAccount,
  setIsUpdateAccount,
  setIsDeleteAccount,
  setAccountSearchParam,
  setAccountList,
} = accountSlice.actions;

export default accountSlice.reducer;
