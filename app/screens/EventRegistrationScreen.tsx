import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  TextInput,
  Alert,
  ActivityIndicator,
  Platform,
  Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { styles } from '../../src/styles/eventRegistration.styles';

// API 설정 (목업용)
const host = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';
const API_BASE_URL = `http://${host}:8080`;

export default function EventRegistrationScreen() {
  const router = useRouter();
  const scrollY = useRef(new Animated.Value(0)).current;
  
  // Form 상태 관리
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    eventDateTime: new Date(),
    maxMaleParticipantsCount: 5,
    maxFemaleParticipantsCount: 5,
    description: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedHour, setSelectedHour] = useState(14);
  const [selectedMinute, setSelectedMinute] = useState(0);

  // 현재 달력 상태
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  // UI 토글 상태
  const [showCalendar, setShowCalendar] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  // 입력값 변경 핸들러
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // 날짜 변경 핸들러
  const handleDateChange = (selectedDate: Date) => {
    if (selectedDate) {
      setSelectedDate(selectedDate);
      const newDateTime = new Date(selectedDate);
      newDateTime.setHours(selectedHour);
      newDateTime.setMinutes(selectedMinute);
      setFormData(prev => ({
        ...prev,
        eventDateTime: newDateTime
      }));
    }
  };

  // 시간 변경 핸들러
  const handleTimeChange = (hour: number, minute: number) => {
    setSelectedHour(hour);
    setSelectedMinute(minute);
    const newDateTime = new Date(selectedDate);
    newDateTime.setHours(hour);
    newDateTime.setMinutes(minute);
    setFormData(prev => ({
      ...prev,
      eventDateTime: newDateTime
    }));
  };

  // 참가자 수 변경 핸들러
  const handleParticipantChange = (type: 'male' | 'female', delta: number) => {
    const field = type === 'male' ? 'maxMaleParticipantsCount' : 'maxFemaleParticipantsCount';
    const currentValue = formData[field];
    const newValue = Math.max(1, Math.min(15, currentValue + delta));
    setFormData(prev => ({
      ...prev,
      [field]: newValue
    }));
  };

  // 달력 렌더링 함수
  const renderCalendar = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    // 해당 월의 첫 번째 날과 마지막 날
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    // 달력 시작 요일 (일요일 = 0)
    const startDay = firstDay.getDay();
    
    // 날짜 배열 생성
    const days: (number | null)[] = [];
    
    // 이전 달의 빈 칸들
    for (let i = 0; i < startDay; i++) {
      days.push(null);
    }
    
    // 현재 달의 날짜들
    for (let day = 1; day <= lastDay.getDate(); day++) {
      days.push(day);
    }

    const monthNames = [
      '1월', '2월', '3월', '4월', '5월', '6월',
      '7월', '8월', '9월', '10월', '11월', '12월'
    ];

    return (
      <View style={styles.calendarContainer}>
        {/* 달력 헤더 */}
        <View style={styles.calendarHeader}>
          <TouchableOpacity 
            onPress={() => setCurrentMonth(new Date(year, month - 1, 1))}
            style={styles.calendarNavButton}
          >
            <Ionicons name="chevron-back" size={20} color="#FF9BB5" />
          </TouchableOpacity>
          
          <Text style={styles.calendarTitle}>
            {year}년 {monthNames[month]}
          </Text>
          
          <TouchableOpacity 
            onPress={() => setCurrentMonth(new Date(year, month + 1, 1))}
            style={styles.calendarNavButton}
          >
            <Ionicons name="chevron-forward" size={20} color="#FF9BB5" />
          </TouchableOpacity>
        </View>

        {/* 요일 헤더 */}
        <View style={styles.weekHeader}>
          {['일', '월', '화', '수', '목', '금', '토'].map((day, index) => (
            <Text key={index} style={styles.weekDay}>{day}</Text>
          ))}
        </View>

        {/* 날짜 그리드 */}
        <View style={styles.daysGrid}>
          {days.map((day, index) => {
            if (day === null) {
              return <View key={index} style={styles.emptyDay} />;
            }

            const isSelected = selectedDate.getDate() === day && 
                             selectedDate.getMonth() === month && 
                             selectedDate.getFullYear() === year;

            return (

              <TouchableOpacity
                key={index}
                style={[
                  styles.dayButton,
                  isSelected && styles.selectedDay
                ]}
                onPress={() => handleDateChange(new Date(year, month, day))}
              >
                <Text style={[
                  styles.dayText,
                  isSelected && styles.selectedDayText
                ]}>
                  {day}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  };

  // 시간 다이얼 렌더링
  const renderTimePicker = () => {
    return (
      <View style={styles.timeSection}>
        <View style={styles.timePickerContainer}>
          {/* 시간 선택 */}
          <View style={styles.timePicker}>
            <Text style={styles.timeLabel}>시간</Text>
            <TouchableOpacity 
              style={[styles.timeDialContainer]}
              onPress={() => {
                const newHour = selectedHour >= 23 ? 0 : selectedHour + 1;
                handleTimeChange(newHour, selectedMinute);
              }}
            >
              <Text style={[styles.timeText, styles.timeSelectedText]}>
                {selectedHour.toString().padStart(2, '0')}
              </Text>
            </TouchableOpacity>
            <View style={styles.participantButtons}>
              <TouchableOpacity 
                style={[styles.participantButton, styles.participantButtonActive]}
                onPress={() => {
                  const newHour = selectedHour <= 0 ? 23 : selectedHour - 1;
                  handleTimeChange(newHour, selectedMinute);
                }}
              >
                <Ionicons name="remove" size={20} color="white" />
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.participantButton, styles.participantButtonActive]}
                onPress={() => {
                  const newHour = selectedHour >= 23 ? 0 : selectedHour + 1;
                  handleTimeChange(newHour, selectedMinute);
                }}
              >
                <Ionicons name="add" size={20} color="white" />
              </TouchableOpacity>
            </View>
          </View>

          {/* 구분자 */}
          <Text style={[styles.timeText, { marginHorizontal: 20 }]}>:</Text>

          {/* 분 선택 */}
          <View style={styles.timePicker}>
            <Text style={styles.timeLabel}>분</Text>
            <TouchableOpacity 
              style={[styles.timeDialContainer]}
              onPress={() => {
                const newMinute = selectedMinute >= 45 ? 0 : selectedMinute + 15;
                handleTimeChange(selectedHour, newMinute);
              }}
            >
              <Text style={[styles.timeText, styles.timeSelectedText]}>
                {selectedMinute.toString().padStart(2, '0')}
              </Text>
            </TouchableOpacity>
            <View style={styles.participantButtons}>
              <TouchableOpacity 
                style={[styles.participantButton, styles.participantButtonActive]}
                onPress={() => {
                  const newMinute = selectedMinute <= 0 ? 45 : selectedMinute - 15;
                  handleTimeChange(selectedHour, newMinute);
                }}
              >
                <Ionicons name="remove" size={20} color="white" />
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.participantButton, styles.participantButtonActive]}
                onPress={() => {
                  const newMinute = selectedMinute >= 45 ? 0 : selectedMinute + 15;
                  handleTimeChange(selectedHour, newMinute);
                }}
              >
                <Ionicons name="add" size={20} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  };

  // 참가자 수 선택 렌더링
  const renderParticipantPicker = () => {
    return (
      <View style={styles.participantSection}>
        <View style={styles.participantRow}>
          {/* 남성 참가자 */}
          <View style={styles.participantInput}>
            <Text style={styles.participantLabel}>👨 남성 최대 인원</Text>
            <View style={[
              styles.participantPickerContainer, 
              styles.participantPickerSelected
            ]}>
              <Text style={[styles.participantCount, styles.participantCountSelected]}>
                {formData.maxMaleParticipantsCount}
              </Text>
            </View>
            <View style={styles.participantButtons}>
              <TouchableOpacity 
                style={[styles.participantButton, styles.participantButtonActive]}
                onPress={() => handleParticipantChange('male', -1)}
                disabled={formData.maxMaleParticipantsCount <= 1}
              >
                <Ionicons name="remove" size={20} color="white" />
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.participantButton, styles.participantButtonActive]}
                onPress={() => handleParticipantChange('male', 1)}
                disabled={formData.maxMaleParticipantsCount >= 15}
              >
                <Ionicons name="add" size={20} color="white" />
              </TouchableOpacity>
            </View>
          </View>

          {/* 여성 참가자 */}
          <View style={styles.participantInput}>
            <Text style={styles.participantLabel}>👩 여성 최대 인원</Text>
            <View style={[
              styles.participantPickerContainer, 
              styles.participantPickerSelected
            ]}>
              <Text style={[styles.participantCount, styles.participantCountSelected]}>
                {formData.maxFemaleParticipantsCount}
              </Text>
            </View>
            <View style={styles.participantButtons}>
              <TouchableOpacity 
                style={[styles.participantButton, styles.participantButtonActive]}
                onPress={() => handleParticipantChange('female', -1)}
                disabled={formData.maxFemaleParticipantsCount <= 1}
              >
                <Ionicons name="remove" size={20} color="white" />
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.participantButton, styles.participantButtonActive]}
                onPress={() => handleParticipantChange('female', 1)}
                disabled={formData.maxFemaleParticipantsCount >= 15}
              >
                <Ionicons name="add" size={20} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  };

  // 폼 유효성 검사
  const validateForm = () => {
    if (!formData.title.trim()) {
      Alert.alert('오류', '제목을 입력해주세요.');
      return false;
    }
    if (!formData.location.trim()) {
      Alert.alert('오류', '장소를 입력해주세요.');
      return false;
    }
    if (formData.eventDateTime <= new Date()) {
      Alert.alert('오류', '이벤트 날짜는 현재 시간 이후여야 합니다.');
      return false;
    }
    return true;
  };

  // 이벤트 생성 API 호출 함수
  const handleCreateEvent = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);

      // 실제 API 호출을 위한 요청 데이터 구성
      const requestData = {
        title: formData.title.trim(),
        location: formData.location.trim(),
        eventDateTime: formData.eventDateTime.toISOString().slice(0, 19), // LocalDateTime 형식으로 변환
        maxMaleParticipantsCount: formData.maxMaleParticipantsCount,
        maxFemaleParticipantsCount: formData.maxFemaleParticipantsCount,
        description: formData.description.trim() || null
      };

      console.log('🔄 API 호출 시작:', requestData);

      // 실제 API 호출
      const response = await fetch(`${API_BASE_URL}/hosts/1/dating-events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // 필요시 Authorization 헤더 추가
          // 'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requestData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ API 오류:', response.status, errorText);
        throw new Error(`서버 오류 (${response.status}): ${errorText}`);
      }

      const createdEvent = await response.json();
      console.log('✅ 이벤트 생성 성공:', createdEvent);

      // 생성된 이벤트 정보로 성공 메시지 표시
      const eventDate = new Date(createdEvent.eventDate || createdEvent.eventDateTime);
      const formattedDate = eventDate.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'short'
      });
      const formattedTime = eventDate.toLocaleTimeString('ko-KR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });

      Alert.alert(
        '🎉 이벤트 생성 완료!', 
        `${createdEvent.title}\n📍 ${createdEvent.location}\n📅 ${formattedDate} ${formattedTime}\n👥 남성 ${createdEvent.maxMaleParticipantsCount}명, 여성 ${createdEvent.maxFemaleParticipantsCount}명\n\n✨ 데이터베이스에 성공적으로 저장되었습니다!`,
        [
          {
            text: '확인',
            onPress: () => router.back()
          }
        ]
      );
      
    } catch (error) {
      console.error('❌ 이벤트 생성 실패:', error);
      
      // 네트워크 오류와 서버 오류를 구분해서 메시지 표시
      let errorMessage = '이벤트 생성 중 오류가 발생했습니다.\n다시 시도해주세요.';
      
      if (error instanceof TypeError && error.message.includes('Network request failed')) {
        errorMessage = '네트워크 연결을 확인해주세요.\n서버에 연결할 수 없습니다.';
      } else if (error.message.includes('서버 오류')) {
        errorMessage = `서버에서 오류가 발생했습니다.\n${error.message}`;
      }
      
      Alert.alert('오류', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // 선택된 날짜와 시간을 포맷팅하는 함수
  const getFormattedDateTime = () => {
    const date = selectedDate.toLocaleDateString('ko-KR', {
      month: 'long',
      day: 'numeric',
      weekday: 'short'
    });
    const time = `${selectedHour.toString().padStart(2, '0')}:${selectedMinute.toString().padStart(2, '0')}`;
    return { date, time };
  };

  const { date: formattedDate, time: formattedTime } = getFormattedDateTime();

  // 헤더 색상 계산
  const headerTextColor = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: ['#333333', '#1a1a1a'],
    extrapolate: 'clamp',
  });

  const headerBackgroundColor = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: ['transparent', 'rgba(255, 255, 255, 0.95)'],
    extrapolate: 'clamp',
  });

  const containerBackgroundColor = scrollY.interpolate({
    inputRange: [0, 200],
    outputRange: ['#ffffff', '#FFCED7'],
    extrapolate: 'clamp',
  });

  const buttonBackgroundColor = scrollY.interpolate({
    inputRange: [0, 200],
    outputRange: ['#FFCED7', '#FF6B9D'],
    extrapolate: 'clamp',
  });

  const buttonShadowOpacity = scrollY.interpolate({
    inputRange: [0, 200],
    outputRange: [0.3, 0.6],
    extrapolate: 'clamp',
  });

  // StatusBar 스타일 계산
  const statusBarAnimatedValue = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Animated.View style={[styles.container, { backgroundColor: containerBackgroundColor }]}>
        <StatusBar 
          barStyle="dark-content"
          backgroundColor="transparent" 
          translucent 
        />
        
        {/* 플로팅 뒤로가기 버튼 */}
        <TouchableOpacity 
          style={styles.floatingBackButton}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={24} color="#333" />
        </TouchableOpacity>

        <Animated.ScrollView 
          style={styles.scrollView} 
          showsVerticalScrollIndicator={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false }
          )}
          scrollEventThrottle={16}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.formContainer}>
            
            {/* 이벤트 생성 타이틀 */}
            <Text style={styles.pageTitle}>✨이벤트 생성✨</Text>
            
            {/* 기본 정보 섹션 */}
            <Text style={styles.sectionTitle}>📝 기본 정보</Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>이벤트 제목</Text>
              <TextInput
                style={styles.textInput}
                placeholder="멋진 이벤트 제목을 입력해주세요"
                placeholderTextColor="#94a3b8"
                value={formData.title}
                onChangeText={(text) => handleInputChange('title', text)}
                maxLength={100}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>장소</Text>
              <TextInput
                style={styles.textInput}
                placeholder="어디서 만날까요?"
                placeholderTextColor="#94a3b8"
                value={formData.location}
                onChangeText={(text) => handleInputChange('location', text)}
                maxLength={100}
              />
            </View>

            {/* 날짜 선택 섹션 */}
            <Text style={styles.sectionTitle}>📅 날짜 선택</Text>
            <View style={styles.pickerContainer}>
              <TouchableOpacity 
                style={styles.pickerButton}
                onPress={() => setShowCalendar(!showCalendar)}
              >
                <Ionicons name="calendar" size={20} color="#FF6B9D" />
                <Text style={styles.pickerText}>{formattedDate}</Text>
                <Ionicons 
                  name={showCalendar ? "chevron-up" : "chevron-down"} 
                  size={16} 
                  color="#64748b" 
                />
              </TouchableOpacity>
            </View>

            {/* 달력 (토글) */}
            {showCalendar && (
              <View style={styles.expandedSection}>
                {renderCalendar()}
              </View>
            )}

            {/* 시간 선택 섹션 */}
            <Text style={styles.sectionTitle}>⏰ 시간 선택</Text>
            <View style={styles.pickerContainer}>
              <TouchableOpacity 
                style={styles.pickerButton}
                onPress={() => setShowTimePicker(!showTimePicker)}
              >
                <Ionicons name="time" size={20} color="#FF6B9D" />
                <Text style={styles.pickerText}>{formattedTime}</Text>
                <Ionicons 
                  name={showTimePicker ? "chevron-up" : "chevron-down"} 
                  size={16} 
                  color="#64748b" 
                />
              </TouchableOpacity>
            </View>

            {/* 시간 선택 (토글) */}
            {showTimePicker && (
              <View style={styles.expandedSection}>
                {renderTimePicker()}
              </View>
            )}

            {/* 참가자 정보 섹션 */}
            <Text style={styles.sectionTitle}>👥 참가자 정보</Text>
            {renderParticipantPicker()}

            {/* 설명 섹션 */}
            <Text style={styles.sectionTitle}>📝 이벤트 설명</Text>
            <View style={styles.descriptionContainer}>
              <TextInput
                style={[styles.textInput, styles.descriptionInput]}
                placeholder="이벤트에 대한 상세한 설명을 입력해주세요 ✨

• 어떤 활동을 하나요?
• 준비물이 있나요?
• 특별한 주의사항이 있나요?
• 참가자들에게 전하고 싶은 말씀이 있나요?"
                placeholderTextColor="#94a3b8"
                value={formData.description}
                onChangeText={(text) => handleInputChange('description', text)}
                multiline
                numberOfLines={8}
                maxLength={1000}
                textAlignVertical="top"
              />
            </View>
            
            {/* 하단 여백 (플로팅 버튼을 위한 공간) */}
            <View style={styles.bottomSpacing} />
          </View>
        </Animated.ScrollView>

        {/* 플로팅 생성 버튼 */}
        <View style={styles.floatingButtonContainer}>
          <Animated.View
            style={[
              styles.createButton,
              {
                backgroundColor: buttonBackgroundColor,
                shadowOpacity: buttonShadowOpacity,
              },
              loading && styles.disabledButton
            ]}
          >
            <TouchableOpacity 
              style={styles.createButtonInner}
              onPress={handleCreateEvent}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <Text style={styles.createButtonText}>🎉 이벤트 생성하기</Text>
              )}
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
} 