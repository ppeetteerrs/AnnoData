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
    type: TASK_TYPES
}

export enum TASK_TYPES {
    BOUNDING_BOX = "Bounding Box", IDENTIFICATION = "Identification"
};

export interface TaskItem {

}