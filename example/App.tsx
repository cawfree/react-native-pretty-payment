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
import {FormattedNumber, IntlProvider, useIntl} from 'react-intl';

import {
  BlurryTouchable,
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

});

type AmountProps = PaymentButtonsHelpers & {
  readonly valueAsString: string;
};

function Amount({valueAsString, ...props}: AmountProps): JSX.Element {
  const intl = useIntl();
  intl.formatNumber();
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
  const renderIsolated = React.useCallback((props: ButtonProps): JSX.Element => {
    return (
      <TouchableOpacity style={styles.flex} onPress={props.onPress}>
        {renderCharacter(props.children)}
      </TouchableOpacity>
    );
  }, [renderCharacter]);
  const renderDigit = React.useCallback((props: ButtonProps): JSX.Element => {
    return (
      <BlurryTouchable
        onPress={props.onPress}
        style={[
          styles.buttonMargin,
          styles.flex,
          {borderRadius: '45%'},
        ]}
        min={40}
        max={100}
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
        <Amount
          {...opts}
          valueAsString={valueAsString}
        />
        <PaymentPad
          {...opts}
          style={{paddingHorizontal: 50, paddingVertical: 10}}
          renderDigit={renderDigit}
          renderBackspace={renderIsolated}
          renderPeriod={renderIsolated}
        />
      </ScrollView>
    </IntlProvider>
  );
}