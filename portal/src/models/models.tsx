import moment, { Moment } from 'moment';
import { string } from 'prop-types';
import { RouteComponentProps } from 'react-router-dom';
import { ActionCreator, Dispatch } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { AppAction } from '../redux/actions';

/**
 * THIS PAGE IS VERY IMPORTANT IF YOU WOULD LIKE TO CUSTOMIZE THE APP BEHAVIOUR
 * AppState: Redux Store state interface
 * AppReducer: 
 */

// Define App State
export type AppState = {
    loading: boolean;
    authToken?: string;
};

// Normal Redux Reducer for the App
export type AppReducer = (state: AppState | undefined, action: AppAction) => AppState;

// Thunk Action Type for the App
export type AppThunkAction = ThunkAction<Promise<void>, AppState, {}, AppAction>;
export type AppDispatch = ThunkDispatch<AppState, {}, AppAction>;

// Pages for the App
export type AppPage = 'overview' | 'leakage';