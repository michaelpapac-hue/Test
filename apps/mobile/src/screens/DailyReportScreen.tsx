import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Switch, Text, TextInput, View } from 'react-native';
import * as Speech from 'expo-speech';
import { colors } from '../theme/colors';

export function DailyReportScreen() {
  const [workers, setWorkers] = useState('8');
  const [hours, setHours] = useState('10');
  const [workCompleted, setWorkCompleted] = useState('Steel framing and deck prep');
  const [incident, setIncident] = useState(false);

  const totalLaborHours = useMemo(() => Number(workers || 0) * Number(hours || 0), [workers, hours]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Daily Report</Text>
      <View style={styles.card}>
        <Text style={styles.label}>Labor (3 taps max)</Text>
        <View style={styles.row}>
          <TextInput value={workers} onChangeText={setWorkers} keyboardType="numeric" style={styles.input} placeholder="Workers" placeholderTextColor={colors.muted} />
          <TextInput value={hours} onChangeText={setHours} keyboardType="numeric" style={styles.input} placeholder="Hours" placeholderTextColor={colors.muted} />
        </View>
        <Text style={styles.value}>Labor hours: {totalLaborHours.toFixed(1)}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Work Completed</Text>
        <TextInput multiline value={workCompleted} onChangeText={setWorkCompleted} style={[styles.input, styles.textArea]} placeholder="Describe work completed" placeholderTextColor={colors.muted} />
        <Pressable style={styles.secondaryBtn} onPress={() => Speech.speak(workCompleted || 'No text entered')}>
          <Text style={styles.secondaryBtnText}>Voice Playback</Text>
        </Pressable>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Safety Incident</Text>
        <View style={styles.rowBetween}>
          <Text style={styles.value}>{incident ? 'Incident Reported' : 'No Incident'}</Text>
          <Switch value={incident} onValueChange={setIncident} />
        </View>
      </View>

      <Pressable style={styles.primaryBtn}>
        <Text style={styles.primaryBtnText}>Auto-Save & Submit</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 16, gap: 12 },
  title: { color: colors.text, fontSize: 24, fontWeight: '700' },
  card: { backgroundColor: colors.card, borderRadius: 14, padding: 16 },
  label: { color: colors.muted, marginBottom: 8, fontSize: 14 },
  value: { color: colors.text, fontWeight: '600' },
  row: { flexDirection: 'row', gap: 8 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  input: { backgroundColor: '#243241', color: colors.text, borderRadius: 10, padding: 12, flex: 1 },
  textArea: { minHeight: 92, textAlignVertical: 'top' },
  primaryBtn: { backgroundColor: colors.accent, borderRadius: 12, padding: 16, alignItems: 'center' },
  primaryBtnText: { color: '#111', fontWeight: '800' },
  secondaryBtn: { borderColor: colors.accent, borderWidth: 1, borderRadius: 10, padding: 12, marginTop: 8, alignItems: 'center' },
  secondaryBtnText: { color: colors.accent, fontWeight: '600' },
});
