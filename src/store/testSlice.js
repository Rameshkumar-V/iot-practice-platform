import { createSlice } from "@reduxjs/toolkit";

const testSlice = createSlice({
  name: "test",
  initialState: {
    isLedOn: 0,
  },
  reducers: {
    setOn: (state) => {
      state.isLedOn = 1;
    },
    setOff: (state) => {
      state.isLedOn = 0;
    },
  },
});

// ✅ correct exports
export const { setOn, setOff } = testSlice.actions;
export default testSlice.reducer;
