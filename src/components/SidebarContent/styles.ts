import {StyleSheet} from 'react-native';

import {MD3Theme} from 'react-native-paper';

export const createStyles = (theme: MD3Theme) =>
  StyleSheet.create({
    sidebarContainer: {
      flex: 1,
      backgroundColor: theme.colors.surface,
    },
    drawerSection: {
      marginVertical: 10,
    },
    dateLabel: {
      color: theme.colors.onSurfaceVariant,
      paddingLeft: 26,
      paddingBottom: 15,
    },
    drawerItem: {},
  });
