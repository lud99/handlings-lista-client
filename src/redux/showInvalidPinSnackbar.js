import { createSlice } from '@reduxjs/toolkit';

const showInvalidPinSnackbarSlice = createSlice({
    name: "showInvalidPinSnackbar",
    initialState: false,
    reducers: {
        setShowInvalidPinSnackbar: (state, action) => action.payload,
    }
});

export const { setShowInvalidPinSnackbar } = showInvalidPinSnackbarSlice.actions;

export default showInvalidPinSnackbarSlice.reducer;