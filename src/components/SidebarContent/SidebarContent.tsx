import React, {useEffect} from 'react';

import {observer} from 'mobx-react';
import {Drawer, Text} from 'react-native-paper';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {
  DrawerContentScrollView,
  DrawerContentComponentProps,
} from '@react-navigation/drawer';

import {useTheme} from '../../hooks';

import {createStyles} from './styles';

import {chatSessionStore} from '../../store';

import {AppleStyleSwipeableRow} from '..';

export const SidebarContent: React.FC<DrawerContentComponentProps> = observer(
  props => {
    useEffect(() => {
      chatSessionStore.loadSessionList();
    }, []);

    const theme = useTheme();
    const styles = createStyles(theme);

    return (
      <GestureHandlerRootView style={styles.sidebarContainer}>
        <DrawerContentScrollView {...props}>
          <Drawer.Section>
            <Drawer.Item
              style={styles.drawerItem}
              label={'Chat'}
              icon={'comment-text'}
              onPress={() => props.navigation.navigate('Chat')}
            />
            <Drawer.Item
              style={styles.drawerItem}
              label={'Models'}
              icon={'view-grid'}
              onPress={() => props.navigation.navigate('Models')}
            />
            <Drawer.Item
              style={styles.drawerItem}
              label={'Settings'}
              icon={'cog'}
              onPress={() => props.navigation.navigate('Settings')}
            />
          </Drawer.Section>

          {/* Loop over the session groups and render them */}
          {Object.entries(chatSessionStore.groupedSessions).map(
            ([dateLabel, sessions]) => (
              <Drawer.Section
                key={dateLabel}
                //title=""
                theme={{
                  colors: {
                    onSurfaceVariant: 'green',
                  },
                }}
                style={styles.drawerSection}>
                <Text variant="bodySmall" style={styles.dateLabel}>
                  {dateLabel}
                </Text>
                {sessions.map(session => {
                  const isActive =
                    chatSessionStore.activeSessionId === session.id;
                  return (
                    <AppleStyleSwipeableRow
                      key={session.id} // Ensure each swipeable row has a unique key
                      onDelete={() =>
                        chatSessionStore.deleteSession(session.id)
                      }>
                      <Drawer.Item
                        style={styles.drawerItem}
                        active={isActive}
                        key={session.id}
                        label={session.title}
                        onPress={() => {
                          chatSessionStore.setActiveSession(session.id);
                          props.navigation.navigate('Chat');
                          console.log(`Navigating to session: ${session.id}`);
                        }}
                      />
                    </AppleStyleSwipeableRow>
                  );
                })}
              </Drawer.Section>
            ),
          )}
        </DrawerContentScrollView>
      </GestureHandlerRootView>
    );
  },
);
