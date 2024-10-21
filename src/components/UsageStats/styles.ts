import {StyleSheet} from 'react-native';

import {Theme} from '../../utils/types';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      position: 'relative',
    },
    tooltip: {
      position: 'absolute',
      top: 25,
      left: -30,
      padding: 8,
      borderRadius: 4,
      backgroundColor: theme.colors.surface,
      elevation: 4,
      width: 120,
    },
    tooltipTitle: {
      color: theme.colors.primary,
      fontSize: 12,
      fontWeight: 'bold',
      marginBottom: 4,
    },
    tooltipText: {
      color: theme.colors.onSurface,
      fontSize: 10,
      marginBottom: 2,
    },
  });
