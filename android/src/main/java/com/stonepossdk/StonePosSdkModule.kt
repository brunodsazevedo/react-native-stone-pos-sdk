package com.stonepossdk

import android.content.Context
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise
import stone.application.StoneStart
import stone.user.UserModel
import stone.utils.Stone
import stone.utils.keys.StoneKeyType

import com.stonepossdk.executors.*
import com.stonepossdk.helpers.*

class StonePosSdkModule(reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext) {

  companion object {
    private const val IS_RUNNING_IN_POS = "IS_RUNNING_IN_POS"
    private const val STONE_SDK_VERSION = "STONE_SDK_VERSION"
    private var STONE_QRCODE_PROVIDER_ID = ""
    private var STONE_QRCODE_AUTHORIZATION = ""

    var currentUserList: List<UserModel>? = null

    fun hasStoneCodeInList(stoneCode: String): Boolean {
      if (currentUserList?.findLast { it.stoneCode.equals(stoneCode) } != null) {
        return true
      }

      return false
    }

    fun updateUserList(reactContext: Context) {
      synchronized(this) {
        if (Stone.isInitialized()) {
          currentUserList = StoneStart.init(
            reactContext, hashMapOf(
              StoneKeyType.QRCODE_PROVIDERID to STONE_QRCODE_PROVIDER_ID,
              StoneKeyType.QRCODE_AUTHORIZATION to STONE_QRCODE_AUTHORIZATION
            )
          )
        }
      }
    }

    fun userListCount(): Int {
      return if (currentUserList != null) currentUserList!!.size else 0
    }

    const val NAME = "StonePosSdk"
  }

  override fun getName(): String {
    return NAME
  }

  override fun getConstants(): Map<String, Any> {
    val constants: MutableMap<String, Any> = HashMap()

    constants[IS_RUNNING_IN_POS] = StoneTransactionHelpers.isRunningInPOS(reactApplicationContext)
    constants[STONE_SDK_VERSION] = Stone.getSdkVersion()

    return constants
  }

  @ReactMethod
  fun initSDK(
    appName: String,
    qrCodeProviderKey: String,
    qrCodeProviderAuthorization: String,
    promise: Promise
  ) {
    try {
      synchronized(this) {
        STONE_QRCODE_PROVIDER_ID = qrCodeProviderKey
        STONE_QRCODE_AUTHORIZATION = qrCodeProviderAuthorization

        currentUserList = StoneStart.init(
          reactApplicationContext, hashMapOf(
            StoneKeyType.QRCODE_PROVIDERID to qrCodeProviderKey,
            StoneKeyType.QRCODE_AUTHORIZATION to qrCodeProviderAuthorization
          )
        )

        Stone.setAppName(appName)

        promise.resolve(true)
      }
    } catch (e: Exception) {
      promise.reject(e)
    }
  }

  @ReactMethod
  fun activateCode(
    stoneCode: String,
    dialogMessage: String?,
    dialogTitle: String?,
    useDefaultUI: Boolean,
    promise: Promise
  ) {
    try {
      ActivateDeactivateCode(reactApplicationContext, currentActivity).executeAction(
        isActivationAction = true,
        stoneCode,
        dialogMessage,
        dialogTitle,
        useDefaultUI,
        ignoreLastStoneCodeCheck = false,
        promise
      )
    } catch (e: Exception) {
      promise.reject(e)
    }
  }

  @ReactMethod
  fun deactivateCode(
    stoneCode: String,
    dialogMessage: String?,
    dialogTitle: String?,
    useDefaultUI: Boolean,
    ignoreLastStoneCodeCheck: Boolean,
    promise: Promise
  ) {
    try {
      ActivateDeactivateCode(reactApplicationContext, currentActivity).executeAction(
        isActivationAction = false,
        stoneCode,
        dialogMessage,
        dialogTitle,
        useDefaultUI,
        ignoreLastStoneCodeCheck,
        promise
      )
    } catch (e: Exception) {
      promise.reject(e)
    }
  }
}
