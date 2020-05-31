import { combineReducers } from 'redux';

import user from './user';
import currentList from './currentList';
import offline from './offline'
import viewOnly from './viewOnly';
import showInvalidPinSnackbar from './showInvalidPinSnackbar';
import showReadOnlySnackbar from './showReadOnlySnackbar';
import shouldLoad from './shouldLoad';
import editMode from './editMode';
import resetDrag from './resetDrag';

// Combine all reducers into a single reducer
export default combineReducers({ 
    user,
    offline,
    currentList,
    shouldLoad,
    viewOnly,
    editMode,
    showInvalidPinSnackbar,
    showReadOnlySnackbar,
    resetDrag
});