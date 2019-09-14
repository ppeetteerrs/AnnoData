import { TaskMaster, AnnotationMaster } from './taskMaster';

export type ImageClassificationTask = TaskMaster<{ labels?: string[] }, string>;

export type ImageClassificationAnnotation = AnnotationMaster<string>;

export type ImageClassificationData = string;
