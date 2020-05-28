import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux';
import { createStore } from 'redux';

import './css/index.css';

import App from './App';

import reducers from './reducers'; 

import { addList, removeList, renameList } from './actions/lists';
import { addListItem, removeListItem, renameListItem } from './actions/listItems';

const store = createStore(reducers);

store.subscribe(() => {
    console.log(store.getState())
})

store.dispatch(addList("Att handla", 0));

store.dispatch(addListItem("milk", 0, 0));
store.dispatch(addListItem("carrots", 1, 0));
store.dispatch(addListItem("dirt", 2, 0));

store.dispatch(renameList("ulla", 0));

store.dispatch(addListItem("vegetables", 3, 0));
store.dispatch(renameListItem("abouw", 2))
store.dispatch(addListItem("computer", 4, 0));

store.dispatch(removeListItem(1));

store.dispatch(removeList(0))

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>, 

    document.getElementById('root')
);