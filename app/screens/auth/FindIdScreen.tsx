import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { authStyles } from '../../css/auth.styles';
import { apiService } from '../../services/auth';

export const FindIdScreen: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFindId = async () => {
    if (!email.trim()) {
      Alert.alert('알림', '이메일을 입력해주세요.');
      return;
    }

    setLoading(true);
    try {
      await apiService.findUserByEmail(email);
      Alert.alert('성공', '입력하신 이메일로 인증 코드를 발송했습니다.');
      router.push('/auth/login');
    } catch (error) {
      Alert.alert('오류', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={authStyles.container}>
      <View style={authStyles.findIdContainer}>
        <Text style={authStyles.findIdTitle}>아이디 찾기</Text>
        <Text style={authStyles.findIdSubtitle}>
          가입 시 등록한 이메일을 입력해주세요.
        </Text>

        <View style={authStyles.inputContainer}>
          <TextInput
            style={authStyles.input}
            placeholder="이메일 입력"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <TouchableOpacity
          style={authStyles.primaryButton}
          onPress={handleFindId}
          disabled={loading}
        >
          <Text style={authStyles.primaryButtonText}>
            {loading ? '처리 중...' : '인증 코드 발송'}
          </Text>
        </TouchableOpacity>

        <View style={authStyles.footerLinks}>
          <Text style={authStyles.footerText}>계정이 기억나셨나요? </Text>
          <TouchableOpacity onPress={() => router.push('/auth/login')}>
            <Text style={authStyles.linkTextBlue}>로그인</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}; 