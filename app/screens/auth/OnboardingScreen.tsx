import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { authStyles } from '../../css/auth.styles';

interface OnboardingScreenProps {
  onFinish: () => void;
}

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onFinish }) => {
  const [currentStep, setCurrentStep] = useState(0);
  
  const onboardingData = [
    {
      title: '스터디 모임에 참여해보세요',
      subtitle: '함께 공부하는 장비들과 새로운 동료를 만나보세요',
      description: '같은 관심사를 가진 사람들과 함께 성장할 수 있는 기회를 만들어보세요',
      icon: '👥'
    },
    {
      title: '새로운 인연을 만나보세요',
      subtitle: '소통 서빽든 앞장 떠돌로 만나는 인간들과',
      description: '다양한 사람들과 진정한 인연을 만들어나가세요',
      icon: '💫'
    },
    {
      title: '중요한 일정을 놓치지 마세요',
      subtitle: '알림 기능을 통해 모든 약속과 일정을',
      description: '체계적인 스케줄 관리를 통해 더욱 효율적인 시간을 보내세요',
      icon: '📅'
    }
  ];

  const handleNext = () => {
    if (currentStep < onboardingData.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onFinish();
    }
  };

  const handleSkip = () => {
    onFinish();
  };

  return (
    <SafeAreaView style={authStyles.onboardingContainer}>
      <View style={authStyles.onboardingContent}>
        <Text style={authStyles.onboardingIcon}>{onboardingData[currentStep].icon}</Text>
        <Text style={authStyles.onboardingTitle}>{onboardingData[currentStep].title}</Text>
        <Text style={authStyles.onboardingSubtitle}>{onboardingData[currentStep].subtitle}</Text>
        <Text style={authStyles.onboardingDescription}>{onboardingData[currentStep].description}</Text>
        
        <View style={authStyles.dotsContainer}>
          {onboardingData.map((_, index) => (
            <View
              key={index}
              style={[
                authStyles.dot,
                index === currentStep ? authStyles.activeDot : authStyles.inactiveDot
              ]}
            />
          ))}
        </View>
      </View>
      
      <View style={authStyles.onboardingButtons}>
        <TouchableOpacity style={authStyles.primaryButton} onPress={handleNext}>
          <Text style={authStyles.primaryButtonText}>
            {currentStep === onboardingData.length - 1 ? '시작하기' : '다음'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={authStyles.secondaryButton} onPress={handleSkip}>
          <Text style={authStyles.secondaryButtonText}>건너뛰기</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}; 