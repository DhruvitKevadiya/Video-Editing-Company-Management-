import { createSlice } from '@reduxjs/toolkit';

let initialState = {
  selectedEmployee: {},
  selectedEmployeeEvents: [],
  monthAsPerSelectedEmployee: new Date(),
};

const calendarSlice = createSlice({
  name: 'calendar',
  initialState,
  reducers: {
    setSelectedEmployee: (state, action) => {
      state.selectedEmployee = action.payload;
    },
    setSelectedEmployeeEvents: (state, action) => {
      state.selectedEmployeeEvents = action.payload;
    },
    setMonthAsPerSelectedEmployee: (state, action) => {
      state.monthAsPerSelectedEmployee = action.payload;
    },
  },
  extraReducers: {},
});

export const {
  setSelectedEmployee,
  setSelectedEmployeeEvents,
  setMonthAsPerSelectedEmployee,
} = calendarSlice.actions;

export default calendarSlice.reducer;
