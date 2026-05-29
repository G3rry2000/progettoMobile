import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Modal,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  FlatList,
  ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useStudy } from '../context/StudyContext';

export default function AgendaTab() {
  const { tasks, courses, addTask, toggleTaskCompleted, deleteTask, sessions } = useStudy();
  
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(todayStr);

  const [tFilter, setTFilter] = useState<'pending' | 'completed' | 'all'>('pending');
  const [modal, setModal] = useState(false);

  const [tTitle, setTTitle] = useState('');
  const [cId, setCId] = useState('all');
  const [tEst, setTEst] = useState('60');

  // Riferimento allo ScrollView per poter far scorrere automaticamente il calendario sul giorno di oggi
  const scrollViewRef = useRef<ScrollView>(null);

  // Genera dinamicamente tutti i giorni del mese corrente
  const getMonthDays = () => {
    const arr = [];
    const daysName = ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'];
    const year = today.getFullYear();
    const month = today.getMonth(); // Mese corrente (0-11)

    // Determina il numero di giorni nel mese corrente
    const numDays = new Date(year, month + 1, 0).getDate();

    for (let i = 1; i <= numDays; i++) {
      const d = new Date(year, month, i);
      // Forza il fuso orario locale per lo split corretto della stringa YYYY-MM-DD
      const offset = d.getTimezoneOffset();
      const localDate = new Date(d.getTime() - (offset * 60 * 1000));
      const str = localDate.toISOString().split('T')[0];

      arr.push({
        dateStr: str,
        dayNum: i,
        label: daysName[d.getDay()],
        isToday: str === todayStr,
      });
    }
    return arr;
  };
  
  const monthDays = getMonthDays();
  const currentMonthName = today.toLocaleString('it-IT', { month: 'long', year: 'numeric' });

  // Auto-scorrimento sul giorno corrente all'avvio dell'applicazione
  useEffect(() => {
    const currentDayIndex = today.getDate() - 1; // I giorni partono da 1, gli indici da 0
    if (currentDayIndex > 3) {
      // Ogni chip è largo 52px + 8px di margine (marginHorizontal: 4) = 60px complessivi
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({
          x: (currentDayIndex - 2) * 60, // Centra approssimativamente il giorno corrente visivamente
          animated: true,
        });
      }, 300);
    }
  }, []);

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
        <View>
          <Text style={styles.title}>Agenda & Planner 🗓️</Text>
          <Text style={styles.monthSubtitle}>{currentMonthName.toUpperCase()}</Text>
        </View>
        <TouchableOpacity style={styles.addButton} onPress={() => setModal(true)}>
          <Ionicons name="add" size={18} color="#FFF" />
          <Text style={styles.addButtonText}>Nuovo Task</Text>
        </TouchableOpacity>
      </View>

      {/* STRISCIA MENSILE ORIZZONTALE SCORREVOLE */}
      <View style={styles.stripContainer}>
        <ScrollView
          ref={scrollViewRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollCalendar}
        >
          {monthDays.map((w) => {
            const act = w.dateStr === selectedDate;
            return (
              <TouchableOpacity
                key={w.dateStr}
                style={[
                  styles.dayChip,
                  act && styles.dayChipActive,
                  w.isToday && !act && { borderColor: 'rgba(255,255,255,0.2)', borderWidth: 1 }
                ]}
                onPress={() => setSelectedDate(w.dateStr)}
              >
                <Text style={[styles.dayChipLabel, act && { color: '#A78BFA' }]}>{w.label}</Text>
                <Text style={[styles.dayChipNum, act && { color: '#FFF' }]}>{w.dayNum}</Text>
                {w.isToday && <View style={[styles.todayDot, act && { backgroundColor: '#FFF' }]} />}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <FlatList
        data={checklistTasks}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.scroll}
        ListHeaderComponent={() => (
          <>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Pianificazione del Giorno</Text>
              {dayTasks.length === 0 && daySessions.length === 0 ? (
                <Text style={styles.emptyText}>Nessuna attività programmata per questa data.</Text>
              ) : (
                <View style={{ gap: 6 }}>
                  {dayTasks.map((t) => (
                    <Text key={t.id} style={styles.cardDesc}>[TASK] {t.completed ? '✅' : '⏳'} {t.title} ({t.estimatedTime}m stima)</Text>
                  ))}
                  {daySessions.map((s) => (
                    <Text key={s.id} style={[styles.cardDesc, { color: '#A78BFA' }]}>[STUDIO] ⏱️ {s.activityType.toUpperCase()} - {s.duration} min svolti</Text>
                  ))}
                </View>
              )}
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>Checklist di Studio</Text>
              <View style={[styles.row, { marginBottom: 12, marginTop: 8 }]}> 
                {(['pending', 'completed', 'all'] as const).map((t) => (
                  <TouchableOpacity key={t} style={[styles.chip, tFilter === t && styles.chipActive]} onPress={() => setTFilter(t)}>
                    <Text style={styles.chipText}>{t === 'pending' ? 'Attivi' : t === 'completed' ? 'Finiti' : 'Tutti'}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </>
        )}
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
        ListEmptyComponent={() => (
          <View style={styles.card}>
            <Text style={styles.emptyText}>Nessun task attivo trovato in questo filtro.</Text>
          </View>
        )}
      />

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
                <View style={styles.courseRow}>
                  {[{ id: 'all', name: 'Generale' }, ...courses].map((item) => (
                    <TouchableOpacity key={item.id} style={[styles.chip, cId === item.id && styles.chipActive]} onPress={() => setCId(item.id)}>
                      <Text style={styles.chipText}>{item.name}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                
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
  monthSubtitle: { fontSize: 10, color: '#A78BFA', fontWeight: 'bold', marginTop: 2, letterSpacing: 1 },
  addButton: { backgroundColor: '#8B5CF6', flexDirection: 'row', alignItems: 'center', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 8, gap: 4 },
  addButtonText: { color: '#FFF', fontSize: 12, fontWeight: 'bold' },
  stripContainer: { height: 75, marginBottom: 8, marginTop: 4 },
  scrollCalendar: { paddingHorizontal: 12, alignItems: 'center' },
  dayChip: { width: 52, height: 62, alignItems: 'center', justifyContent: 'center', borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.02)', marginHorizontal: 4 },
  dayChipActive: { backgroundColor: 'rgba(139,92,246,0.2)', borderColor: 'rgba(139,92,246,0.4)', borderWidth: 1 },
  dayChipLabel: { fontSize: 9, color: '#64748B', fontWeight: 'bold', textTransform: 'uppercase' },
  dayChipNum: { fontSize: 15, color: '#F8FAFC', fontWeight: 'bold', marginTop: 2 },
  todayDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: '#8B5CF6', marginTop: 4 },
  card: { backgroundColor: 'rgba(30, 41, 59, 0.7)', padding: 16, borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)', marginBottom: 16 },
  cardTitle: { fontSize: 15, fontWeight: 'bold', color: '#FFF' },
  emptyText: { fontSize: 12, color: '#64748B', textAlign: 'center', paddingVertical: 12 },
  cardDesc: { fontSize: 13, color: '#CBD5E1', marginTop: 6, lineHeight: 18 },
  row: { flexDirection: 'row', gap: 8 },
  chip: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 15, backgroundColor: 'rgba(255,255,255,0.02)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  chipActive: { backgroundColor: 'rgba(139, 92, 246, 0.15)', borderColor: 'rgba(139, 92, 246, 0.3)' },
  chipText: { fontSize: 11, color: '#94A3B8', fontWeight: '600' },
  courseRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, paddingVertical: 6 },
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