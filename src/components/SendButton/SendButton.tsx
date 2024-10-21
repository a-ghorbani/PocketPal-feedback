import * as React from 'react';
import {
  GestureResponderEvent,
  Image,
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';

import {useTheme} from '../../hooks';

import {L10nContext} from '../../utils';

export interface SendButtonPropsAdditionalProps {
  touchableOpacityProps?: TouchableOpacityProps;
}

export interface SendButtonProps extends SendButtonPropsAdditionalProps {
  /** Callback for send button tap event */
  onPress: () => void;
}

export const SendButton = ({
  onPress,
  touchableOpacityProps,
}: SendButtonProps) => {
  const l10n = React.useContext(L10nContext);
  const theme = useTheme();
  const handlePress = (event: GestureResponderEvent) => {
    onPress();
    touchableOpacityProps?.onPress?.(event);
  };

  return (
    <TouchableOpacity
      accessibilityLabel={l10n.sendButtonAccessibilityLabel}
      accessibilityRole="button"
      testID="send-button"
      {...touchableOpacityProps}
      onPress={handlePress}
      style={styles.sendButton}>
      {theme.icons?.sendButtonIcon?.() ?? (
        <Image
          source={require('../../assets/icon-send.png')}
          style={{tintColor: theme.colors.inverseOnSurface}}
        />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  sendButton: {
    marginLeft: 16,
  },
});
