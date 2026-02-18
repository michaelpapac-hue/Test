import React from 'react';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ProjectDashboardScreen } from './screens/ProjectDashboardScreen';
import { DailyReportScreen } from './screens/DailyReportScreen';
import { PhotoReelScreen } from './screens/PhotoReelScreen';
import { HotItemsScreen } from './screens/HotItemsScreen';
import { colors } from './theme/colors';

const Tab = createBottomTabNavigator();

const appTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: colors.bg,
    card: colors.card,
    text: colors.text,
    primary: colors.accent,
  },
};

export default function App() {
  return (
    <NavigationContainer theme={appTheme}>
      <Tab.Navigator screenOptions={{ headerShown: false }}>
        <Tab.Screen name="Dashboard" component={ProjectDashboardScreen} />
        <Tab.Screen name="Report" component={DailyReportScreen} />
        <Tab.Screen name="Photo Reel" component={PhotoReelScreen} />
        <Tab.Screen name="Hot Items" component={HotItemsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
