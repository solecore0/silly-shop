import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    screenWidth: window.innerWidth,
  },
  reducers: {
    setScreenWidth(state, action) {
      state.screenWidth = action.payload;
    },
  },
});

export const { setScreenWidth } = uiSlice.actions;
export default uiSlice.reducer;