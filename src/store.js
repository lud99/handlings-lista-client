import { configureStore } from '@reduxjs/toolkit';

import rootReducer from './redux/index';

export default configureStore({ reducer: rootReducer });