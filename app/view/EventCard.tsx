import React from 'react';
import styled from 'styled-components/native';
import { ImageBackground, TouchableOpacity } from 'react-native'; // 👈 TouchableOpacity 추가
import { useRouter } from 'expo-router'; // 👈 useRouter 추가

interface EventCardProps {
  title: string;
  host: string;
  date: string;
  location: string;
  currentParticipants: number;
  totalParticipants: number;
  backgroundImage?: string; // 이미지 없으면 흰색 배경 사용
}

export default function EventCard({
  title,
  host,
  date,
  location,
  currentParticipants,
  totalParticipants,
  backgroundImage,
}: EventCardProps) {

  const router = useRouter(); // 👈 

  const content = (
    <Content>
      <Title>{title}</Title>
      {host && <Subtitle>{host}</Subtitle>}
      <LocationTag>{location}</LocationTag>
      <DateText>{date}</DateText>
      <ParticipantText>
        👥 {currentParticipants}/{totalParticipants}
      </ParticipantText>
    </Content>
  );

  return (
    <TouchableOpacity 
      onPress={() => router.push({
        pathname: '/screens/EventDetailScreen',
        params: { 
          title,
          host,
          date,
          location,
          currentParticipants: currentParticipants.toString(),
          totalParticipants: totalParticipants.toString(),
          backgroundImage: backgroundImage || ''
        }
      })}
      activeOpacity={0.8} // 터치할 때 살짝 투명해지는 효과
    >
      <CardWrapper>
        {backgroundImage ? (
          <StyledImageBackground source={{ uri: backgroundImage }} imageStyle={{ borderRadius: 12 }}>
            <Overlay />
            {content}
          </StyledImageBackground>
        ) : (
          <PlainCard>{content}</PlainCard>
        )}
      </CardWrapper>
    </TouchableOpacity>
  );
}

const CardWrapper = styled.View`
  width: 90%;
  align-self: center;
  margin-vertical: 12px;
  border-radius: 12px;
  overflow: hidden;
  background-color: #f98da0;
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
  border-radius: 12px;
`;

const PlainCard = styled.View`
  padding: 16px;
  background-color: #000000;
  border-radius: 12px;
`;

const Content = styled.View`
  padding: 12px 16px;
`;

const Title = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: #ffffff;
`;

const Subtitle = styled.Text`
  font-size: 14px;
  color: #eeeeee;
  margin-top: 4px;
`;

const LocationTag = styled.Text`
  font-size: 12px;
  color: #333;
  background-color: #ffffffaa;
  padding: 2px 8px;
  border-radius: 6px;
  align-self: flex-start;
  margin-top: 8px;
`;

const DateText = styled.Text`
  font-size: 13px;
  color: #eeeeee;
  margin-top: 6px;
`;

const ParticipantText = styled.Text`
  font-size: 13px;
  color: #eeeeee;
  margin-top: 2px;
`;