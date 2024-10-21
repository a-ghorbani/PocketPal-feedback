import {Platform, StyleSheet} from 'react-native';
import {Theme} from '../../utils/types';

export const styles = ({theme}: {theme: Theme}) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.background,
      flex: 1,
    },
    emptyComponentContainer: {
      alignItems: 'center',
      marginHorizontal: 24,
      transform:
        Platform.OS === 'android'
          ? [{rotate: '180deg'}]
          : [{rotateX: '180deg'}],
    },
    emptyComponentTitle: {
      ...theme.fonts.emptyChatPlaceholderTextStyle,
      textAlign: 'center',
    },
    flatList: {
      backgroundColor: theme.colors.background,
      height: '100%',
    },
    flatListContentContainer: {
      flexGrow: 1,
    },
    footer: {
      height: 16,
    },
    footerLoadingPage: {
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 16,
      height: 32,
    },
    header: {
      height: 4,
    },
    keyboardAccessoryView: {
      backgroundColor: theme.colors.onBackground,
      borderTopLeftRadius: theme.borders.inputBorderRadius,
      borderTopRightRadius: theme.borders.inputBorderRadius,
    },
  });
