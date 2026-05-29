import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

interface WeeklyChartProps {
  weeklyData: { [day: string]: number };
}

export const WeeklyChart: React.FC<WeeklyChartProps> = ({ weeklyData }) => {
  const ObjectValues = Object.values(weeklyData);
  const maxMins = Math.max(...(ObjectValues.length > 0 ? ObjectValues : [0]), 60);
  const maxBarHeight = 60; // px

  const dayKeys = Object.keys(weeklyData);
  const days = ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'];

  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Attività di Studio Settimanale</Text>
      <Text style={styles.cardSub}>Minuti accumulati negli ultimi 7 giorni</Text>
      
      {/* CORRETTO: Un View con riga flessibile al posto della FlatList per evitare conflitti e bug di rendering */}
      <View style={styles.chartContainer}>
        {dayKeys.map((day) => {
          const m = weeklyData[day] || 0;
          const barH = Math.max((m / maxMins) * maxBarHeight, m > 0 ? 8 : 4);
          
          // FIX ROBUSTO PER IL PARSING DELLA DATA (Compatibile cross-platform Android/iOS)
          // Se la stringa contiene un timestamp o una data ISO completa, la puliamo
          const cleanDayStr = day.includes('T') ? day.split('T')[0] : day;
          const d = new Date(cleanDayStr);
          
          let label = '';
          if (!isNaN(d.getTime())) {
            // Se la data è valida, estraiamo il giorno corretto dall'array dei nomi
            label = days[d.getDay()];
          } else {
            // Fallback estremo se la chiave non è una data ma è già una stringa di testo (es. "Sab")
            label = String(day).length > 3 ? String(day).substring(0, 3) : String(day);
          }

          return (
            <View key={day} style={styles.chartCol}>
              <View style={styles.barWrapper}>
                {m > 0 && <Text style={styles.barVal}>{m}m</Text>}
                <View style={[styles.bar, { height: barH, backgroundColor: m > 0 ? '#8B5CF6' : 'rgba(255,255,255,0.05)' }]} />
              </View>
              <Text style={styles.chartLbl}>{label}</Text>
            </View>
          );
        })}
      </View>
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
  // Sostituito lo scroll con una distribuzione equa orizzontale a spazio uniforme (space-around)
  chartContainer: { 
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    alignItems: 'flex-end', 
    height: 120, 
    paddingTop: 12,
    width: '100%'
  },
  chartCol: { alignItems: 'center', flex: 1 },
  barWrapper: { height: 70, width: '100%', justifyContent: 'flex-end', alignItems: 'center' },
  barVal: { fontSize: 9, color: '#A78BFA', fontWeight: 'bold', marginBottom: 4 },
  bar: { width: 12, borderRadius: 8 },
  chartLbl: { fontSize: 10, color: '#64748B', marginTop: 8, textAlign: 'center' },
});