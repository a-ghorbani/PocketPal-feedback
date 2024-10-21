import * as React from 'react';
import {
  Dimensions,
  EventSubscription,
  Keyboard,
  KeyboardEvent,
  LayoutAnimation,
  Platform,
  ScaledSize,
} from 'react-native';
import {useSafeAreaFrame} from 'react-native-safe-area-context';

/**
 * Utility hook used to calculate keyboard dimensions.
 *
 * @param `useListenersOnAndroid` Will register keyboard listeners for Android
 *
 * ⚠️ You shouldn't use this hook on the same screen with `KeyboardAccessoryView` component, unexpected behavior might occur
 * @returns `keyboardEndPositionY` Keyboard's top line Y position
 * @returns `keyboardHeight` Keyboard's height
 */
export const useKeyboardDimensions = (useListenersOnAndroid?: boolean) => {
  const {height, y} = useSafeAreaFrame();
  const [state, setState] = React.useState({
    keyboardEndPositionY: height,
    keyboardHeight: 0,
  });

  React.useEffect(() => {
    const handleDimensionsChange = ({window}: {window: ScaledSize}) =>
      setState(current => ({
        ...current,
        keyboardEndPositionY: window.height,
      }));

    const resetKeyboardDimensions = () =>
      setState({
        keyboardEndPositionY: height,
        keyboardHeight: 0,
      });

    const updateKeyboardDimensions = (event: KeyboardEvent) =>
      setState(current => {
        const {screenY: keyboardEndPositionY} = event.endCoordinates;
        const keyboardHeight = height - keyboardEndPositionY + y;

        if (keyboardHeight === current.keyboardHeight) {
          return current;
        }

        const {duration, easing} = event;

        if (duration && easing) {
          // We have to pass the duration equal to minimal
          // accepted duration defined here: RCTLayoutAnimation.m
          const animationDuration = Math.max(duration, 10);

          LayoutAnimation.configureNext({
            duration: animationDuration,
            update: {
              duration: animationDuration,
              type: LayoutAnimation.Types[easing],
            },
          });
        }

        return {
          keyboardEndPositionY,
          keyboardHeight,
        };
      });

    const dimensionsListener = Dimensions.addEventListener(
      'change',
      handleDimensionsChange,
    );

    const keyboardListeners: EventSubscription[] = [];

    if (Platform.OS === 'android' && useListenersOnAndroid) {
      keyboardListeners.push(
        Keyboard.addListener('keyboardDidHide', resetKeyboardDimensions),
        Keyboard.addListener('keyboardDidShow', updateKeyboardDimensions),
      );
    } else {
      keyboardListeners.push(
        Keyboard.addListener(
          'keyboardWillChangeFrame',
          updateKeyboardDimensions,
        ),
      );
    }

    return () => {
      keyboardListeners.forEach(listener => listener.remove());
      dimensionsListener.remove();
    };
  }, [height, useListenersOnAndroid, y]);

  return state;
};
