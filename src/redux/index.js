import { combineReducers } from 'redux';

import user from './user';
import offline from './offline'
import showInvalidPinSnackbar from './showInvalidPinSnackbar';
import shouldLoad from './shouldLoad';
import editMode from './editMode';

// Combine all reducers into a single reducer
export default combineReducers({ 
    user,
    offline,
    shouldLoad,
    editMode,
    showInvalidPinSnackbar
});