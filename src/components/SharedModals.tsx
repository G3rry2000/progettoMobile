import React from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Modal } from 'react-native';

interface BaseModalProps {
  visible: boolean;
  title: string;
  onCancel: () => void;
  onConfirm: () => void;
  confirmLabel?: string;
  children: React.ReactNode;
}

export const BaseFormModal: React.FC<BaseModalProps> = ({ visible, title, onCancel, onConfirm, confirmLabel = "Conferma", children }) => (
  <Modal visible={visible} transparent animationType="slide">
    <View style={styles.overlay}>
      <View style={styles.modal}>
        <Text style={styles.modalTitle}>{title}</Text>
        {children}
        <View style={[styles.row, { marginTop: 16 }]}>
          <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
            <Text style={styles.cancelBtnText}>Annulla</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveBtn} onPress={onConfirm}>
            <Text style={styles.saveBtnText}>{confirmLabel}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  modal: { backgroundColor: '#0F172A', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#FFF' },
  row: { flexDirection: 'row', gap: 8 },
  cancelBtn: { flex: 1, backgroundColor: 'rgba(255,255,255,0.02)', height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  cancelBtnText: { color: '#94A3B8', fontWeight: '600', fontSize: 13 },
  saveBtn: { flex: 1, backgroundColor: '#8B5CF6', height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  saveBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 13 },
});