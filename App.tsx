import React from 'react';
import { useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { TweaksProvider } from './hooks/useTweaks';
import { PersonaProvider } from './hooks/usePersona';
import { DesignProvider } from './hooks/useDesign';
import { NudgeProvider } from './hooks/useNudgeState';
import { RootNavigator } from './navigation/RootNavigator';

// Thin entry: compose providers and mount the navigator. Everything else lives in
// its layer (services / hooks / screens / components / navigation). See ARCHITECTURE.md.
export default function App() {
  const dark = useColorScheme() === 'dark';
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <TweaksProvider>
          <PersonaProvider>
            <DesignProvider>
              <NudgeProvider>
                <NavigationContainer theme={dark ? DarkTheme : DefaultTheme}>
                  <RootNavigator />
                </NavigationContainer>
              </NudgeProvider>
            </DesignProvider>
          </PersonaProvider>
        </TweaksProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
