import * as React from 'react';

import { View, Text } from 'react-native';
import { multiply } from 'react-native-stone-pos-sdk';

export default function App() {
  const [result, setResult] = React.useState<number | undefined>();

  React.useEffect(() => {
    multiply(3, 7).then(setResult);
  }, []);

  return (
    <View className="flex-1 items-center justify-center">
      <Text>Result: {result}</Text>
    </View>
  );
}
