import * as React from 'react';
import {Text, View, StyleSheet, ScrollView, ViewStyle} from 'react-native';

import type {PaymentButtonsHelpers} from '../hooks';

export type PaymentAmountProps = PaymentButtonsHelpers & {
  readonly style?: ViewStyle;
  readonly height: number;
  readonly value: string;
};

const styles = StyleSheet.create({
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    width: '100%',
  },
  fill: {
    height: '100%',
    width: '100%',
  },
});

export default function PaymentAmount({
  style,
  value,
  height,
}: PaymentAmountProps): JSX.Element {
  const [layout, setLayout] = React.useState(null);
  const onLayout = React.useCallback(({nativeEvent: {layout}}) => {
    setLayout(layout);
  }, [setLayout]);
  const maxHeight = Math.min(height, height / (Math.max(value.length, 1) * 0.15));
  return (
    <View style={[styles.container, StyleSheet.flatten(style), {height}]} onLayout={onLayout}>
      {!!layout && (
        <ScrollView
          style={layout}
          horizontal
          showsHorizontalScrollIndicator={false}>
          <View style={[styles.center, layout]}>
            <Text 
              style={{
                fontSize: height,
                maxHeight,
              }}
              adjustsFontSizeToFit
              children={value}
            />
          </View>
        </ScrollView>
      )}
    </View>
  );
}