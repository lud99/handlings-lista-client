import { createSlice } from '@reduxjs/toolkit';

const offlineSlice = createSlice({
    name: "offline",
    initialState: false,
    reducers: {
        setOffline: (state, action) => action.payload,
    }
});

export const { setOffline } = offlineSlice.actions;

export default offlineSlice.reducer;