# 全站导航数据

## 目录
- 配置字段
- 当前链接状态

## 配置字段
navigation.json 的 items 用于主导航和 Footer。每项含 id、label、href，可选 external（新窗口，附 noopener noreferrer）。legal 为法律链接；social 为 label、href、icon，icon 对应 assets/icons/ 中的文件名。

## 当前链接状态
Shop、Contact、Download、法律及社交链接来自 https://mymonthly.io/ 的可见链接。参考站的 About / News 尚未提供真实目标，因此本地暂用 ?page=about / ?page=news 展示当前项状态。这些是组件预览，不代表页面已完成。正式接入新网站时替换为实际页面地址，移除预览参数。不要用空链接假装已实现页面。
