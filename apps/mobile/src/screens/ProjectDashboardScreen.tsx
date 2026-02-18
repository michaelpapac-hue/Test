import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';

export function ProjectDashboardScreen() {
  const cards = [
    { label: 'Active Projects', value: '12' },
    { label: "Today's Reports", value: '9/12' },
    { label: 'Open Safety Flags', value: '4' },
    { label: 'Hot Items', value: '6' },
    { label: 'Weather', value: '72°F - Partly Cloudy' },
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Project Dashboard</Text>
      {cards.map((card) => (
        <View key={card.label} style={styles.card}>
          <Text style={styles.cardLabel}>{card.label}</Text>
          <Text style={styles.cardValue}>{card.value}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, padding: 16 },
  header: { color: colors.text, fontSize: 26, marginBottom: 12, fontWeight: '700' },
  card: { backgroundColor: colors.card, borderRadius: 14, padding: 16, marginBottom: 10 },
  cardLabel: { color: colors.muted, fontSize: 13 },
  cardValue: { color: colors.text, fontSize: 22, fontWeight: '700', marginTop: 4 },
});
