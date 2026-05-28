import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Exam } from '../types/study';

interface UpcomingExamRowProps {
  exam: Exam;
  courseName: string;
}

export const UpcomingExamRow: React.FC<UpcomingExamRowProps> = ({ exam, courseName }) => (
  <View style={styles.examRow}>
    <View style={styles.examDateBlock}>
      <Text style={styles.examDateDay}>{new Date(exam.date).getDate()}</Text>
      <Text style={styles.examDateMonth}>{new Date(exam.date).toLocaleDateString('it-IT', { month: 'short' })}</Text>
    </View>
    <View style={{ flex: 1, marginLeft: 12 }}>
      <Text style={styles.examTitle}>{exam.title}</Text>
      <Text style={styles.examCourse}>{courseName}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  examRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderColor: 'rgba(255,255,255,0.03)' },
  examDateBlock: { backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 8, paddingVertical: 4, paddingHorizontal: 8, alignItems: 'center', minWidth: 44 },
  examDateDay: { fontSize: 12, fontWeight: 'bold', color: '#FFF' },
  examDateMonth: { fontSize: 9, color: '#94A3B8' },
  examTitle: { fontSize: 13, fontWeight: '600', color: '#FFF' },
  examCourse: { fontSize: 11, color: '#64748B', marginTop: 2 },
});