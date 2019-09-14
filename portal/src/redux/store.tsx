import { applyMiddleware, compose, createStore } from 'redux';
import { persistReducer, persistStore } from 'redux-persist';
import thunk from 'redux-thunk';
import { AppState } from '../models/models';
import { AppAction } from './actions';
import { initialState, PERSIST_CONFIG, persistedReducer } from './reducers';

// Disable Redux DevTools in production for better performance
export const store = process.env.NODE_ENV == 'development' ? createStore(
    persistedReducer,
    initialState,
    compose(applyMiddleware<{}, AppState>(thunk),
        (window as any).__REDUX_DEVTOOLS_EXTENSION__ &&
        (window as any).__REDUX_DEVTOOLS_EXTENSION__()
    )
) : createStore(
    persistedReducer,
    initialState,
    compose(applyMiddleware<{}, AppState>(thunk)
    )
);

if (module.hot) {
    module.hot.accept('./reducers.tsx', () => {
        let nextRootReducer = require('./reducers').rootReducer;
        store.replaceReducer(
            persistReducer(PERSIST_CONFIG, nextRootReducer)
        );
    });
}


export const persistor = persistStore(store);