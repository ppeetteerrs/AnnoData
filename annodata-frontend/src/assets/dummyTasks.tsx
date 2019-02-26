import { TaskInterface, TASK_TYPES } from "../models/tasksModel";

export const dummyTasks: TaskInterface[] = [
    {
        key: "0",
        title: "Identifying Cats and Dogs",
        client: "ROSE Lab",
        status: {
            completed: 0,
            total: 10000
        },
        rate: {
            price: 1,
            quantity: 100
        },
        type: TASK_TYPES.IDENTIFICATION
    },
    {
        key: "1",
        title: "Locating Humans",
        client: "Shopee",
        status: {
            completed: 0,
            total: 10000
        },
        rate: {
            price: 1,
            quantity: 100
        },
        type: TASK_TYPES.BOUNDING_BOX
    }
];