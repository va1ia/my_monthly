# 共享数据

## 目录
- 配置字段
- 当前链接状态
- 简略 FAQ
- Pre-footer 背景切换

## 配置字段
navigation.json 的 items 用于主导航和 Footer。每项含 id、label、href，可选 external（新窗口，附 noopener noreferrer）与 hiddenInMenu（默认同时从主导航和 Footer 页面列表隐藏）；showInFooter: true 可单独保留 Footer 入口。legal 为法律链接；social 为 label、href、icon，icon 对应 assets/icons/ 中的文件名。

## 当前链接状态
Newsletter 指向 ./press.html，保留 news 标识；Contact / Download 指向各自本地页面。Shop 已指向 ./shop.html，Event 指向 ./event.html，但当前均暂时隐藏。About 保留未启用的 ?page=about 占位，不显示于主导航或 Footer；正式接入时须替换为真实页面。法律与社交链接继续保留原站目标。

About / Event / Shop 当前设为 hiddenInMenu: true；桌面、手机主导航只显示 Newsletter / Contact / Download；恢复时删除该字段或设为 false。State of Period 设为 hiddenInMenu: true、showInFooter: true，仅在 Footer 的 Download 下方显示，指向 ./event/the-state-of-the-period/。

Newsletter 为当前临时显示名，页面浏览器标题同步为 Newsletter — My Monthly；press.html 及其类型目录不改名。Terms of Service / Privacy Policy 已接入本地页面，由独立 legal 列表维护。

## 简略 FAQ
faq.json 由 Home / Contact / Download 共用。csvUrl 为 Q&A: Preview 的公开 CSV 导出地址（gid=0），refreshSeconds 为刷新间隔（当前 60 秒、最低 30 秒），items 为包含 question / answer 的本地后备数组。完整 FAQ 页面独立使用 content/faq/source.json（Q&A: All），避免两种展示范围互相覆盖。同步、数据格式及失败行为见 [FAQ 组件](../../components/faq/README.md)。

## Pre-footer 背景切换
Contact / Download 共用 content/shared/pre-footer-background.json：以 FAQ 顶部为稳定判断点，≥768px 越过视口中线时由 picnic-date 过渡到 darker-linen；≤767px 保持 FAQ 顶部距离视口底部 80px 时提前触发。展开或折叠答案不影响判断点，避免下方 Pre-footer 被推移时背景错误恢复绿色。向下 2000ms、上滚返回触发线之前恢复绿色为 700ms；Footer 保留独立绿色。 triggerLine 为视口比例（1 即底边），triggerOffsetPx 为提前量；sections 内同名字段可覆盖全局值（桌面使用 0.5 / 0，手机继承 1 / 80）；transitionMs / returnTransitionMs 为双向时长，default / sections 指定既有颜色变量。
