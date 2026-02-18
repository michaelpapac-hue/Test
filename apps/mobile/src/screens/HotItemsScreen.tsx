import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';

const hotItems = [
  { id: 'h1', description: 'Roof crew without tie-off line', status: 'OPEN', due: 'Today 4:00 PM' },
  { id: 'h2', description: 'Open trench near loading dock', status: 'DEFERRED', due: 'Tomorrow' },
];

export function HotItemsScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16, gap: 10 }}>
      <Text style={styles.title}>Hot Items</Text>
      {hotItems.map((item) => (
        <View key={item.id} style={styles.card}>
          <Text style={styles.desc}>{item.description}</Text>
          <Text style={styles.meta}>Status: {item.status} • Due: {item.due}</Text>
          <Pressable style={styles.btn}><Text style={styles.btnText}>Assign / Update</Text></Pressable>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  title: { color: colors.text, fontSize: 24, fontWeight: '700' },
  card: { backgroundColor: colors.card, borderRadius: 12, padding: 14, gap: 8 },
  desc: { color: colors.text, fontWeight: '600' },
  meta: { color: colors.muted },
  btn: { backgroundColor: colors.accent, borderRadius: 10, padding: 10, alignItems: 'center' },
  btnText: { color: '#111', fontWeight: '700' },
});
