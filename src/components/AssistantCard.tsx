import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Suggestion } from '../types/study';

interface AssistantCardProps {
  suggestion: Suggestion;
  onPressAction: () => void;
}

export const AssistantCard: React.FC<AssistantCardProps> = ({ suggestion, onPressAction }) => (
  <View style={[styles.card, { borderColor: suggestion.priority === 'high' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(139, 92, 246, 0.3)', borderWidth: 1 }]}>
    <View style={styles.rowAlign}>
      <Ionicons name="bulb" size={20} color="#8B5CF6" />
      <Text style={[styles.cardTitle, { marginLeft: 8 }]}>⚡ Assistente di Studio</Text>
    </View>
    <Text style={styles.cardDesc}>{suggestion.description}</Text>
    {suggestion.taskId && (
      <TouchableOpacity style={styles.quickBtn} onPress={onPressAction}>
        <Text style={styles.quickBtnText}>Avvia Timer</Text>
        <Ionicons name="play" size={12} color="#FFF" style={{ marginLeft: 4 }} />
      </TouchableOpacity>
    )}
  </View>
);

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
  cardDesc: { fontSize: 13, color: '#CBD5E1', marginTop: 6, lineHeight: 18 },
  rowAlign: { flexDirection: 'row', alignItems: 'center' },
  quickBtn: {
    backgroundColor: '#8B5CF6',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginTop: 10,
  },
  quickBtnText: { color: '#FFF', fontSize: 11, fontWeight: 'bold' },
});