import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Animated from 'react-native';

const CalendarScreen = () => {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(25);
  
  // 현재 월 데이터 (예시로 12월 사용)
  const currentMonth = 'December 2024';
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  // 캘린더 날짜 데이터
  const calendarData = [
    // 첫 번째 주
    [
      { date: null, events: [] },
      { date: null, events: [] },
      { date: null, events: [] },
      { date: null, events: [] },
      { date: null, events: [] },
      { date: null, events: [] },
      { date: 1, events: [{ color: '#ff4757', type: 'dot' }, { color: '#2ed573', type: 'dot' }] },
    ],
    // 두 번째 주
    [
      { date: 2, events: [] },
      { date: 3, events: [] },
      { date: 4, events: [{ color: '#ffa502', type: 'dot' }] },
      { date: 5, events: [] },
      { date: 6, events: [] },
      { date: 7, events: [] },
      { date: 8, events: [] },
    ],
    // 세 번째 주
    [
      { date: 9, events: [] },
      { date: 10, events: [{ color: '#2ed573', type: 'bar' }] },
      { date: 11, events: [] },
      { date: 12, events: [] },
      { date: 13, events: [] },
      { date: 14, events: [{ color: '#ff4757', type: 'bar' }] },
      { date: 15, events: [{ color: '#ff4757', type: 'bar' }] },
    ],
    // 네 번째 주
    [
      { date: 16, events: [] },
      { date: 17, events: [] },
      { date: 18, events: [] },
      { date: 19, events: [] },
      { date: 20, events: [] },
      { date: 21, events: [] },
      { date: 22, events: [] },
    ],
    // 다섯 번째 주
    [
      { date: 23, events: [{ color: '#2ed573', type: 'dot' }, { color: '#ff4757', type: 'dot' }] },
      { date: 24, events: [] },
      { date: 25, events: [] },
      { date: 26, events: [] },
      { date: 27, events: [{ color: '#2ed573', type: 'dot' }] },
      { date: 28, events: [] },
      { date: 29, events: [] },
    ],
    // 여섯 번째 주
    [
      { date: 30, events: [] },
      { date: 31, events: [] },
      { date: 1, events: [], nextMonth: true },
      { date: 2, events: [], nextMonth: true },
      { date: 3, events: [], nextMonth: true },
      { date: 4, events: [], nextMonth: true },
      { date: null, events: [] },
    ],
  ];

  const events = [
    {
      id: 1,
      title: '1st Event',
      color: '#ff4757',
      icon: 'calendar',
    },
    {
      id: 2,
      title: '2nd Event',
      color: '#ffa502',
      icon: 'time',
    },
    {
      id: 3,
      title: '3rd Event',
      color: '#2ed573',
      icon: 'checkmark-circle',
    },
  ];

  const renderCalendarDay = (dayData, dayIndex) => {
    if (!dayData.date) {
      return <View key={dayIndex} style={styles.emptyDay} />;
    }

    const isSelected = dayData.date === selectedDate && !dayData.nextMonth;
    const isNextMonth = dayData.nextMonth;

    return (
      <TouchableOpacity
        key={dayIndex}
        style={[
          styles.dayContainer,
          isSelected && styles.selectedDay,
        ]}
        onPress={() => !isNextMonth && setSelectedDate(dayData.date)}
      >
        <Text
          style={[
            styles.dayText,
            isSelected && styles.selectedDayText,
            isNextMonth && styles.nextMonthText,
          ]}
        >
          {dayData.date}
        </Text>
        
        {/* 이벤트 표시 */}
        <View style={styles.eventContainer}>
          {dayData.events.map((event, index) => (
            <View
              key={index}
              style={[
                event.type === 'dot' ? styles.eventDot : styles.eventBar,
                { backgroundColor: event.color },
              ]}
            />
          ))}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#34495e' }}>
      <StatusBar 
        barStyle="dark-content"
        backgroundColor="transparent" 
        translucent={false}
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
        {/* 요일 헤더 */}
        <View style={styles.weekHeader}>
          {weekDays.map((day, index) => (
            <View key={index} style={styles.weekDayContainer}>
              <Text
                style={[
                  styles.weekDayText,
                  (index === 5 || index === 6) && styles.weekendText,
                ]}
              >
                {day}
              </Text>
            </View>
          ))}
        </View>

        {/* 캘린더 그리드 */}
        <View style={styles.calendar}>
          {calendarData.map((week, weekIndex) => (
            <View key={weekIndex} style={styles.weekRow}>
              {week.map((day, dayIndex) => renderCalendarDay(day, dayIndex))}
            </View>
          ))}
        </View>

        {/* 이벤트 리스트 */}
        <View style={styles.eventsList}>
          {events.map((event) => (
            <TouchableOpacity key={event.id} style={styles.eventItem}>
              <View style={[styles.eventIcon, { backgroundColor: event.color }]}>
                <Ionicons name={event.icon} size={20} color="#fff" />
              </View>
              <Text style={styles.eventTitle}>{event.title}</Text>
              <Ionicons name="chevron-forward" size={20} color="#7f8c8d" />
            </TouchableOpacity>
          ))}
        </View>
      </Animated.ScrollView>

      {/* 하단 탭바 */}
      <View style={styles.tabBar}>
        <TouchableOpacity style={styles.tabItem}>
          <Ionicons name="heart-outline" size={24} color="#7f8c8d" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.homeButton}>
          <Ionicons name="home" size={28} color="#fff" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.tabItem}>
          <Ionicons name="chatbubble-outline" size={24} color="#7f8c8d" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  floatingBackButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 20,
    left: 20,
    width: 44,
    height: 44,
  },
  scrollContent: {
    paddingBottom: 100,
    paddingTop: Platform.OS === 'ios' ? 0 : 0,
  },
  container: {
    flex: 1,
    backgroundColor: '#34495e',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#2c3e50',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backText: {
    color: '#fff',
    fontSize: 17,
    marginLeft: 5,
    fontWeight: '400',
  },
  searchButton: {
    padding: 8,
  },
  addButton: {
    backgroundColor: '#2ed573',
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  content: {
    flex: 1,
    backgroundColor: '#34495e',
  },
  weekHeader: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  weekDayContainer: {
    flex: 1,
    alignItems: 'center',
  },
  weekDayText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  weekendText: {
    color: '#95a5a6',
  },
  calendar: {
    paddingHorizontal: 20,
  },
  weekRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  emptyDay: {
    flex: 1,
    height: 50,
  },
  dayContainer: {
    flex: 1,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  selectedDay: {
    backgroundColor: '#2ed573',
    borderRadius: 25,
    width: 50,
    height: 50,
  },
  dayText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '400',
  },
  selectedDayText: {
    color: '#fff',
    fontWeight: '600',
  },
  nextMonthText: {
    color: '#7f8c8d',
  },
  eventContainer: {
    position: 'absolute',
    bottom: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  eventDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginHorizontal: 1,
  },
  eventBar: {
    width: 20,
    height: 3,
    borderRadius: 1.5,
    marginHorizontal: 1,
  },
  eventsList: {
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  eventItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2c3e50',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
  },
  eventIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  eventTitle: {
    flex: 1,
    color: '#fff',
    fontSize: 17,
    fontWeight: '500',
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#2c3e50',
    paddingVertical: 20,
    paddingBottom: 30,
  },
  tabItem: {
    padding: 8,
  },
  homeButton: {
    backgroundColor: '#2ed573',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CalendarScreen; 