Refar
=========================

Use MVI (model view intent) pattern, where M is Falcor, V is React and
I are rxjs Observables. The library uses the similar to Redux top down
unidirectional data flow and a single model (store in Redux)

## Installation

Refar requires **React 0.14 or later.** **Falcor 1.0** and **Rxjs 5.0**

```
npm install --save refar
```

For the package to work with react-native you will need to depend on
FourSS/falcor instead of Netflix/falcor due to asap.js dependency
You will also have to comment the following line in
`node_modules/babel-preset-react-native/configs/main.js`:
```
require('../transforms/transform-symbol-member')
```
