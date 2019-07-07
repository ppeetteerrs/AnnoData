import { TaskInterface } from '../models/tasksModel';

export enum ACTIONS {
    SELECT_TASK = 'Select Task'
}

export function selectTask(taskRecord: TaskInterface) {
    return { type: ACTIONS.SELECT_TASK, payload: taskRecord };
}