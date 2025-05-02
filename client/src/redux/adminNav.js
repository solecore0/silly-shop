import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
    admin: true, 
    nav: false,
};



const adminNavSlice = createSlice({
    name: 'adminNav',
    initialState,
    reducers: {
        toggleNav: (state) => {
            state.nav = !state.nav;
        },
        toggleonAdmin: (state) => {
            state.admin = true
        },
        toggleoffAdmin: (state) => {
            state.admin = false
        }
    },
});

export const { toggleNav, toggleonAdmin, toggleoffAdmin } = adminNavSlice.actions;
export default adminNavSlice.reducer;
