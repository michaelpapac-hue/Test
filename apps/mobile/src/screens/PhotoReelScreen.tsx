import React from 'react';
import { FlatList, Image, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';

const photos = [
  {
    id: '1',
    imageUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200',
    timestamp: '07:40 AM',
    aiRisk: 8,
    aiResult: 'No fall protection',
    caption: 'Crew on roof deck prep.',
  },
  {
    id: '2',
    imageUrl: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1200',
    timestamp: '11:20 AM',
    aiRisk: 3,
    aiResult: 'No critical hazard',
    caption: 'Material staging complete.',
  },
];

export function PhotoReelScreen() {
  return (
    <FlatList
      style={styles.container}
      data={photos}
      pagingEnabled
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={styles.frame}>
          <Image source={{ uri: item.imageUrl }} style={styles.image} />
          <View style={styles.overlay}>
            <Text style={styles.time}>{item.timestamp}</Text>
            <Text style={styles.caption}>{item.caption}</Text>
            <Text style={styles.ai}>AI: {item.aiResult}</Text>
            <Text style={[styles.risk, { color: item.aiRisk >= 7 ? colors.danger : colors.success }]}>Risk {item.aiRisk}/10</Text>
          </View>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  frame: { height: 720, justifyContent: 'flex-end' },
  image: { ...StyleSheet.absoluteFillObject },
  overlay: { backgroundColor: 'rgba(0,0,0,0.45)', padding: 16, gap: 6 },
  time: { color: '#fff', fontWeight: '700' },
  caption: { color: '#fff', fontSize: 16 },
  ai: { color: '#facc15' },
  risk: { fontWeight: '700', fontSize: 18 },
});
