import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { AssistantCard } from '../components/AssistantCard';
import { StatCard } from '../components/StatCard';
import { UpcomingExamRow } from '../components/UpcomingExamRow';
import { WeeklyChart } from '../components/WeeklyChart';
import { useStudy } from '../context/StudyContext';

export default function DashboardTab({ setTab, setTimerCourse, setTimerTask }: any) {
  const { stats, smartSuggestion, exams, courses } = useStudy();
  const getCourseName = (id: string) => courses.find((c) => c.id === id)?.name || 'Corso';

  // Prende i primi 2 esami pianificati
  const upcoming = exams
    .filter((e) => e.status === 'planned')
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 2);

  return (
    <FlatList
      data={upcoming}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.scroll}
      showsVerticalScrollIndicator={false}
      
      // Renderizza l'esame singolo all'interno della lista con la card dedicata
      renderItem={({ item }) => (
        <View style={styles.examCard}>
          <UpcomingExamRow exam={item} courseName={getCourseName(item.courseId)} />
        </View>
      )}
      
      // Tutto il blocco superiore della dashboard per evitare il nesting errato di liste o scroll
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

          <Text style={[styles.cardTitle, { marginTop: 16, marginBottom: 8 }]}>Prossime Scadenze</Text>
        </>
      )}
      
      // Fallback grafico se l'array "upcoming" è vuoto
      ListEmptyComponent={() => (
        <View style={styles.emptyCard}>
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
  cardTitle: { fontSize: 15, fontWeight: 'bold', color: '#FFF' },
  // Card per i singoli esami della lista
  examCard: { backgroundColor: 'rgba(30, 41, 59, 0.7)', padding: 16, borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)', marginBottom: 8 },
  // Card di fallback con stile tratteggiato se non ci sono esami imminenti
  emptyCard: { backgroundColor: 'rgba(30, 41, 59, 0.4)', padding: 20, borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)', borderStyle: 'dashed' },
  emptyText: { fontSize: 12, color: '#64748B', textAlign: 'center', paddingVertical: 4 },
});