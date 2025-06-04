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

interface FormData {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  password?: string;
  confirmPassword?: string;
}

export const SignupScreen: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // 입력 시 해당 필드의 에러 메시지 제거
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (formData.name.length < 2) {
      newErrors.name = '이름은 2글자 이상이어야 합니다.';
    }

    if (!formData.email.includes('@')) {
      newErrors.email = '유효한 이메일 주소를 입력해주세요.';
    }

    if (!formData.phone) {
      newErrors.phone = '전화번호를 입력해주세요.';
    }

    if (formData.password.length < 8) {
      newErrors.password = '비밀번호는 8자 이상이어야 합니다.';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호가 일치하지 않습니다.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await apiService.register({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      });
      router.push('/auth/signup-complete');
    } catch (error) {
      if (error.message.includes('이미 존재하는 이메일')) {
        setErrors(prev => ({
          ...prev,
          email: '이미 사용 중인 이메일입니다.'
        }));
      } else {
        Alert.alert('오류', error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={authStyles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={authStyles.keyboardContainer}
      >
        <ScrollView contentContainerStyle={authStyles.signupContainer}>
          <Text style={authStyles.signupTitle}>회원가입</Text>

          <View style={authStyles.inputContainer}>
            <TextInput
              style={[authStyles.input, errors.name && authStyles.inputError]}
              placeholder="이름"
              value={formData.name}
              onChangeText={(value) => handleInputChange('name', value)}
            />
            {errors.name && <Text style={authStyles.errorText}>{errors.name}</Text>}

            <TextInput
              style={[authStyles.input, errors.email && authStyles.inputError]}
              placeholder="이메일"
              value={formData.email}
              onChangeText={(value) => handleInputChange('email', value)}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {errors.email && <Text style={authStyles.errorText}>{errors.email}</Text>}

            <TextInput
              style={[authStyles.input, errors.phone && authStyles.inputError]}
              placeholder="전화번호"
              value={formData.phone}
              onChangeText={(value) => handleInputChange('phone', value)}
              keyboardType="phone-pad"
            />
            {errors.phone && <Text style={authStyles.errorText}>{errors.phone}</Text>}

            <TextInput
              style={[authStyles.input, errors.password && authStyles.inputError]}
              placeholder="비밀번호"
              value={formData.password}
              onChangeText={(value) => handleInputChange('password', value)}
              secureTextEntry
            />
            {errors.password && <Text style={authStyles.errorText}>{errors.password}</Text>}

            <TextInput
              style={[authStyles.input, errors.confirmPassword && authStyles.inputError]}
              placeholder="비밀번호 확인"
              value={formData.confirmPassword}
              onChangeText={(value) => handleInputChange('confirmPassword', value)}
              secureTextEntry
            />
            {errors.confirmPassword && (
              <Text style={authStyles.errorText}>{errors.confirmPassword}</Text>
            )}
          </View>

          <TouchableOpacity
            style={authStyles.primaryButton}
            onPress={handleSignup}
            disabled={loading}
          >
            <Text style={authStyles.primaryButtonText}>
              {loading ? '처리 중...' : '회원가입'}
            </Text>
          </TouchableOpacity>

          <View style={authStyles.footerLinks}>
            <Text style={authStyles.footerText}>이미 계정이 있으신가요? </Text>
            <TouchableOpacity onPress={() => router.push('/auth/login')}>
              <Text style={authStyles.linkTextBlue}>로그인</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}; 