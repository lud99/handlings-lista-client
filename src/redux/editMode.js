import { createSlice } from '@reduxjs/toolkit';

const editModeSlice = createSlice({
    name: "editMode",
    initialState: false,
    reducers: {
        setEditMode: (state, action) => action.payload,
        toggleEditMode: (state, action) => !state
    }
});

export const { setEditMode, toggleEditMode } = editModeSlice.actions;

export default editModeSlice.reducer;