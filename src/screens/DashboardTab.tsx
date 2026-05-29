import React from 'react';
import { StyleSheet, View, Text, ScrollView, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useStudy } from '../context/StudyContext';
import { StatCard } from '../components/StatCard';
import { AssistantCard } from '../components/AssistantCard';
import { WeeklyChart } from '../components/WeeklyChart';
import { UpcomingExamRow } from '../components/UpcomingExamRow';

export default function DashboardTab({ setTab, setTimerCourse, setTimerTask }: any) {
  const { stats, smartSuggestion, exams, courses } = useStudy();
  const getCourseName = (id: string) => courses.find((c) => c.id === id)?.name || 'Corso';

  const upcoming = exams
    .filter((e) => e.status === 'planned')
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 2);

  return (
    <FlatList
      data={upcoming}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <View style={styles.card}><UpcomingExamRow exam={item} courseName={getCourseName(item.courseId)} /></View>}
      contentContainerStyle={styles.scroll}
      ListHeaderComponent={() => (
        <>
          <View style={styles.header}>
            <View>
              <Text style={styles.welcomeText}>Bentornato👋</Text>
              <Text style={styles.dateText}>Pronto per una sessione di studio?</Text>
            </View>
            <Ionicons name="school" size={32} color="#8B5CF6" />
          </View>

          {smartSuggestion && (
            <AssistantCard 
              suggestion={smartSuggestion} 
              onPressAction={() => {
                setTimerCourse(smartSuggestion.courseId || '');
                setTimerTask(smartSuggestion.taskId || '');
                setTab('timer');
              }}
            />
          )}

          <View style={styles.grid}>
            <StatCard label="Media Ponderata" value={stats.weightedAverage > 0 ? stats.weightedAverage.toFixed(2) : '- -'} sub="Target Voti" />
            <StatCard label="CFU Acquisiti" value={stats.passedCFU} sub={`Target: ${stats.totalCFU} CFU`} />
            <StatCard label="Ore di Studio" value={`${stats.totalStudyHours}h`} sub="Focus Totale" />
            <StatCard label="Task Finiti" value={`${stats.completedTasksCount}/${stats.completedTasksCount + stats.pendingTasksCount}`} sub="Checklist attiva" />
          </View>

          <WeeklyChart weeklyData={stats.weeklyStudyMinutes} />

          <Text style={[styles.cardTitle, { marginTop: 12, marginBottom: 8 }]}>Prossime Scadenze</Text>
        </>
      )}
      ListEmptyComponent={() => (
        <View style={styles.card}>
          <Text style={styles.emptyText}>Nessuna scadenza programmata.</Text>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  scroll: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 90, alignSelf: 'center', width: '100%', maxWidth: 600 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  welcomeText: { fontSize: 22, fontWeight: 'bold', color: '#FFF' },
  dateText: { fontSize: 13, color: '#94A3B8', marginTop: 2 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  card: { backgroundColor: 'rgba(30, 41, 59, 0.7)', padding: 16, borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)', marginBottom: 16 },
  cardTitle: { fontSize: 15, fontWeight: 'bold', color: '#FFF' },
  emptyText: { fontSize: 12, color: '#64748B', textAlign: 'center', paddingVertical: 12 },
});