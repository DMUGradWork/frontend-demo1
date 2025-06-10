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
import VoteSection from '../components/VoteSection';
import CreateVoteModal from '../components/CreateVoteModal';

interface Vote {
  id: number;
  title: string;
  description: string;
  isClosed: boolean;
  isCompleted: boolean;
  backgroundColor: string;
}

interface EventInfo {
  id: number;
  title: string;
  hostname: string;
  description?: string;
  eventDate: string;
  location: string;
  currentMaleParticipants: number;
  maxMaleParticipantsCount: number;
  currentFemaleParticipants: number;
  maxFemaleParticipantsCount: number;
  hostUserId?: number;
}

export default function DatingEventDetailScreen() {
  const router = useRouter();
  const { eventId } = useLocalSearchParams();
  const { userId } = useUser();
  const [votes, setVotes] = useState<Vote[]>([]);
  const [loading, setLoading] = useState(true);
  const [eventInfo, setEventInfo] = useState<EventInfo | null>(null);
  const [showCreateVoteModal, setShowCreateVoteModal] = useState(false);
  const [isHost, setIsHost] = useState(false);

  // Determine host for iOS vs. Android emulator
  const host = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';
  const baseURL = `http://${host}:8080`;

  useEffect(() => {
    if (!userId) {
      Alert.alert(
        '사용자 선택 필요',
        '먼저 테스트할 사용자를 선택해주세요.',
        [{ text: '확인', onPress: () => router.back() }]
      );
      return;
    }
    fetchEventDetails();
    fetchVotes();
  }, [eventId, userId]);

  // 호스트 여부 확인
  useEffect(() => {
    if (eventInfo && userId) {
      setIsHost(eventInfo.hostUserId === userId);
    }
  }, [eventInfo, userId]);

  const fetchEventDetails = async () => {
    try {
      // 실제 API 호출
      console.log('🔄 API 호출 시작:', `${baseURL}/dating/dating-events/${eventId}`);
      const response = await fetch(`${baseURL}/dating/dating-events/${eventId}`);
      
      if (!response.ok) {
        throw new Error(`서버 에러: ${response.status}`);
      }
      
      const data: EventInfo = await response.json();
      console.log('✅ 이벤트 정보 API 성공:', data);
      setEventInfo(data);
      
    } catch (error) {
      console.error('❌ Error fetching event details:', error);
      
      // API 실패 시 더미 데이터로 fallback (개발용)
      console.log('🔄 더미 데이터로 fallback 처리');
      setEventInfo({
        id: Number(eventId),
        title: 'GrewMeet 공식 여름 데이팅',
        hostname: 'GrewMeet Official',
        description: '한강에서 즐기는 시원한 여름밤! 치맥과 보드게임, 그리고 불꽃놀이까지! 자연의 아름다움과 현대적인 감각으로 특별한 만남을 만들어보세요.',
        eventDate: '2025-06-29T18:00:00',
        location: '서울 한강공원 여의도지구',
        currentMaleParticipants: 2,
        maxMaleParticipantsCount: 8,
        currentFemaleParticipants: 1,
        maxFemaleParticipantsCount: 8,
        hostUserId: 1, // 더미 호스트 ID
      });
    }
  };

  const fetchVotes = async () => {
    try {
      setLoading(true);
      // 더미 투표는 제거하고 VoteSection만 사용
      setVotes([]);
    } catch (error) {
      console.error('❌ Error fetching votes:', error);
      setVotes([]);
    } finally {
      setLoading(false);
    }
  };

  // 투표 새로고침 함수
  const refreshVotes = () => {
    fetchVotes();
    setShowCreateVoteModal(false);
  };

  const handleVotePress = (vote: Vote) => {
    if (!vote.isClosed) {
      // 투표 화면으로 이동 (추후 구현)
      // router.push(`/screens/VotingScreen?voteId=${vote.id}`);
      console.log('투표하기:', vote.title);
    }
  };

  const renderVoteCard = (vote: Vote, index: number, totalCount: number) => {
    return (
      <View key={vote.id} style={styles.voteCardContainer}>
        {/* Timeline dot */}
        <View style={styles.timelineContainer}>
          <View style={[
            styles.timelineDot,
            vote.isCompleted && styles.timelineDotCompleted
          ]} />
          {index < totalCount - 1 && <View style={styles.timelineLine} />}
        </View>

        {/* Vote Card */}
        <View style={[styles.voteCard, { backgroundColor: vote.backgroundColor }]}>
          <Text style={styles.voteTitle}>{vote.title}</Text>
          <Text style={styles.voteDescription}>{vote.description}</Text>
          
          <TouchableOpacity 
            style={styles.voteButton}
            onPress={() => handleVotePress(vote)}
            activeOpacity={0.8}
          >
            <Text style={styles.voteButtonText}>▶ 응답하기</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#7B9BFF" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FF9BB5" />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Back Button */}
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={24} color="#333" />
        </TouchableOpacity>

        {/* Event Header */}
        {eventInfo && (
          <View style={styles.eventHeader}>
            <Text style={styles.eventTitle}>{eventInfo.title}</Text>
            <View style={styles.teamBadge}>
              <Text style={styles.teamName}>{eventInfo.hostname} ✓</Text>
            </View>
            
            {/* 날짜와 장소 정보 */}
            <View style={styles.eventInfoRow}>
              <Text style={styles.eventDate}>
                📅 {new Date(eventInfo.eventDate).toLocaleDateString('ko-KR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  weekday: 'short'
                })} {new Date(eventInfo.eventDate).toLocaleTimeString('ko-KR', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </Text>
              <Text style={styles.eventLocation}>📍 {eventInfo.location}</Text>
            </View>
            
            {/* 참가자 현황 */}
            <View style={styles.participantInfo}>
              <Text style={styles.participantText}>
                👨 {eventInfo.currentMaleParticipants}/{eventInfo.maxMaleParticipantsCount}  
                👩 {eventInfo.currentFemaleParticipants}/{eventInfo.maxFemaleParticipantsCount}
              </Text>
            </View>

            {eventInfo.description && (
              <Text style={styles.eventDescription}>{eventInfo.description}</Text>
            )}
          </View>
        )}

        {/* 호스트 전용 투표 만들기 버튼 */}
        {isHost && (
          <View style={styles.hostControls}>
            <TouchableOpacity
              style={styles.createVoteButton}
              onPress={() => setShowCreateVoteModal(true)}
            >
              <Ionicons name="add-circle-outline" size={20} color="#FF6B9D" />
              <Text style={styles.createVoteButtonText}>새 투표 만들기</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* 실시간 투표 섹션 */}
        <View style={styles.votesContainer}>
          {userId && (
            <VoteSection 
              eventId={Number(eventId)} 
              userId={userId}
              isParticipant={true}
            />
          )}
        </View>
      </ScrollView>

      {/* 투표 생성 모달 */}
      {isHost && (
        <CreateVoteModal
          visible={showCreateVoteModal}
          onClose={() => setShowCreateVoteModal(false)}
          eventId={Number(eventId)}
          hostId={userId || 1}
          onVoteCreated={refreshVotes}
        />
      )}
    </SafeAreaView>
  );
}

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
  eventHeader: {
    padding: 20,
    paddingTop: 80,
    alignItems: 'center',
  },
  eventTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2D2D2D',
    marginBottom: 8,
  },
  teamBadge: {
    backgroundColor: 'rgba(72, 187, 120, 0.2)',
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: 15,
    marginBottom: 15,
  },
  teamName: {
    fontSize: 14,
    color: '#48BB78',
    fontWeight: '600',
  },
  eventInfoRow: {
    alignItems: 'center',
    marginBottom: 8,
    paddingHorizontal: 20,
  },
  eventDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
    textAlign: 'center',
  },
  eventLocation: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  participantInfo: {
    backgroundColor: 'rgba(72, 187, 120, 0.2)',
    padding: 10,
    borderRadius: 10,
    marginBottom: 15,
    marginHorizontal: 20,
  },
  participantText: {
    fontSize: 14,
    color: '#48BB78',
    fontWeight: '600',
    textAlign: 'center',
  },
  eventDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 20,
  },
  hostControls: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: 'center',
  },
  createVoteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFE0E6',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#FF6B9D',
  },
  createVoteButtonText: {
    color: '#FF6B9D',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  votesContainer: {
    paddingTop: 20,
    paddingBottom: 30,
  },
  voteCardContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  timelineContainer: {
    width: 40,
    alignItems: 'center',
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#E0E0E0',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  timelineDotCompleted: {
    backgroundColor: '#7B9BFF',
  },
  timelineLine: {
    width: 2,
    backgroundColor: '#E0E0E0',
    position: 'absolute',
    top: 12,
    bottom: -15,
  },
  voteCard: {
    flex: 1,
    borderRadius: 20,
    padding: 20,
    marginLeft: 10,
  },
  voteTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D2D2D',
    marginBottom: 8,
  },
  voteDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 15,
  },
  voteButton: {
    alignSelf: 'flex-start',
  },
  voteButtonText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  newVoteSection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 10,
    marginBottom: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  newVoteSectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2D2D2D',
    marginBottom: 15,
  },
     scrollView: {
     flex: 1,
   },
 }); 