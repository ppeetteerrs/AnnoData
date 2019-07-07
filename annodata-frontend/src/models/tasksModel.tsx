export interface TaskInterface {
    key: string;
    title: string;
    client: string;
    status: {
        completed: number;
        total: number;
    };
    rate: {
        price: number;
        quantity: number;
    };
    type: TASK_TYPES;
    images: string[];
    completed?: string[];
    labels: string[];
    taskInfo?: {
        imageWidth?: number,
        imageHeight?: number
    };
}

export enum TASK_TYPES {
    IMAGE_CLASSIFICATION = 'Image Classification', // Choose from available classes
    IMAGE_LOCALIZATION = 'Image Localization', // Bounding Boxes, does not recognize object class
    IMAGE_RECOGNITION = 'Image Recognition', // Bounding Boxes + Classes
}

export interface TaskItem {

}