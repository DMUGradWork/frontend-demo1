import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { authStyles } from '../../css/auth.styles';
import { apiService } from '../../services/auth';

export const LoginScreen: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('알림', '이메일과 비밀번호를 입력해주세요.');
      return;
    }

    setLoading(true);
    try {
      const result = await apiService.login(email, password);
      Alert.alert('성공', '로그인되었습니다!');
      // 로그인 성공 시 메인 화면으로 이동
    } catch (error) {
      Alert.alert('오류', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    Alert.alert('알림', `${provider} 로그인 기능을 구현해주세요.`);
  };

  return (
    <SafeAreaView style={authStyles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={authStyles.keyboardContainer}
      >
        <ScrollView contentContainerStyle={authStyles.loginContainer}>
          <Text style={authStyles.loginTitle}>로그인</Text>
          
          <View style={authStyles.inputContainer}>
            <TextInput
              style={authStyles.input}
              placeholder="이메일 입력"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            
            <View style={authStyles.passwordContainer}>
              <TextInput
                style={authStyles.passwordInput}
                placeholder="비밀번호 입력"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                style={authStyles.eyeButton}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons 
                  name={showPassword ? 'eye' : 'eye-off'} 
                  size={20} 
                  color="#999" 
                />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={authStyles.primaryButton}
            onPress={handleLogin}
            disabled={loading}
          >
            <Text style={authStyles.primaryButtonText}>
              {loading ? '로그인 중...' : 'Login'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={authStyles.linkButton}
            onPress={() => router.push('/auth/signup')}
          >
            <Text style={authStyles.linkText}>소셜 회원가입</Text>
          </TouchableOpacity>

          <View style={authStyles.socialLoginContainer}>
            <TouchableOpacity
              style={authStyles.socialButton}
              onPress={() => handleSocialLogin('카카오')}
            >
              <View style={[authStyles.socialIcon, { backgroundColor: '#FEE500' }]}>
                <Text style={authStyles.socialIconText}>K</Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={authStyles.socialButton}
              onPress={() => handleSocialLogin('구글')}
            >
              <View style={[authStyles.socialIcon, { backgroundColor: '#4285F4' }]}>
                <Text style={[authStyles.socialIconText, { color: 'white' }]}>G</Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={authStyles.socialButton}
              onPress={() => handleSocialLogin('애플')}
            >
              <View style={[authStyles.socialIcon, { backgroundColor: '#000' }]}>
                <Ionicons name="logo-apple" size={20} color="white" />
              </View>
            </TouchableOpacity>
          </View>

          <View style={authStyles.footerLinks}>
            <Text style={authStyles.footerText}>계정이 없으신가요? </Text>
            <TouchableOpacity onPress={() => router.push('/auth/signup')}>
              <Text style={authStyles.linkTextBlue}>회원가입</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}; 