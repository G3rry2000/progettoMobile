import React from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useStudy } from '../context/StudyContext';
import { StatCard } from '../components/StatCard';
import PieChart from '../components/PieChart';

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
  { label: 'Annullati', value: exams.filter((e) => e.status === 'cancelled').length, color: '#64748B' },
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
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Progresso Corsi</Text>
        {courseData.length === 0 ? (
          <Text style={styles.empty}>Nessun corso presente.</Text>
        ) : (
          courseData.map((cd) => (
            <View key={cd.id} style={styles.row}>
              <View style={styles.rowLeft}>
                <Text style={styles.courseName}>{cd.name}</Text>
                <Text style={styles.coursePct}>{cd.progress}%</Text>
              </View>
              <View style={styles.barBg}>
                <View style={[styles.barFill, { width: `${Math.max(cd.progress, 3)}%`, backgroundColor: cd.color }]} />
              </View>
            </View>
          ))
        )}
      </View>

      <View style={styles.cardRow}>
        <View style={[styles.card, { flex: 1, alignItems: 'center' }] }>
          <Text style={styles.cardTitle}>Stato Esami</Text>
          <PieChart data={pie} size={160} innerRadius={50} />
        </View>

        <View style={[styles.card, { flex: 1 }] }>
          <Text style={styles.cardTitle}>Legenda</Text>
          <View style={styles.pieList}>
            {pie.map((p) => (
              <View key={p.label} style={styles.pieRow}>
                <View style={[styles.legendDot, { backgroundColor: p.color }]} />
                <Text style={styles.legendLabel}>{p.label}</Text>
                <Text style={styles.legendCount}>{p.count}</Text>
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
  empty: { fontSize: 12, color: '#64748B' },

  row: { marginBottom: 10 },
  rowLeft: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  courseName: { color: '#FFF', fontSize: 13 },
  coursePct: { color: '#A78BFA', fontWeight: 'bold' },

  barBg: { height: 10, backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 6, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 6 },

  pieList: { marginTop: 6 },
  pieRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 6 },
  legendDot: { width: 12, height: 12, borderRadius: 6, marginRight: 10 },
  legendLabel: { flex: 1, color: '#94A3B8' },
  legendCount: { color: '#FFF', fontWeight: '700' },
});
