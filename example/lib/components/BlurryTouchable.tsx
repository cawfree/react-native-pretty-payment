import * as React from 'react';
import {StyleSheet, Animated, TouchableWithoutFeedback, ViewStyle, GestureResponderEvent, ViewBase} from 'react-native';
import {BlurView} from 'expo-blur';

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

export type BlurryTouchableProps = {
  readonly style?: ViewStyle | readonly ViewStyle[];
  readonly children: JSX.Element | readonly JSX.Element[];
  readonly duration: number;
};

export type Blurry = {
  readonly tint?: string;
  readonly min: number;
  readonly max: number;
}

export type PressableBlurryTouchableProps = Blurry & BlurryTouchableProps & {
  readonly disabled?: boolean;
  readonly onPress: (e: GestureResponderEvent) =>void;
};

const styles = StyleSheet.create({
  flex: {flex: 1},
});

export default function BlurryTouchable({
  style,
  children,
  disabled,
  tint,
  min,
  max,
  duration,
  onPress,
}: PressableBlurryTouchableProps): JSX.Element {
  const [intensity] = React.useState(() => new Animated.Value(0));
  const shouldChangeIntensity = React.useCallback((toValue: number) => {
    Animated.timing(intensity, {
      toValue,
      duration: duration,
      useNativeDriver: false,
    }).start();
  }, [intensity, duration]);
  React.useEffect(() => shouldChangeIntensity(min), [min, shouldChangeIntensity]);
  const onPressIn = React.useCallback(() => {
    shouldChangeIntensity(max);
  }, [shouldChangeIntensity, max]);
  const onPressOut = React.useCallback(() => {
    setTimeout(() => shouldChangeIntensity(min), duration);
  }, [shouldChangeIntensity, min, duration]);
  return (
    <AnimatedBlurView intensity={intensity} style={style} tint={tint}>
      <TouchableWithoutFeedback
        style={styles.flex}
        disabled={disabled}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        onPress={onPress}
      >
        {children}
      </TouchableWithoutFeedback>
    </AnimatedBlurView>
  );
}
