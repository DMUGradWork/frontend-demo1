import { View, Text, Button, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function DetailScreen() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <View style={styles.card}>
        <Button title="뒤로 가기" onPress={() => router.back()} />
      </View>
    </View>
  );
}

export const styles = StyleSheet.create({
  card: {
    backgroundColor: 'red',
    padding: 16,
    borderRadius: 8,
  },
  
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  desc: {
    fontSize: 14,
    color: '#666',
  },
});
