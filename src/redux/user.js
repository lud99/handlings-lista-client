import { createSlice } from '@reduxjs/toolkit';

import listItemReducers from './listItemReducers';
import WebSocketConnection from '../WebSocketConnection';
import Utils from '../Utils';

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

        // List
        setLists: (state, action) => ({ ...state, lists: setLocalTextInLists(action.payload) }),
        addList: (state, action) => (
            {
                ...state, lists: [
                    { ...action.payload, localText: action.payload.text },
                    ...state.lists
                ]
            }
        ),
        createList: (state, action) => {
            WebSocketConnection.send({
                type: "create-list",
                name: action.payload.name,
                pin: action.state.pin
            });

            return state;
        },
        removeList: (state, action) => {
            if (!action.payload._id) return state;

            // Send the state update to the server
            if (!action.payload.localOnly) {
                WebSocketConnection.send({
                    type: "remove-list",
                    pin: state.pin,
                    listId: action.payload._id,
                });
            }

            // Find the index of the list in the array, then remove it 
            state.lists.splice(state.lists.indexOf(Utils.findList(state.lists, action.payload._id)), 1);
        },
        renameList: (state, action) => {
            // Find the list in the array, then rename it 
            const list = Utils.findList(state.lists, action.payload._id);

            if (state.name === action.name) return state;

            // Send the state update to the server
            if (!action.payload.localOnly) {
                WebSocketConnection.send({
                    type: "rename-list",
                    pin: state.pin,
                    listId: action.payload._id,
                    newName: action.payload.name
                });
            }

            list.name = action.payload.name;
        },

        // List items
        ...listItemReducers
    }
});

// User
export const { setUserInitialState, setUser, setPin, setLoggedIn } = userSlice.actions;

// Lists
export const { setLists, addList, createList, removeList, renameList } = userSlice.actions;

// List items
export const { 
    setListItems, addListItem, createListItem, removeListItem, 
    toggleListItemCompleted, renameListItem, renameListItemLocal, 
    reorderListItems } = userSlice.actions;

export default userSlice.reducer;