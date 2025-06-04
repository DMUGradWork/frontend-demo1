import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { authStyles } from '../../css/auth.styles';

export const SignupCompleteScreen: React.FC = () => {
  const router = useRouter();

  return (
    <SafeAreaView style={authStyles.container}>
      <View style={authStyles.completeContainer}>
        <View style={authStyles.successIcon}>
          <Ionicons name="checkmark" size={40} color="#4CAF50" />
        </View>
        <Text style={authStyles.completeTitle}>회원가입 완료!</Text>
        <Text style={authStyles.completeSubtitle}>
          Your password has been changed successfully.
        </Text>
        <TouchableOpacity
          style={authStyles.primaryButton}
          onPress={() => router.push('/auth/login')}
        >
          <Text style={authStyles.primaryButtonText}>Back to Login</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}; 