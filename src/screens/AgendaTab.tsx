import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  TextInput, 
  Modal,
  KeyboardAvoidingView, 
  Platform, 
  TouchableWithoutFeedback, 
  Keyboard,
  FlatList
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useStudy } from '../context/StudyContext';

export default function AgendaTab() {
  const { tasks, courses, addTask, toggleTaskCompleted, deleteTask, sessions } = useStudy();
  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(todayStr);

  const [tFilter, setTFilter] = useState<'pending' | 'completed' | 'all'>('pending');
  const [modal, setModal] = useState(false);

  const [tTitle, setTTitle] = useState('');
  const [cId, setCId] = useState('all');
  const [tEst, setTEst] = useState('60');

  const getWeekDays = () => {
    const arr = [];
    const days = ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'];
    for (let i = -3; i <= 3; i++) {
      const d = new Date(); d.setDate(d.getDate() + i);
      const str = d.toISOString().split('T')[0];
      arr.push({ dateStr: str, dayNum: d.getDate(), label: days[d.getDay()], isToday: str === todayStr });
    }
    return arr;
  };
  const weekDays = getWeekDays();

  const handleCreate = async () => {
    if (!tTitle.trim()) return;
    await addTask({
      title: tTitle.trim(), courseId: cId === 'all' ? undefined : cId, dueDate: selectedDate, priority: 'medium', estimatedTime: parseInt(tEst) || 60
    });
    setTTitle(''); setCId('all'); setTEst('60'); setModal(false);
  };

  const dayTasks = tasks.filter((t) => t.dueDate === selectedDate);
  const daySessions = sessions.filter((s) => s.date === selectedDate);

  const checklistTasks = tasks.filter((t) => {
    if (tFilter === 'pending') return !t.completed;
    if (tFilter === 'completed') return t.completed;
    return true;
  });

  const getCourseName = (id?: string) => courses.find((c) => c.id === id)?.name || 'Generale';

  return (
    <View style={styles.container}>
      <View style={styles.tabHeader}>
        <Text style={styles.title}>Agenda & Planner 🗓️</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => setModal(true)}>
          <Ionicons name="add" size={18} color="#FFF" />
          <Text style={styles.addButtonText}>Nuovo Task</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.stripContainer}>
        <FlatList
          horizontal
          data={weekDays}
          keyExtractor={(item) => item.dateStr}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item: w }) => {
            const act = w.dateStr === selectedDate;
            return (
              <TouchableOpacity style={[styles.dayChip, act && styles.dayChipActive, w.isToday && !act && { borderColor: 'rgba(255,255,255,0.2)', borderWidth: 1 }]} onPress={() => setSelectedDate(w.dateStr)}>
                <Text style={[styles.dayChipLabel, act && { color: '#A78BFA' }]}>{w.label}</Text>
                <Text style={[styles.dayChipNum, act && { color: '#FFF' }]}>{w.dayNum}</Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Pianificazione del Giorno</Text>
          {dayTasks.length === 0 && daySessions.length === 0 ? (
            <Text style={styles.emptyText}>Nessuna attività programmata.</Text>
          ) : (
            <View style={{ gap: 6 }}>
                  <FlatList
                    data={dayTasks}
                    keyExtractor={(item) => item.id}
                    scrollEnabled={false}
                    renderItem={({ item: t }) => <Text style={styles.cardDesc}>[TASK] {t.completed ? '✅' : '⏳'} {t.title} ({t.estimatedTime}m stima)</Text>}
                    contentContainerStyle={{ gap: 6 }}
                  />
                  <FlatList
                    data={daySessions}
                    keyExtractor={(item) => item.id}
                    scrollEnabled={false}
                    renderItem={({ item: s }) => <Text style={[styles.cardDesc, { color: '#A78BFA' }]}>[STUDIO] ⏱️ {s.activityType.toUpperCase()} - {s.duration} min svolti</Text>}
                    contentContainerStyle={{ gap: 6 }}
                  />
            </View>
          )}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Checklist di Studio</Text>
          <View style={[styles.row, { marginBottom: 12, marginTop: 8 }]}> 
            <FlatList
              horizontal
              data={['pending', 'completed', 'all']}
              keyExtractor={(item) => String(item)}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 8 }}
              renderItem={({ item: t }) => (
                <TouchableOpacity style={[styles.chip, tFilter === t && styles.chipActive]} onPress={() => setTFilter(t as any)}>
                  <Text style={styles.chipText}>{t === 'pending' ? 'Attivi' : t === 'completed' ? 'Finiti' : 'Tutti'}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
          {checklistTasks.length === 0 ? (
            <Text style={styles.emptyText}>Nessun task attivo.</Text>
          ) : (
            <FlatList
              data={checklistTasks}
              keyExtractor={(item) => item.id}
              renderItem={({ item: t }) => (
                <View style={styles.taskItem}>
                  <TouchableOpacity onPress={() => toggleTaskCompleted(t.id)}>
                    <Ionicons name={t.completed ? "checkbox" : "square-outline"} size={22} color={t.completed ? "#10B981" : "rgba(255,255,255,0.3)"} />
                  </TouchableOpacity>
                  <View style={{ flex: 1, marginLeft: 8 }}>
                    <Text style={[styles.taskText, t.completed && styles.lineThrough]}>{t.title}</Text>
                    <Text style={{ fontSize: 10, color: '#64748B' }}>Corso: {getCourseName(t.courseId)} {t.dueDate ? `• Scadenza: ${t.dueDate}` : ''}</Text>
                  </View>
                  <TouchableOpacity onPress={() => deleteTask(t.id)}><Ionicons name="trash" size={16} color="#EF4444" /></TouchableOpacity>
                </View>
              )}
            />
          )}
        </View>
      </ScrollView>

      {/* CREATE MODAL CON STRUTTURA UNICA AGGIUSTATA PER TELEFONO */}
      <Modal visible={modal} transparent animationType="slide">
        <View style={styles.overlay}>
          <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
            style={{ width: '100%' }}
          >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View style={styles.modal}>
                <Text style={styles.modalTitle}>Crea Task</Text>
                
                <Text style={styles.label}>Titolo</Text>
                <TextInput style={styles.input} value={tTitle} onChangeText={setTTitle} placeholder="Es. Ripasso slide..." placeholderTextColor="#64748B" />
                
                <Text style={styles.label}>Associa Corso</Text>
                <FlatList
                  horizontal
                  data={[{ id: 'all', name: 'Generale' }, ...courses]}
                  keyExtractor={(item) => item.id}
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ gap: 6, paddingVertical: 6 }}
                  renderItem={({ item }) => (
                    <TouchableOpacity style={[styles.chip, cId === item.id && styles.chipActive]} onPress={() => setCId(item.id)}>
                      <Text style={styles.chipText}>{item.name}</Text>
                    </TouchableOpacity>
                  )}
                  keyboardShouldPersistTaps="handled"
                />
                
                <Text style={styles.label}>Tempo Stimato (min)</Text>
                <TextInput style={styles.input} value={tEst} keyboardType="numeric" onChangeText={setTEst} />
                
                <View style={[styles.row, { marginTop: 12 }]}>
                  <TouchableOpacity style={styles.cancelBtn} onPress={() => setModal(false)}><Text style={styles.cancelBtnText}>Annulla</Text></TouchableOpacity>
                  <TouchableOpacity style={styles.saveBtn} onPress={handleCreate}><Text style={styles.saveBtnText}>Crea</Text></TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' },
  scroll: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 90, alignSelf: 'center', width: '100%', maxWidth: 600 },
  tabHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 },
  title: { fontSize: 20, fontWeight: 'bold', color: '#FFF' },
  addButton: { backgroundColor: '#8B5CF6', flexDirection: 'row', alignItems: 'center', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 8, gap: 4 },
  addButtonText: { color: '#FFF', fontSize: 12, fontWeight: 'bold' },
  stripContainer: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16, marginBottom: 8 },
  dayChip: { flex: 1, alignItems: 'center', paddingVertical: 6, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.01)' },
  dayChipActive: { backgroundColor: 'rgba(139,92,246,0.15)', borderColor: 'rgba(139,92,246,0.3)', borderWidth: 1 },
  dayChipLabel: { fontSize: 8, color: '#64748B', fontWeight: 'bold' },
  dayChipNum: { fontSize: 13, color: '#F8FAFC', fontWeight: 'bold', marginTop: 2 },
  card: { backgroundColor: 'rgba(30, 41, 59, 0.7)', padding: 16, borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)', marginBottom: 16 },
  cardTitle: { fontSize: 15, fontWeight: 'bold', color: '#FFF' },
  emptyText: { fontSize: 12, color: '#64748B', textAlign: 'center', paddingVertical: 12 },
  cardDesc: { fontSize: 13, color: '#CBD5E1', marginTop: 6, lineHeight: 18 },
  row: { flexDirection: 'row', gap: 8 },
  chip: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 15, backgroundColor: 'rgba(255,255,255,0.02)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  chipActive: { backgroundColor: 'rgba(139, 92, 246, 0.15)', borderColor: 'rgba(139, 92, 246, 0.3)' },
  chipText: { fontSize: 11, color: '#94A3B8', fontWeight: '600' },
  taskItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderColor: 'rgba(255,255,255,0.03)' },
  taskText: { fontSize: 13, color: '#FFF' },
  lineThrough: { textDecorationLine: 'line-through', color: '#64748B' },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  modal: { backgroundColor: '#0F172A', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#FFF' },
  label: { fontSize: 10, color: '#94A3B8', textTransform: 'uppercase', marginTop: 10, marginBottom: 6, fontWeight: 'bold' },
  input: { backgroundColor: 'rgba(30, 41, 59, 0.6)', borderRadius: 10, height: 40, paddingHorizontal: 12, color: '#FFF', fontSize: 13, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  cancelBtn: { flex: 1, backgroundColor: 'rgba(255,255,255,0.02)', height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  cancelBtnText: { color: '#94A3B8', fontWeight: '600', fontSize: 13 },
  saveBtn: { flex: 1, backgroundColor: '#8B5CF6', height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  saveBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 13 }
});