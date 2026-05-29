import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import PieChart from '../components/PieChart';
import { StatCard } from '../components/StatCard';
import { useStudy } from '../context/StudyContext';

export default function StatsTab() {
  const { stats, courses, exams, tasks } = useStudy();

  const totalCfu = stats.totalCFU;
  const avgGrade = stats.weightedAverage || 0;

  const courseData = courses.map((c, idx) => {
    const related = tasks.filter((t) => t.courseId === c.id);
    const total = related.length;
    const done = related.filter((t) => t.completed).length;
    const progress = total === 0 ? (c.status === 'passed' ? 100 : 0) : Math.round((done / total) * 100);
    const palette = ['#8B5CF6', '#06B6D4', '#F59E0B', '#10B981', '#EF4444'];
    return { id: c.id, name: c.name.split(' ')[0], progress, color: palette[idx % palette.length] };
  });

  const pie = [
    { label: 'Passati', value: exams.filter((e) => e.status === 'passed').length, color: '#06B6D4' },
    { label: 'Programmati', value: exams.filter((e) => e.status === 'planned').length, color: '#8B5CF6' },
    { label: 'Falliti', value: exams.filter((e) => e.status === 'failed').length, color: '#EF4444' },
    { label: 'Annullati', value: exams.filter((e) => e.status === 'cancelled').length + (stats.deletedCancelledExams || 0), color: '#64748B' },
  ];

  return (
    <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Statistiche</Text>
        <Ionicons name="stats-chart" size={26} color="#A78BFA" />
      </View>

      <View style={styles.grid}>
        <StatCard label="Totale CFU" value={totalCfu} sub="CFU totali" />
        <StatCard label="Media Ponderata" value={avgGrade > 0 ? avgGrade.toFixed(2) : '- -'} sub="Media pesata" />
        <StatCard label="Esami Falliti" value={exams.filter((e) => e.status === 'failed').length} sub="Esami" />
        <StatCard label="Esami Annullati" value={exams.filter((e) => e.status === 'cancelled').length + (stats.deletedCancelledExams || 0)} sub="Esami" />
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Progresso Corsi</Text>
        {courseData.length === 0 ? (
          <Text style={styles.empty}>Nessun corso presente.</Text>
        ) : (
          <View style={styles.courseListContainer}>
            {courseData.map((cd) => (
              <View key={cd.id} style={styles.row}>
                <View style={styles.rowLeft}>
                  <Text style={styles.courseName}>{cd.name}</Text>
                  <Text style={styles.coursePct}>{cd.progress}%</Text>
                </View>
                <View style={styles.barBg}>
                  <View style={[styles.barFill, { width: `${Math.max(cd.progress, 3)}%`, backgroundColor: cd.color }]} />
                </View>
              </View>
            ))}
          </View>
        )}
      </View>

      <View style={styles.cardRow}>
        <View style={[styles.card, { flex: 1, alignItems: 'center' }]}>
          <Text style={styles.cardTitle}>Stato Esami</Text>
          <PieChart data={pie} size={140} innerRadius={40} />
        </View>

        <View style={[styles.card, { flex: 1 }]}>
          <Text style={styles.cardTitle}>Legenda</Text>
          {/* .map() pulito per la legenda */}
          <View style={styles.pieList}>
            {pie.map((p) => (
              <View key={p.label} style={styles.pieRow}>
                <View style={[styles.legendDot, { backgroundColor: p.color }]} />
                <Text style={styles.legendLabel} numberOfLines={1}>{p.label}</Text>
                <Text style={styles.legendCount}>{p.value}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 90, alignSelf: 'center', width: '100%', maxWidth: 600 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  title: { fontSize: 20, fontWeight: 'bold', color: '#FFF' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  card: { backgroundColor: 'rgba(30, 41, 59, 0.7)', padding: 14, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)', marginBottom: 12 },
  cardTitle: { fontSize: 15, fontWeight: 'bold', color: '#FFF', marginBottom: 8 },
  cardRow: { flexDirection: 'row', gap: 10 },
  empty: { fontSize: 12, color: '#64748B' },
  courseListContainer: { gap: 4 },
  row: { marginBottom: 10 },
  rowLeft: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  courseName: { color: '#FFF', fontSize: 13, fontWeight: '500' },
  coursePct: { color: '#A78BFA', fontWeight: 'bold', fontSize: 12 },
  barBg: { height: 8, backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 6, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 6 },
  pieList: { marginTop: 4, gap: 2 },
  pieRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 5 },
  legendDot: { width: 10, height: 10, borderRadius: 5, marginRight: 8 },
  legendLabel: { flex: 1, color: '#94A3B8', fontSize: 12 },
  legendCount: { color: '#FFF', fontWeight: '700', fontSize: 12 },
});