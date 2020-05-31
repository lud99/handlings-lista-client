import { createSlice } from '@reduxjs/toolkit';

const showReadOnlySnackbarSlice = createSlice({
    name: "showReadOnlySnackbar",
    initialState: false,
    reducers: {
        setShowReadOnlySnackbar: (state, action) => action.payload,
    }
});

export const { setShowReadOnlySnackbar } = showReadOnlySnackbarSlice.actions;

export default showReadOnlySnackbarSlice.reducer;