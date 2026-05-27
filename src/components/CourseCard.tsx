import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Course } from '../types/study';

interface CourseCardProps {
  course: Course;
  onPress: () => void;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course, onPress }) => {
  const getStatusLabel = (s: Course['status']) => {
    if (s === 'to_start') return 'Da Iniziare';
    if (s === 'in_prog') return 'In Corso';
    if (s === 'completed') return 'Completato';
    return 'Superato';
  };

  const getStatusColor = (s: Course['status']) => {
    if (s === 'to_start') return '#94A3B8';
    if (s === 'in_prog') return '#3B82F6';
    if (s === 'completed') return '#F59E0B';
    return '#10B981';
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.rowSpace}>
        <Text style={styles.courseCardName}>{course.name}</Text>
        <Text style={styles.courseCfuText}>{course.cfu} CFU</Text>
      </View>
      <Text style={styles.courseCardProf}>{course.professor}</Text>
      <View style={styles.rowSpace}>
        <View style={[styles.tagBadge, { backgroundColor: 'rgba(255,255,255,0.03)' }]}>
          <View style={[styles.dot, { backgroundColor: getStatusColor(course.status) }]} />
          <Text style={[styles.tagText, { color: getStatusColor(course.status) }]}>{getStatusLabel(course.status)}</Text>
        </View>
        {course.obtainedGrade && (
          <Text style={[styles.tagText, { color: '#10B981', fontWeight: 'bold' }]}>Voto: {course.obtainedGrade}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: { backgroundColor: 'rgba(30, 41, 59, 0.7)', padding: 16, borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)', marginBottom: 16 },
  rowSpace: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  courseCardName: { fontSize: 15, fontWeight: 'bold', color: '#FFF', flex: 1 },
  courseCfuText: { fontSize: 10, color: '#A78BFA', backgroundColor: 'rgba(139,92,246,0.1)', paddingVertical: 2, paddingHorizontal: 6, borderRadius: 4, fontWeight: 'bold' },
  courseCardProf: { fontSize: 12, color: '#94A3B8', marginTop: 4, marginBottom: 8 },
  tagBadge: { flexDirection: 'row', alignItems: 'center', paddingVertical: 3, paddingHorizontal: 6, borderRadius: 6, gap: 4 },
  dot: { width: 6, height: 6, borderRadius: 3 },
  tagText: { fontSize: 9, fontWeight: 'bold' },
});