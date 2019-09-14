import { TaskInterface } from '../models/tasksModel';

export interface AppStateModel {
    taskHistory: TaskInterface[];
}

export const initialState = {
    taskHistory: []
};