//
//  InputScrollViewPlugin.m
//  InputScrollViewPlugin
//
//  Created by LvBingru on 4/11/16.
//  Copyright © 2016 erica. All rights reserved.
//

#import "InputScrollViewPlugin.h"
#import "RCTShadowView.h"
#import "RCTUIManager.h"
#import "RCTTextField.h"
#import "RCTTextView.h"

@implementation InputScrollViewPlugin

RCT_EXPORT_MODULE();

@synthesize bridge = _bridge;

RCT_EXPORT_METHOD(isSubview:(nonnull NSNumber *)reactTag
                  relativeTo:(nonnull NSNumber *)ancestorReactTag
                  callback:(RCTResponseSenderBlock)callback)
{
    dispatch_async(dispatch_get_main_queue(), ^{
        UIView *view = [_bridge.uiManager viewForReactTag:reactTag];
        UIView *ancestorView = [_bridge.uiManager viewForReactTag:ancestorReactTag];
        
        while (view) {
            view = view.superview;
            if (view == ancestorView) {
                if (callback) {
                    callback(@[@(YES)]);
                }
                return;
            }
        }
        
        if (callback) {
            callback(@[@(NO)]);
        }
    });
}

RCT_EXPORT_METHOD(isTextInput:(nonnull NSNumber *)reactTag
                  callback:(RCTResponseSenderBlock)callback)
{
    dispatch_async(dispatch_get_main_queue(), ^{
        UIView *view = [_bridge.uiManager viewForReactTag:reactTag];
        if ([view isKindOfClass:[RCTTextField class]] || [view isKindOfClass:[RCTTextView class]]) {
            if (callback) {
                callback(@[@(YES)]);
            }
        }
        else {
            if (callback) {
                callback(@[@(NO)]);
            }
        }
    });
}


@end
