import * as React from 'react';
import {LayoutChangeEvent} from 'react-native';

/**
 * Calculates view's width & height based on the `onLayout` event.
 * @example
 * const [onLayout, size] = useComponentSize()
 * ...
 * <View onLayout={onLayout} /> // `size` will contain the size of this view
 */
export const useComponentSize = () => {
  const [size, setSize] = React.useState({height: 0, width: 0});

  const onLayout = React.useCallback((event: LayoutChangeEvent) => {
    const {height, width} = event.nativeEvent.layout;
    setSize({height, width});
  }, []);

  return {onLayout, size};
};
