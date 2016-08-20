/**
 * Created by lvbingru on 12/16/15.
 */

import React, {Component, PropTypes, } from 'react';
import ReactNative, {InteractionManager, View, Text, ScrollView, Platform, Animated, UIManager, NativeModules, Dimensions} from 'react-native';
import TextInputState from 'react-native/Libraries/Components/TextInput/TextInputState';
import dismissKeyboard from 'react-native/Libraries/Utilities/dismissKeyboard';
import packageData from 'react-native/package.json';
import semver from 'semver';
const ViewPlugins = NativeModules.InputScrollViewPlugin;

const propTypes = {
    distance : PropTypes.number,
    tapToDismiss : PropTypes.bool,
    onKeyboardWillShow : PropTypes.func,
}

const defaultProps = {
    distance : 160,
    tapToDismiss : true,
}

export default class InputScrollView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            keyboardHeightAnim: new Animated.Value(0)
        };

        this.offsetY = 0;
        this.moved = false;
    }

    render() {
        const {distance, tapToDismiss, onKeyboardWillShow, keyboardShouldPersistTaps, children, ...others} = this.props
        return (
          <View
            style = {{flex:1}}
            onStartShouldSetResponderCapture = {e=>{
                if (tapToDismiss === true) {
                    const currentlyFocusedTextInput = TextInputState.currentlyFocusedField();
                    if (e.target != currentlyFocusedTextInput) {
                        if (ViewPlugins && ViewPlugins.isTextInput) {
                            ViewPlugins.isTextInput(
                                e.target,
                                r => {
                                  if (r===false) {
                                    dismissKeyboard();
                                  }
                                }
                            );
                        }
                        else {
                            dismissKeyboard();
                        }
                    }
                }
                return false;
            }}
          >
              <ScrollView
                style = {{flex:1}}
                contentContainerStyle = {[{alignItems : 'stretch',}]}
                keyboardShouldPersistTaps = {tapToDismiss?true:keyboardShouldPersistTaps}
                ref={(srcollView) => {
                       this.scrollViewRef = srcollView;
                }}
                onKeyboardWillShow = {e => {
                    if (!this.scrollViewRef) {
                        return;
                    }
                   const currentlyFocusedTextInput = TextInputState.currentlyFocusedField();
                   if (currentlyFocusedTextInput != null) {
                       ViewPlugins && ViewPlugins.isSubview(
                        currentlyFocusedTextInput,
                        this.scrollViewRef.getInnerViewNode(),
                        r => {
                            if(r===true) {this.move(currentlyFocusedTextInput, e)}
                        });
                   }
                   onKeyboardWillShow && onKeyboardWillShow(e);
                }}
                onKeyboardWillHide = {e=> {
                    if (!this.scrollViewRef) {
                        return;
                    }
                    if (this.moved) {
                        this.moved = false;
                        this.scrollToY(this.offsetY);
                    }
                }}
                onMomentumScrollEnd = {e=>{
                    if (!this.moved) {
                        this.offsetY = Math.max(0, e.nativeEvent.contentOffset.y)
                    }
                }}
                {...others}
              >
                  {children}
              </ScrollView>
          </View>

        );
    }

    move(currentlyFocusedTextInput, e) {
        UIManager.measureLayout(
          currentlyFocusedTextInput,
          ReactNative.findNodeHandle(this.scrollViewRef.getInnerViewNode()),
          e=>{console.warning(e)},
          (left, top, width, height)=>{
            let keyboardScreenY = Dimensions.get('window').height;
              if (e.endCoordinates) {
                  keyboardScreenY = e.endCoordinates.screenY;
              }
              let scrollOffsetY = top - keyboardScreenY + height + this.props.distance;
              scrollOffsetY = Math.max(this.offsetY, scrollOffsetY);
              this.scrollToY(scrollOffsetY);
          }
        );
        this.moved = true;
    }

    getInnerScrollView() {
        return this.scrollViewRef;
    }

    scrollToY(offsetY) {
        if (semver.gte(packageData.version, '0.20.0')) {
            this.scrollViewRef.scrollTo({x:0, y:offsetY});
        }
        else {
            this.scrollViewRef.scrollTo(offsetY, 0);
        }
    }
}

InputScrollView.propTypes = propTypes;
InputScrollView.defaultProps = defaultProps;
