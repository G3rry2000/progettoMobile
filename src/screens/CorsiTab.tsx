import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, TextInput, Modal, Alert, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useStudy } from '../context/StudyContext';
import { Course } from '../types/study';
import { CourseCard } from '../components/CourseCard';
import { BaseFormModal } from '../components/SharedModals';
import { getRelativeDateStr } from '../constants/initialData';

export default function CorsiTab() {
  const { courses, addCourse, updateCourse, deleteCourse, tasks, sessions, addSession, addTask, toggleTaskCompleted } = useStudy();
  
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'in_prog' | 'passed' | 'to_start'>('all');
  
  const [addModal, setAddModal] = useState(false);
  const [name, setName] = useState('');
  const [professor, setProfessor] = useState('');
  const [cfu, setCfu] = useState('6');
  const [desc, setDesc] = useState('');
  const [cStatus, setCStatus] = useState<Course['status']>('in_prog');
  const [expectedGrade, setExpectedGrade] = useState('30');

  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [addSessionModal, setAddSessionModal] = useState(false);
  const [sessionMins, setSessionMins] = useState('60');
  const [sessionNotes, setSessionNotes] = useState('');

  const [addTaskModal, setAddTaskModal] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');

  const [editMode, setEditMode] = useState(false);
  const [editName, setEditName] = useState('');
  const [editProf, setEditProf] = useState('');
  const [editCfu, setEditCfu] = useState('6');
  const [editGrade, setEditGrade] = useState('');

  const filtered = courses.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.professor.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || c.status === filter;
    return matchesSearch && matchesFilter;
  });

  const getStatusLabel = (s: Course['status']) => {
    if (s === 'to_start') return 'Da Iniziare';
    if (s === 'in_prog') return 'In Corso';
    if (s === 'completed') return 'Completato';
    return 'Superato';
  };

  const getStatusColor = (s: Course['status']) => {
    if (s === 'to_start') return '#94A3B8';
    if (s === 'in_prog') return '#3B82F6';
    if (s === 'completed') return '#F59E0B';
    return '#10B981';
  };

  const handleCreate = async () => {
    if (!name.trim()) return;

    const targetNum = parseInt(expectedGrade.trim());
    if (isNaN(targetNum) || targetNum < 18 || targetNum > 30) {
      Alert.alert(
        "Voto Target Non Valido ⚠️",
        "Il voto target per il superamento dell'esame deve essere compreso tra 18 e 30."
      );
      return;
    }

    await addCourse({
      name: name.trim(), professor: professor.trim() || 'Non specificato',
      semester: 'Semestre Standard', cfu: parseInt(cfu) || 6, description: desc.trim(),
      status: cStatus, expectedGrade: targetNum
    });
    
    setName(''); setProfessor(''); setCfu('6'); setDesc(''); setCStatus('in_prog'); setExpectedGrade('30');
    setAddModal(false);
  };

  const handleSaveEdit = async (cId: string) => {
    let finalGrade: number | undefined = undefined;

    if (editGrade.trim()) {
      const cleanInput = editGrade.trim().toLowerCase();
      
      if (cleanInput === '30l' || cleanInput === '30 lode' || cleanInput === '30 e lode') {
        finalGrade = 31;
      } else {
        const votoNum = parseInt(cleanInput);
        if (isNaN(votoNum) || votoNum < 18 || votoNum > 30) {
          Alert.alert(
            "Voto Conseguito Non Valido ⚠️",
            "Il voto universitario inserito deve essere compreso tra 18 e 30. Per la lode scrivi '30L'."
          );
          return;
        }
        finalGrade = votoNum;
      }
    }

    await updateCourse(cId, {
      name: editName, professor: editProf, cfu: parseInt(editCfu) || 6,
      obtainedGrade: finalGrade,
      status: finalGrade ? 'passed' : selectedCourse?.status
    });

    const updated = courses.find((c) => c.id === cId);
    if (updated) setSelectedCourse(updated);
    setEditMode(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabHeader}>
        <Text style={styles.title}>I Miei Corsi 📚</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => setAddModal(true)}>
          <Ionicons name="add" size={18} color="#FFF" />
          <Text style={styles.addButtonText}>Nuovo</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchBar}>
        <Ionicons name="search" size={16} color="#64748B" />
        <TextInput style={styles.searchInput} placeholder="Cerca corso..." placeholderTextColor="#64748B" value={search} onChangeText={setSearch} />
      </View>

      <View style={{ height: 36, marginBottom: 12 }}>
        <FlatList
          horizontal
          data={['all', 'in_prog', 'passed', 'to_start']}
          keyExtractor={(item) => String(item)}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 8, paddingHorizontal: 16 }}
          renderItem={({ item: f }) => (
            <TouchableOpacity style={[styles.chip, filter === f && styles.chipActive]} onPress={() => setFilter(f)}>
              <Text style={[styles.chipText, filter === f && styles.chipTextActive]}>
                {f === 'all' ? 'Tutti' : f === 'in_prog' ? 'In Corso' : f === 'passed' ? 'Superati' : 'Da Iniziare'}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {filtered.length === 0 ? (
        <Text style={styles.emptyText}>Nessun corso inserito.</Text>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={({ item: c }) => (
            <CourseCard
              course={c}
              onPress={() => {
                setSelectedCourse(c);
                setEditName(c.name);
                setEditProf(c.professor);
                setEditCfu(c.cfu.toString());
                setEditGrade(c.obtainedGrade ? (c.obtainedGrade === 31 ? '30L' : c.obtainedGrade.toString()) : '');
              }}
            />
          )}
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* CREA CORSO MODAL - PROTETTO DALLA TASTIERA */}
      <Modal visible={addModal} animationType="slide" transparent>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <KeyboardAvoidingView style={styles.overlay} behavior={Platform.OS === "ios" ? "padding" : "height"}>
            <View style={styles.modal}>
              <View style={styles.rowSpace}>
                <Text style={styles.modalTitle}>Crea Corso 📘</Text>
                <TouchableOpacity onPress={() => setAddModal(false)}><Ionicons name="close" size={24} color="#94A3B8" /></TouchableOpacity>
              </View>
              <ScrollView style={{ marginVertical: 12 }} keyboardShouldPersistTaps="handled">
                <Text style={styles.label}>Nome Corso *</Text>
                <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Es. Sviluppo Mobile" placeholderTextColor="#64748B" />
                <Text style={styles.label}>Docente</Text>
                <TextInput style={styles.input} value={professor} onChangeText={setProfessor} placeholder="Es. Prof. Rossi" placeholderTextColor="#64748B" />
                <View style={styles.row}>
                  <View style={{ flex: 1, marginRight: 8 }}>
                    <Text style={styles.label}>CFU</Text>
                    <TextInput style={styles.input} value={cfu} keyboardType="numeric" onChangeText={setCfu} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.label}>Voto Target (18-30)</Text>
                    <TextInput style={styles.input} value={expectedGrade} keyboardType="numeric" onChangeText={setExpectedGrade} />
                  </View>
                </View>
                <Text style={styles.label}>Note / Descrizione</Text>
                <TextInput style={[styles.input, { height: 60 }]} value={desc} onChangeText={setDesc} multiline placeholder="Note sul corso..." placeholderTextColor="#64748B" />
              </ScrollView>
              <View style={styles.row}>
                <TouchableOpacity style={styles.cancelBtn} onPress={() => setAddModal(false)}><Text style={styles.cancelBtnText}>Annulla</Text></TouchableOpacity>
                <TouchableOpacity style={styles.saveBtn} onPress={handleCreate}><Text style={styles.saveBtnText}>Crea</Text></TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </Modal>

      {/* DETTAGLI CORSO MODAL - PROTETTO DALLA TASTIERA */}
      {selectedCourse && (
        <Modal visible={!!selectedCourse} animationType="slide" transparent>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAvoidingView style={styles.overlay} behavior={Platform.OS === "ios" ? "padding" : "height"}>
              <View style={[styles.modal, { maxHeight: '90%' }]}>
                <View style={styles.rowSpace}>
                  <Text style={styles.modalTitle} numberOfLines={1}>{editMode ? 'Modifica Corso' : selectedCourse.name}</Text>
                  <TouchableOpacity onPress={() => { setSelectedCourse(null); setEditMode(false); }}><Ionicons name="close" size={24} color="#94A3B8" /></TouchableOpacity>
                </View>

                <ScrollView style={{ marginVertical: 12 }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
                  {editMode ? (
                    <View style={{ gap: 8 }}>
                      <Text style={styles.label}>Nome Corso</Text>
                      <TextInput style={styles.input} value={editName} onChangeText={setEditName} />
                      <Text style={styles.label}>Docente</Text>
                      <TextInput style={styles.input} value={editProf} onChangeText={setEditProf} />
                      <Text style={styles.label}>CFU</Text>
                      <TextInput style={styles.input} value={editCfu} keyboardType="numeric" onChangeText={setEditCfu} />
                      <Text style={styles.label}>Voto Ottenuto (Es. 28 o 30L)</Text>
                      <TextInput style={styles.input} value={editGrade} placeholder="18-30 o 30L" placeholderTextColor="#64748B" onChangeText={setEditGrade} />
                      <View style={[styles.row, { marginTop: 12 }]}>
                        <TouchableOpacity style={styles.cancelBtn} onPress={() => setEditMode(false)}><Text style={styles.cancelBtnText}>Annulla</Text></TouchableOpacity>
                        <TouchableOpacity style={styles.saveBtn} onPress={() => handleSaveEdit(selectedCourse.id)}><Text style={styles.saveBtnText}>Salva</Text></TouchableOpacity>
                      </View>
                    </View>
                  ) : (
                    <View style={{ gap: 12 }}>
                      <View style={styles.rowSpace}>
                        <Text style={styles.dateText}>Docente: {selectedCourse.professor}</Text>
                        <Text style={styles.courseCfuText}>{selectedCourse.cfu} CFU</Text>
                      </View>
                      <View style={[styles.tagBadge, { backgroundColor: 'rgba(255,255,255,0.03)', alignSelf: 'flex-start' }]}>
                        <Text style={[styles.tagText, { color: getStatusColor(selectedCourse.status) }]}>{getStatusLabel(selectedCourse.status).toUpperCase()}</Text>
                      </View>

                      {selectedCourse.description ? (
                        <View style={styles.receipt}>
                          <Text style={[styles.label, { marginTop: 0 }]}>Note Corso:</Text>
                          <Text style={styles.cardDesc}>{selectedCourse.description}</Text>
                        </View>
                      ) : null}

                      <View style={styles.row}>
                        <View style={styles.statCard}>
                          <Text style={styles.statVal}>{sessions.filter((s)=>s.courseId===selectedCourse.id).reduce((sum,s)=>sum+s.duration, 0)}m</Text>
                          <Text style={styles.statSub}>Studio Totale</Text>
                        </View>
                        <View style={styles.statCard}>
                          <Text style={styles.statVal}>{tasks.filter((t)=>t.courseId===selectedCourse.id && t.completed).length}/{tasks.filter((t)=>t.courseId===selectedCourse.id).length}</Text>
                          <Text style={styles.statSub}>Task Completati</Text>
                        </View>
                      </View>

                      <View style={[styles.receipt, { gap: 4 }]}>
                        <View style={styles.rowSpace}>
                          <Text style={styles.cardTitle}>Task Associati</Text>
                          <TouchableOpacity onPress={() => setAddTaskModal(true)}><Text style={{ fontSize: 11, color: '#A78BFA', fontWeight: 'bold' }}>+ Aggiungi</Text></TouchableOpacity>
                        </View>
                        {tasks.filter((t)=>t.courseId===selectedCourse.id).length === 0 ? (
                          <Text style={styles.emptyText}>Nessun task per questo corso.</Text>
                        ) : (
                          <FlatList
                            data={tasks.filter((t)=>t.courseId===selectedCourse.id)}
                            keyExtractor={(item) => item.id}
                            scrollEnabled={false}
                            renderItem={({ item: task }) => (
                              <View style={styles.taskRow}>
                                <TouchableOpacity onPress={() => toggleTaskCompleted(task.id)}>
                                  <Ionicons name={task.completed ? "checkbox" : "square-outline"} size={18} color={task.completed ? "#10B981" : "#FFF"} />
                                </TouchableOpacity>
                                <Text style={[styles.taskText, task.completed && styles.lineThrough, { flex: 1, marginLeft: 8 }]}>{task.title}</Text>
                              </View>
                            )}
                          />
                        )}
                      </View>

                      <View style={[styles.row, { marginTop: 12 }]}>
                        <TouchableOpacity style={[styles.cancelBtn, { borderColor: '#8B5CF6' }]} onPress={() => setEditMode(true)}><Text style={[styles.cancelBtnText, { color: '#8B5CF6' }]}>Modifica</Text></TouchableOpacity>
                        <TouchableOpacity style={[styles.cancelBtn, { borderColor: '#EF4444' }]} onPress={() => {
                          Alert.alert("Elimina", "Eliminare il corso e le attività associate?", [
                            { text: "No" },
                            { text: "Sì", style: "destructive", onPress: async () => { await deleteCourse(selectedCourse.id); setSelectedCourse(null); } }
                          ]);
                        }}><Text style={[styles.cancelBtnText, { color: '#EF4444' }]}>Elimina</Text></TouchableOpacity>
                      </View>
                    </View>
                  )}
                </ScrollView>
              </View>
            </KeyboardAvoidingView>
          </TouchableWithoutFeedback>
        </Modal>
      )}

      {/* REGISTRA STUDIO MODAL */}
      <BaseFormModal visible={addSessionModal} title="Registra Studio" onCancel={() => setAddSessionModal(false)} onConfirm={async () => {
        if (selectedCourse) {
          await addSession({ courseId: selectedCourse.id, date: getRelativeDateStr(0), duration: parseInt(sessionMins) || 60, activityType: 'study', notes: sessionNotes });
          setAddSessionModal(false); setSessionNotes('');
        }
      }} confirmLabel="Registra">
        <Text style={styles.label}>Durata (minuti)</Text>
        <TextInput style={styles.input} keyboardType="numeric" value={sessionMins} onChangeText={setSessionMins} />
        <Text style={styles.label}>Attività</Text>
        <TextInput style={styles.input} value={sessionNotes} onChangeText={setSessionNotes} placeholder="Cosa hai studiato?" placeholderTextColor="#64748B" />
      </BaseFormModal>

      {/* AGGIUNGI TASK MODAL */}
      <BaseFormModal visible={addTaskModal} title="Aggiungi Task" onCancel={() => setAddTaskModal(false)} onConfirm={async () => {
        if (selectedCourse && taskTitle.trim()) {
          await addTask({ title: taskTitle.trim(), courseId: selectedCourse.id, priority: 'medium', estimatedTime: 60 });
          setAddTaskModal(false); setTaskTitle('');
        }
      }}>
        <Text style={styles.label}>Titolo Task</Text>
        <TextInput style={styles.input} value={taskTitle} onChangeText={setTaskTitle} placeholder="Es. Preparare appunti" placeholderTextColor="#64748B" />
      </BaseFormModal>
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
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(30, 41, 59, 0.6)', marginHorizontal: 16, marginVertical: 8, paddingHorizontal: 12, height: 40, borderRadius: 10, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  searchInput: { flex: 1, color: '#FFF', fontSize: 13, marginLeft: 6 },
  chip: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 15, backgroundColor: 'rgba(255,255,255,0.02)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  chipActive: { backgroundColor: 'rgba(139, 92, 246, 0.15)', borderColor: 'rgba(139, 92, 246, 0.3)' },
  chipText: { fontSize: 11, color: '#94A3B8', fontWeight: '600' },
  chipTextActive: { color: '#A78BFA' },
  emptyText: { fontSize: 12, color: '#64748B', textAlign: 'center', paddingVertical: 12 },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  modal: { backgroundColor: '#0F172A', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)', paddingBottom: Platform.OS === 'ios' ? 35 : 20 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#FFF' },
  label: { fontSize: 10, color: '#94A3B8', textTransform: 'uppercase', marginTop: 10, marginBottom: 6, fontWeight: 'bold' },
  input: { backgroundColor: 'rgba(30, 41, 59, 0.6)', borderRadius: 10, height: 40, paddingHorizontal: 12, color: '#FFF', fontSize: 13, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  row: { flexDirection: 'row', gap: 8 },
  rowSpace: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cancelBtn: { flex: 1, backgroundColor: 'rgba(255,255,255,0.02)', height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  cancelBtnText: { color: '#94A3B8', fontWeight: '600', fontSize: 13 },
  saveBtn: { flex: 1, backgroundColor: '#8B5CF6', height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  saveBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 13 },
  dateText: { fontSize: 13, color: '#94A3B8', marginTop: 2 },
  courseCfuText: { fontSize: 10, color: '#A78BFA', backgroundColor: 'rgba(139,92,246,0.1)', paddingVertical: 2, paddingHorizontal: 6, borderRadius: 4, fontWeight: 'bold' },
  tagBadge: { flexDirection: 'row', alignItems: 'center', paddingVertical: 3, paddingHorizontal: 6, borderRadius: 6, gap: 4 },
  tagText: { fontSize: 9, fontWeight: 'bold' },
  receipt: { backgroundColor: 'rgba(0,0,0,0.15)', borderRadius: 10, padding: 12, gap: 4, marginTop: 8 },
  cardTitle: { fontSize: 15, fontWeight: 'bold', color: '#FFF' },
  cardDesc: { fontSize: 13, color: '#CBD5E1', marginTop: 6, lineHeight: 18 },
  statCard: { flex: 1, minWidth: 120, backgroundColor: 'rgba(30, 41, 59, 0.7)', padding: 12, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)', alignItems: 'center' },
  statVal: { fontSize: 18, fontWeight: 'bold', color: '#FFF', marginVertical: 4 },
  statSub: { fontSize: 10, color: '#94A3B8' },
  taskRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderColor: 'rgba(255,255,255,0.02)' },
  taskText: { fontSize: 13, color: '#FFF' },
  lineThrough: { textDecorationLine: 'line-through', color: '#64748B' }
});