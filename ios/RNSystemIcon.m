//
//  RNSystemIcon.m
//  WUAU
//
//  Created by Leigh Scholten on 25/5/2026.
//

#import <React/RCTViewManager.h>

@interface RCT_EXTERN_MODULE(RNSystemIcon, RCTViewManager)
RCT_EXPORT_VIEW_PROPERTY(name, NSString)
RCT_EXPORT_VIEW_PROPERTY(color, NSString)
RCT_EXPORT_VIEW_PROPERTY(size, CGFloat)
RCT_EXPORT_VIEW_PROPERTY(weight, NSString)
@end
