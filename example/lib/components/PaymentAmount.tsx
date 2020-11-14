import * as React from 'react';
import {Text, View, StyleSheet, ScrollView, ViewStyle, TextStyle} from 'react-native';
import {useSplitStyles} from 'react-native-split-styles';
import TextPreset from 'react-native-split-styles/dist/presets/Text';

import type {PaymentButtonsHelpers} from '../hooks';

export type PaymentAmountProps = PaymentButtonsHelpers & {
  readonly style?: ViewStyle | TextStyle;
  readonly height: number;
  readonly children: string;
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
  children,
  height,
}: PaymentAmountProps): JSX.Element {
  const [layout, setLayout] = React.useState(null);
  const onLayout = React.useCallback(({nativeEvent: {layout}}) => {
    setLayout(layout);
  }, [setLayout]);
  const maxHeight = Math.min(height, height / (Math.max(children.length, 1) * 0.11));
  const [textStyle, extraStyles] = useSplitStyles(style || {}, TextPreset);
  return (
    <View style={[styles.container, extraStyles, {height}]} onLayout={onLayout}>
      {!!layout && (
        <ScrollView
          style={layout}
          horizontal
          showsHorizontalScrollIndicator={false}>
          <View style={[styles.center, layout]}>
            <Text 
              style={[{fontSize: height, maxHeight}, textStyle]}
              adjustsFontSizeToFit
            >
              {children}
            </Text>
          </View>
        </ScrollView>
      )}
    </View>
  );
}