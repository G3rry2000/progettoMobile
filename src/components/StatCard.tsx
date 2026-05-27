import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

interface StatCardProps {
  label: string;
  value: string | number;
  sub: string;
}

export const StatCard: React.FC<StatCardProps> = ({ label, value, sub }) => (
  <View style={styles.statCard}>
    <Text style={styles.statLbl}>{label}</Text>
    <Text style={styles.statVal}>{value}</Text>
    <Text style={styles.statSub}>{sub}</Text>
  </View>
);

const styles = StyleSheet.create({
  statCard: {
    flex: 1,
    minWidth: 120,
    backgroundColor: 'rgba(30, 41, 59, 0.7)',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
  },
  statLbl: { fontSize: 10, color: '#64748B', textTransform: 'uppercase' },
  statVal: { fontSize: 18, fontWeight: 'bold', color: '#FFF', marginVertical: 4 },
  statSub: { fontSize: 10, color: '#94A3B8' },
});