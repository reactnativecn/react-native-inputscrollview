/**
 * Created by lvbingru on 12/16/15.
 */

import React, {Component, PropTypes } from 'react';
import ReactNative, {
    InteractionManager, View, Text, ScrollView, Platform, Animated, UIManager, NativeModules, Dimensions,
    Keyboard,
} from 'react-native';
import TextInputState from 'react-native/Libraries/Components/TextInput/TextInputState';
const ViewPlugins = NativeModules.InputScrollViewPlugin;
const dismissKeyboard = Keyboard.dismiss;

const propTypes = {
    distance : PropTypes.number,
    tapToDismiss : PropTypes.bool,
}

const defaultProps = {
    distance : 50,
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

    componentWillMount() {
        this.keyboardWillShowListener = Keyboard.addListener('keyboardWillShow', this.onKeyboardWillShow);
        this.keyboardWillHideListener = Keyboard.addListener('keyboardWillHide', this.onKeyboardWillHide);
    }

    componentWillUnmount() {
        this.keyboardWillShowListener.remove();
        this.keyboardWillHideListener.remove();
    }

    onKeyboardWillShow = e => {
        if (!this.scrollViewRef) {
            return;
        }
        const currentlyFocusedTextInput = TextInputState.currentlyFocusedField();
        if (currentlyFocusedTextInput != null) {
            ViewPlugins && ViewPlugins.isSubview(
                currentlyFocusedTextInput,
                this.scrollViewRef.getInnerViewNode(),
                r => {
                    if (r === true) {
                        this.move(currentlyFocusedTextInput, e)
                    }
                });
        }
    };
    onKeyboardWillHide = e=> {
        if (!this.scrollViewRef) {
            return;
        }
        if (this.moved) {
            this.moved = false;
            this.scrollToY(this.offsetY);
        }
    };

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
                if (e) {
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
        this.scrollViewRef.scrollTo({x:0, y:offsetY});
    }
}

InputScrollView.propTypes = propTypes;
InputScrollView.defaultProps = defaultProps;
