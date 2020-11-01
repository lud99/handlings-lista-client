import { combineReducers } from 'redux';

import user from './user';
import accounts from './accounts';
import currentList from './currentList';
import offline from './offline'
import viewOnly from './viewOnly';
import showInvalidPinSnackbar from './showInvalidPinSnackbar';
import showReadOnlySnackbar from './showReadOnlySnackbar';
import showListCompletedDialog from './showListCompleteDialog';
import shouldLoad from './shouldLoad';
import editMode from './editMode';
import resetDrag from './resetDrag';

import showAccountDialog from './basic/showAccountDialog';

// Combine all reducers into a single reducer
export default combineReducers({ 
    user,
    accounts,
    offline,
    currentList,
    shouldLoad,
    viewOnly,
    editMode,
    showInvalidPinSnackbar,
    showReadOnlySnackbar,
    showListCompletedDialog,
    resetDrag,
    showAccountDialog
});