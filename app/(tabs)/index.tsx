import { Stack } from 'expo-router';
import { useUpdates } from 'expo-updates';
import { StyleSheet, View, Text } from 'react-native';

import { ScreenContent } from '~/components/ScreenContent';

export default function Home() {
  const { currentlyRunning } = useUpdates();
  return (
    <>
      <Stack.Screen options={{ title: 'Tab One' }} />
      <View style={styles.container}>
        <Text style={{ paddingBottom: 20 }}>App version: {currentlyRunning.runtimeVersion}</Text>
        <ScreenContent path="app/(tabs)/index.tsx" title="Tab One" />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
});
