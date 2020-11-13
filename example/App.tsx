import React from 'react';
import { View, Text, Image, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import BigNumber from 'bignumber.js';

import {BlurryTouchable, usePaymentButtons, PaymentPad, ButtonProps, Controls} from './lib';

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
    fontWeight: '100',
    color: 'rgba(0, 0, 0.0980392, 0.22)',
  },
  center: {alignItems: 'center', justifyContent: 'center'},
  flex: {flex: 1},

});

export default function App() {
  const [valueAsString, value, opts] = usePaymentButtons(
    new BigNumber(50),
    {min: new BigNumber(50), max: new BigNumber(100)},
  );
  const {getDigits, getPeriod, getBackspace, setValue, overflow, underflow} = opts;
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
          {borderRadius: '50%'},
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
    <>
      <SafeAreaView />
      <Image
        blurRadius={100}
        style={StyleSheet.absoluteFill}
        source={{uri: 'https://i.guim.co.uk/img/media/d143e03bccd1150ef52b8b6abd7f3e46885ea1b3/0_182_5472_3283/master/5472.jpg?width=1200&quality=85&auto=format&fit=max&s=d5a74a011c3fef1ad9c1c962721d221d'}}
      />
      <Text children={valueAsString}/>
      <PaymentPad
        {...opts}
        style={{padding: 50}}
        renderDigit={renderDigit}
        renderBackspace={renderIsolated}
        renderPeriod={renderIsolated}
      />
    </>
  );
}