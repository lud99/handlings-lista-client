import { createSlice } from '@reduxjs/toolkit';

const shouldLoadSlice = createSlice({
    name: "shouldLoad",
    initialState: true,
    reducers: {
        setShouldLoad: (state, action) => action.payload
    }
});

export const { setShouldLoad } = shouldLoadSlice.actions;

export default shouldLoadSlice.reducer;