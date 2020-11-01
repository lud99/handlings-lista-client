import { createSlice } from '@reduxjs/toolkit';

const showAccountDialogSlice = createSlice({
    name: "showAccountDialog",
    initialState: { changeAccount: false, manageAccounts: false },
    reducers: {
        setShowChangeAccountDialog: (state, action) => ({ ...state, changeAccount: action.payload }), 
        setShowManageAccountsDialog: (state, action) => ({ ...state, manageAccounts: action.payload })
    }
});

export const { setShowChangeAccountDialog, setShowManageAccountsDialog } = showAccountDialogSlice.actions;

export default showAccountDialogSlice.reducer;