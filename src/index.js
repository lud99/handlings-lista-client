import React from 'react';
import ReactDOM from 'react-dom';

import './css/index.css';

import App from './App';

window.findReactComponent = function (el) {
    for (const key in el) {
        if (key.startsWith('__reactInternalInstance$')) {
            const fiberNode = el[key];

            return fiberNode && fiberNode.return && fiberNode.return.stateNode;
        }
    }
    return null;
};

ReactDOM.render(<App />, document.getElementById('root'));