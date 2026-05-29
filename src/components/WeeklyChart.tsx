import React from 'react';
import { StyleSheet, View, Text, FlatList } from 'react-native';

interface WeeklyChartProps {
  weeklyData: { [day: string]: number };
}

export const WeeklyChart: React.FC<WeeklyChartProps> = ({ weeklyData }) => {
  const maxMins = Math.max(...Object.values(weeklyData), 60);

  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Attività di Studio Settimanale</Text>
      <Text style={styles.cardSub}>Minuti accumulati negli ultimi 7 giorni</Text>
      <FlatList
        horizontal
        data={Object.keys(weeklyData)}
        keyExtractor={(item) => item}
        contentContainerStyle={styles.chart}
        renderItem={({ item: day }) => {
          const m = weeklyData[day];
          const h = Math.min((m / maxMins) * 100, 100);
          return (
            <View style={styles.chartCol}>
              <View style={styles.barWrapper}>
                {m > 0 && <Text style={styles.barVal}>{m}m</Text>}
                <View style={[styles.bar, { height: `${Math.max(h, 5)}%`, backgroundColor: m > 0 ? '#8B5CF6' : 'rgba(255,255,255,0.05)' }]} />
              </View>
              <Text style={styles.chartLbl}>{day}</Text>
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
  chart: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', height: 100, paddingTop: 12 },
  chartCol: { alignItems: 'center', flex: 1 },
  barWrapper: { height: 60, width: '100%', justifyContent: 'flex-end', alignItems: 'center' },
  barVal: { fontSize: 9, color: '#A78BFA', fontWeight: 'bold', marginBottom: 2 },
  bar: { width: 10, borderRadius: 5 },
  chartLbl: { fontSize: 9, color: '#64748B', marginTop: 6 },
});