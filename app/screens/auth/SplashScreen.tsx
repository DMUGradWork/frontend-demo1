import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { authStyles } from '../../css/auth.styles';

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={authStyles.splashContainer}>
      <View style={authStyles.logoContainer}>
        <Ionicons name="checkmark" size={60} color="white" />
        <Text style={authStyles.logoText}>GREW MEET</Text>
        <Text style={authStyles.logoSubText}>connect</Text>
      </View>
    </View>
  );
}; 