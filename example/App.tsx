import React from 'react';
import { Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import BigNumber from 'bignumber.js';

import {usePaymentButtons} from './lib';

const styles = StyleSheet.create({
  button: {width: 50, height: 50, backgroundColor: 'red', alignItems: 'center', justifyContent: 'center'},
});

export default function App() {
  const [valueAsString, value, opts] = usePaymentButtons(
    new BigNumber(50),
    {min: new BigNumber(50), max: new BigNumber(100)},
  );
  const {getDigits, getPeriod, getBackspace, setValue, overflow, underflow} = opts;
  return (
    <>
      <SafeAreaView />
      <Text
        style={{color: (overflow || underflow) ? 'red' : undefined}}
        children={`${valueAsString}${overflow ? ' (over)' : underflow ? ' (under)' : ''}`}
      />
      {/* i want to iterate */}
      {getDigits().map(
        (props, i) => (
          <TouchableOpacity {...props} style={styles.button} key={`b${i}`}>
            <Text children={`${i}`} />
          </TouchableOpacity>
        ),
      )}
      <TouchableOpacity {...getBackspace()} style={styles.button}>
        <Text children="<" />
      </TouchableOpacity>
      <TouchableOpacity {...getPeriod()} style={styles.button}>
        <Text children="." />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setValue(new BigNumber(Math.random()))} style={styles.button}>
        <Text children="Rand" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setValue(new BigNumber(0))} style={styles.button}>
        <Text children="Reset" />
      </TouchableOpacity>
    </>
  );
}
