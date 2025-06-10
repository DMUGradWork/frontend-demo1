import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../contexts/UserContext';

interface DatingEventResponseNew {
  id: number;
  title: string;
  hostname: string;
  eventDate: string;
  location: string;
  currentMaleParticipants: number;
  maxMaleParticipantsCount: number;
  currentFemaleParticipants: number;
  maxFemaleParticipantsCount: number;
  description?: string;
}

export default function EventDetailScreen() {
  const router = useRouter();
  const { eventId } = useLocalSearchParams();
  const { userId } = useUser();
  
  // API 설정
  const host = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';
  const baseURL = `http://${host}:8080`;
  
  // 상태 관리
  const [eventData, setEventData] = useState<DatingEventResponseNew | null>(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  // 이벤트 정보 불러오기
  useEffect(() => {
    if (!userId) {
      Alert.alert(
        '사용자 선택 필요',
        '먼저 테스트할 사용자를 선택해주세요.',
        [{ text: '확인', onPress: () => router.back() }]
      );
      return;
    }
    fetchEventDetail();
  }, [eventId, userId]);

  const fetchEventDetail = async () => {
    try {
      setLoading(true);
      // 실제 API 호출
      console.log(`🔄 API 호출: /dating/dating-events/${eventId} (User: ${userId})`);
      const response = await fetch(`${baseURL}/dating/dating-events/${eventId}`);
      
      if (!response.ok) {
        throw new Error(`서버 에러: ${response.status}`);
      }
      
      const data: DatingEventResponseNew = await response.json();
      console.log('✅ 이벤트 상세 API 성공:', data);
      setEventData(data);
      
    } catch (error) {
      console.error('❌ Error fetching event detail:', error);
      setErrorMsg('이벤트 정보를 불러오는데 실패했습니다.');
      
      // API 실패 시 더미 데이터로 fallback (개발용)
      console.log('🔄 더미 데이터로 fallback 처리');
      const mockEventData: DatingEventResponseNew = {
        id: Number(eventId),
        title: 'GrewMeet 공식 여름 데이팅',
        hostname: 'GrewMeet Official',
        eventDate: '2025-06-29T18:00:00',
        location: '서울 한강공원 여의도지구',
        currentMaleParticipants: 2,
        maxMaleParticipantsCount: 8,
        currentFemaleParticipants: 1,
        maxFemaleParticipantsCount: 8,
        description: '한강에서 즐기는 시원한 여름밤! 치맥과 보드게임, 그리고 불꽃놀이까지!'
      };
      setEventData(mockEventData);
      setErrorMsg(null); // fallback 사용 시 에러 메시지 제거
    } finally {
      setLoading(false);
    }
  };

  // 이벤트 참가 신청
  const handleJoinEvent = async () => {
    if (!eventData || !userId) return;

    try {
      setJoining(true);
      
      // 실제 API 호출
      console.log(`🔄 참가 신청 API 호출: /dating/dating-events/${eventId}/join?userId=${userId}`);
      const response = await fetch(`${baseURL}/dating/dating-events/${eventId}/join?userId=${userId}`, {
        method: 'POST',
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ 참가 신청 실패:', response.status, errorText);
        throw new Error(errorText || '참가 신청에 실패했습니다.');
      }
      
      const updatedEvent = await response.json();
      console.log('✅ 참가 신청 성공:', updatedEvent);
      setEventData(updatedEvent);

      Alert.alert(
        '🎉 참가 신청 완료!',
        `${eventData.title}에 성공적으로 참가 신청되었습니다.`,
        [
          {
            text: '확인',
            onPress: () => router.back()
          }
        ]
      );

    } catch (error) {
      console.error('❌ Join event failed:', error);
      let errorMessage = '참가 신청 중 오류가 발생했습니다.';
      
      if (error instanceof Error) {
        const errorText = error.message;
        
        // 특정 에러 상황별 메시지 처리
        if (errorText.includes('3 개 보다 많은 이벤트에 참여할 수 없습니다')) {
          errorMessage = '🚫 참가 제한\n\n동시에 참여할 수 있는 이벤트는 최대 3개입니다.\n다른 이벤트를 취소한 후 다시 시도해주세요.';
        } else if (errorText.includes('마감') || errorText.includes('정원')) {
          errorMessage = '😔 죄송합니다\n\n이 이벤트는 이미 정원이 마감되었습니다.';
        } else if (errorText.includes('이미 참여')) {
          errorMessage = '✅ 이미 참여하고 있는 이벤트입니다.';
        } else {
          errorMessage = errorText;
        }
      }
      
      Alert.alert(
        '참가 신청 실패', 
        errorMessage,
        [
          { text: '확인' },
          { 
            text: '미참여 사용자로 테스트', 
            onPress: () => router.push('/'),
            style: 'default'
          }
        ]
      );
    } finally {
      setJoining(false);
    }
  };

  // 날짜 포맷팅
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

  // 로딩 상태
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B9D" />
        <Text style={styles.loadingText}>이벤트 정보를 불러오는 중...</Text>
      </View>
    );
  }

  // 에러 상태
  if (errorMsg || !eventData) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.errorText}>{errorMsg || '이벤트 정보를 찾을 수 없습니다.'}</Text>
        </View>
      </SafeAreaView>
    );
  }

  // 상태 계산
  const totalCurrentParticipants = eventData.currentMaleParticipants + eventData.currentFemaleParticipants;
  const totalMaxParticipants = eventData.maxMaleParticipantsCount + eventData.maxFemaleParticipantsCount;
  const isMaleFull = eventData.currentMaleParticipants >= eventData.maxMaleParticipantsCount;
  const isFemaleFull = eventData.currentFemaleParticipants >= eventData.maxFemaleParticipantsCount;
  const isFull = isMaleFull && isFemaleFull;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FF9BB5" />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* 상단 핑크 배경 영역 */}
        <View style={styles.topSection}>
          {/* 뒤로가기 버튼 */}
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={24} color="#333" />
          </TouchableOpacity>

          {/* 이벤트 카드 */}
          <View style={styles.eventCard}>
            <LinearGradient
              colors={['#B8E6FF', '#E8F4FD']}
              style={styles.cardBackground}
            >
              {/* 카드 내용 */}
              <View style={styles.cardContent}>
                <Text style={styles.eventTitle}>{eventData.title}</Text>
                <View style={styles.hostContainer}>
                  <Text style={styles.hostName}>{eventData.hostname}</Text>
                  <Text style={styles.verifyIcon}>✅</Text>
                </View>
                <View style={styles.locationTag}>
                  <Text style={styles.locationText}>{eventData.location}</Text>
                </View>
                
                <Text style={styles.dateText}>{formatDate(eventData.eventDate)}</Text>
                <View style={styles.participantContainer}>
                  <View style={styles.participantRow}>
                    <Text style={styles.participantIcon}>👨</Text>
                    <Text style={styles.participantText}>
                      {eventData.currentMaleParticipants}/{eventData.maxMaleParticipantsCount}
                    </Text>
                  </View>
                  <View style={styles.participantRow}>
                    <Text style={styles.participantIcon}>👩</Text>
                    <Text style={styles.participantText}>
                      {eventData.currentFemaleParticipants}/{eventData.maxFemaleParticipantsCount}
                    </Text>
                  </View>
                </View>
              </View>
            </LinearGradient>
          </View>
        </View>

        {/* 메인 콘텐츠 영역 */}
        <View style={styles.contentSection}>
          {/* 이벤트 정보 섹션 */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionIcon}>📍</Text>
              <Text style={styles.sectionTitle}>이벤트 정보</Text>
            </View>
            <Text style={styles.scheduleItem}>• 최대 참여자: {totalMaxParticipants}명</Text>
            <Text style={styles.scheduleItem}>• 현재 참여자: {totalCurrentParticipants}명</Text>
            <Text style={styles.scheduleItem}>• 남성: {eventData.currentMaleParticipants}/{eventData.maxMaleParticipantsCount}명</Text>
            <Text style={styles.scheduleItem}>• 여성: {eventData.currentFemaleParticipants}/{eventData.maxFemaleParticipantsCount}명</Text>
            <Text style={[styles.scheduleItem, { color: isFull ? '#d32f2f' : '#4caf50' }]}>
              • 상태: {isFull ? '마감' : '모집중'}
            </Text>
          </View>

  
          {/* 이벤트 세부사항 섹션 */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionIcon}>📋</Text>
              <Text style={styles.sectionTitle}>세부사항</Text>
            </View>
            <Text style={styles.scheduleItem}>• 주최자: {eventData.hostname}</Text>
            <Text style={styles.scheduleItem}>• 장소: {eventData.location}</Text>
            <Text style={styles.scheduleItem}>• 일시: {formatDate(eventData.eventDate)}</Text>
            {eventData.description && (
              <Text style={styles.scheduleItem}>• 설명: {eventData.description}</Text>
            )}
          </View>
        </View>

        {/* 하단 웨이브 배경 */}
        <View style={styles.bottomSection}>
          <LinearGradient
            colors={['#82D9FF', '#A8E6CF', '#98FB98']}
            style={styles.waveBackground}
          />
        </View>
      </ScrollView>

      {/* 하단 고정 버튼 */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[
            styles.joinButton,
            { 
              backgroundColor: isFull ? '#999' : '#5A67FF',
              opacity: isFull ? 0.6 : 1
            }
          ]}
          disabled={isFull || joining}
          onPress={handleJoinEvent}
        >
          {joining ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
          <Text style={styles.joinButtonText}>
              {isFull ? '마감됨' : '참가신청'}
          </Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FF9BB5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FF9BB5',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#333',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginTop: 20,
  },
  scrollView: {
    flex: 1,
  },
  topSection: {
    backgroundColor: '#FF9BB5',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
  },
  backButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 10,
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
  eventCard: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginTop: 20,
  },
  cardBackground: {
    position: 'relative',
    minHeight: 200,
  },
  cardContent: {
    padding: 20,
    paddingTop: 25,
    zIndex: 1,
  },
  eventTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  hostContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  hostName: {
    fontSize: 16,
    color: '#555',
    marginRight: 6,
  },
  verifyIcon: {
    fontSize: 16,
  },
  locationTag: {
    backgroundColor: 'rgba(139, 69, 19, 0.8)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  locationText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  dateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  participantContainer: {
    flexDirection: 'row',
    gap: 20,
  },
  participantRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  participantIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  participantText: {
    fontSize: 14,
    color: '#666',
  },
  contentSection: {
    backgroundColor: '#E8F0E8',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  description: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  },
  scheduleItem: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
    marginBottom: 4,
  },
  warningItem: {
    fontSize: 14,
    color: '#d32f2f',
    lineHeight: 20,
    marginBottom: 4,
  },
  bottomSection: {
    height: 150,
    position: 'relative',
  },
  waveBackground: {
    flex: 1,
  },
  buttonContainer: {
    backgroundColor: '#FF9BB5',
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingBottom: 30,
  },
  joinButton: {
    backgroundColor: '#5A67FF',
    borderRadius: 25,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  joinButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});