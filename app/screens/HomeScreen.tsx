import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import EventCard from '../view/EventCard';
import { useUser } from '../contexts/UserContext';

const { width } = Dimensions.get('window');

// 사용자 정보 매핑 (실제 DB 데이터 기반)
const USER_INFO_MAP: { [key: number]: { username: string; role: string } } = {
  1: { username: 'GrewMeet Official', role: 'HOST' },
  2: { username: '책벌레들', role: 'HOST' },
  3: { username: '영화광클럽', role: 'HOST' },
  4: { username: '맛집탐방대', role: 'HOST' },
  5: { username: '김민준', role: 'GUEST' },
  6: { username: '이서연', role: 'GUEST' },
  7: { username: '박준호', role: 'GUEST' },
  8: { username: '최은지', role: 'GUEST' },
  9: { username: '정현우', role: 'GUEST' },
  10: { username: '강수진', role: 'GUEST' },
  11: { username: '이동현', role: 'GUEST' },
  12: { username: '김지은', role: 'GUEST' },
  13: { username: '홍길동', role: 'GUEST' },
  14: { username: '김영희', role: 'GUEST' },
};

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

const HomeScreen = () => {
  const router = useRouter();
  const { userId } = useUser();
  const [recommendedEvent, setRecommendedEvent] = useState<DatingEventCardDto | null>(null);
  const [loading, setLoading] = useState(true);

  // Determine host for iOS vs. Android emulator
  const host = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';
  const baseURL = `http://${host}:8080`;

  // 현재 사용자 정보 가져오기
  const currentUser = userId ? USER_INFO_MAP[userId] : null;
  const displayName = currentUser?.username || '사용자를 선택해주세요';
  const isHost = currentUser?.role === 'HOST';

  useEffect(() => {
    fetchRecommendedEvent();
  }, []);

  const fetchRecommendedEvent = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${baseURL}/dating/dating-events`);
      if (!res.ok) {
        throw new Error(`서버 에러: ${res.status}`);
      }
      const data: DatingEventCardDto[] = await res.json();
      
      // 정원이 다 차지 않은 이벤트들만 필터링
      const availableEvents = data.filter(event => 
        (event.currentMaleParticipants < event.maxMaleParticipantsCount) ||
        (event.currentFemaleParticipants < event.maxFemaleParticipantsCount)
      );
      
      // 랜덤으로 하나 선택
      if (availableEvents.length > 0) {
        const randomIndex = Math.floor(Math.random() * availableEvents.length);
        setRecommendedEvent(availableEvents[randomIndex]);
      }
    } catch (err: any) {
      console.error('추천 이벤트 로딩 실패:', err);
      // API 실패 시 null 유지 (추천 이벤트 없음으로 표시)
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 뒤로가기 버튼 */}
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Ionicons name="chevron-back" size={24} color="#333" />
      </TouchableOpacity>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>
            안녕하세요, {displayName} 님
            {isHost && <Text style={styles.hostBadge}> 👑</Text>}
          </Text>
          <Text style={styles.headerSubtitle}>
            {userId ? 'We Wish you have a good day' : '먼저 사용자를 선택해주세요'}
          </Text>
          {userId && (
            <Text style={styles.userIdText}>User ID: {userId}</Text>
          )}
        </View>

        {/* Action Cards */}
        <View style={styles.cardsContainer}>
          <TouchableOpacity 
            style={[
              styles.card, 
              styles.createCard,
              !isHost && styles.disabledCard
            ]} 
            activeOpacity={isHost ? 0.8 : 0.3}
            onPress={() => {
              if (isHost) {
                router.push('/screens/EventRegistrationScreen');
              } else {
                alert('HOST 권한이 필요합니다.');
              }
            }}
          >
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>이벤트 생성</Text>
              <Text style={styles.cardSubtitle}>
                {isHost ? 'Create' : 'HOST 전용'}
              </Text>
            </View>
            <TouchableOpacity 
              style={[styles.startButton, !isHost && styles.disabledButton]}
              onPress={() => {
                if (isHost) {
                  router.push('/screens/EventRegistrationScreen');
                } else {
                  alert('HOST 권한이 필요합니다.');
                }
              }}
            >
              <Text style={[styles.startButtonText, !isHost && styles.disabledButtonText]}>
                {isHost ? 'START' : 'HOST 전용'}
              </Text>
            </TouchableOpacity>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.card, styles.joinCard]} 
            activeOpacity={0.8}
            onPress={() => router.push('/screens/EventListScreenCopy')}
          >
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>참여하기</Text>
              <Text style={styles.cardSubtitle}>Join</Text>
            </View>
            <TouchableOpacity 
              style={styles.startButtonDark}
              onPress={() => router.push('/screens/EventListScreenCopy')}
            >
              <Text style={styles.startButtonTextDark}>START</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </View>

        {/* My Dating Event */}
        <TouchableOpacity 
          style={styles.datingCard} 
          activeOpacity={0.8}
          onPress={() => router.push('/screens/MyDatingEventsScreen')}
        >
          <View style={styles.datingCardContent}>
            <Text style={styles.datingCardText}>내 데이팅 이벤트 보기</Text>
            <TouchableOpacity 
              style={styles.goButton}
              onPress={() => router.push('/screens/MyDatingEventsScreen')}
            >
              <Text style={styles.goButtonText}>Go</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>

        {/* Recommended Section */}
        <View style={styles.recommendedSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recommended for you</Text>
            {!loading && (
              <TouchableOpacity 
                style={styles.refreshButton}
                onPress={fetchRecommendedEvent}
              >
                <Ionicons name="refresh" size={20} color="#7B9BFF" />
              </TouchableOpacity>
            )}
          </View>
          
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#7B9BFF" />
              <Text style={styles.loadingText}>추천 이벤트를 찾는 중...</Text>
            </View>
          ) : recommendedEvent ? (
            <EventCard
              eventId={recommendedEvent.id}
              title={recommendedEvent.title}
              host={recommendedEvent.hostname}
              date={recommendedEvent.eventDate}
              location={recommendedEvent.location}
              currentMaleParticipants={recommendedEvent.currentMaleParticipants}
              maxMaleParticipants={recommendedEvent.maxMaleParticipantsCount}
              currentFemaleParticipants={recommendedEvent.currentFemaleParticipants}
              maxFemaleParticipants={recommendedEvent.maxFemaleParticipantsCount}
            />
          ) : (
            <View style={styles.noRecommendationContainer}>
              <Ionicons name="heart-outline" size={48} color="#C8D6E5" />
              <Text style={styles.noRecommendationTitle}>추천할 이벤트가 없습니다</Text>
              <Text style={styles.noRecommendationText}>새로운 이벤트가 곧 업데이트될 예정입니다!</Text>
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
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2D2D2D',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#8B8B8B',
  },
  cardsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 15,
  },
  card: {
    flex: 1,
    height: 180,
    borderRadius: 20,
    padding: 20,
    justifyContent: 'space-between',
  },
  createCard: {
    backgroundColor: '#7B9BFF',
  },
  joinCard: {
    backgroundColor: '#FFD093',
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  cardSubtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.8,
  },
  startButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    alignSelf: 'flex-start',
  },
  startButtonText: {
    color: '#7B9BFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  startButtonDark: {
    backgroundColor: '#4A4A4A',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    alignSelf: 'flex-start',
  },
  startButtonTextDark: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  datingCard: {
    marginHorizontal: 20,
    marginTop: 20,
    backgroundColor: '#5A5A6B',
    borderRadius: 20,
    padding: 25,
  },
  datingCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  datingCardText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  goButton: {
    backgroundColor: '#8B7B9B',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 20,
  },
  goButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  recommendedSection: {
    marginTop: 30,
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4A4A4A',
  },
  refreshButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(123, 155, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    gap: 12,
  },
  loadingText: {
    fontSize: 16,
    color: '#7B9BFF',
  },
  noRecommendationContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  noRecommendationTitle: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: '600',
    color: '#4A4A4A',
    textAlign: 'center',
  },
  noRecommendationText: {
    marginTop: 8,
    fontSize: 14,
    color: '#8B8B8B',
    textAlign: 'center',
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
  hostBadge: {
    fontSize: 24,
  },
  userIdText: {
    fontSize: 14,
    color: '#8B8B8B',
    marginTop: 5,
  },
  disabledCard: {
    opacity: 0.6,
  },
  disabledButton: {
    backgroundColor: '#C8D6E5',
  },
  disabledButtonText: {
    color: '#8B8B8B',
  },
});

export default HomeScreen; 