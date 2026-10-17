import { PTE_ACADEMIC, PTE_CORE, TASK_TYPES } from './pte';
import type { ExamId, ExamSpec, TaskTypeId, TaskTypeSpec } from './types';

export const EXAMS: Record<ExamId, ExamSpec> = {
  'pte-academic': PTE_ACADEMIC,
  'pte-core': PTE_CORE,
};

export const EXAM_LIST: ExamSpec[] = Object.values(EXAMS);

export function getExam(id: ExamId): ExamSpec {
  return EXAMS[id];
}

export function getTaskType(id: TaskTypeId): TaskTypeSpec {
  return TASK_TYPES[id];
}

export function isTaskTypeId(value: string): value is TaskTypeId {
  return value in TASK_TYPES;
}

/** Task types in exam order for the given exam. */
export function examTaskTypes(exam: ExamSpec): TaskTypeSpec[] {
  return exam.sections.flatMap((s) => s.taskTypes.map(getTaskType));
}

export { TASK_TYPES };
export * from './targets';
export type * from './types';
