import * as React from 'react';
import {Animated, PanResponder, Platform} from 'react-native';

/**
 * Returns `panHandlers` used to calculate Y finger position.
 *
 * Used to support interactive dismiss on iOS, on Android `panHandlers` is an empty object.
 *
 * ⚠️ You shouldn't use this hook if you don't use interactive dismiss on iOS.
 * @example
 * // `positionY` will be passed to the `KeyboardAccessoryView` component
 * const [panHandlers, positionY] = usePanResponder()
 * ...
 * <ScrollView {...panHandlers} />
 */
export const usePanResponder = () => {
  const positionY = React.useRef(new Animated.Value(0)).current;

  // Ignore PanResponder callbacks from the coverage since it is hard to simulate touches in a unit test
  /* istanbul ignore next */
  const panResponder = React.useRef(
    PanResponder.create({
      onPanResponderMove: Animated.event([null, {moveY: positionY}], {
        useNativeDriver: false,
      }),
      onPanResponderEnd: () => {
        setTimeout(() => {
          positionY.setValue(0);
        }, 10);
      },
    }),
  ).current;

  return {
    panHandlers: Platform.OS === 'android' ? {} : panResponder.panHandlers,
    positionY,
  };
};
