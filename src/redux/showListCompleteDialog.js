import { createSlice } from '@reduxjs/toolkit';

const showListCompleteDialogSlice = createSlice({
    name: "showListCompleteDialog",
    initialState: false,
    reducers: {
        setShowListCompleteDialog: (state, action) => action.payload,
        toggleShowListCompleteDialog: (state, action) => !state
    }
});

export const { setShowListCompleteDialog, toggleShowListCompleteDialog } = showListCompleteDialogSlice.actions;

export default showListCompleteDialogSlice.reducer;