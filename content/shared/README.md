# 全站导航数据

## 目录
- 配置字段
- 当前链接状态

## 配置字段
navigation.json 的 items 用于主导航和 Footer。每项含 id、label、href，可选 external（新窗口，附 noopener noreferrer）。legal 为法律链接；social 为 label、href、icon，icon 对应 assets/icons/ 中的文件名。

## 当前链接状态
Shop 已指向 ./shop.html。Contact、Download、法律及社交链接来自 https://mymonthly.io/ 的可见链接。参考站的 About / News 尚未提供真实目标，因此本地暂用 ?page=about / ?page=news 展示当前项状态。这些是组件预览，不代表页面已完成。正式接入新网站时替换为实际页面地址，移除预览参数。不要用空链接假装已实现页面。

顶部菜单支持 navigation.json 项目的 hiddenInMenu: true；About / Shop 暂时隐藏，桌面和手机均不渲染，不进入键盘焦点。Footer 不受影响；恢复时删除该字段或设为 false。

News 显示文案已改为 Press，保留原 news 标识与目标；新增 Event 指向 event.html。
