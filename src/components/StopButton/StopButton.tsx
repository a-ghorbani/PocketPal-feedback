import * as React from 'react';
import {
  GestureResponderEvent,
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';

import {useTheme} from '../../hooks';

// import {L10nContext} from '../../utils';

export interface StopButtonPropsAdditionalProps {
  touchableOpacityProps?: TouchableOpacityProps;
}

export interface StopButtonProps extends StopButtonPropsAdditionalProps {
  /** Callback for stop button tap event */
  onPress?: () => void;
}

export const StopButton = ({
  onPress,
  touchableOpacityProps,
}: StopButtonProps) => {
  // const l10n = React.useContext(L10nContext);
  const theme = useTheme();
  const handlePress = (event: GestureResponderEvent) => {
    if (onPress) {
      onPress();
    }
    touchableOpacityProps?.onPress?.(event);
  };

  return (
    <TouchableOpacity
      //accessibilityLabel={l10n.stopButtonAccessibilityLabel}
      accessibilityRole="button"
      testID="stop-button"
      {...touchableOpacityProps}
      onPress={handlePress}
      style={styles.stopButton}>
      <Icon name="stop-circle" size={24} color={theme.colors.background} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  stopButton: {
    marginLeft: 8,
    borderRadius: 20,
    padding: 8,
  },
});
