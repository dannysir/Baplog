import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

import { bayesianScore } from '@baplog/core';

export default function App() {
  const sampleScore = bayesianScore({ up: 5, neutral: 0, down: 0 });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Baplog</Text>
      <Text style={styles.subtitle}>가본 맛집을 사진으로 기록하는 나만의 지도</Text>
      <Text style={styles.note}>샘플 베이지안 점수(추천 5): {sampleScore.toFixed(2)}</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 14,
    color: '#444',
    textAlign: 'center',
    marginBottom: 24,
  },
  note: {
    fontSize: 12,
    color: '#888',
  },
});
