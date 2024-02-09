
#ifdef RCT_NEW_ARCH_ENABLED
#import "RNStonePosSdkSpec.h"

@interface StonePosSdk : NSObject <NativeStonePosSdkSpec>
#else
#import <React/RCTBridgeModule.h>

@interface StonePosSdk : NSObject <RCTBridgeModule>
#endif

@end
