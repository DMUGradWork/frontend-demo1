import React, { useEffect, useState } from 'react';
import { FlatList, View, Text, SafeAreaView, ActivityIndicator, Platform, TouchableOpacity, StyleSheet } from 'react-native';
import EventCard from '../view/EventCard';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

interface DatingEventCardDto {
  id: number;
  title: string;
  hostname: string;
  eventDate: string;
  location: string;
  currentMaleParticipants: number;
  maxMaleParticipantsCount: number;
  currentFemaleParticipants: number;
  maxFemaleParticipantsCount: number;
}

export default function EventListScreen() {
  const router = useRouter();
  // Determine host for iOS vs. Android emulator
  const host = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';
  const baseURL = `http://${host}:8080`;

  // 1) state 선언
  const [events, setEvents] = useState<DatingEventCardDto[]>([]);
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
        const data: DatingEventCardDto[] = await res.json();
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
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#7B9BFF" />
        <Text style={styles.loadingText}>이벤트를 불러오는 중...</Text>
      </View>
    );
  }
  if (errorMsg) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={24} color="#2E3A59" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>데이팅 이벤트</Text>
        </View>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={64} color="#FF6B6B" />
          <Text style={styles.errorTitle}>오류가 발생했습니다</Text>
          <Text style={styles.errorText}>{errorMsg}</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={() => window.location.reload()}
          >
            <Text style={styles.retryButtonText}>다시 시도</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // 4) 정상적으로 데이터를 받았으면 FlatList에 바인딩
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={24} color="#2E3A59" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>데이팅 이벤트</Text>
      </View>
      
      <View style={styles.content}>
        <FlatList
          data={events}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <EventCard
              eventId={item.id}
              title={item.title}
              host={item.hostname}
              date={item.eventDate}
              location={item.location}
              currentMaleParticipants={item.currentMaleParticipants}
              maxMaleParticipants={item.maxMaleParticipantsCount}
              currentFemaleParticipants={item.currentFemaleParticipants}
              maxFemaleParticipants={item.maxFemaleParticipantsCount}
            />
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="calendar-outline" size={64} color="#C8D6E5" />
              <Text style={styles.emptyTitle}>등록된 이벤트가 없습니다</Text>
              <Text style={styles.emptyText}>새로운 이벤트가 곧 업데이트될 예정입니다!</Text>
            </View>
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E8ECF0',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F1F3F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2E3A59',
  },
  content: {
    flex: 1,
    paddingTop: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#5A6B8C',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  errorTitle: {
    marginTop: 20,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2E3A59',
    textAlign: 'center',
  },
  errorText: {
    marginTop: 8,
    fontSize: 16,
    color: '#5A6B8C',
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 24,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#7B9BFF',
    borderRadius: 12,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
  },
  emptyTitle: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: '600',
    color: '#2E3A59',
    textAlign: 'center',
  },
  emptyText: {
    marginTop: 8,
    fontSize: 14,
    color: '#5A6B8C',
    textAlign: 'center',
  },
});