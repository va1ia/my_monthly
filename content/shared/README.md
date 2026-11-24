# 全站导航数据

## 目录
- 配置字段
- 当前链接状态
- Pre-footer 背景切换

## 配置字段
navigation.json 的 items 用于主导航和 Footer。每项含 id、label、href，可选 external（新窗口，附 noopener noreferrer）与 hiddenInMenu（同时从主导航和 Footer 页面列表隐藏）。legal 为法律链接；social 为 label、href、icon，icon 对应 assets/icons/ 中的文件名。

## 当前链接状态
Newsletter 指向 ./press.html，保留 news 标识；Contact / Download 指向各自本地页面。Shop 已指向 ./shop.html，Event 指向 ./event.html，但当前均暂时隐藏。About 保留未启用的 ?page=about 占位，不显示于主导航或 Footer；正式接入时须替换为真实页面。法律与社交链接继续保留原站目标。

About / Event / Shop 当前设为 hiddenInMenu: true；桌面、手机主导航和 Footer 页面列表均同步过滤，只显示 Newsletter / Contact / Download；恢复时删除该字段或设为 false。

Newsletter 为当前临时显示名，页面浏览器标题同步为 Newsletter — My Monthly；press.html 及其类型目录不改名。Terms of Service / Privacy Policy 将在后续搭建，当前仍使用独立 legal 列表。

## Pre-footer 背景切换
Contact / Download 共用 content/shared/pre-footer-background.json：Pre-footer 顶部距离视口底部 80px 时开始由 picnic-date 过渡到 darker-linen，向下 2000ms、上滚恢复 700ms。桌面仍由 Pre-footer 触发；手机版（≤767px）由 FAQ 顶部进入同一触发线时开始换色，弥补 Pre-footer 隐藏时没有触发点的问题。Footer 保留独立绿色。 triggerLine 为视口比例（1 即底边），triggerOffsetPx 为提前量；transitionMs / returnTransitionMs 为双向时长，default / sections 指定既有颜色变量。
