import * as React from 'react';
import {Animated, ColorValue, Easing, StyleProp, ViewStyle} from 'react-native';

import styles from './styles';

export interface CircularActivityIndicatorProps {
  color: ColorValue;
  size?: number;
  style?: StyleProp<ViewStyle>;
}

export const CircularActivityIndicator = ({
  color,
  size = 24,
  style,
}: CircularActivityIndicatorProps) => {
  const spinValue = React.useRef(new Animated.Value(0)).current;
  const {circle} = styles({color, size});

  React.useEffect(() => {
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 600,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Animated.View
      style={[
        {
          transform: [
            {
              rotate: spinValue.interpolate({
                inputRange: [0, 1],
                outputRange: ['0deg', '360deg'],
              }),
            },
          ],
        },
        circle,
        style,
      ]}
      testID="CircularActivityIndicator"
    />
  );
};
