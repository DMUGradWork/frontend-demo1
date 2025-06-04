import { View, Text, Button, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>홈 화면</Text>
      <View style={styles.buttonContainer}>
        <Button
          title="로그인"
          onPress={() => router.push('/auth/login')}
        />
        <Button
          title="회원가입"
          onPress={() => router.push('/auth/signup')}
        />
        <Button
          title="아이디 찾기"
          onPress={() => router.push('/auth/find-id')}
        />
        <Button
          title="디테일 페이지로 이동"
          onPress={() => router.push('/view/detail')}
        />
        <Button
          title="데이팅 목록"
          onPress={() => router.push('/screens/EventListScreenCopy')}
        />
        <Button
          title="캘린더 보기"
          onPress={() => router.push('/screens/CalendarScreen')}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  buttonContainer: {
    gap: 15,
  },
});


