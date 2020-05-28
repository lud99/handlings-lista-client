import { combineReducers } from 'redux';

import lists from './lists';
import listItems from './listItems';

// Combine all reducers into a single reducer
export default combineReducers({ 
    lists,
    listItems
});