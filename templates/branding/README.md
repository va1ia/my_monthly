# 新增品牌页面

## 目录
- 创建位置
- 分区同步

## 创建位置
以 about 为例，同时创建：
- pages/about/sections/
- styles/about/ 与 styles/about/index.css
- scripts/about/（需要交互时）
- content/about/
- assets/images/about/

## 分区同步
在各类型目录中使用同一分区名称，页面 README 登记所有分区。页面先加载 styles/shared.css，再加载专属入口。共享 Header、Footer 等引用 components/ 中的实现。
