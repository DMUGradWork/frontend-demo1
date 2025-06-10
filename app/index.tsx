import React from 'react';
import { View, Text, Button, StyleSheet, Alert, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useUser } from './contexts/UserContext';

export default function HomeScreen() {
  const router = useRouter();
  const { userId, setUserId, clearUserId } = useUser();

  const handleUserSelect = (id: number, name: string, role: string) => {
    setUserId(id);
    Alert.alert(
      '테스트 사용자 선택',
      `${name} (${role}) - User ID ${id}로 설정되었습니다.`,
      [{ text: '확인' }]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.innerContainer}>
        <Text style={styles.title}>CrewMeet 테스트</Text>
        
        {/* 현재 선택된 유저 표시 */}
        <View style={styles.currentUserContainer}>
          <Text style={styles.currentUserLabel}>현재 선택된 User ID:</Text>
          <Text style={styles.currentUserId}>
            {userId ? `${userId}` : '선택되지 않음'}
          </Text>
          {userId && (
            <Button title="유저 초기화" onPress={clearUserId} color="#ff6b6b" />
          )}
        </View>

        {/* HOST 사용자들 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>👑 HOST 사용자 (이벤트 생성 + 참여 가능)</Text>
          <View style={styles.buttonContainer}>
            <Button
              title="GrewMeet Official (ID: 1)"
              onPress={() => handleUserSelect(1, 'GrewMeet Official', 'HOST')}
              color="#7B9BFF"
            />
            <Button
              title="책벌레들 (ID: 2)"
              onPress={() => handleUserSelect(2, '책벌레들', 'HOST')}
              color="#7B9BFF"
            />
            <Button
              title="영화광클럽 (ID: 3)"
              onPress={() => handleUserSelect(3, '영화광클럽', 'HOST')}
              color="#7B9BFF"
            />
            <Button
              title="맛집탐방대 (ID: 4)"
              onPress={() => handleUserSelect(4, '맛집탐방대', 'HOST')}
              color="#7B9BFF"
            />
          </View>
        </View>

        {/* GUEST 사용자들 - 참여 중인 게스트들 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>👤 GUEST 사용자 - 참여 중 (참여만 가능)</Text>
          <View style={styles.buttonContainer}>
            <Button
              title="김민준 ♂ (ID: 5)"
              onPress={() => handleUserSelect(5, '김민준', 'GUEST')}
              color="#FFD093"
            />
            <Button
              title="이서연 ♀ (ID: 6)"
              onPress={() => handleUserSelect(6, '이서연', 'GUEST')}
              color="#FF9EAA"
            />
            <Button
              title="박준호 ♂ (ID: 7)"
              onPress={() => handleUserSelect(7, '박준호', 'GUEST')}
              color="#FFD093"
            />
            <Button
              title="최은지 ♀ (ID: 8)"
              onPress={() => handleUserSelect(8, '최은지', 'GUEST')}
              color="#FF9EAA"
            />
            <Button
              title="정현우 ♂ (ID: 9)"
              onPress={() => handleUserSelect(9, '정현우', 'GUEST')}
              color="#FFD093"
            />
            <Button
              title="강수진 ♀ (ID: 10)"
              onPress={() => handleUserSelect(10, '강수진', 'GUEST')}
              color="#FF9EAA"
            />
          </View>
        </View>

        {/* GUEST 사용자들 - 참여하지 않은 게스트들 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🆕 GUEST 사용자 - 미참여</Text>
          <View style={styles.buttonContainer}>
            <Button
              title="홍길동 ♂ (ID: 13)"
              onPress={() => handleUserSelect(13, '홍길동', 'GUEST')}
              color="#C8D6E5"
            />
            <Button
              title="김영희 ♀ (ID: 14)"
              onPress={() => handleUserSelect(14, '김영희', 'GUEST')}
              color="#DDA0DD"
            />
          </View>
        </View>

        {/* 화면 이동 섹션 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📱 화면 이동</Text>
          <View style={styles.buttonContainer}>
            <Button
              title="🏠 새로운 홈 화면 (메인)"
              onPress={() => router.push('/screens/HomeScreen')}
            />
            <Button
              title="📋 데이팅 목록"
              onPress={() => router.push('/screens/EventListScreenCopy')}
            />
            <Button
              title="👤 내 데이팅 이벤트"
              onPress={() => router.push('/screens/MyDatingEventsScreen')}
            />
            <Button
              title="📊 데이팅 이벤트 상세 (투표 포함)"
              onPress={() => router.push('/screens/DatingEventDetailScreen?eventId=100')}
            />
            <Button
              title="📅 캘린더 보기"
              onPress={() => router.push('/screens/CalendarScreen')}
            />
            <Button
              title="✏️ 이벤트 생성"
              onPress={() => router.push('/screens/EventRegistrationScreen')}
            />
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  currentUserContainer: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  currentUserLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  currentUserId: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 15,
    color: '#666',
  },
  buttonContainer: {
    gap: 8,
  },
}); 