import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  RefreshControl,
  Alert,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../contexts/UserContext';

// API 설정
const host = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';
const API_BASE_URL = `http://${host}:8080`;

interface MyDatingEvent {
  id: number;
  title: string;
  hostname: string;
  eventDate: string;
  location: string;
  currentMaleParticipants: number;
  maxMaleParticipantsCount: number;
  currentFemaleParticipants: number;
  maxFemaleParticipantsCount: number;
  backgroundColor?: string;
  status?: string;
}

const MyDatingEventsScreen = () => {
  const router = useRouter();
  const { userId } = useUser();
  const [events, setEvents] = useState<MyDatingEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (!userId) {
      Alert.alert(
        '사용자 선택 필요',
        '먼저 테스트할 사용자를 선택해주세요.',
        [{ text: '확인', onPress: () => router.back() }]
      );
      return;
    }
    fetchMyEvents();
  }, [userId]);

  const fetchMyEvents = async () => {
    if (!userId) return;

    try {
      setLoading(true);
      
      // 실제 API 호출 - 백엔드에 구현되어 있음
      console.log(`🔄 API 호출: /users/${userId}/dating-events`);
      const response = await fetch(`${API_BASE_URL}/users/${userId}/dating-events`);
      
      if (!response.ok) {
        throw new Error(`API 호출 실패: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('✅ 사용자 참가 이벤트 API 성공:', data);
      
      // DatingEventCardDto 형식 데이터를 MyDatingEvent 형식으로 변환
      const formattedEvents = data.map((event: any) => ({
        id: event.id,
        title: event.title,
        hostname: event.hostname,
        eventDate: event.eventDate,
        location: event.location,
        currentMaleParticipants: event.currentMaleParticipants,
        maxMaleParticipantsCount: event.maxMaleParticipantsCount,
        currentFemaleParticipants: event.currentFemaleParticipants,
        maxFemaleParticipantsCount: event.maxFemaleParticipantsCount,
        // 프론트엔드에서 추가하는 필드들
        backgroundColor: getRandomPastelColor(),
        status: getEventStatus(event.eventDate),
      }));
      
      setEvents(formattedEvents);
      
    } catch (error) {
      console.error('❌ Error fetching user events:', error);
      Alert.alert('API 오류', `사용자 ${userId}의 이벤트를 불러오는데 실패했습니다. 더미 데이터를 표시합니다.`);
      
      // API 실패 시 사용자별 더미 데이터 사용
      setEvents(getDummyEventsForUser(userId));
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchMyEvents();
    setRefreshing(false);
  };

  const handleEventPress = (event: MyDatingEvent) => {
    router.push(`/screens/DatingEventDetailScreen?eventId=${event.id}`);
  };

  const handleLeaveEvent = async (eventId: number) => {
    if (!userId) return;

    Alert.alert(
      '이벤트 나가기',
      '정말로 이 이벤트에서 나가시겠습니까?',
      [
        { text: '취소', style: 'cancel' },
        { 
          text: '나가기', 
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await fetch(
                `${API_BASE_URL}/users/${userId}/dating-events/${eventId}/leave`,
                { method: 'PATCH' }
              );
              
              if (response.ok) {
                Alert.alert('성공', '이벤트에서 나갔습니다.');
                fetchMyEvents(); // 목록 새로고침
              } else {
                throw new Error('Failed to leave event');
              }
            } catch (error) {
              console.error('Error leaving event:', error);
              Alert.alert('오류', '이벤트 나가기에 실패했습니다.');
            }
          }
        }
      ]
    );
  };

  const getEventStatus = (eventDate: string) => {
    const now = new Date();
    const event = new Date(eventDate);
    
    if (event < now) {
      return 'completed';
    } else if (event.getTime() - now.getTime() < 24 * 60 * 60 * 1000) { // 24시간 이내
      return 'active';
    } else {
      return 'upcoming';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return { text: '진행중', color: '#48BB78' };
      case 'upcoming':
        return { text: '예정', color: '#4299E1' };
      case 'completed':
        return { text: '완료', color: '#718096' };
      default:
        return { text: '', color: '#718096' };
    }
  };

  const getRandomPastelColor = () => {
    const colors = ['#B8E7F3', '#FFE8D1', '#E8D4F2', '#D4E8D4', '#FFE0E6', '#E8F0FF'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTotalParticipants = (event: MyDatingEvent) => {
    return {
      current: event.currentMaleParticipants + event.currentFemaleParticipants,
      max: event.maxMaleParticipantsCount + event.maxFemaleParticipantsCount
    };
  };

  const renderEventCard = (event: MyDatingEvent) => {
    const statusInfo = getStatusBadge(event.status || 'upcoming');
    const totalParticipants = getTotalParticipants(event);

    return (
      <TouchableOpacity
        key={event.id}
        style={[styles.eventCard, { backgroundColor: event.backgroundColor || '#FFE0E6' }]}
        onPress={() => handleEventPress(event)}
        activeOpacity={0.8}
        onLongPress={() => handleLeaveEvent(event.id)}
      >
        <View style={styles.cardHeader}>
          <View style={styles.titleContainer}>
            <Text style={styles.eventTitle} numberOfLines={2}>{event.title}</Text>
            <View style={styles.organizerContainer}>
              <Text style={styles.organizerText}>{event.hostname} ✓</Text>
            </View>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: statusInfo.color }]}>
            <Text style={styles.statusText}>{statusInfo.text}</Text>
          </View>
        </View>

        <View style={styles.eventInfo}>
          <View style={styles.infoRow}>
            <Text style={styles.infoIcon}>📍</Text>
            <Text style={styles.infoText}>{event.location}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoIcon}>📅</Text>
            <Text style={styles.infoText}>{formatDate(event.eventDate)}</Text>
          </View>
        </View>

        <View style={styles.participantsContainer}>
          <View style={styles.participantInfo}>
            <Text style={styles.participantIcon}>👥</Text>
            <Text style={styles.participantText}>
              전체 {totalParticipants.current}/{totalParticipants.max}
            </Text>
          </View>
          <View style={styles.genderInfo}>
            <View style={styles.participantInfo}>
              <Text style={styles.genderIcon}>👨</Text>
              <Text style={styles.participantText}>
                {event.currentMaleParticipants}/{event.maxMaleParticipantsCount}
              </Text>
            </View>
            <View style={styles.participantInfo}>
              <Text style={styles.genderIcon}>👩</Text>
              <Text style={styles.participantText}>
                {event.currentFemaleParticipants}/{event.maxFemaleParticipantsCount}
              </Text>
            </View>
          </View>
        </View>

        {totalParticipants.current === totalParticipants.max && (
          <View style={styles.fullBadge}>
            <Text style={styles.fullText}>마감</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  // 개발용 더미 데이터
  const getDummyEvents = (): MyDatingEvent[] => [
    {
      id: 1,
      title: '제2회 GrewMeet 공식 데이팅',
      hostname: 'GrewMeet Official',
      location: '서울 강남구',
      eventDate: '2025-06-22T18:00:00',
      currentMaleParticipants: 8,
      maxMaleParticipantsCount: 10,
      currentFemaleParticipants: 7,
      maxFemaleParticipantsCount: 10,
      backgroundColor: '#B8E7F3',
      status: 'upcoming',
    },
    {
      id: 2,
      title: 'Calm Mind 모임',
      hostname: 'Team Botanic',
      location: '서울 성동구',
      eventDate: '2025-06-09T19:00:00',
      currentMaleParticipants: 6,
      maxMaleParticipantsCount: 8,
      currentFemaleParticipants: 6,
      maxFemaleParticipantsCount: 8,
      backgroundColor: '#FFE8D1',
      status: 'active',
    },
  ];

  const getDummyEventsForUser = (userId: number): MyDatingEvent[] => {
    // 사용자별로 다른 더미 데이터 반환
    if (userId === 5) { // 김민준
      return [
        {
          id: 1,
          title: '제2회 GrewMeet 공식 데이팅',
          hostname: 'GrewMeet Official',
          location: '서울 강남구',
          eventDate: '2025-06-22T18:00:00',
          currentMaleParticipants: 8,
          maxMaleParticipantsCount: 10,
          currentFemaleParticipants: 7,
          maxFemaleParticipantsCount: 10,
          backgroundColor: '#B8E7F3',
          status: 'upcoming',
        },
      ];
    } else if (userId === 6) { // 이서연
      return [
        {
          id: 2,
          title: 'Calm Mind 모임',
          hostname: 'Team Botanic',
          location: '서울 성동구',
          eventDate: '2025-06-09T19:00:00',
          currentMaleParticipants: 6,
          maxMaleParticipantsCount: 8,
          currentFemaleParticipants: 6,
          maxFemaleParticipantsCount: 8,
          backgroundColor: '#FFE8D1',
          status: 'active',
        },
      ];
    } else {
      return []; // 다른 사용자는 참가중인 이벤트 없음
    }
  };

  if (!userId) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>사용자를 선택해주세요</Text>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>돌아가기</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B9D" />
        <Text style={styles.loadingText}>User ID {userId}의 이벤트를 불러오는 중...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* 뒤로가기 버튼 */}
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Ionicons name="chevron-back" size={24} color="#333" />
      </TouchableOpacity>

      <View style={styles.header}>
        <Text style={styles.headerTitle}>내 데이팅 이벤트 (User ID: {userId})</Text>
        <Text style={styles.headerSubtitle}>참여중인 이벤트를 확인하세요</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#FF6B9D"
          />
        }
      >
        <View style={styles.eventsContainer}>
          {events.length > 0 ? (
            events.map(renderEventCard)
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>🎭</Text>
              <Text style={styles.emptyText}>User ID {userId}가 참여중인 이벤트가 없습니다</Text>
              <TouchableOpacity 
                style={styles.findEventButton}
                onPress={() => router.push('/screens/EventListScreenCopy')}
              >
                <Text style={styles.findEventButtonText}>이벤트 찾아보기</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFE0E6',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFE0E6',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#333',
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    zIndex: 1,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 100,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2D2D2D',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
  },
  eventsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  eventCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  titleContainer: {
    flex: 1,
    marginRight: 10,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D2D2D',
    marginBottom: 4,
  },
  organizerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  organizerText: {
    fontSize: 14,
    color: '#666',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  eventInfo: {
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  infoIcon: {
    fontSize: 14,
    marginRight: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  participantsContainer: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
    paddingTop: 12,
  },
  participantInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  participantIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  genderInfo: {
    flexDirection: 'row',
    marginTop: 8,
  },
  genderIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  participantText: {
    fontSize: 14,
    color: '#2D2D2D',
  },
  fullBadge: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: '#E53E3E',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  fullText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  findEventButton: {
    backgroundColor: '#FF6B9D',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  findEventButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  backButtonText: {
    color: '#FF6B9D',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default MyDatingEventsScreen; 