import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// API 설정
const host = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';
const API_BASE_URL = `http://${host}:8080`;

interface VoteOption {
  id: number;
  optionValue: string;
  voteCount?: number;
  percentage?: number;
  isSelected?: boolean;
}

interface Vote {
  id: number;
  title: string;
  isClosed: boolean;
  options: VoteOption[];
  totalVotes?: number;
  hasVoted?: boolean;
  selectedOptionId?: number;
}

interface VoteSectionProps {
  eventId: number;
  userId: number;
  isParticipant: boolean;
}

const VoteSection: React.FC<VoteSectionProps> = ({ eventId, userId, isParticipant }) => {
  const [votes, setVotes] = useState<Vote[]>([]);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);
  const [expandedVotes, setExpandedVotes] = useState<Set<number>>(new Set());
  const [selectedOptions, setSelectedOptions] = useState<Map<number, number>>(new Map()); // voteId -> optionId

  useEffect(() => {
    fetchVotes();
  }, [eventId]);

  const fetchVotes = async () => {
    try {
      setLoading(true);
      // 호스트 API를 통해 투표 목록 가져오기
      // 임시로 hostId를 1로 설정 (실제로는 이벤트 정보에서 가져와야 함)
      const response = await fetch(`${API_BASE_URL}/hosts/1/dating-events/${eventId}/votes`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch votes');
      }
      
      const data = await response.json();
      
      // VoteResponseDto 형식에 맞게 데이터 변환
      const votesWithUserStatus = data.map((vote: any) => {
        // 사용자가 이미 투표했는지 확인 (participants 정보가 없으므로 옵션의 voteCount로 추정)
        // 실제로는 백엔드에서 사용자별 투표 여부를 반환해야 함
        const hasVoted = false; // 임시로 false 설정
        const selectedOptionId = null;
        
        return {
          id: vote.voteId,
          title: vote.title,
          isClosed: vote.isClosed,
          hasVoted,
          selectedOptionId,
          totalVotes: vote.totalParticipants,
          options: vote.options.map((opt: any) => ({
            id: opt.optionId,
            optionValue: opt.optionValue,
            voteCount: opt.voteCount,
            percentage: vote.totalParticipants > 0 
              ? Math.round((opt.voteCount / vote.totalParticipants) * 100) 
              : 0,
            isSelected: false,
          })),
        };
      });
      
      setVotes(votesWithUserStatus);
    } catch (error) {
      console.error('Error fetching votes:', error);
      // 개발용 더미 데이터
      setVotes(getDummyVotes());
    } finally {
      setLoading(false);
    }
  };

  const handleOptionSelect = (voteId: number, optionId: number) => {
    setSelectedOptions(prev => new Map(prev.set(voteId, optionId)));
  };

  const handleVote = async (voteId: number) => {
    if (!isParticipant) {
      Alert.alert('참가자만 투표 가능', '이벤트에 참가 신청을 먼저 해주세요.');
      return;
    }

    const selectedOptionId = selectedOptions.get(voteId);
    if (!selectedOptionId) {
      Alert.alert('선택 필요', '투표할 옵션을 먼저 선택해주세요.');
      return;
    }

    Alert.alert(
      '투표 확인',
      '선택하신 옵션에 투표하시겠습니까?',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '투표',
          onPress: async () => {
            try {
              setVoting(true);
              
              const response = await fetch(
                `${API_BASE_URL}/users/${userId}/dating-events/${eventId}/votes/${voteId}?optionId=${selectedOptionId}`,
                {
                  method: 'PATCH',
                }
              );
              
              if (!response.ok) {
                const errorData = await response.text();
                throw new Error(errorData || 'Failed to vote');
              }
              
              const result = await response.json();
              Alert.alert('투표 완료', result.message || '투표가 성공적으로 완료되었습니다.');
              fetchVotes(); // 투표 목록 새로고침
              // 선택된 옵션 초기화
              setSelectedOptions(prev => {
                const newMap = new Map(prev);
                newMap.delete(voteId);
                return newMap;
              });
            } catch (error: any) {
              console.error('Error voting:', error);
              // 에러 메시지 파싱
              const errorMessage = error.message || '투표 처리 중 오류가 발생했습니다.';
              Alert.alert('오류', errorMessage);
            } finally {
              setVoting(false);
            }
          },
        },
      ]
    );
  };

  const toggleVoteExpansion = (voteId: number) => {
    setExpandedVotes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(voteId)) {
        newSet.delete(voteId);
      } else {
        newSet.add(voteId);
      }
      return newSet;
    });
  };

  const renderVoteOption = (option: VoteOption, vote: Vote) => {
    const isExpanded = expandedVotes.has(vote.id);
    const showResults = vote.hasVoted || vote.isClosed || !isParticipant;
    const isSelected = selectedOptions.get(vote.id) === option.id;
    const canSelect = !vote.hasVoted && !vote.isClosed && isParticipant;
    
    return (
      <TouchableOpacity
        key={option.id}
        style={[
          styles.optionContainer,
          isSelected && styles.selectedOption,
          canSelect && styles.selectableOption,
          option.isSelected && styles.completedOption, // 이미 투표한 옵션
        ]}
        onPress={() => canSelect && handleOptionSelect(vote.id, option.id)}
        disabled={!canSelect || voting}
      >
        <View style={styles.optionContent}>
          <Text style={[
            styles.optionText, 
            isSelected && styles.selectedOptionText,
            option.isSelected && styles.completedOptionText
          ]}>
            {option.optionValue}
          </Text>
          {option.isSelected && (
            <View style={styles.checkmark}>
              <Ionicons name="checkmark-circle" size={20} color="#48BB78" />
            </View>
          )}
          {isSelected && !option.isSelected && (
            <View style={styles.checkmark}>
              <Ionicons name="radio-button-on" size={20} color="#FF6B9D" />
            </View>
          )}
        </View>
        
        {showResults && isExpanded && (
          <>
            <View style={styles.progressBarContainer}>
              <View 
                style={[
                  styles.progressBar, 
                  { width: `${option.percentage || 0}%` },
                  option.isSelected && styles.selectedProgressBar,
                ]}
              />
            </View>
            <Text style={styles.voteCount}>
              {option.voteCount || 0}표 ({option.percentage || 0}%)
            </Text>
          </>
        )}
      </TouchableOpacity>
    );
  };

  const renderVote = (vote: Vote) => {
    const isExpanded = expandedVotes.has(vote.id);
    
    return (
      <View key={vote.id} style={styles.voteCard}>
        <TouchableOpacity 
          style={styles.voteHeader}
          onPress={() => toggleVoteExpansion(vote.id)}
        >
          <View style={styles.voteTitleContainer}>
            <Text style={styles.voteTitle}>{vote.title}</Text>
            {vote.isClosed && (
              <View style={styles.closedBadge}>
                <Text style={styles.closedText}>마감</Text>
              </View>
            )}
            {vote.hasVoted && !vote.isClosed && (
              <View style={styles.votedBadge}>
                <Text style={styles.votedText}>투표완료</Text>
              </View>
            )}
          </View>
          <Ionicons 
            name={isExpanded ? "chevron-up" : "chevron-down"} 
            size={20} 
            color="#666" 
          />
        </TouchableOpacity>
        
        {isExpanded && (
          <View style={styles.optionsContainer}>
            {vote.options.map(option => renderVoteOption(option, vote))}
            {(vote.hasVoted || vote.isClosed) && (
              <Text style={styles.totalVotes}>
                총 {vote.totalVotes || 0}명 참여
              </Text>
            )}
          </View>
        )}
      </View>
    );
  };

  const renderVoteAsTimelineCard = (vote: Vote, index: number) => {
    const isExpanded = expandedVotes.has(vote.id);
    const hasSelection = selectedOptions.has(vote.id);
    const canVote = !vote.hasVoted && !vote.isClosed && isParticipant && hasSelection;
    
    return (
      <View key={vote.id} style={styles.timelineVoteContainer}>
        {/* Timeline dot */}
        <View style={styles.timelineContainer}>
          <View style={[
            styles.timelineDot,
            vote.hasVoted && styles.timelineDotCompleted
          ]} />
          {index < votes.length - 1 && <View style={styles.timelineLine} />}
        </View>

        {/* Vote Card */}
        <View style={[styles.timelineVoteCard, { backgroundColor: getVoteCardColor(index) }]}>
          <TouchableOpacity 
            onPress={() => toggleVoteExpansion(vote.id)}
            activeOpacity={0.8}
          >
            <Text style={styles.timelineVoteTitle}>{vote.title}</Text>
            <Text style={styles.timelineVoteDescription}>
              {vote.isClosed ? '투표가 마감되었습니다.' : 
               vote.hasVoted ? '투표 완료' : 
               '옵션을 선택하고 투표해주세요.'}
            </Text>
            
            {vote.hasVoted && (
              <Text style={styles.votedIndicator}>✓ 투표 완료</Text>
            )}
          </TouchableOpacity>
          
          {isExpanded && (
            <View style={styles.timelineOptionsContainer}>
              {vote.options.map(option => renderVoteOption(option, vote))}
              
              {/* 투표 버튼 */}
              {!vote.hasVoted && !vote.isClosed && isParticipant && (
                <TouchableOpacity
                  style={[
                    styles.voteButton,
                    canVote ? styles.voteButtonActive : styles.voteButtonDisabled
                  ]}
                  onPress={() => canVote && handleVote(vote.id)}
                  disabled={!canVote || voting}
                >
                  {voting ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <Text style={[
                      styles.voteButtonText,
                      !canVote && styles.voteButtonTextDisabled
                    ]}>
                      {hasSelection ? '투표하기' : '옵션을 선택하세요'}
                    </Text>
                  )}
                </TouchableOpacity>
              )}
              
              {(vote.hasVoted || vote.isClosed) && (
                <Text style={styles.totalVotes}>
                  총 {vote.totalVotes || 0}명 참여
                </Text>
              )}
            </View>
          )}
        </View>
      </View>
    );
  };

  const getVoteCardColor = (index: number) => {
    const colors = ['#E8F5E8', '#FFE8E8', '#E8F0FF', '#F5F5F5', '#FFF8E1'];
    return colors[index % colors.length];
  };

  // 개발용 더미 데이터
  const getDummyVotes = (): Vote[] => [
    {
      id: 1,
      title: '오름 트레킹 코스 선택',
      isClosed: false,
      hasVoted: false,
      options: [
        { id: 1, optionValue: '성산일출봉', voteCount: 3, percentage: 30 },
        { id: 2, optionValue: '한라산 영실코스', voteCount: 4, percentage: 40 },
        { id: 3, optionValue: '사려니숲길', voteCount: 3, percentage: 30 },
      ],
      totalVotes: 10,
    },
    {
      id: 2,
      title: '저녁 식사 메뉴',
      isClosed: false,
      hasVoted: true,
      selectedOptionId: 5,
      options: [
        { id: 4, optionValue: '흑돼지 구이', voteCount: 5, percentage: 50, isSelected: false },
        { id: 5, optionValue: '갈치조림', voteCount: 3, percentage: 30, isSelected: true },
        { id: 6, optionValue: '해물탕', voteCount: 2, percentage: 20, isSelected: false },
      ],
      totalVotes: 10,
    },
    {
      id: 3,
      title: '치킨 브랜드 선택',
      isClosed: true,
      hasVoted: true,
      selectedOptionId: 7,
      options: [
        { id: 7, optionValue: 'BBQ', voteCount: 6, percentage: 60, isSelected: true },
        { id: 8, optionValue: '교촌치킨', voteCount: 3, percentage: 30, isSelected: false },
        { id: 9, optionValue: 'BHC', voteCount: 1, percentage: 10, isSelected: false },
      ],
      totalVotes: 10,
    },
  ];

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color="#FF6B9D" />
        <Text style={styles.loadingText}>투표를 불러오는 중...</Text>
      </View>
    );
  }

  if (votes.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>진행중인 투표가 없습니다</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {votes.map((vote, index) => renderVoteAsTimelineCard(vote, index))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
    fontSize: 14,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    color: '#666',
    fontSize: 14,
  },
  voteCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  voteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
  },
  voteTitleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  voteTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D2D2D',
  },
  closedBadge: {
    backgroundColor: '#E53E3E',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  closedText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  votedBadge: {
    backgroundColor: '#48BB78',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  votedText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  optionsContainer: {
    padding: 15,
    paddingTop: 0,
  },
  optionContainer: {
    backgroundColor: '#F7FAFC',
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  selectableOption: {
    borderColor: '#CBD5E0',
  },
  selectedOption: {
    backgroundColor: '#F0FFF4',
    borderColor: '#48BB78',
  },
  optionContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 14,
    color: '#2D2D2D',
    flex: 1,
  },
  selectedOptionText: {
    fontWeight: '600',
    color: '#22543D',
  },
  checkmark: {
    marginLeft: 8,
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    marginTop: 8,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#FF6B9D',
    borderRadius: 3,
  },
  selectedProgressBar: {
    backgroundColor: '#48BB78',
  },
  voteCount: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  totalVotes: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
  },
  // 타임라인 스타일
  timelineVoteContainer: {
    flexDirection: 'row',
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
    backgroundColor: '#48BB78',
  },
  timelineLine: {
    width: 2,
    backgroundColor: '#E0E0E0',
    position: 'absolute',
    top: 12,
    bottom: -15,
  },
  timelineVoteCard: {
    flex: 1,
    borderRadius: 20,
    padding: 20,
    marginLeft: 10,
  },
  timelineVoteTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D2D2D',
    marginBottom: 8,
  },
  timelineVoteDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 10,
  },
  votedIndicator: {
    fontSize: 14,
    color: '#48BB78',
    fontWeight: '600',
    marginBottom: 10,
  },
  timelineOptionsContainer: {
    marginTop: 10,
  },
  completedOption: {
    backgroundColor: '#F0FFF4',
    borderColor: '#48BB78',
  },
  completedOptionText: {
    fontWeight: '600',
    color: '#22543D',
  },
  voteButton: {
    marginTop: 15,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  voteButtonActive: {
    backgroundColor: '#FF6B9D',
  },
  voteButtonDisabled: {
    backgroundColor: '#E2E8F0',
  },
  voteButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  voteButtonTextDisabled: {
    fontSize: 16,
    fontWeight: '600',
    color: '#9CA3AF',
  },
});

export default VoteSection; 