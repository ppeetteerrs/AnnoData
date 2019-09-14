import moment from 'moment';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { AppReducer, AppState } from '../models/models';

export const PERSIST_CONFIG = {
    key: 'appState',
    storage,
    whitelist: ['authToken']
};

// Initial App State
export let initialState: AppState = {
    loading: false,
    authToken: undefined
};

// App Reducer (there is only one single reducer currently)
export const rootReducer: AppReducer = (
    state = initialState,
    action) => {
    const newState = { ...state };
    switch (action.type) {
        case 'UPDATE_LOADING':
            newState.loading = action.loading;
            break;
        case 'UPDATE_TOKEN':
            newState.authToken = action.token;
            break;
    }
    return newState;
};

export const persistedReducer = persistReducer(PERSIST_CONFIG, rootReducer);