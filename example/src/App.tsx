import * as React from 'react';

import { View, Button, ScrollView } from 'react-native';
import {
  initSDK,
  activateCode,
  deactivateCode,
  makeTransaction,
  printReceiptInPOSPrinter,
  mifareDetectCard,
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

  async function handleMakeTransactionWithCreditCard() {
    try {
      const transactionStatus = await makeTransaction({
        typeOfTransaction: 'CREDIT',
        amountInCents: '10000',
        installmentCount: 1,
        installmentHasInterest: false,
        capture: true,
        useDefaultUI: false,
      });

      if (transactionStatus.transactionStatus === 'APPROVED') {
        console.log('Has printed merchant');
        await printReceiptInPOSPrinter(
          'MERCHANT',
          transactionStatus.acquirerTransactionKey!,
          false,
          'Printing merchant slip...'
        );

        console.log('Has printed client');
        await printReceiptInPOSPrinter(
          'CLIENT',
          transactionStatus.acquirerTransactionKey!,
          false,
          'Printing client slip...'
        );

        console.log(JSON.stringify(transactionStatus, null, 1));
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function handleMakeTransactionWithDebitCard() {
    try {
      const transactionStatus = await makeTransaction({
        typeOfTransaction: 'DEBIT',
        amountInCents: '10000',
        installmentCount: 1,
        installmentHasInterest: false,
        capture: true,
        useDefaultUI: true,
      });

      if (transactionStatus.transactionStatus === 'APPROVED') {
        console.log('Has printed merchant');
        await printReceiptInPOSPrinter(
          'MERCHANT',
          transactionStatus.acquirerTransactionKey!,
          false,
          'Printing merchant slip...'
        );

        console.log('Has printed client');
        await printReceiptInPOSPrinter(
          'CLIENT',
          transactionStatus.acquirerTransactionKey!,
          false,
          'Printing client slip...'
        );

        console.log(JSON.stringify(transactionStatus, null, 1));

        return;
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function handleDetectNFCCard() {
    try {
      const cardId = await mifareDetectCard();
      console.log(cardId);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <View className="flex-1 pt-6 px-6">
      <ScrollView className="space-y-4">
        <View>
          <Button title="Init SDK" onPress={handleInitSdk} />
        </View>

        <View>
          <Button title="Ativar código" onPress={handleActiveCode} />
        </View>

        <View>
          <Button title="Desativar código" onPress={handleDeactivateCode} />
        </View>

        <View>
          <Button
            title="Pagamento de cartão de crédito"
            onPress={handleMakeTransactionWithCreditCard}
          />
        </View>

        <View>
          <Button
            title="Pagamento de cartão de débito"
            onPress={handleMakeTransactionWithDebitCard}
          />
        </View>

        <View>
          <Button title="Detectar Cartão NFC" onPress={handleDetectNFCCard} />
        </View>
      </ScrollView>
    </View>
  );
}
