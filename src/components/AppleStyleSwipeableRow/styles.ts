import {I18nManager, StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  leftActionsContainer: {
    width: 192,
    flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
  },
  leftActionContainer: {
    flex: 1,
  },
  actionText: {
    color: 'white',
    fontSize: 16,
    backgroundColor: 'transparent',
    padding: 10,
  },
  leftAction: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
});
