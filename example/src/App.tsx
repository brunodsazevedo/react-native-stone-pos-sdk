import * as React from 'react';

import { View, Button } from 'react-native';
import {
  initSDK,
  activateCode,
  deactivateCode,
} from 'react-native-stone-pos-sdk';

export default function App() {
  async function handleInitSdk() {
    try {
      const isStarted = await initSDK('TestApp');
      console.log(isStarted);
    } catch (error) {
      console.log(error);
    }
  }

  async function handleActiveCode() {
    try {
      const test = await activateCode('206192723');
      console.log(test);
    } catch (error) {
      console.log(error);
    }
  }

  async function handleDeactivateCode() {
    try {
      const test = await deactivateCode('206192723');
      console.log(test);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <View className="flex-1 items-center justify-center space-y-4">
      <View>
        <Button title="Init SDK" onPress={handleInitSdk} />
      </View>

      <View>
        <Button title="Ativar código" onPress={handleActiveCode} />
      </View>

      <View>
        <Button title="Desativar código" onPress={handleDeactivateCode} />
      </View>
    </View>
  );
}
