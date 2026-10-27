# 首页脚本

## 目录
- 首页入口
- Hero 动画
- Marquee
- User comments

## 首页入口
`index.js` 加载导航、Hero 和订阅配置，复用共享导航与 Footer。Hero 结构由 `pages/home/sections/hero/hero.js` 输出。

## Hero 动画
`hero.js` 导出 `mountHeroMotion(element)`，提供滚动碰杯、错层 tag、桌面鼠标视差和 marquee 暂停；返回 `destroy()` 清理事件及动画帧。支持减少动画偏好。参数出处和行为见 Hero README。

## Marquee
`marquee.js` 加载自动清单、检查更新、响应容器宽度变化并生成无缝轨道，返回 refresh()/destroy()。复制项对辅助技术隐藏，空素材时隐藏滚动带，少量素材时补足可视宽度；滚动暂停继续由 Hero 动画模块的按钮管理。

## User comments
user-comments.js 提供等高 Flex group 圆弧布局、持续循环播放、共享鼠标背景视差与 Sheet CSV 同步。支持减少动画和后台暂停；返回 refresh()/destroy()。详见 pages/home/sections/user-comments/README.md。
