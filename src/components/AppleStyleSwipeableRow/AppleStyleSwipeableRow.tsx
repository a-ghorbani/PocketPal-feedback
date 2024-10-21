import {Animated, Text, View} from 'react-native';
import React, {Component, PropsWithChildren} from 'react';

import {RectButton, Swipeable} from 'react-native-gesture-handler';

import {styles} from './styles';

interface AppleStyleSwipeableRowProps {
  onDelete: () => void;
  onSwipeableOpen?: (direction: string) => void;
  onSwipeableClose?: (direction: string) => void;
}

export class AppleStyleSwipeableRow extends Component<
  PropsWithChildren<AppleStyleSwipeableRowProps>
> {
  private renderLeftAction = (
    text: string,
    color: string,
    x: number,
    progress: Animated.AnimatedInterpolation<number>,
  ) => {
    const trans = progress.interpolate({
      inputRange: [0, 1],
      outputRange: [-x, 0], // Start offscreen and move into view
    });
    const pressHandler = () => {
      this.close();
      this.props.onDelete();
    };

    return (
      <Animated.View
        style={[
          styles.leftActionContainer,
          {transform: [{translateX: trans}]},
        ]}>
        <RectButton
          style={[styles.leftAction, {backgroundColor: color}]}
          onPress={pressHandler}>
          <Text style={styles.actionText}>{text}</Text>
        </RectButton>
      </Animated.View>
    );
  };

  private renderLeftActions = (
    progress: Animated.AnimatedInterpolation<number>,
    _dragAnimatedValue: Animated.AnimatedInterpolation<number>,
  ) => (
    <View style={styles.leftActionsContainer}>
      {this.renderLeftAction('Delete', '#dd2c00', 192, progress)}
    </View>
  );

  private swipeableRow?: Swipeable;

  private updateRef = (ref: Swipeable) => {
    this.swipeableRow = ref;
  };
  private close = () => {
    this.swipeableRow?.close();
  };

  render() {
    const {children} = this.props;
    return (
      <Swipeable
        ref={this.updateRef}
        friction={2}
        enableTrackpadTwoFingerGesture
        leftThreshold={30} // Right swipe threshold
        renderLeftActions={this.renderLeftActions} // Swipe right to reveal left actions
        onSwipeableOpen={this.props.onSwipeableOpen}
        onSwipeableClose={this.props.onSwipeableClose}>
        {children}
      </Swipeable>
    );
  }
}
