import { Course, Exam, Task, StudySession } from '../types/study';

export const STORAGE_KEYS = {
  COURSES: 'snack_courses',
  EXAMS: 'snack_exams',
  TASKS: 'snack_tasks',
  SESSIONS: 'snack_sessions',
};

export const getRelativeDateStr = (daysOffset: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + daysOffset);
  return date.toISOString().split('T')[0];
};

export const INITIAL_COURSES: Course[] = [
  { id: 'c1', name: 'Sviluppo Applicazioni Mobile', professor: 'Prof. Alessandro Rossi', semester: 'Anno 2 - Semestre 2', cfu: 6, description: 'Progettazione e sviluppo cross-platform con React Native.', status: 'in_prog', expectedGrade: 30 },
  { id: 'c2', name: 'Intelligenza Artificiale', professor: 'Prof.ssa Chiara Verdi', semester: 'Anno 2 - Semestre 2', cfu: 6, description: 'Machine learning, logica e reti neurali.', status: 'in_prog', expectedGrade: 27 },
  { id: 'c3', name: 'Basi di Dati', professor: 'Prof. Giovanni Bianchi', semester: 'Anno 1 - Semestre 1', cfu: 9, description: 'Modellazione relazionale e linguaggio SQL.', status: 'passed', expectedGrade: 26, obtainedGrade: 28 },
  { id: 'c4', name: 'Sistemi Operativi', professor: 'Prof. Massimo Neri', semester: 'Anno 1 - Semestre 2', cfu: 9, description: 'Thread, CPU scheduling e memoria virtuale.', status: 'to_start', expectedGrade: 28 }
];

export const INITIAL_EXAMS: Exam[] = [
  { id: 'e1', title: 'Discussione Progetto Mobile', courseId: 'c1', date: getRelativeDateStr(5), type: 'project', priority: 'high', status: 'planned' },
  { id: 'e2', title: 'Esame Scritto IA', courseId: 'c2', date: getRelativeDateStr(12), type: 'written', priority: 'medium', status: 'planned' },
  { id: 'e3', title: 'Esame Basi di Dati', courseId: 'c3', date: getRelativeDateStr(-60), type: 'written', priority: 'high', status: 'passed', grade: 28 }
];

export const INITIAL_TASKS: Task[] = [
  { id: 't1', title: 'Progettare Layout Figma App', courseId: 'c1', dueDate: getRelativeDateStr(2), priority: 'high', completed: false, estimatedTime: 120, actualTime: 45 },
  { id: 't2', title: 'Scrivere AsyncStorage Storage', courseId: 'c1', dueDate: getRelativeDateStr(4), priority: 'high', completed: false, estimatedTime: 90, actualTime: 0 },
  { id: 't3', title: 'Ripassare algoritmi di ricerca A*', courseId: 'c2', dueDate: getRelativeDateStr(10), priority: 'medium', completed: false, estimatedTime: 180, actualTime: 60 },
  { id: 't4', title: 'Esercitazione Query SQL', courseId: 'c3', dueDate: getRelativeDateStr(-62), priority: 'medium', completed: true, estimatedTime: 120, actualTime: 120 }
];

export const INITIAL_SESSIONS: StudySession[] = [
  { id: 's1', courseId: 'c1', date: getRelativeDateStr(-5), duration: 60, activityType: 'study' },
  { id: 's2', courseId: 'c1', date: getRelativeDateStr(-4), duration: 90, activityType: 'project' },
  { id: 's3', courseId: 'c2', date: getRelativeDateStr(-3), duration: 120, activityType: 'study' },
  { id: 's4', courseId: 'c1', date: getRelativeDateStr(-2), duration: 45, activityType: 'exercises' },
  { id: 's5', courseId: 'c1', date: getRelativeDateStr(-1), duration: 150, activityType: 'project' }
];