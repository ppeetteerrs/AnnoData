import { TASK_TYPES, TaskInterface } from '../models/tasksModel';
import animalLinks from './dummyAnimalImages';
import animals from './dummyAnimals';
import labels from './dummyLabels';

export const dummyTasks: TaskInterface[] = [
    {
        key: '0',
        title: 'Identifying Cats and Dogs',
        client: 'ROSE Lab',
        status: {
            completed: 0,
            total: 10000
        },
        rate: {
            price: 1,
            quantity: 100
        },
        type: TASK_TYPES.IMAGE_CLASSIFICATION,
        images: animalLinks,
        labels: animals
    },
    {
        key: '1',
        title: 'Locating Humans',
        client: 'Shopee',
        status: {
            completed: 0,
            total: 10000
        },
        rate: {
            price: 1,
            quantity: 100
        },
        type: TASK_TYPES.IMAGE_LOCALIZATION,
        images: animalLinks,
        labels: animals
    },
    {
        key: '2',
        title: 'Locating Humans',
        client: 'Shopee',
        status: {
            completed: 0,
            total: 10000
        },
        rate: {
            price: 1,
            quantity: 100
        },
        type: TASK_TYPES.IMAGE_RECOGNITION,
        images: animalLinks,
        labels: animals,
        taskInfo: {
            imageWidth: 224,
            imageHeight: 224
        }
    }
];