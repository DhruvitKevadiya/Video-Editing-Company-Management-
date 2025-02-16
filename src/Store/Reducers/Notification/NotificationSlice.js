import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';

let initialState = {
  notificationList: {},
  notificationListLoading: false,
  notificationCurrentPage: 1,
  notificationPageLimit: 0,
};

export const getNotificationList = createAsyncThunk(
  'notification/list-notification',
  data => {
    return new Promise((resolve, reject) => {
      axios
        .post('notification/list-notification', data)
        .then(({ data }) => {
          if (data?.err === 0) {
            // toast.success(data?.msg)
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

export const clearNotification = createAsyncThunk(
  'notification/clear-notification',
  data => {
    return new Promise((resolve, reject) => {
      axios
        .post('notification/clear-notification', data)
        .then(({ data }) => {
          if (data?.err === 0) {
            toast.success(data?.msg);
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

export const readNotification = createAsyncThunk(
  'notification/read-notification',
  data => {
    return new Promise((resolve, reject) => {
      axios
        .post('notification/read-notification', data)
        .then(({ data }) => {
          if (data?.err === 0) {
            toast.success(data?.msg);
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

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setNotificationList: (state, action) => {
      state.notificationList = action.payload;
    },
  },
  extraReducers: {
    [getNotificationList.pending]: state => {
      state.notificationListLoading = true;
    },
    [getNotificationList.rejected]: state => {
      state.notificationList = {};
      state.notificationListLoading = false;
    },
    [getNotificationList.fulfilled]: (state, action) => {
      state.notificationList = action.payload?.data;
      state.notificationListLoading = false;
    },
    [clearNotification.pending]: state => {
      state.notificationListLoading = true;
    },
    [clearNotification.rejected]: state => {
      state.notificationListLoading = false;
    },
    [clearNotification.fulfilled]: (state, action) => {
      state.notificationList = action.payload?.data;
      state.notificationListLoading = false;
    },
    [readNotification.pending]: state => {
      state.notificationListLoading = true;
    },
    [readNotification.rejected]: state => {
      state.notificationListLoading = false;
    },
    [readNotification.fulfilled]: (state, action) => {
      state.notificationListLoading = false;
    },
  },
});

export const { setNotificationList } = notificationSlice.actions;

export default notificationSlice.reducer;
