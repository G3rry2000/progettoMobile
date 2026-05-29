import React from 'react';
import { StyleSheet, View, Text, FlatList } from 'react-native';

interface WeeklyChartProps {
  weeklyData: { [day: string]: number };
}

export const WeeklyChart: React.FC<WeeklyChartProps> = ({ weeklyData }) => {
  const maxMins = Math.max(...Object.values(weeklyData), 60);
  const maxBarHeight = 60; // px

  const dayKeys = Object.keys(weeklyData);

  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Attività di Studio Settimanale</Text>
      <Text style={styles.cardSub}>Minuti accumulati negli ultimi 7 giorni</Text>
      <FlatList
        horizontal
        data={dayKeys}
        keyExtractor={(item) => item}
        contentContainerStyle={styles.chart}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item: day }) => {
          const m = weeklyData[day] || 0;
          const barH = Math.max((m / (maxMins || 60)) * maxBarHeight, m > 0 ? 8 : 4);
          const d = new Date(day);
          const days = ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'];
          const label = isNaN(d.getTime()) ? String(day).slice(-2) : days[d.getDay()];

          return (
            <View style={styles.chartCol}>
              <View style={styles.barWrapper}>
                {m > 0 && <Text style={styles.barVal}>{m}m</Text>}
                <View style={[styles.bar, { height: barH, backgroundColor: m > 0 ? '#8B5CF6' : 'rgba(255,255,255,0.05)' }]} />
              </View>
              <Text style={styles.chartLbl}>{label}</Text>
            </View>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(30, 41, 59, 0.7)',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    marginBottom: 16,
  },
  cardTitle: { fontSize: 15, fontWeight: 'bold', color: '#FFF' },
  cardSub: { fontSize: 11, color: '#64748B', marginBottom: 8 },
  chart: { flexDirection: 'row', alignItems: 'flex-end', height: 120, paddingTop: 12, paddingHorizontal: 6 },
  chartCol: { alignItems: 'center', width: 48, marginHorizontal: 6 },
  barWrapper: { height: 70, width: '100%', justifyContent: 'flex-end', alignItems: 'center' },
  barVal: { fontSize: 9, color: '#A78BFA', fontWeight: 'bold', marginBottom: 4 },
  bar: { width: 14, borderRadius: 8 },
  chartLbl: { fontSize: 10, color: '#64748B', marginTop: 8 },
});