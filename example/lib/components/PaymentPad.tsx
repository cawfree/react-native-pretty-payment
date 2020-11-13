import * as React from 'react';
import {Animated, Easing, StyleSheet, ViewStyle} from 'react-native';

import {PaymentButtonsHelpers, ButtonProps, Controls} from '../hooks';

export type PaymentPadProps = PaymentButtonsHelpers & {
  readonly style?: ViewStyle;
  readonly renderDigit: (props: ButtonProps) => JSX.Element;
  readonly renderBackspace: (props: ButtonProps) => JSX.Element;
  readonly renderPeriod: (props: ButtonProps) => JSX.Element;
};

const styles = StyleSheet.create({
  container: {flex: 1},
  digit: {flex: 1, aspectRatio: 1},
  row: {aspectRatio: 3, flexDirection: 'row'},
});

export default function PaymentPad({
  style,
  getDigits,
  getBackspace,
  getPeriod,
  renderDigit,
  renderBackspace,
  renderPeriod,
}: PaymentPadProps): JSX.Element {
  const [opacity] = React.useState(() => new Animated.Value(0));
  const [scales] = React.useState(() => [...Array(12)].map(() => new Animated.Value(0)));
  const digits = getDigits();
  React.useEffect(() => {
    Animated.sequence(
      [
        Animated.parallel([
          Animated.timing(opacity, {
            toValue: 1,
            duration: 40,
            useNativeDriver: true,
          }),
          Animated.stagger(
            30,
            scales.map(scale => Animated.timing(scale, {
              easing: Easing.ease,
              toValue: 1,
              useNativeDriver: true,
              duration: 350,
            })),
          ),
        ]),
        
      ]
    ).start();
  }, [scales]);
  return (
    <Animated.View style={[StyleSheet.flatten(style), styles.container, {opacity}]}>
      <Animated.View style={styles.row}>
          <Animated.View style={[styles.digit, {transform: [{scale: scales[0]}]}]}>
            {renderDigit(digits[1])}
          </Animated.View>
          <Animated.View style={[styles.digit, {transform: [{scale: scales[1]}]}]}>
            {renderDigit(digits[2])}
          </Animated.View>
          <Animated.View style={[styles.digit, {transform: [{scale: scales[2]}]}]}>
            {renderDigit(digits[3])}
          </Animated.View>
      </Animated.View>
      <Animated.View style={styles.row}>
        <Animated.View style={[styles.digit, {transform: [{scale: scales[3]}]}]}>
          {renderDigit(digits[4])}
        </Animated.View>
        <Animated.View style={[styles.digit, {transform: [{scale: scales[4]}]}]}>
          {renderDigit(digits[5])}
        </Animated.View>
        <Animated.View style={[styles.digit, {transform: [{scale: scales[5]}]}]}>
          {renderDigit(digits[6])}
        </Animated.View>
      </Animated.View>
      <Animated.View style={styles.row}>
        <Animated.View style={[styles.digit, {transform: [{scale: scales[6]}]}]}>
          {renderDigit(digits[7])}
        </Animated.View>
        <Animated.View style={[styles.digit, {transform: [{scale: scales[7]}]}]}>
          {renderDigit(digits[8])}
        </Animated.View>
        <Animated.View style={[styles.digit, {transform: [{scale: scales[8]}]}]}>
          {renderDigit(digits[9])}
        </Animated.View>
      </Animated.View>
      <Animated.View style={styles.row}>
        <Animated.View style={[styles.digit, {transform: [{scale: scales[9]}]}]}>
          {renderPeriod(getPeriod())}
        </Animated.View>
        <Animated.View style={[styles.digit, {transform: [{scale: scales[10]}]}]}>
          {renderDigit(digits[0])}
        </Animated.View>
        <Animated.View style={[styles.digit, {transform: [{scale: scales[11]}]}]}>
          {renderBackspace(getBackspace())}
        </Animated.View>
      </Animated.View>
    </Animated.View>
  );
}
