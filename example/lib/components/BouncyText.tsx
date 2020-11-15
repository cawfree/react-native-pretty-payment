import * as React from 'react';
import {Text, View, StyleSheet, TextStyle, LayoutAnimation} from 'react-native';
import {useImmediateLayoutAnimation} from 'use-layout-animation';

export type BouncyTextProps = {
  readonly children: string;
  readonly style: TextStyle;
};

const styles = StyleSheet.create({
  container: {flex: 1, flexDirection: 'row'},
});

export default function BouncyText({
  style,
  children,
}: BouncyTextProps): JSX.Element {
  const shouldSplitChildren = React.useCallback((children: string): readonly JSX.Element[] => {
    return children.split('').map((e, i) => (
      <Text key={`k${i}${e}`} style={style} children={e} adjustsFontSizeToFit />
    ));
  }, [style]);
  const [layoutAnimation] = React.useState(() => ({
    ...LayoutAnimation.Presets.easeInEaseOut,
    duration: 150,
  }));
  const [nested, setNested] = React.useState(() => shouldSplitChildren(children));
  React.useEffect(() => {
    setNested(shouldSplitChildren(children));
  }, [shouldSplitChildren, setNested, children]);
  useImmediateLayoutAnimation([nested], layoutAnimation);
  return (
    <View style={styles.container}>{nested}</View>
  );
}
