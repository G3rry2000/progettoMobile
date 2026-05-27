export interface Course {
  id: string;
  name: string;
  professor: string;
  semester: string;
  cfu: number;
  description: string;
  status: 'to_start' | 'in_prog' | 'completed' | 'passed';
  expectedGrade?: number;
  obtainedGrade?: number;
}

export interface Exam {
  id: string;
  title: string;
  courseId: string;
  date: string;
  type: 'written' | 'oral' | 'project' | 'online';
  priority: 'low' | 'medium' | 'high';
  status: 'planned' | 'passed' | 'failed' | 'cancelled';
  grade?: number;
  note?: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  courseId?: string;
  dueDate?: string;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  estimatedTime: number;
  actualTime: number;
}

export interface StudySession {
  id: string;
  courseId: string;
  date: string;
  duration: number;
  activityType: 'study' | 'revision' | 'exercises' | 'reading' | 'project';
  notes?: string;
}

export interface Suggestion {
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  courseId?: string;
  taskId?: string;
}