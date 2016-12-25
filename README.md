# react-native-inputscrollview

1. 防止键盘弹出时候，输入框被遮挡
2. 解决在ScrollView中点击其它元素时需要点击两次才能生效的问题

## 如何安装

0.35以上:

```bash
npm install react-native-inputscrollview --save
rnpm link react-native-inputscrollview

```

0.34以下:

```bash
npm install react-native-inputscrollview@1.x --save
rnpm link react-native-inputscrollview

```


## 如何使用
用InputScrollView替换InputView外层的ScrollView组件

## 属性

### distance: number (default 50)

当输入框非常靠近底部的时候,会自动和键盘保持一定的距离。这可以为你其它的组件留出空间。

### tapToDismiss: boolean (default true)

是否可以点击ScrollView来关闭键盘。