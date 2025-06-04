import React, { useState } from 'react';
import { SplashScreen } from './SplashScreen';
import { OnboardingScreen } from './OnboardingScreen';
import { LoginScreen } from './LoginScreen';
import { SignupScreen } from './SignupScreen';
import { FindIdScreen } from './FindIdScreen';
import { SignupCompleteScreen } from './SignupCompleteScreen';

export const AuthNavigator = () => {
  const [currentScreen, setCurrentScreen] = useState('splash');

  const navigateToScreen = (screen: string) => {
    setCurrentScreen(screen);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'splash':
        return <SplashScreen onFinish={() => setCurrentScreen('onboarding')} />;
      case 'onboarding':
        return <OnboardingScreen onFinish={() => setCurrentScreen('login')} />;
      case 'login':
        return <LoginScreen onNavigate={navigateToScreen} />;
      case 'signup':
        return (
          <SignupScreen 
            onNavigate={navigateToScreen}
            onBack={() => setCurrentScreen('login')}
          />
        );
      case 'findId':
        return <FindIdScreen onBack={() => setCurrentScreen('login')} />;
      case 'signupComplete':
        return <SignupCompleteScreen onNavigate={navigateToScreen} />;
      default:
        return <LoginScreen onNavigate={navigateToScreen} />;
    }
  };

  return renderScreen();
}; 