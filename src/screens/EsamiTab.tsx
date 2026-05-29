import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  FlatList,
  ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useStudy } from '../context/StudyContext';
import { Exam } from '../types/study';
import { getRelativeDateStr } from '../constants/initialData';

export default function EsamiTab() {
  const { exams, courses, addExam, updateExam, deleteExam } = useStudy();
  const [examTab, setExamTab] = useState<'upcoming' | 'past'>('upcoming');
  const [modal, setModal] = useState(false);

  const [title, setTitle] = useState('');
  const [courseId, setCourseId] = useState(courses[0]?.id || '');
  const [date, setDate] = useState(getRelativeDateStr(0));

  const [resultModal, setResultModal] = useState(false);
  const [selectedEx, setSelectedEx] = useState<Exam | null>(null);
  const [grade, setGrade] = useState('30');
  const [eStatus, setEStatus] = useState<'passed' | 'failed'>('passed');

  const getCourseName = (id: string) => courses.find((c) => c.id === id)?.name || 'Corso';

  const upcomingList = exams.filter((e) => e.status === 'planned');
  const pastList = exams.filter((e) => e.status !== 'planned');

  const handleCreate = async () => {
    if (!title.trim()) return;

    const oggiStr = new Date().toISOString().split('T')[0];
    if (date < oggiStr) {
      Alert.alert(
        'Data Non Valida ⚠️',
        "Non puoi pianificare un esame in una data passata. Se lo hai già sostenuto, inseriscilo con la data odierna o futura e poi registrane l'esito."
      );
      return;
    }

    const finalCourseId = courseId || courses[0]?.id;
    if (!finalCourseId) {
      Alert.alert('Errore', "Devi inserire almeno un corso nel tab 'Corsi' prima di pianificare una scadenza.");
      return;
    }

    await addExam({ title: title.trim(), courseId: finalCourseId, date, type: 'written', priority: 'medium', status: 'planned' });
    setTitle(''); setCourseId(courses[0]?.id || ''); setModal(false);
  };

  const handleSaveResult = async () => {
    if (!selectedEx) return;
    let finalGrade: number | undefined = undefined;

    if (eStatus === 'passed') {
      const cleanInput = grade.trim().toLowerCase();
      if (cleanInput === '30l' || cleanInput === '30 lode' || cleanInput === '30 e lode') {
        finalGrade = 31;
      } else {
        const votoNum = parseInt(cleanInput);
        if (isNaN(votoNum) || votoNum < 18 || votoNum > 30) {
          Alert.alert('Voto Errato ⚠️', "Un esame superato deve avere un voto numerico tra 18 e 30. Scrivi '30L' per registrare la lode.");
          return;
        }
        finalGrade = votoNum;
      }
    }

    await updateExam(selectedEx.id, { status: eStatus, grade: finalGrade });
    setResultModal(false); setSelectedEx(null);
  };

  const renderPastGrade = (g?: number) => {
    if (!g) return '';
    return g === 31 ? '30L' : g.toString();
  };

  const examsData = courses.length === 0 ? [] : (examTab === 'upcoming' ? upcomingList : pastList);

  return (
    <View style={styles.container}>
      <FlatList
        data={examsData}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.scroll}
        ListHeaderComponent={() => (
          <>
            <View style={styles.tabHeader}>
              <Text style={styles.title}>Esami & Scadenze 📅</Text>
              {courses.length > 0 && (
                <TouchableOpacity style={styles.addButton} onPress={() => setModal(true)}>
                  <Ionicons name="add" size={18} color="#FFF" />
                  <Text style={styles.addButtonText}>Pianifica</Text>
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.modeTabs}>
              <TouchableOpacity style={[styles.modeTab, examTab === 'upcoming' && styles.modeTabActive]} onPress={() => setExamTab('upcoming')}>
                <Text style={[styles.modeText, examTab === 'upcoming' && styles.modeTextActive]}>Da Sostenere ({upcomingList.length})</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modeTab, examTab === 'past' && styles.modeTabActive]} onPress={() => setExamTab('past')}>
                <Text style={[styles.modeText, examTab === 'past' && styles.modeTextActive]}>Sostenuti ({pastList.length})</Text>
              </TouchableOpacity>
            </View>

            {courses.length === 0 && <Text style={styles.emptyText}>Inserisci prima dei corsi nel Tab "Corsi".</Text>}
          </>
        )}
        renderItem={({ item: ex }) => (
          examTab === 'upcoming' ? (
            <View style={styles.card}>
              <View style={styles.rowSpace}>
                <Text style={styles.courseCardName}>{ex.title}</Text>
                <Text style={{ fontSize: 11, color: '#A78BFA', fontWeight: 'bold' }}>{ex.date}</Text>
              </View>
              <Text style={styles.courseCardProf}>{getCourseName(ex.courseId)}</Text>
              <View style={[styles.rowSpace, { marginTop: 12, borderTopWidth: 1, borderColor: 'rgba(255,255,255,0.03)', paddingTop: 8 }]}>
                <Text style={{ fontSize: 11, color: '#64748B' }}>Tipo: {ex.type.toUpperCase()}</Text>
                <View style={styles.rowAlign}>
                  <TouchableOpacity style={styles.completeBtn} onPress={() => { setSelectedEx(ex); setResultModal(true); }}>
                    <Text style={styles.completeBtnText}>Esito</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={{ marginLeft: 12 }} onPress={() => {
                    Alert.alert('Elimina', 'Rimuovere questo esame?', [
                      { text: 'Annulla' },
                      { text: 'Sì', style: 'destructive', onPress: async () => await deleteExam(ex.id) }
                    ]);
                  }}>
                    <Ionicons name="trash" size={16} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ) : (
            <View style={styles.card}>
              <View style={styles.rowSpace}>
                <Text style={styles.courseCardName}>{ex.title}</Text>
                <Text style={[styles.tagText, { color: ex.status === 'passed' ? '#10B981' : '#EF4444', fontWeight: 'bold' }]}>
                  {ex.status === 'passed' ? `SUPERATO VOTO: ${renderPastGrade(ex.grade)}` : 'NON SUPERATO'}
                </Text>
              </View>
              <Text style={styles.courseCardProf}>{getCourseName(ex.courseId)}</Text>
              <Text style={styles.cardSub}>Data sostenimento: {ex.date}</Text>
            </View>
          )
        )}
        ListEmptyComponent={() => (
          <Text style={styles.emptyText}>{courses.length === 0 ? 'Inserisci prima dei corsi nel Tab "Corsi".' : (examTab === 'upcoming' ? 'Nessun esame pianificato.' : 'Nessun esame sostenuto ancora registrato.')}</Text>
        )}
      />

      {/* PLAN MODAL RISOLTA SENZA ANNIDAMENTI DI FLATLIST */}
      <Modal visible={modal} transparent animationType="slide">
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.overlay}>
            <KeyboardAvoidingView style={{ width: '100%' }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
              <View style={styles.modal}>
                <View style={styles.rowSpace}>
                  <Text style={styles.modalTitle}>Pianifica Esame 📅</Text>
                  <TouchableOpacity onPress={() => setModal(false)}><Ionicons name="close" size={24} color="#FFF" /></TouchableOpacity>
                </View>
                
                <View style={{ marginVertical: 12 }}>
                  <Text style={styles.label}>Titolo Scadenza *</Text>
                  <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="Es. Appello Scritto" placeholderTextColor="#64748B" />
                  
                  <Text style={styles.label}>Corso Associato</Text>
                  {/* FIX PROFESSIONALE: Uno ScrollView orizzontale nativo con mappaggio .map() leggero */}
                  <ScrollView 
                    horizontal 
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ gap: 6, paddingVertical: 4 }}
                  >
                    {courses.map((c) => (
                      <TouchableOpacity key={c.id} style={[styles.chip, courseId === c.id && styles.chipActive]} onPress={() => setCourseId(c.id)}>
                        <Text style={[styles.chipText, courseId === c.id && styles.chipTextActive]}>{c.name}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                  
                  <Text style={styles.label}>Data (AAAA-MM-GG)</Text>
                  <TextInput style={styles.input} value={date} onChangeText={setDate} placeholder="AAAA-MM-GG" placeholderTextColor="#64748B" />
                </View>

                <View style={[styles.row, { marginTop: 12 }]}>
                  <TouchableOpacity style={styles.cancelBtn} onPress={() => setModal(false)}><Text style={styles.cancelBtnText}>Annulla</Text></TouchableOpacity>
                  <TouchableOpacity style={styles.saveBtn} onPress={handleCreate}><Text style={styles.saveBtnText}>Crea</Text></TouchableOpacity>
                </View>
              </View>
            </KeyboardAvoidingView>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* LOG ESITO MODAL CON GESTIONE TASTIERA */}
      <Modal visible={resultModal} transparent animationType="slide">
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.overlay}>
            <KeyboardAvoidingView style={{ width: '100%' }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
              <View style={styles.modal}>
                <Text style={styles.modalTitle}>Registra Esito</Text>
                <Text style={styles.label}>Esito</Text>
                <View style={[styles.row, { marginVertical: 8 }]}>
                  <TouchableOpacity style={[styles.chip, eStatus === 'passed' && styles.chipActive]} onPress={() => setEStatus('passed')}><Text style={styles.chipText}>Superato</Text></TouchableOpacity>
                  <TouchableOpacity style={[styles.chip, eStatus === 'failed' && styles.chipActive]} onPress={() => setEStatus('failed')}><Text style={styles.chipText}>Respinto</Text></TouchableOpacity>
                </View>
                {eStatus === 'passed' && (
                  <View>
                    <Text style={styles.label}>Voto Conseguito (Es. 27 o 30L)</Text>
                    <TextInput style={styles.input} value={grade} placeholder="18-30 o 30L" placeholderTextColor="#64748B" onChangeText={setGrade} />
                  </View>
                )}
                <View style={[styles.row, { marginTop: 16 }]}>
                  <TouchableOpacity style={styles.cancelBtn} onPress={() => { setResultModal(false); setSelectedEx(null); }}><Text style={styles.cancelBtnText}>Annulla</Text></TouchableOpacity>
                  <TouchableOpacity style={styles.saveBtn} onPress={handleSaveResult}><Text style={styles.saveBtnText}>Registra</Text></TouchableOpacity>
                </View>
              </View>
            </KeyboardAvoidingView>
          </View>
        </TouchableWithoutFeedback>
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
  modeTabs: { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.02)', marginHorizontal: 16, marginVertical: 8, borderRadius: 10, padding: 2, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  modeTab: { flex: 1, alignItems: 'center', paddingVertical: 8, borderRadius: 8 },
  modeTabActive: { backgroundColor: 'rgba(139,92,246,0.15)', borderWidth: 1, borderColor: 'rgba(139,92,246,0.3)' },
  modeText: { fontSize: 11, color: '#94A3B8', fontWeight: 'bold' },
  modeTextActive: { color: '#A78BFA' },
  emptyText: { fontSize: 12, color: '#64748B', textAlign: 'center', paddingVertical: 12 },
  card: { backgroundColor: 'rgba(30, 41, 59, 0.7)', padding: 16, borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)', marginBottom: 16 },
  rowSpace: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  courseCardName: { fontSize: 15, fontWeight: 'bold', color: '#FFF', flex: 1 },
  courseCardProf: { fontSize: 12, color: '#94A3B8', marginTop: 4, marginBottom: 8 },
  rowAlign: { flexDirection: 'row', alignItems: 'center' },
  completeBtn: { backgroundColor: '#10B981', paddingVertical: 4, paddingHorizontal: 8, borderRadius: 6 },
  completeBtnText: { fontSize: 10, fontWeight: 'bold', color: '#FFF' },
  tagText: { fontSize: 9, fontWeight: 'bold' },
  cardSub: { fontSize: 11, color: '#64748B', marginBottom: 8 },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  modal: { backgroundColor: '#0F172A', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)', paddingBottom: Platform.OS === 'ios' ? 30 : 20 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#FFF' },
  label: { fontSize: 10, color: '#94A3B8', textTransform: 'uppercase', marginTop: 10, marginBottom: 6, fontWeight: 'bold' },
  input: { backgroundColor: 'rgba(30, 41, 59, 0.6)', borderRadius: 10, height: 40, paddingHorizontal: 12, color: '#FFF', fontSize: 13, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  chip: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 15, backgroundColor: 'rgba(255,255,255,0.02)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  chipActive: { backgroundColor: 'rgba(139, 92, 246, 0.15)', borderColor: 'rgba(139, 92, 246, 0.3)' },
  chipText: { fontSize: 11, color: '#94A3B8', fontWeight: '600' },
  chipTextActive: { color: '#A78BFA' },
  row: { flexDirection: 'row', gap: 8 },
  cancelBtn: { flex: 1, backgroundColor: 'rgba(255,255,255,0.02)', height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  cancelBtnText: { color: '#94A3B8', fontWeight: '600', fontSize: 13 },
  saveBtn: { flex: 1, backgroundColor: '#8B5CF6', height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  saveBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 13 }
});