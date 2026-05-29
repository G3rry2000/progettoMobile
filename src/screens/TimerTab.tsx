import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Modal, Alert, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useStudy } from '../context/StudyContext';

export default function TimerTab({ timerCourse, setTimerCourse, timerTask, setTimerTask }: any) {
  const { courses, tasks, addSession, updateTask } = useStudy();
  
  const [isBreak, setIsBreak] = useState(false);
  const [seconds, setSeconds] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<any>(null);

  const [celeb, setCeleb] = useState(false);
  const [completedSessions, setCompletedSessions] = useState(0);

  const getCourseName = (id: string) => courses.find((c) => c.id === id)?.name || 'Studio Generale';
  const getTaskTitle = (id: string) => tasks.find((t) => t.id === id)?.title || 'Generale';

  useEffect(() => {
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  const handleToggle = () => {
    if (isRunning) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setIsRunning(false);
    } else {
      setIsRunning(true);
      intervalRef.current = setInterval(() => {
        setSeconds((s) => {
          if (s <= 1) {
            // Usiamo setTimeout per spostare l'aggiornamento fuori dal ciclo di rendering immediato
            setTimeout(() => { handleComplete(); }, 10);
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    }
  };

  const handleComplete = async () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsRunning(false);

    if (!isBreak) {
      if (timerCourse) {
        try {
          await addSession({
            courseId: timerCourse,
            date: new Date().toISOString().split('T')[0],
            duration: 25,
            activityType: 'study',
            notes: `Focus Pomodoro completato ${timerTask ? `sul task "${getTaskTitle(timerTask)}"` : ''}`
          });

          if (timerTask) {
            const target = tasks.find((t) => t.id === timerTask);
            if (target) {
              await updateTask(timerTask, { actualTime: target.actualTime + 25 });
            }
          }
          setCompletedSessions((c) => c + 1);
          setCeleb(true);
        } catch (error) {
          console.error("Errore durante il salvataggio della sessione:", error);
        }
      }
      setIsBreak(true);
      setSeconds(5 * 60);
    } else {
      Alert.alert("Pausa Finita! ☕", "Il tempo di recupero è terminato. Pronto a riprendere la sessione di studio?");
      setIsBreak(false);
      setSeconds(25 * 60);
    }
  };

  const reset = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsRunning(false);
    setSeconds(isBreak ? 5 * 60 : 25 * 60);
  };

  const skipTimer = () => {
    // Spostiamo l'esecuzione fuori dal thread grafico principale per evitare cattivi accoppiamenti di stato
    setTimeout(() => { handleComplete(); }, 10);
  };

  const format = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m < 10 ? '0' : ''}${m}:${sec < 10 ? '0' : ''}${sec}`;
  };

  const themeColor = isBreak ? '#10B981' : '#8B5CF6';
  const ringBgColor = isBreak ? 'rgba(16, 185, 129, 0.15)' : 'rgba(139, 92, 246, 0.15)';

  return (
    <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Timer Pomodoro ⏱️</Text>
        <View style={styles.rowAlign}>
          <Ionicons name="ribbon" size={16} color="#F59E0B" />
          <Text style={{ fontSize: 13, color: '#F59E0B', fontWeight: 'bold', marginLeft: 4 }}>Oggi: {completedSessions}</Text>
        </View>
      </View>

      <View style={{ alignItems: 'center', marginVertical: 32 }}>
        <View style={[styles.timerRingOuter, { borderColor: ringBgColor }]}>
          <View style={styles.timerRingInner}>
            <Text style={styles.timerDigits}>{format(seconds)}</Text>
            <Text style={[styles.timerSub, { color: themeColor, fontWeight: 'bold' }]}>
              {isBreak ? "PAUSA RIGENERANTE ☕" : "STUDIO FOCALIZZATO 🎯"}
            </Text>
          </View>
        </View>
      </View>

      <View style={[styles.row, { justifyContent: 'center', gap: 24, marginBottom: 20 }]}>
        <TouchableOpacity style={styles.iconCircle} onPress={reset}>
          <Ionicons name="refresh" size={20} color="#FFF" />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.playCircle, { backgroundColor: themeColor }]} onPress={handleToggle}>
          <Ionicons name={isRunning ? "pause" : "play"} size={28} color="#FFF" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconCircle} onPress={skipTimer}>
          <Ionicons name="play-skip-forward" size={20} color="#F59E0B" />
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Pianifica la Sessione</Text>
        <Text style={styles.cardSub}>Associa lo studio ad un corso per accumulare ore di progresso ed ore nei task.</Text>

        <Text style={[styles.label, { marginTop: 12 }]}>Seleziona Corso</Text>
        <FlatList
          horizontal
          data={courses}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 6, paddingVertical: 4 }}
          renderItem={({ item: c }) => (
            <TouchableOpacity style={[styles.chip, timerCourse === c.id && styles.chipActive]} onPress={() => { setTimerCourse(c.id); setTimerTask(''); }}>
              <Text style={[styles.chipText, timerCourse === c.id && styles.chipTextActive]}>{c.name}</Text>
            </TouchableOpacity>
          )}
        />

        {timerCourse && tasks.filter((t) => !t.completed && t.courseId === timerCourse).length > 0 ? (
          <View>
            <Text style={styles.label}>Seleziona Task attivo</Text>
            <FlatList
              horizontal
              data={[{ id: '__none', title: 'Nessuno / Solo Corso' }, ...tasks.filter((t) => !t.completed && t.courseId === timerCourse)]}
              keyExtractor={(item) => item.id}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 6, paddingVertical: 4 }}
              renderItem={({ item }) => (
                item.id === '__none' ? (
                  <TouchableOpacity style={[styles.chip, timerTask === '' && styles.chipActive]} onPress={() => setTimerTask('')}>
                    <Text style={styles.chipText}>Nessuno / Solo Corso</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity style={[styles.chip, timerTask === item.id && styles.chipActive]} onPress={() => setTimerTask(item.id)}>
                    <Text style={[styles.chipText, timerTask === item.id && styles.chipTextActive]}>{item.title}</Text>
                  </TouchableOpacity>
                )
              )}
            />
          </View>
        ) : null}
      </View>

      {/* Celebration Modal blindato */}
      <Modal visible={celeb} transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 10, zIndex: 10 }}>
              <TouchableOpacity onPress={() => setCeleb(false)}>
                <Ionicons name="close-circle" size={26} color="#94A3B8" />
              </TouchableOpacity>
            </View>

            <Ionicons name="trophy" size={50} color="#F59E0B" style={{ alignSelf: 'center', marginBottom: 12 }} />
            <Text style={[styles.modalTitle, { textAlign: 'center' }]}>Grande Lavoro! 🎉</Text>
            <Text style={[styles.cardDesc, { textAlign: 'center', marginBottom: 16 }]}>
              Hai completato con successo un ciclo di studio di 25 minuti!
            </Text>
            
            <View style={styles.receipt}>
              <Text style={{ fontSize: 11, color: '#64748B', fontWeight: 'bold' }}>CREDITI CONSEGUITI:</Text>
              <Text style={styles.cardDesc}>• Corso: {getCourseName(timerCourse)}</Text>
              {timerTask ? <Text style={styles.cardDesc}>• Task: {getTaskTitle(timerTask)}</Text> : null}
              <Text style={styles.cardDesc}>• Minuti accreditati: +25 min</Text>
            </View>

            <TouchableOpacity style={[styles.saveBtn, { width: '100%', marginTop: 20, backgroundColor: themeColor }]} onPress={() => setCeleb(false)}>
              <Text style={styles.saveBtnText}>Chiudi e Avvia Pausa</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 90, alignSelf: 'center', width: '100%', maxWidth: 600 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 20, fontWeight: 'bold', color: '#FFF' },
  rowAlign: { flexDirection: 'row', alignItems: 'center' },
  row: { flexDirection: 'row', gap: 8 },
  iconCircle: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.03)', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  playCircle: { width: 60, height: 60, borderRadius: 30, alignItems: 'center', justifyContent: 'center' },
  card: { backgroundColor: 'rgba(30, 41, 59, 0.7)', padding: 16, borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)', marginBottom: 16 },
  cardTitle: { fontSize: 15, fontWeight: 'bold', color: '#FFF' },
  cardSub: { fontSize: 11, color: '#64748B', marginBottom: 8 },
  label: { fontSize: 10, color: '#94A3B8', textTransform: 'uppercase', marginTop: 10, marginBottom: 6, fontWeight: 'bold' },
  chip: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 15, backgroundColor: 'rgba(255,255,255,0.02)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  chipActive: { backgroundColor: 'rgba(139, 92, 246, 0.15)', borderColor: 'rgba(139, 92, 246, 0.3)' },
  chipText: { fontSize: 11, color: '#94A3B8', fontWeight: '600' },
  chipTextActive: { color: '#A78BFA' },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  modal: { backgroundColor: '#0F172A', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#FFF' },
  cardDesc: { fontSize: 13, color: '#CBD5E1', marginTop: 6, lineHeight: 18 },
  receipt: { backgroundColor: 'rgba(0,0,0,0.15)', borderRadius: 10, padding: 12, gap: 4, marginTop: 8 },
  saveBtn: { flex: 1, height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  saveBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 13 },
  timerRingOuter: { width: 180, height: 180, borderRadius: 90, backgroundColor: 'rgba(255,255,255,0.01)', borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  timerRingInner: { width: 160, height: 160, borderRadius: 80, backgroundColor: '#1E293B', alignItems: 'center', justifyContent: 'center' },
  timerDigits: { fontSize: 36, fontWeight: 'bold', color: '#FFF', letterSpacing: 1 },
  timerSub: { fontSize: 8, marginTop: 4, letterSpacing: 1 },
});