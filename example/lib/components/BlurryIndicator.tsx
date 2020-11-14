import * as React from 'react';
import {Animated, Easing, StyleSheet} from 'react-native';

import BlurryTouchable from './BlurryTouchable';
import type {BlurryTouchableProps} from './BlurryTouchable';

export type BlurryIndicatorProps = BlurryTouchableProps & {
  readonly visible: boolean;
};

const styles = StyleSheet.create({
  container: {flex: 1},
});

export default function BlurryIndicator({
  visible,
  duration,
  ...extras
}: BlurryIndicatorProps) {
  const [opacity] = React.useState(() => new Animated.Value(0));
  React.useEffect(() => {
    Animated.timing(opacity, {
      duration: visible ? 200 : 50,
      easing: Easing.ease,
      toValue: visible ? 1 : 0,
      useNativeDriver: false,
    }).start();
  }, [visible, opacity, duration]);
  const noop = React.useCallback(() => null, []);
  return (
    <Animated.View style={{opacity}}>
      <BlurryTouchable
        {...extras}
         duration={duration}
         disabled
         onPress={noop}
         min={100}
         max={100}
       />
      <Animated.View style={StyleSheet.absoluteFill} />
    </Animated.View>
  );
}