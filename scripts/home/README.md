# 首页脚本

## 目录
- 首页入口
- Hero 动画
- Marquee
- User comments
- FAQ 与整页换色

## 首页入口
`index.js` 加载导航、Hero 和订阅配置，复用共享导航与 Footer。Hero 结构由 `pages/home/sections/hero/hero.js` 输出。

## Hero 动画
`hero.js` 导出 `mountHeroMotion(element)`，提供滚动碰杯、错层 tag、桌面鼠标视差和 marquee 暂停；返回 `destroy()` 清理事件及动画帧。支持减少动画偏好。参数出处和行为见 Hero README。

## Marquee
`marquee.js` 加载自动清单、检查更新、响应容器宽度变化并生成无缝轨道，返回 refresh()/destroy()。复制项对辅助技术隐藏，空素材时隐藏滚动带，少量素材时补足可视宽度；滚动暂停继续由 Hero 动画模块的按钮管理。

## User comments
user-comments.js 提供等高 Flex group 圆弧布局、持续循环播放、共享鼠标背景视差与 Sheet CSV 同步。支持减少动画和后台暂停；返回 refresh()/destroy()。详见 pages/home/sections/user-comments/README.md。

## FAQ 与整页换色
首页在评论区后挂载共享 renderFAQ / mountFAQ，加载 content/contact/faq.json 和 faq-colors.json；样式由 styles/home/index.css 引用共享组件。首页使用 renderFAQ({ variant: 'linen' })，固定显示 Darker Linen；不挂载整页滚动背景控制器，也不请求换色配置。手机和桌面一致，与 Pre-footer 默认浅色顶部衔接。Contact / Download 保留原渐变。
