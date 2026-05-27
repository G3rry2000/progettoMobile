import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

interface TimerRingProps {
  formattedTime: string;
}

export const TimerRing: React.FC<TimerRingProps> = ({ formattedTime }) => (
  <View style={styles.timerRingOuter}>
    <View style={styles.timerRingInner}>
      <Text style={styles.timerDigits}>{formattedTime}</Text>
      <Text style={styles.timerSub}>STUDIO FOCALIZZATO</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  timerRingOuter: { width: 180, height: 180, borderRadius: 90, backgroundColor: 'rgba(139, 92, 246, 0.02)', borderWidth: 2, borderColor: 'rgba(139, 92, 246, 0.15)', alignItems: 'center', justifyContent: 'center' },
  timerRingInner: { width: 160, height: 160, borderRadius: 80, backgroundColor: '#1E293B', alignItems: 'center', justifyContent: 'center' },
  timerDigits: { fontSize: 36, fontWeight: 'bold', color: '#FFF', letterSpacing: 1 },
  timerSub: { fontSize: 8, color: '#64748B', marginTop: 4, letterSpacing: 1 },
});