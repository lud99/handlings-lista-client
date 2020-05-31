import { createSlice } from '@reduxjs/toolkit';
import { createSelector } from 'reselect'

const currentListSlice = createSlice({
    name: "currentList",
    initialState: null,
    reducers: {
        setCurrentListId: (state, action) => action.payload,
    }
});

const getCurrentListId = state => state.currentList;
const getLists = state => state.user.lists;

export const getCurrentList = createSelector(
    [getCurrentListId, getLists],
    (listId, lists) => {
        return lists && lists.find(list => list._id === listId)
    }
)

export const { setCurrentListId } = currentListSlice.actions;

export default currentListSlice.reducer;