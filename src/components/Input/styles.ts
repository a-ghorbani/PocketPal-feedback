import {StyleSheet} from 'react-native';

import {Theme} from '../../utils/types';

export const styles = ({theme}: {theme: Theme}) =>
  StyleSheet.create({
    container: {
      alignItems: 'center',
      flexDirection: 'row',
      paddingHorizontal: 24,
      paddingVertical: 20,
    },
    input: {
      ...theme.fonts.inputTextStyle,
      color: theme.colors.inverseOnSurface,
      flex: 1,
      maxHeight: 100,
      // Fixes default paddings for Android
      paddingBottom: 0,
      paddingTop: 0,
    },
    marginRight: {
      marginRight: 16,
    },
  });
