import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, SafeAreaView, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StudyProvider, useStudy } from '../src/context/StudyContext';
import DashboardTab from '../src/screens/DashboardTab';
import CorsiTab from '../src/screens/CorsiTab';
import ExamiTab from '../src/screens/EsamiTab';
import AgendaTab from '../src/screens/AgendaTab';
import TimerTab from '../src/screens/TimerTab';
import StatsTab from '../src/screens/StatsTab';

function MainApp() {
  const [tab, setTab] = useState<'dashboard' | 'courses' | 'exams' | 'planner' | 'timer' | 'stats'>('dashboard');

  // Stato condiviso tra l'Assistente Intelligente e il Timer Pomodoro
  const [timerCourse, setTimerCourse] = useState('');
  const [timerTask, setTimerTask] = useState('');

  const renderContent = () => {
    switch (tab) {
      case 'dashboard':
        return <DashboardTab setTab={setTab} setTimerCourse={setTimerCourse} setTimerTask={setTimerTask} />;
      case 'courses':
        return <CorsiTab />;
      case 'exams':
        return <ExamiTab />;
      case 'planner':
        return <AgendaTab />;
      case 'stats':
        return <StatsTab />;
      case 'timer':
        return <TimerTab timerCourse={timerCourse} setTimerCourse={setTimerCourse} timerTask={timerTask} setTimerTask={setTimerTask} />;
      default:
        return <DashboardTab setTab={setTab} setTimerCourse={setTimerCourse} setTimerTask={setTimerTask} />;
    }
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar barStyle="light-content" backgroundColor="#0F172A" />
        <View style={{ flex: 1 }}>{renderContent()}</View>

        {/* Global Bottom Tab Bar */}
        <View style={styles.tabBar}>
          <TouchableOpacity style={styles.tabBtn} onPress={() => setTab('dashboard')}>
            <Ionicons name="home" size={20} color={tab === 'dashboard' ? '#A78BFA' : '#64748B'} />
            <Text style={[styles.tabBtnText, tab === 'dashboard' && styles.tabBtnTextActive]}>Home</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.tabBtn} onPress={() => setTab('courses')}>
            <Ionicons name="book" size={20} color={tab === 'courses' ? '#A78BFA' : '#64748B'} />
            <Text style={[styles.tabBtnText, tab === 'courses' && styles.tabBtnTextActive]}>Corsi</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.tabBtn} onPress={() => setTab('exams')}>
            <Ionicons name="calendar" size={20} color={tab === 'exams' ? '#A78BFA' : '#64748B'} />
            <Text style={[styles.tabBtnText, tab === 'exams' && styles.tabBtnTextActive]}>Esami</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.tabBtn} onPress={() => setTab('planner')}>
            <Ionicons name="list" size={20} color={tab === 'planner' ? '#A78BFA' : '#64748B'} />
            <Text style={[styles.tabBtnText, tab === 'planner' && styles.tabBtnTextActive]}>Agenda</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.tabBtn} onPress={() => setTab('timer')}>
            <Ionicons name="time" size={20} color={tab === 'timer' ? '#A78BFA' : '#64748B'} />
            <Text style={[styles.tabBtnText, tab === 'timer' && styles.tabBtnTextActive]}>Timer</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.tabBtn} onPress={() => setTab('stats')}>
            <Ionicons name="pie-chart" size={20} color={tab === 'stats' ? '#A78BFA' : '#64748B'} />
            <Text style={[styles.tabBtnText, tab === 'stats' && styles.tabBtnTextActive]}>Stats</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

export default function App() {
  return (
    <StudyProvider>
      <MainApp />
    </StudyProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' },
  tabBar: {
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    width: '100%',
    backgroundColor: 'rgba(15, 23, 42, 0.95)',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    justifyContent: 'space-around',
    height: 60,
  },
  tabBtn: { alignItems: 'center', justifyContent: 'center', flex: 1 },
  tabBtnText: { fontSize: 10, color: '#64748B', marginTop: 2 },
  tabBtnTextActive: { color: '#A78BFA', fontWeight: 'bold' },
});