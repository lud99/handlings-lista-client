import { createSlice } from '@reduxjs/toolkit';
import Utils from '../Utils';

const accountsSlice = createSlice({
    name: "accounts",
    initialState: JSON.parse(localStorage.getItem("accounts")) || [],
    reducers: {
        setAccounts: (state, action) => action.payload,
        addAccount: (state, action) => {
            state.push({ ...action.payload, id: Utils.createId() });
        },
        setAccount: (state, action) => {
            const account = state.find(account => account.id === action.payload.id);

            if (!account) {
                // Create new account
                state.push({ ...action.payload, id: Utils.createId() });
            } else {
                const index = state.indexOf(account);
                state[index] = action.payload;
            }
        },
        deleteAccount: (state, action) => {
            const account = state.find(account => account.id === action.payload.id);

            if (account) {
                const index = state.indexOf(account);
                state.splice(index, 1);
            } else {
                return state;
            }
        }
    }
});

export const { setAccounts, addAccount, setAccount, deleteAccount } = accountsSlice.actions;

export default accountsSlice.reducer;