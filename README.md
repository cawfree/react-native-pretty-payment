# react-native-pretty-payment
Super pretty payment inputs for [**React Native**](https://reactnative.dev). It exports a bunch of hooks and utility components to help you deliver a sweeter payment experience, faster. It uses [**bignumber.js**](https://github.com/MikeMcl/bignumber.js/) to avoid floating point rounding errors.

[**☮️  Hippy Demo**](https://twitter.com/cawfree/status/1327734123415302144?s=20) [**😴 Sleepy Demo**](https://twitter.com/cawfree/status/1327800083908325378?s=20)

## 🚀 Getting Started

Using [**Yarn**](https://yarnpkg.com):

```sh
yarn add react-native-pretty-payment
```

> This solution is most effective when comprised with an internationalization library with support for currency, such as [`react-intl`](https://github.com/formatjs/formatjs).

## ✏️ Usage

Firstly, you don't actually _need_ any of the included UI to begin accepting payment information; all of the important business logic and props are retained inside a call to [`usePaymentButtons`](./src/hooks/usePaymentButtons.ts):

```typescript
import {usePaymentButtons} from 'react-native-pretty-payment';
import BigNumber from 'bignumber.js';

const [valueAsString, value, {...helpers}] = usePaymentButtons(new BigNumber(1), {
  min: new BigNumber(1),
  max: new BigNumber(75),
  maximumFractionDigits: 2,
});
```

From this point, you're free render as you please, with the assurance that input and output values are going to remain bounded to the parameters supplied in the initial invocation of `usePaymentButtons`.

For a full demonstration, please check out the included [**Example**](./example/App.tsx).

## 📒 Reference

### `usePaymentButtons`

`usePaymentButtons` is used to synthesize all of the form validation logic and related props required to pass into a payment input layout.


```typescript
type usePaymentButtonsParams = {
  readonly min: BigNumber; // min required payment
  readonly max: BigNumber; // max required payment
  readonly maximumFractionDigits: number; // maximum digits the user can enter
}
```


```typescript
type usePaymentButtonsResult = [
  readonly valueAsString: string, // currently entered value as a string
  readonly value: BigNumber, // currently entered value as a non-lossy numeric representation
  readonly helpers: PaymentButtonsHelpers, // props and useful functions to help build your form
]
```

```typescript
type PaymentButtonsHelpers = {
  readonly overflow: boolean; // signalling value exceeds max
  readonly underflow: boolean; // signalling value is less than min
  readonly getDigits: () => readonly ButtonProps[]; // returns all digit props
  readonly getBackspace: () => ButtonProps; // returns backspace props
  readonly getPeriod: () => ButtonProps; // returns decimal point props
  readonly hasPeriod: boolean; // defines whether the user has tapped the decimal point
  readonly numberOfFractionalDigits: number; // the number of decimal points that have been entered
}
```

```typescript
type ButtonProps = {
  readonly onPress: onPressHandler; // callback used to change the entered payment value
  readonly disabled: boolean; // whether the input is disabled
  readonly children: string; // which value is being rendered [0123456789.-]
};
```

## ✌️ License
[**MIT**](./LICENSE)
