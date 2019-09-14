import { PersistConfig, persistReducer } from 'redux-persist';
import autoMergeLevel2 from 'redux-persist/es/stateReconciler/autoMergeLevel2';
import storage from 'redux-persist/lib/storage';
import { ACTIONS } from './actions';
import { AppStateModel, initialState } from './state';
const persistConfig: PersistConfig = {
    key: 'root',
    storage,
    stateReconciler: autoMergeLevel2
};


function rootReducer(
    state: AppStateModel = initialState,
    action: {
        type: ACTIONS;
        payload: any;
    }) {
    const newState = { ...state };

    if (action.type === ACTIONS.SELECT_TASK) {
        let taskIndex = state.taskHistory.findIndex((task) => {
            return task.key === action.payload.key;
        });
        if (taskIndex > 0) {
            // Resume task
            const task = newState.taskHistory[taskIndex];
            newState.taskHistory = [task, ...newState.taskHistory.splice(taskIndex, 1)];
        } else if (taskIndex != 0) {
            // Add task to history
            newState.taskHistory = [action.payload, ...newState.taskHistory];
        } else {
            newState.taskHistory[0] = {
                ...state.taskHistory[0],
                ...action.payload
            };
        }
    }

    return newState;
}
export const persistedReducer = persistReducer(persistConfig, rootReducer);