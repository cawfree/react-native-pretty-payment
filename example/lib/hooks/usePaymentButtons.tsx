import {useCallback, useEffect, useState} from 'react';
import BigNumber from 'bignumber.js';
import {Platform, GestureResponderEvent, LayoutAnimation, Vibration} from 'react-native';
import {useImmediateLayoutAnimation} from 'use-layout-animation';

const ZERO_STR = '0';
type onPressHandler = (e: GestureResponderEvent) => void;

export enum Controls {
  BACKSPACE = '<',
  PERIOD = '.',
};

export type ButtonProps = {
  readonly onPress: onPressHandler;
  readonly disabled: boolean;
  readonly children: string;
};

export type Buttons = {
  readonly [0]: ButtonProps;
  readonly [1]: ButtonProps;
  readonly [2]: ButtonProps;
  readonly [3]: ButtonProps;
  readonly [4]: ButtonProps;
  readonly [5]: ButtonProps;
  readonly [6]: ButtonProps;
  readonly [7]: ButtonProps;
  readonly [8]: ButtonProps;
  readonly [9]: ButtonProps;
  readonly [Controls.BACKSPACE]: ButtonProps;
  readonly [Controls.PERIOD]: ButtonProps;
};

export type usePaymentButtonsParams = {
  readonly min: BigNumber;
  readonly max: BigNumber;
};

export type PaymentButtonsHelpers = {
  readonly overflow: boolean;
  readonly underflow: boolean;
  readonly getDigits: () => readonly ButtonProps[];
  readonly getBackspace: () => ButtonProps;
  readonly getPeriod: () => ButtonProps;
  readonly setValue: (value: BigNumber) => void;
  readonly numberOfFractionalDigits: number;
};

export type usePaymentButtonsResult = [
  valueAsString: string,
  value: BigNumber,
  helpers: PaymentButtonsHelpers,
];

export default function usePaymentButtons(
  initialValue: BigNumber,
  params: usePaymentButtonsParams,
): usePaymentButtonsResult {
  const {min, max} = params;
  const [value, onChange] = useState<string>(() => initialValue.toString());
  const hasPeriod = value.includes('.');
  const nextValue = new BigNumber(value);

  const buildButtonProps = useCallback((
    onPress: onPressHandler,
    disabled: boolean,
    children: string,
    ): ButtonProps => ({onPress, disabled, children}), []);
  const appendDigit = useCallback(
    (nextDigit: string) => {
      onChange((e) => {
        const nextValue = `${e}${nextDigit}`;
        const isAllZeros = nextValue.replace(/0/g, '').length === 0;
        return isAllZeros ? ZERO_STR : e === ZERO_STR ? nextDigit : nextValue;
      });
    },
    [onChange],
  );
  const removeDigit = useCallback(() => {
    onChange((e) => e.substring(0, e.length - 1) || ZERO_STR);
  }, [onChange]);
  const appendPeriod = useCallback(() => {
    onChange((e) => {
      if (!hasPeriod) {
        return `${e}${Controls.PERIOD}`;
      }
      return e;
    });
  }, [onChange, hasPeriod]);

  const props = [];
  for (let i = 0; i < 10; i += 1) {
    const onPress = useCallback(
      () => appendDigit(`${i}`),
      [appendDigit],
    );
    const disabled = new BigNumber(`${value}${i}`).gt(max);
    props.push(buildButtonProps(onPress, disabled, `${i}`));
  }
  const buttons = (Object.assign({
    [Controls.BACKSPACE]: buildButtonProps(removeDigit, false, Controls.BACKSPACE),
    [Controls.PERIOD]: buildButtonProps(appendPeriod, hasPeriod, Controls.PERIOD),
  }, props) as unknown) as Buttons;

  const getDigits = useCallback(() => {
    return Object.values(Object.fromEntries(Object.entries(buttons).filter(([k]) => !isNaN(parseInt(k)))));
  }, [buttons]);
  const getBackspace = useCallback(() => buttons[Controls.BACKSPACE], [buttons]);
  const getPeriod = useCallback(() => buttons[Controls.PERIOD], [buttons]);
  const setValue = useCallback((b: BigNumber) => onChange(b.toString()), [onChange]);
  const numberOfFractionalDigits = hasPeriod ? value.substring(value.lastIndexOf('.')).length : 0;

  const overflow = nextValue.isGreaterThan(max);
  const underflow = nextValue.isLessThan(min);
  useImmediateLayoutAnimation([overflow, underflow], LayoutAnimation.Presets.spring);
  useEffect(() => {
    (Platform.OS !== 'web' && overflow || underflow) && Vibration.vibrate();
  }, [overflow, underflow]);
  return [
    value,
    nextValue,
    {
      overflow,
      underflow,
      getDigits,
      getBackspace,
      getPeriod,
      setValue,
      numberOfFractionalDigits,
    },
  ];
}
