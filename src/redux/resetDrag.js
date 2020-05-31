import { createSlice } from '@reduxjs/toolkit';

const resetDragSlice = createSlice({
    name: "resetDrag",
    initialState: false,
    reducers: {
        setResetDrag: (state, action) => action.payload,
    }
});

export const { setResetDrag } = resetDragSlice.actions;

export default resetDragSlice.reducer;