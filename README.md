# Legend List Mvcp Bug Reproduction
This repository reproduces the issue described in [LegendApp/legend-list Issue #79.](https://github.com/LegendApp/legend-list/issues/79)

## Environment

#### Versions
- Node: 20.10.0 (LTS/Iron)
- React: 18.1.0
- React Native: 0.70.9

#### To Run Locally:
1. Install dependencies: `npm install`
2. Install CocoaPods: `cd ios/ && pod install`
3. Run on iOS: `npm run ios`
4. Run on Android: `npm run android`
   
## Background
#### Problem
When implementing a bidirectional infinite list in React Native, maintaining the top and bottom scroll positions is crucial, especially for chat-like applications.

Although this is a known issue in React Native versions earlier than 0.76.x, as detailed in [facebook/react-native Issue #25239](https://github.com/facebook/react-native/issues/25239), the challenge still persists when attempting to implement such functionality.

![Screenshot 2025-01-24 at 13 37 32](https://github.com/user-attachments/assets/cfa28e38-d421-476a-8583-0058d51ac59d)

With the @legendapp/list library, it is possible to achieve smooth UX and performance for ScrollView-based lists. However, when using this library, the top scroll position does not retain its correct position when new data is appended to the original array. This repository replicates the issue discussed in https://github.com/LegendApp/legend-list/issues/79.

#### Conclusion
When appending or prepending data, avoid creating a new object for the data array.
```
// ⛔️ Wrong implementation
// If you prepend the data by creating a new array,
// the list will start shifting and will not work as expected
const newData = [...response, ...data];
setData(newData);

// ✅ Correct implementation
// If you prepend the data this way without creating a new array,
// it will work as expected
setData(prevData => [...response, ...prevData]);
```
