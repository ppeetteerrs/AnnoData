import { createStore } from 'redux';
import { persistStore } from 'redux-persist';
import { persistedReducer } from './reducers';
const anyWindow = window as any;
export const store = createStore(persistedReducer, anyWindow.__REDUX_DEVTOOLS_EXTENSION__ && anyWindow.__REDUX_DEVTOOLS_EXTENSION__());
export const persistor = persistStore(store);