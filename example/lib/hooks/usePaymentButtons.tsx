import {SyntheticEvent, useCallback, useState} from 'react';
import BigNumber from 'bignumber.js';
import { GestureResponderEvent } from 'react-native';

const ZERO_STR = '0';
const ZERO_BIG = new BigNumber(ZERO_STR);
type onPressHandler = (e: GestureResponderEvent) => void;

export enum Controls {
  BACKSPACE = '<',
  PERIOD = '.',
};

export type ButtonProps = {
  readonly onPress: onPressHandler;
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
  readonly getDigits: () => readonly ButtonProps[];
  readonly getBackspace: () => ButtonProps;
  readonly getPeriod: () => ButtonProps;
  readonly setValue: (value: BigNumber) => void;
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
  const buildButtonProps = useCallback((onPress: onPressHandler) => ({
    onPress,
  }), []);
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
    onChange((e) => {
      const next = e.substring(0, e.length - 1) || ZERO_STR;
      return next;
    });
  }, [onChange]);
  const appendPeriod = useCallback(() => {
    onChange((e) => {
      if (!e.includes(Controls.PERIOD)) {
        return `${e}${Controls.PERIOD}`;
      }
      return e;
    });
  }, [onChange]);
  const props = [];
  for (let i = 0; i < 10; i += 1) {
    const onPress = useCallback(() => appendDigit(`${i}`), [appendDigit]);
    props.push(buildButtonProps(onPress));
  }
  const buttons = (Object.assign({
    [Controls.BACKSPACE]: buildButtonProps(removeDigit),
    [Controls.PERIOD]: buildButtonProps(appendPeriod),
  }, props) as unknown) as Buttons;
  const getDigits = useCallback(() => {
    return Object.values(Object.fromEntries(Object.entries(buttons).filter(([k]) => !isNaN(parseInt(k)))));
  }, [buttons]);
  const getBackspace = useCallback(() => buttons[Controls.BACKSPACE], [buttons]);
  const getPeriod = useCallback(() => buttons[Controls.PERIOD], [buttons]);
  const nextValue = new BigNumber(value);
  const hasPeriod = value.includes(Controls.PERIOD);
  const setValue = useCallback((b: BigNumber) => onChange(b.toString()), [onChange]);
  // TODO: an onChange for dynamics
  return [
    value,
    nextValue,
    {
      getDigits,
      getBackspace,
      getPeriod,
      setValue,
    },
  ];
}
