import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux';

import './css/index.css';

import App from './App';

import store from './store'; 

//store.subscribe(() => console.log(store.getState()));

ReactDOM.render(
    <Provider store={store}>
        <App store={store}/>
    </Provider>, 

    document.getElementById('root')
);