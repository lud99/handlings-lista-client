import { createSlice } from '@reduxjs/toolkit';
import { createSelector } from 'reselect'

import listReducers from './reducers/listReducers';
import listItemReducers from './reducers/listItemReducers';
import historyListReducers from './reducers/historyListReducers';

const setLocalTextInLists = (lists) => (
    lists.map(list => (
        {
            ...list, items: list.items.map(item => (
                { ...item, localText: item.text }
            ))
        }
    ))
);

const initialState = { pin: localStorage.getItem("pin"), loggedIn: false };

const userSlice = createSlice({
    name: "user",
    initialState: initialState,
    reducers: {
        // User
        setUser: (state, action) => ({ ...action.payload, loggedIn: true, lists: setLocalTextInLists(action.payload.lists) }),
        setUserInitialState: () => initialState,
        setPin: (state, action) => ({ ...state, pin: action.payload }),
        setLoggedIn: (state, action) => ({ ...state, loggedIn: action.payload }),
        setStats: (state, action) => ({ ...state, stats: action.payload }),
        logout: (state, action) => {
            localStorage.removeItem("pin");

            return { ...initialState, pin: null }
        },

        ...listReducers,
        ...listItemReducers,
        ...historyListReducers
    }
});

const getLists = state => state.user.lists;
const getItemId = (state, props) => props.id;

export const makeGetListItemFromId = () => {
    return createSelector(
        [getLists, getItemId],
        (lists, id) => {
            return lists && lists.map(list => list.items.find(item => item._id === id)).filter(e => !!e)[0];
        }
    )
}

// User
export const { setUserInitialState, setUser, setPin, setLoggedIn, setStats, logout } = userSlice.actions;

// Lists
export const { setLists, addList, createList, removeList, renameList, setListCompleted, removeCompletedItems } = userSlice.actions;

// List items
export const { 
    setListItems, addListItem, createListItem, removeListItem, 
    toggleListItemCompleted, renameListItem, renameListItemLocal, 
    reorderListItems, sortListItems } = userSlice.actions;

export default userSlice.reducer;