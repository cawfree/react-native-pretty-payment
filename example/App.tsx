import "@formatjs/intl-numberformat/polyfill";
import "@formatjs/intl-numberformat/locale-data/en";

import React from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  useWindowDimensions,
  TouchableOpacity,
 } from 'react-native';
import BigNumber from 'bignumber.js';
import Animation from 'lottie-react-native';
import {IntlProvider, useIntl} from 'react-intl';

import {
  BlurryTouchable,
  BlurryIndicator,
  usePaymentButtons,
  PaymentPad,
  ButtonProps,
  PaymentAmount,
  PaymentButtonsHelpers,
} from './lib';

import Gradient from './assets/gradient.json';

const styles = StyleSheet.create({
  buttonMargin: {
    marginLeft: 10,
    marginBottom: 10,
  },
  buttonPadding: {
    padding: 10,
  },
  buttonText: {
    fontSize: 200,
    fontWeight: '200',
    color: 'white',
    opacity: 0.8,
    textShadowColor: 'rgba(255, 255, 255, 1)',
    textShadowRadius: 1,
  },
  center: {alignItems: 'center', justifyContent: 'center'},
  currencyText: {
    fontSize: 200,
    fontWeight: '200',
    color: 'white',
    opacity: 0.75,
    textShadowColor: 'rgba(255, 255, 255, 1)',
    textShadowRadius: 1,
  },
  flex: {flex: 1},
  indicator: {
    padding: 10,
    borderRadius: 10,
  },
  indicatorText: {
    fontSize: 20,
    fontWeight: '400',
    color: 'white',
    opacity: 0.75,
    textShadowColor: 'rgba(255, 255, 255, 1)',
    textShadowRadius: 1,
  },
  noOverflow: {overflow: 'hidden'},
  row: {
    width: '100%',
    flexDirection: 'row',
  },
  rowPadding: {paddingHorizontal: 50},
});

type AmountProps = PaymentButtonsHelpers & {
  readonly valueAsString: string;
};

function Amount({valueAsString, ...props}: AmountProps): JSX.Element {
  const intl = useIntl();
  const {numberOfFractionalDigits} = props;
  return (
    <PaymentAmount
      {...props}
      style={styles.currencyText}
      height={100}
    >
      {intl.formatNumber(
        valueAsString,
        {style: 'currency', currency: 'usd', minimumFractionDigits: numberOfFractionalDigits},
      )}
    </PaymentAmount>
  );
}

export default function App() {
  const {height} = useWindowDimensions();
  const [valueAsString, value, opts] = usePaymentButtons(
    new BigNumber(0),
    {min: new BigNumber(50), max: new BigNumber(100)},
  );
  const renderCharacter = React.useCallback((children: string): JSX.Element => {
    return (
      <View
        style={[
          StyleSheet.absoluteFill,
          styles.buttonPadding,
          styles.center,
        ]}>
        <Text
          style={styles.buttonText}
          numberOfLines={1}
          adjustsFontSizeToFit
          children={children}
        />
      </View>
    );
  }, []);
  const renderDigit = React.useCallback((props: ButtonProps, blurry: boolean): JSX.Element => {
    return (
      <BlurryTouchable
        onPress={props.onPress}
        disabled={props.disabled}
        style={[
          styles.buttonMargin,
          styles.flex,
          {borderRadius: '45%'},
          {opacity: props.disabled ? 0.2 : 1.0},
        ]}
        min={blurry ? 40 : 0}
        max={blurry ? 100 : 0}
        duration={60}
      >
        {renderCharacter(props.children)}
      </BlurryTouchable>
    );
  }, [renderCharacter]);
  return (
    <IntlProvider locale="en">
      <Animation
        style={{
          position: 'absolute',
          height,
        }}
        source={Gradient}
        autoPlay={false}
        loop
      />
      <ScrollView>
        <View style={{height: height * 0.16}} />
        <View style={[styles.row, styles.rowPadding]}>
          <View style={styles.flex} />
          <BlurryIndicator
            style={[styles.center, styles.noOverflow, styles.indicator]}
            visible={opts.underflow || opts.overflow}
            duration={250}
          >
            <Text style={styles.indicatorText} children={opts.underflow ? "MIN" : opts.overflow ? "MAX" : ""} />
          </BlurryIndicator>
        </View>
        <Amount
          {...opts}
          valueAsString={valueAsString}
        />
        <PaymentPad
          {...opts}
          style={[styles.rowPadding, {paddingVertical: 10}]}
          renderDigit={e => renderDigit(e, true)}
          renderBackspace={e => renderDigit(e, false)}
          renderPeriod={e => renderDigit(e, false)}
        />
      </ScrollView>
    </IntlProvider>
  );
}