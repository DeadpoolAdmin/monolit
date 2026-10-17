import { createSlice } from "@reduxjs/toolkit";

const controlSlice = createSlice({
  name: "movieCurrentRow",
  initialState: {
    currentRow: 0
  },
  reducers: {
    setCurrentRow: (state, action) => {
      state.currentRow = action.payload;
    }
  },
});

export const { setCurrentRow } = controlSlice.actions;
export default controlSlice.reducer;