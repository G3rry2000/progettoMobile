import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Course, Exam, Task, StudySession, Suggestion } from '../types/study';
import { STORAGE_KEYS, INITIAL_COURSES, INITIAL_EXAMS, INITIAL_TASKS, INITIAL_SESSIONS, getRelativeDateStr } from '../constants/initialData';

interface StudyContextType {
  courses: Course[];
  exams: Exam[];
  tasks: Task[];
  sessions: StudySession[];
  loading: boolean;
  addCourse: (course: Omit<Course, 'id'>) => Promise<void>;
  updateCourse: (id: string, course: Partial<Course>) => Promise<void>;
  deleteCourse: (id: string) => Promise<void>;
  addExam: (exam: Omit<Exam, 'id'>) => Promise<void>;
  updateExam: (id: string, exam: Partial<Exam>) => Promise<void>;
  deleteExam: (id: string) => Promise<void>;
  addTask: (task: Omit<Task, 'id' | 'completed' | 'actualTime'>) => Promise<void>;
  updateTask: (id: string, task: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  toggleTaskCompleted: (id: string) => Promise<void>;
  addSession: (session: Omit<StudySession, 'id'>) => Promise<void>;
  deleteSession: (id: string) => Promise<void>;
  stats: {
    totalCFU: number;
    passedCFU: number;
    weightedAverage: number;
    totalStudyHours: number;
    completedTasksCount: number;
    pendingTasksCount: number;
    weeklyStudyMinutes: { [day: string]: number };
  };
  smartSuggestion: Suggestion | null;
}

const StudyContext = createContext<StudyContextType | undefined>(undefined);

export const StudyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initData = async () => {
      try {
        const coursesJson = await AsyncStorage.getItem(STORAGE_KEYS.COURSES);
        if (!coursesJson) {
          await AsyncStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(INITIAL_COURSES));
          await AsyncStorage.setItem(STORAGE_KEYS.EXAMS, JSON.stringify(INITIAL_EXAMS));
          await AsyncStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(INITIAL_TASKS));
          await AsyncStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(INITIAL_SESSIONS));
          setCourses(INITIAL_COURSES); setExams(INITIAL_EXAMS); setTasks(INITIAL_TASKS); setSessions(INITIAL_SESSIONS);
        } else {
          setCourses(JSON.parse(coursesJson));
          const e = await AsyncStorage.getItem(STORAGE_KEYS.EXAMS); setExams(e ? JSON.parse(e) : []);
          const t = await AsyncStorage.getItem(STORAGE_KEYS.TASKS); setTasks(t ? JSON.parse(t) : []);
          const s = await AsyncStorage.getItem(STORAGE_KEYS.SESSIONS); setSessions(s ? JSON.parse(s) : []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    initData();
  }, []);

  const addCourse = async (cData: Omit<Course, 'id'>) => {
    const nc = { ...cData, id: 'course_' + Date.now().toString() };
    const updated = [...courses, nc]; setCourses(updated);
    await AsyncStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(updated));
  };

  const updateCourse = async (id: string, fields: Partial<Course>) => {
    const updated = courses.map((c) => c.id === id ? { ...c, ...fields } : c);
    setCourses(updated);
    await AsyncStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(updated));
  };

  const deleteCourse = async (id: string) => {
    const updated = courses.filter((c) => c.id !== id); setCourses(updated);
    await AsyncStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(updated));
    const ue = exams.filter((e) => e.courseId !== id); setExams(ue);
    await AsyncStorage.setItem(STORAGE_KEYS.EXAMS, JSON.stringify(ue));
    const ut = tasks.filter((t) => t.courseId !== id); setTasks(ut);
    await AsyncStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(ut));
  };

  const addExam = async (eData: Omit<Exam, 'id'>) => {
    const ne = { ...eData, id: 'exam_' + Date.now().toString() };
    const updated = [...exams, ne]; setExams(updated);
    await AsyncStorage.setItem(STORAGE_KEYS.EXAMS, JSON.stringify(updated));
  };

  const updateExam = async (id: string, fields: Partial<Exam>) => {
    const updated = exams.map((e) => {
      if (e.id === id) {
        const ne = { ...e, ...fields };
        if (fields.status === 'passed' && fields.grade !== undefined) {
          updateCourse(e.courseId, { status: 'passed', obtainedGrade: fields.grade });
        }
        return ne;
      }
      return e;
    });
    setExams(updated);
    await AsyncStorage.setItem(STORAGE_KEYS.EXAMS, JSON.stringify(updated));
  };

  const deleteExam = async (id: string) => {
    const updated = exams.filter((e) => e.id !== id); setExams(updated);
    await AsyncStorage.setItem(STORAGE_KEYS.EXAMS, JSON.stringify(updated));
  };

  const addTask = async (tData: Omit<Task, 'id' | 'completed' | 'actualTime'>) => {
    const nt = { ...tData, id: 'task_' + Date.now().toString(), completed: false, actualTime: 0 };
    const updated = [...tasks, nt]; setTasks(updated);
    await AsyncStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(updated));
  };

  const updateTask = async (id: string, fields: Partial<Task>) => {
    const updated = tasks.map((t) => t.id === id ? { ...t, ...fields } : t);
    setTasks(updated);
    await AsyncStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(updated));
  };

  const deleteTask = async (id: string) => {
    const updated = tasks.filter((t) => t.id !== id); setTasks(updated);
    await AsyncStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(updated));
  };

  const toggleTaskCompleted = async (id: string) => {
    const updated = tasks.map((t) => t.id === id ? { ...t, completed: !t.completed } : t);
    setTasks(updated);
    await AsyncStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(updated));
  };

  const addSession = async (sData: Omit<StudySession, 'id'>) => {
    const ns = { ...sData, id: 'session_' + Date.now().toString() };
    const updated = [...sessions, ns]; setSessions(updated);
    await AsyncStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(updated));
  };

  const deleteSession = async (id: string) => {
    const updated = sessions.filter((s) => s.id !== id); setSessions(updated);
    await AsyncStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(updated));
  };

  const totalCFU = courses.reduce((sum, c) => sum + c.cfu, 0);
  const passedCFU = courses.filter((c) => c.status === 'passed').reduce((sum, c) => sum + c.cfu, 0);
  
  const getWeightedAverage = () => {
    const passed = courses.filter((c) => c.status === 'passed' && c.obtainedGrade && c.obtainedGrade > 0);
    if (passed.length === 0) return 0;
    const sumProducts = passed.reduce((sum, c) => sum + (c.obtainedGrade || 0) * c.cfu, 0);
    const sumCfu = passed.reduce((sum, c) => sum + c.cfu, 0);
    return sumCfu > 0 ? parseFloat((sumProducts / sumCfu).toFixed(2)) : 0;
  };

  const totalStudyHours = parseFloat((sessions.reduce((sum, s) => sum + s.duration, 0) / 60).toFixed(1));
  const completedTasksCount = tasks.filter((t) => t.completed).length;
  const pendingTasksCount = tasks.filter((t) => !t.completed).length;

  const getWeeklyStudyMinutes = () => {
    const daysOfWeek = ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'];
    const result: { [day: string]: number } = {};
    const dates: string[] = [];
    const labels: string[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayLabel = daysOfWeek[d.getDay()];
      dates.push(dateStr); labels.push(dayLabel);
      result[dayLabel] = 0;
    }
    sessions.forEach((s) => {
      const idx = dates.indexOf(s.date);
      if (idx !== -1) result[labels[idx]] += s.duration;
    });
    return result;
  };

  const getSmartSuggestion = (): Suggestion | null => {
    const todayStr = new Date().toISOString().split('T')[0];
    const upcoming = exams.filter((e) => e.status === 'planned' && e.date >= todayStr).sort((a,b)=>a.date.localeCompare(b.date));
    if (upcoming.length > 0) {
      const exam = upcoming[0];
      const course = courses.find((c) => c.id === exam.courseId);
      if (course) {
        const diff = Math.ceil(Math.abs(new Date(exam.date).getTime() - new Date(todayStr).getTime()) / (1000 * 60 * 60 * 24));
        const related = tasks.filter((t) => !t.completed && t.courseId === exam.courseId);
        if (related.length > 0) {
          const task = related[0];
          return {
            title: `Prossimo Esame: ${course.name}`,
            description: `Mancano ${diff} giorni all'esame "${exam.title}". Concentrati sul task "${task.title}" per non restare indietro!`,
            priority: 'high', courseId: course.id, taskId: task.id
          };
        }
      }
    }
    return { title: 'Tutto sotto controllo! 🎉', description: 'Nessun esame imminente con task arretrati. Continua così!', priority: 'low' };
  };

  const stats = {
    totalCFU, passedCFU, weightedAverage: getWeightedAverage(),
    totalStudyHours, completedTasksCount, pendingTasksCount,
    weeklyStudyMinutes: getWeeklyStudyMinutes()
  };

  const smartSuggestion = loading ? null : getSmartSuggestion();

  return (
    <StudyContext.Provider value={{
      courses, exams, tasks, sessions, loading,
      addCourse, updateCourse, deleteCourse,
      addExam, updateExam, deleteExam,
      addTask, updateTask, deleteTask, toggleTaskCompleted,
      addSession, deleteSession, stats, smartSuggestion
    }}>
      {children}
    </StudyContext.Provider>
  );
};

export const useStudy = () => {
  const c = useContext(StudyContext);
  if (!c) throw new Error('useStudy deve essere inserito all\'interno dello StudyProvider');
  return c;
};