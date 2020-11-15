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
  const [scales] = React.useState(() => [...Array(12)].map(() => new Animated.Value(0)));
  const [opacity] = React.useState(() => [...Array(12)].map(() => new Animated.Value(0)));
  const digits = getDigits();
  const backspace = getBackspace();
  const period = getPeriod();
  const disabled = [
    ...digits.map(({disabled}) => disabled),
    period.disabled,
    backspace.disabled,
  ] as readonly boolean[];
  React.useEffect(() => {
    Animated.parallel(
      disabled.map((isDisabled, i) => Animated.timing(
        opacity[i],
        {
          toValue: isDisabled ? 0.2 : 1,
          useNativeDriver: true,
          easing: Easing.ease,
          duration: 120,
        },
      )),
    ).start();
  }, [...disabled, opacity]);
  React.useEffect(() => {
    Animated.sequence(
      [
        Animated.delay(50),
        Animated.parallel([
          Animated.stagger(
            30,
            scales.map(scale => Animated.timing(scale, {
              easing: Easing.ease,
              toValue: 1,
              useNativeDriver: true,
              duration: 300,
            })),
          ),
        ]),
        
      ]
    ).start();
  }, [scales]);
  return (
    <Animated.View style={[StyleSheet.flatten(style), styles.container]}>
      <Animated.View style={styles.row}>
          <Animated.View style={[styles.digit, {opacity: opacity[1], transform: [{scale: scales[1]}]}]}>
            {renderDigit(digits[1])}
          </Animated.View>
          <Animated.View style={[styles.digit, {opacity: opacity[2], transform: [{scale: scales[2]}]}]}>
            {renderDigit(digits[2])}
          </Animated.View>
          <Animated.View style={[styles.digit, {opacity: opacity[3], transform: [{scale: scales[3]}]}]}>
            {renderDigit(digits[3])}
          </Animated.View>
      </Animated.View>
      <Animated.View style={styles.row}>
        <Animated.View style={[styles.digit, {opacity: opacity[4], transform: [{scale: scales[4]}]}]}>
          {renderDigit(digits[4])}
        </Animated.View>
        <Animated.View style={[styles.digit, {opacity: opacity[5], transform: [{scale: scales[5]}]}]}>
          {renderDigit(digits[5])}
        </Animated.View>
        <Animated.View style={[styles.digit, {opacity: opacity[6], transform: [{scale: scales[6]}]}]}>
          {renderDigit(digits[6])}
        </Animated.View>
      </Animated.View>
      <Animated.View style={styles.row}>
        <Animated.View style={[styles.digit, {opacity: opacity[7], transform: [{scale: scales[7]}]}]}>
          {renderDigit(digits[7])}
        </Animated.View>
        <Animated.View style={[styles.digit, {opacity: opacity[8], transform: [{scale: scales[8]}]}]}>
          {renderDigit(digits[8])}
        </Animated.View>
        <Animated.View style={[styles.digit, {opacity: opacity[9], transform: [{scale: scales[9]}]}]}>
          {renderDigit(digits[9])}
        </Animated.View>
      </Animated.View>
      <Animated.View style={styles.row}>
        <Animated.View style={[styles.digit, {opacity: opacity[10], transform: [{scale: scales[10]}]}]}>
          {renderPeriod(period)}
        </Animated.View>
        <Animated.View style={[styles.digit, {opacity: opacity[0], transform: [{scale: scales[0]}]}]}>
          {renderDigit(digits[0])}
        </Animated.View>
        <Animated.View style={[styles.digit, {opacity: opacity[11], transform: [{scale: scales[11]}]}]}>
          {renderBackspace(backspace)}
        </Animated.View>
      </Animated.View>
    </Animated.View>
  );
}
