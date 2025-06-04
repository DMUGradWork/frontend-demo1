import React from 'react';
import { FlatList, View, SafeAreaView } from 'react-native';
import EventCard from '../view/EventCard';

export default function EventListScreen() {
  const mockEvents = [ {
    id: '1',
    title: '제4회 제주에 혼저옵서예🍊',
    subtitle: 'Team 안전한놀이터',
    date: '2025년 06월 22일',
    location: '제주',
    currentParticipants: 15,
    totalParticipants: 20,
    // backgroundImage: 'https://yourcdn.com/jeju.jpg',
  },
  {
    id: '2',
    title: 'GrewMeet 공식 데이팅',
    subtitle: 'GrewMeet Official ✅',
    date: '2025년 06월 29일',
    location: '서울',
    currentParticipants: 10,
    totalParticipants: 10,
    // backgroundImage: 'https://yourcdn.com/seoul.jpg',
  },
  {
    id: '3',
    title: '독서 스터디 모집',
    subtitle: '책벌레들 📚',
    date: '2025년 07월 05일',
    location: '부산',
    currentParticipants: 5,
    totalParticipants: 10,
  },];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f98da0' }}>
      <FlatList
        data={mockEvents}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingVertical: 16 }}
        renderItem={({ item }) => (
          <EventCard
            title={item.title}
            subtitle={item.subtitle}
            date={item.date}
            location={item.location}
            currentParticipants={item.currentParticipants}
            totalParticipants={item.totalParticipants}
            backgroundImage={item.backgroundImage}
          />
        )}
      />
    </SafeAreaView>
  );
}