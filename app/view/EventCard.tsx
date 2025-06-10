import React from 'react';
import styled from 'styled-components/native';
import { ImageBackground, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

interface EventCardProps {
  eventId: number;
  title: string;
  host: string;
  date: string;
  location: string;
  currentMaleParticipants: number;
  maxMaleParticipants: number;
  currentFemaleParticipants: number;
  maxFemaleParticipants: number;
  backgroundImage?: string;
}

// 카드별로 다른 채도 낮은 색상 배열
const cardColors = [
  { bg: '#E8F5E8', shadow: '#C8E6C9' }, // 연한 민트
  { bg: '#FFE8E8', shadow: '#FFCDD2' }, // 연한 핑크
  { bg: '#E8F0FF', shadow: '#C5CAE9' }, // 연한 블루
  { bg: '#FFF8E1', shadow: '#FFF9C4' }, // 연한 옐로우
  { bg: '#F3E5F5', shadow: '#E1BEE7' }, // 연한 퍼플
  { bg: '#E0F2F1', shadow: '#B2DFDB' }, // 연한 틸
];

export default function EventCard({
  eventId,
  title,
  host,
  date,
  location,
  currentMaleParticipants,
  maxMaleParticipants,
  currentFemaleParticipants,
  maxFemaleParticipants,
  backgroundImage,
}: EventCardProps) {

  const router = useRouter();
  
  // eventId를 기반으로 색상 선택 (일관성 유지)
  const colorIndex = eventId % cardColors.length;
  const cardColor = cardColors[colorIndex];

  const content = (
    <Content>
      <Title>{title}</Title>
      {host && <Subtitle>{host}</Subtitle>}
      <LocationTag>{location}</LocationTag>
      <DateText>{date}</DateText>
      <ParticipantContainer>
        <ParticipantRow>
          <ParticipantText>👨 {currentMaleParticipants}/{maxMaleParticipants}</ParticipantText>
        </ParticipantRow>
        <ParticipantRow>
          <ParticipantText>👩 {currentFemaleParticipants}/{maxFemaleParticipants}</ParticipantText>
        </ParticipantRow>
      </ParticipantContainer>
    </Content>
  );

  return (
    <TouchableOpacity 
      onPress={() => router.push(`/screens/EventDetailScreen?eventId=${eventId}`)}
      activeOpacity={0.8}
    >
      <CardWrapper shadowColor={cardColor.shadow}>
        {backgroundImage ? (
          <StyledImageBackground source={{ uri: backgroundImage }} imageStyle={{ borderRadius: 16 }}>
            <Overlay />
            {content}
          </StyledImageBackground>
        ) : (
          <PlainCard bgColor={cardColor.bg}>{content}</PlainCard>
        )}
      </CardWrapper>
    </TouchableOpacity>
  );
}

const CardWrapper = styled.View<{ shadowColor: string }>`
  width: 90%;
  align-self: center;
  margin-vertical: 12px;
  border-radius: 16px;
  overflow: hidden;
  shadow-color: ${props => props.shadowColor};
  shadow-offset: 0px 4px;
  shadow-opacity: 0.2;
  shadow-radius: 8px;
  elevation: 4;
`;

const StyledImageBackground = styled(ImageBackground)`
  width: 100%;
  height: 180px;
  justify-content: flex-end;
`;

const Overlay = styled.View`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.35);
  border-radius: 16px;
`;

const PlainCard = styled.View<{ bgColor: string }>`
  padding: 20px;
  background-color: ${props => props.bgColor};
  border-radius: 16px;
  min-height: 180px;
  justify-content: space-between;
`;

const Content = styled.View`
  flex: 1;
  justify-content: space-between;
`;

const Title = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: #2E3A59;
  margin-bottom: 4px;
`;

const Subtitle = styled.Text`
  font-size: 14px;
  color: #5A6B8C;
  margin-bottom: 8px;
`;

const LocationTag = styled.Text`
  font-size: 12px;
  color: #2E3A59;
  background-color: rgba(255, 255, 255, 0.8);
  padding: 4px 10px;
  border-radius: 12px;
  align-self: flex-start;
  margin-bottom: 8px;
  font-weight: 500;
`;

const DateText = styled.Text`
  font-size: 13px;
  color: #5A6B8C;
  margin-bottom: 12px;
`;

const ParticipantContainer = styled.View`
  flex-direction: row;
  gap: 16px;
`;

const ParticipantRow = styled.View`
  flex-direction: row;
  align-items: center;
`;

const ParticipantText = styled.Text`
  font-size: 14px;
  color: #2E3A59;
  font-weight: 500;
`;