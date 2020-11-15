# react-native-pretty-payment
Super pretty payment inputs for [**React Native**](https://reactnative.dev). It exports a bunch of hooks and utility components to help you deliver a sweeter payment experience, faster. It uses [**bignumber.js**](https://github.com/MikeMcl/bignumber.js/) to avoid floating point rounding errors.

[**☮️  Hippy Demo**](https://twitter.com/cawfree/status/1327734123415302144?s=20) [**😴 Sleepy Demo**](https://twitter.com/cawfree/status/1327800083908325378?s=20)

## 🚀 Getting Started

Using [**Yarn**](https://yarnpkg.com):

```sh
yarn add react-native-pretty-payment
```

## ✏️ Usage

Firstly, you don't actually _need_ any of the included UI to begin accepting payment information; all of the important business logic and props are retained inside a call to [`usePaymentButtons`](./src/hooks/usePaymentButtons.ts):

```javascript
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

## ✌️ License
[**MIT**](./LICENSE)
