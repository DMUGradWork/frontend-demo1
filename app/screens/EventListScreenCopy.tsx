import React, { useEffect, useState } from 'react';
import { FlatList, View, Text, SafeAreaView, ActivityIndicator, Platform } from 'react-native';
import EventCard from '../view/EventCard';

interface Event {
  id: string;
  title: string;
  hostname: string;
  date: string;
  location: string;
  currentParticipants: number;
  totalParticipants: number;
  backgroundImage?: string;
}

export default function EventListScreen() {
    // Determine host for iOS vs. Android emulator
  const host = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';
  const baseURL = `http://${host}:8080`;

  // 1) state 선언
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // 2) 컴포넌트 마운트 시 한 번만 데이터 불러오기
  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await fetch(`${baseURL}/dating/dating-events`);
        if (!res.ok) {
          throw new Error(`서버 에러: ${res.status}`);
        }
        const data: Event[] = await res.json();
        setEvents(data);
      } catch (err: any) {
        setErrorMsg(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, []);

  // 3) 로딩 & 에러 처리
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
  if (errorMsg) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>👀 오류 발생: {errorMsg}</Text>
      </View>
    );
  }

  // 4) 정상적으로 데이터를 받았으면 FlatList에 바인딩
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <FlatList
        data={events}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <EventCard
            title={item.title}
            host={item.hostname}
            date={item.date}
            location={item.location}
            currentParticipants={item.currentParticipants}
            totalParticipants={item.totalParticipants}
            backgroundImage={item.backgroundImage}
          />
        )}
        // 빈 배열일 때 출력할 컴포넌트
        ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 20 }}>등록된 이벤트가 없습니다.</Text>}
      />
    </SafeAreaView>
  );
}