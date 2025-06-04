import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  StyleSheet,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

interface EventDetailScreenProps {
  // URL params로 받을 데이터들
}

export default function EventDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  // 실제로는 params나 API에서 받아올 데이터
  const eventData = {
    title: '제2회 GrewMeet 공식 데이팅',
    host: 'GrewMeet Official',
    isVerified: true,
    location: '서울',
    date: '2025년 06월 22일',
    currentParticipants: 20,
    totalParticipants: 20,
    description: '이번에는 서울롤과 전년 미술기업을 접목해 자연의 아름다움을 현대적인 감각으로 재해석하는 스튜디오 작에서 진행됩니다.',
  };

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
              colors={['#E8F4FD', '#E8F4FD']}
              style={styles.cardBackground}
            >
              {/* 카드 내용 */}
              <View style={styles.cardContent}>
                <Text style={styles.eventTitle}>{eventData.title}</Text>
                <View style={styles.hostContainer}>
                  <Text style={styles.hostName}>{eventData.host}</Text>
                  {eventData.isVerified && <Text style={styles.verifyIcon}>✅</Text>}
                </View>
                <View style={styles.locationTag}>
                  <Text style={styles.locationText}>{eventData.location}</Text>
                </View>
                
                <Text style={styles.dateText}>{eventData.date}</Text>
                <View style={styles.participantContainer}>
                  <View style={styles.participantRow}>
                    <Text style={styles.participantIcon}>👥</Text>
                    <Text style={styles.participantText}>{eventData.currentParticipants}/{eventData.totalParticipants}</Text>
                  </View>
                </View>
              </View>
            </LinearGradient>
          </View>
        </View>

        {/* 중간 회색 배경 섹션 */}
        <View style={styles.middleSection}>
          <Text style={styles.sectionTitle}>
            <Text style={styles.boldText}>{eventData.host}</Text>
            <Text> 에서 주최하는 공식 데이팅 이벤트!</Text>
          </Text>
          <Text style={styles.description}>{eventData.description}</Text>
        </View>

        {/* 하단 웨이브 배경 */}
        <View style={styles.bottomSection}>
          <LinearGradient
            colors={['#82D9FF', '#A8E6CF']}
            style={styles.waveBackground}
          />
        </View>
      </ScrollView>

      {/* 하단 고정 버튼 */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.joinButton}
          onPress={() => {
            // 참여하기 로직
            console.log('참여하기 버튼 클릭');
          }}
        >
          <Text style={styles.joinButtonText}>참여하기</Text>
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
  scrollView: {
    flex: 1,
  },
  topSection: {
    backgroundColor: '#FF9BB5',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
  },
  eventCard: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardBackground: {
    position: 'relative',
    minHeight: 200,
  },
  cardContent: {
    padding: 20,
    paddingTop: 25,
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
  middleSection: {
    backgroundColor: '#E8F0E8',
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  sectionTitle: {
    fontSize: 16,
    color: '#333',
    marginBottom: 16,
    lineHeight: 22,
  },
  boldText: {
    fontWeight: 'bold',
  },
  description: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
    marginBottom: 20,
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
    backgroundColor: '#4A5BFF',
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
  backButton: {
    position: 'absolute',
    top: 10,
    left: 10,
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
});