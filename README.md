# 基于uni-app框架

## 注意文件后缀名，区分.vue和.nvue结尾的文件

[官网地址](https://uniapp.dcloud.io/)
[参考链接](https://ask.dcloud.net.cn/article/36074)

## Tips
- app-nvue 平台只有纯nvue项目（render为native）才支持 <navigator>。非render为native的情况下，nvue暂不支持navigator组件，请使用API跳转。
- 在manifest.json源码视图的"app-plus"下配置"renderer":"native"，即代表App端启用纯原生渲染模式。此时pages.json注册的vue页面将被忽略，vue组件中的代码也需覆盖nvue规范，并会被原生渲染。(如果不指定该值，默认是不启动纯原生渲染的。)
- 启动纯原生渲染，可以减少App端的包体积、加快App启动速度。因为webview渲染模式的相关模块将被移除。
- unpackage文件夹不要上传，真机测试遇到问题的时候删了它在试