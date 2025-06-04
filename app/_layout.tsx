import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

export default function Layout() {
  const router = useRouter();

  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: '#f4511e',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerLeft: ({ canGoBack }) => {
            if (!canGoBack) return null;
            return (
              <Ionicons
                name="arrow-back"
                size={24}
                color="white"
                onPress={() => router.back()}
              />
            );
          },
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="auth/login"
          options={{
            title: '로그인',
          }}
        />
        <Stack.Screen
          name="auth/signup"
          options={{
            title: '회원가입',
          }}
        />
        <Stack.Screen
          name="auth/find-id"
          options={{
            title: '아이디 찾기',
          }}
        />
        <Stack.Screen
          name="screens/EventListScreenCopy"
          options={{
            title: '데이팅 목록',
          }}
        />
        <Stack.Screen
          name="screens/CalendarScreen"
          options={{
            title: '캘린더',
          }}
        />
        <Stack.Screen
          name="view/detail"
          options={{
            title: '상세 정보',
          }}
        />
      </Stack>
    </>
  );
} 