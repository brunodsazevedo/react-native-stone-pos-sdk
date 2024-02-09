import { NativeModules, Platform } from 'react-native';

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
