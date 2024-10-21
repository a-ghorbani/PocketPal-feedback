import React from 'react';
import {View} from 'react-native';

import {observer} from 'mobx-react';
import {IconButton} from 'react-native-paper';

import {styles} from './styles';

import {chatSessionStore, uiStore} from '../../store';

import {UsageStats} from '..';

export const HeaderRight: React.FC = observer(() => (
  <View style={styles.headerRightContainer}>
    {uiStore.displayMemUsage && <UsageStats width={40} height={20} />}
    <IconButton
      icon="square-edit-outline"
      testID="reset-button"
      onPress={() => {
        chatSessionStore.resetActiveSession();
      }}
    />
  </View>
));
