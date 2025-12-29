import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider, MeetingsProvider } from './context';
import { RootNavigator } from './navigation';
import { Colors } from './theme';

const App: React.FC = () => {
  return (
    <SafeAreaProvider>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={Colors.background}
      />
      <NavigationContainer>
        <AuthProvider>
          <MeetingsProvider>
            <RootNavigator />
          </MeetingsProvider>
        </AuthProvider>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default App;
