import { NativeModules, Platform, DeviceEventEmitter } from 'react-native';

import type {
  MakeTransactionProgressProps,
  MifareKeyType,
  ProgressEventName,
  ReceiptType,
  TransactionSetupType,
  TransactionType,
} from './types';
import { useEffect, useState } from 'react';

const LINKING_ERROR =
  `The package 'react-native-stone-pos-sdk' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

const StonePosSdk = NativeModules.StonePosSdk
  ? NativeModules.StonePosSdk
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

export function initSDK(
  appName: String,
  qrCodeProviderKey: String = '',
  qrCodeProviderAuthorization: String = ''
): Promise<boolean> {
  if (!qrCodeProviderAuthorization || !qrCodeProviderKey) {
    console.warn(
      'You forgot to provide qrCodeProviderKey or qrCodeProviderAuthorization, PIX will NOT work'
    );
  }

  return StonePosSdk.initSDK(
    appName,
    qrCodeProviderKey,
    qrCodeProviderAuthorization
  );
}

export function activateCode(
  stoneCode: String,
  dialogMessage: String | null = null,
  dialogTitle: String | null = null,
  useDefaultUI: Boolean = true
): Promise<boolean> {
  return StonePosSdk.activateCode(
    stoneCode,
    dialogMessage,
    dialogTitle,
    useDefaultUI
  );
}

export function deactivateCode(
  stoneCode: String,
  dialogMessage: String | null = null,
  dialogTitle: String | null = null,
  useDefaultUI: Boolean = true,
  ignoreLastStoneCodeCheck: Boolean = false
): Promise<boolean> {
  return StonePosSdk.deactivateCode(
    stoneCode,
    dialogMessage,
    dialogTitle,
    useDefaultUI,
    ignoreLastStoneCodeCheck
  );
}

export function makeTransaction(
  {
    installmentCount = 1,
    installmentHasInterest = false,
    ...restOfTransactionSetup
  }: TransactionSetupType,
  progressCallbackEventName: ProgressEventName = 'MAKE_TRANSACTION_PROGRESS'
): Promise<TransactionType> {
  return StonePosSdk.makeTransaction(
    {
      installmentCount,
      installmentHasInterest,
      ...restOfTransactionSetup,
    },
    progressCallbackEventName
  );
}

export function printReceiptInPOSPrinter(
  receiptType: ReceiptType,
  transactionAtk: String,
  isReprint: Boolean = false,
  dialogMessage: String | null = null,
  dialogTitle: String | null = null,
  useDefaultUI: Boolean = true,
  progressCallbackEventName: ProgressEventName = 'PRINT_RECEIPT_IN_POS_PRINTER_PROGRESS'
): Promise<boolean> {
  return StonePosSdk.printReceiptInPOSPrinter(
    receiptType,
    transactionAtk,
    isReprint,
    dialogMessage,
    dialogTitle,
    useDefaultUI,
    progressCallbackEventName
  );
}

export function mifareDetectCard(
  dialogMessage: String | null = null,
  dialogTitle: String | null = null,
  useDefaultUI: Boolean = false,
  progressCallbackEventName: ProgressEventName = 'MIFARE_PROGRESS'
): Promise<String[]> {
  return StonePosSdk.mifareDetectCard(
    dialogMessage,
    dialogTitle,
    useDefaultUI,
    progressCallbackEventName
  );
}

export function mifareAuthenticateSector(
  keyType: MifareKeyType,
  sector: number,
  key: String = 'FFFFFFFFFFFF',
  dialogMessage: String | null = null,
  dialogTitle: String | null = null,
  useDefaultUI: Boolean = false,
  progressCallbackEventName: ProgressEventName = 'MIFARE_PROGRESS'
): Promise<boolean> {
  return StonePosSdk.mifareAuthenticateSector(
    keyType,
    sector,
    key,
    dialogMessage,
    dialogTitle,
    useDefaultUI,
    progressCallbackEventName
  );
}

export function mifareReadBlock(
  keyType: MifareKeyType,
  sector: number,
  block: number,
  key: String = 'FFFFFFFFFFFF',
  dialogMessage: String | null = null,
  dialogTitle: String | null = null,
  useDefaultUI: Boolean = false,
  progressCallbackEventName: ProgressEventName = 'MIFARE_PROGRESS'
): Promise<String[]> {
  if (block < 0 || block > 3) {
    throw Error('Your block must be between 0-3 inclusive');
  }

  return StonePosSdk.mifareReadBlock(
    keyType,
    sector,
    block,
    key,
    dialogMessage,
    dialogTitle,
    useDefaultUI,
    progressCallbackEventName
  );
}

export function mifareWriteBlock(
  keyType: MifareKeyType,
  sector: number,
  block: number,
  data: String,
  key: String = 'FFFFFFFFFFFF',
  dialogMessage: String | null = null,
  dialogTitle: String | null = null,
  useDefaultUI: Boolean = false,
  progressCallbackEventName: ProgressEventName = 'MIFARE_PROGRESS'
): Promise<String[]> {
  if (block < 0 || block > 3) {
    throw Error('Your block must be between 0-3 inclusive');
  }

  return StonePosSdk.mifareWriteBlock(
    keyType,
    sector,
    block,
    data,
    key,
    dialogMessage,
    dialogTitle,
    useDefaultUI,
    progressCallbackEventName
  );
}

export async function voidTransaction(
  transactionAtk: String,
  dialogMessage: String | null = null,
  dialogTitle: String | null = null,
  useDefaultUI: boolean = true,
  progressCallbackEventName: ProgressEventName = 'VOID_TRANSACTION_PROGRESS'
): Promise<TransactionType> {
  return StonePosSdk.voidTransaction(
    transactionAtk,
    dialogMessage,
    dialogTitle,
    useDefaultUI,
    progressCallbackEventName
  );
}

export function useMakeTransactionProgress() {
  const [transactionProgress, setTransactionProgress] =
    useState<MakeTransactionProgressProps | null>(null);

  function onClearTransactionProgress() {
    setTransactionProgress(null);
  }

  useEffect(() => {
    DeviceEventEmitter.addListener('MAKE_TRANSACTION_PROGRESS', (event) => {
      setTransactionProgress(event);
    });

    return () => {
      DeviceEventEmitter.removeAllListeners();
    };
  }, []);

  return { transactionProgress, onClearTransactionProgress };
}

export function useVoidTransactionProgress() {
  const [voidTransactionProgress, setVoidTransactionProgress] = useState<any>();

  useEffect(() => {
    DeviceEventEmitter.addListener('VOID_TRANSACTION_PROGRESS', (event) => {
      setVoidTransactionProgress(event);
    });

    return () => {
      DeviceEventEmitter.removeAllListeners();
    };
  }, []);

  return voidTransactionProgress;
}

export function useMifareProgress() {
  const [mifareProgress, setMifareProgress] = useState<any>();

  function onClearMifareProgress() {
    setMifareProgress(null);
  }

  useEffect(() => {
    DeviceEventEmitter.addListener('MIFARE_PROGRESS', (event) => {
      setMifareProgress(event);
    });

    return () => {
      DeviceEventEmitter.removeAllListeners();
    };
  }, []);

  return { mifareProgress, onClearMifareProgress };
}
