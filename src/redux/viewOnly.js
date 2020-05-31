import { createSlice } from '@reduxjs/toolkit';

const viewOnlySlice = createSlice({
    name: "viewOnly",
    initialState: false,
    reducers: {
        setViewOnly: (state, action) => action.payload,
    }
});

export const { setViewOnly } = viewOnlySlice.actions;

export default viewOnlySlice.reducer;