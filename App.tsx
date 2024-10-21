import * as React from 'react';
import {Dimensions} from 'react-native';

import {reaction} from 'mobx';
import {observer} from 'mobx-react';
import {NavigationContainer} from '@react-navigation/native';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {gestureHandlerRootHOC} from 'react-native-gesture-handler';
import {Provider as PaperProvider} from 'react-native-paper';

import {useTheme} from './src/hooks';
import {HeaderRight, SidebarContent} from './src/components';
import {modelStore} from './src/store';
import {ChatScreen, ModelsScreen, SettingsScreen} from './src/screens';

const Drawer = createDrawerNavigator();

const screenWidth = Dimensions.get('window').width;

const App = observer(() => {
  const [chatTitle, setChatTitle] = React.useState('Default Chat Page');

  React.useEffect(() => {
    const dispose = reaction(
      () => modelStore.chatTitle,
      newTitle => setChatTitle(newTitle),
      {fireImmediately: true},
    );
    return () => dispose();
  }, []);

  const theme = useTheme();

  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <Drawer.Navigator
          screenOptions={{
            drawerStyle: {
              width: screenWidth * 0.8,
            },
            headerStyle: {
              backgroundColor: theme.colors.background,
            },
            headerTintColor: theme.colors.onBackground,
          }}
          drawerContent={props => <SidebarContent {...props} />}>
          <Drawer.Screen
            name="Chat"
            component={gestureHandlerRootHOC(ChatScreen)}
            options={{
              title: chatTitle,
              headerRight: () => <HeaderRight />,
            }}
          />
          <Drawer.Screen
            name="Models"
            component={gestureHandlerRootHOC(ModelsScreen)}
          />
          <Drawer.Screen
            name="Settings"
            component={gestureHandlerRootHOC(SettingsScreen)}
          />
        </Drawer.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
});

export default App;
