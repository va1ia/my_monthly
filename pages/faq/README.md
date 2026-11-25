# 完整 FAQ 页面

## 目录
- 入口与排版
- 表格绑定
- 文件与修改
- 验证

## 入口与排版
入口 `faq.html`，现有简略 FAQ 的 FAQ page 链接直接进入该页。桌面沿用共享 FAQ 左右网格，左侧为 GT Eesti Display 的大标题 FAQ，右侧为全部问题；≤991px 标题在上、问题在下。背景复用 Privacy Policy 的 --color-article-cream。保留现有 details / summary 的折叠、分隔线、答案留白与键盘焦点，不使用装饰便签或介绍语。

底部提示 “Have questions we haven’t answered yet? Contact us, we’d love to help :)”，链接到 contact.html。提示复用问题区域的网格和左右内边距，桌面与右侧问题文字左边缘对齐，手机 / 平板与单列问题文字对齐。Contact 提示之后接共享 Pre-footer（三卡和花园动画），再连接 Footer，与 Terms of Service / Privacy Policy 相同。页面设置 --pre-footer-base-bg:var(--color-article-cream)，复用同一背景衔接接口。

## 表格绑定
通过 `content/faq/source.json` 的公开 CSV 地址，读取用户指定 MM Website Copy 的 `Q&A: All`，gid=1307779966。唯一文案来源为 Google Sheet，无本地问答副本。首屏加载后立即读取，可见页面每 60 秒同步，切回标签页时也刷新；不需要重建或发布 HTML 才能反映文案变化。Google 导出缓存可能造成短暂延迟。

复用 `scripts/shared/faq.js`：增改删和排序均以表格当前结果为准，保留多段换行。表头 Q/A、Question/Answer 或 问题/回答；仅读取前两列，空行及缺少问题或答案的行不显示。完整页配置 stopBefore:COMING SOON，该标记及其下方全部内容均不显示；其上方问答原样显示。沿用共享读取器的 200 条上限和 1MB 响应限制。

加载中显示提示；首次失败显示重试与 Contact 提示；后续刷新失败保留本次访问已加载内容，成功后恢复同步。所有问答按纯文本转义，不执行表格 HTML。相同问题刷新时保留展开与键盘焦点。

## 文件与修改
- 结构：pages/faq/page.js，调用共享 renderFAQ({variant:'full'})。
- 页面入口：scripts/faq/index.js。
- 样式入口：styles/faq/index.css，复用 components/faq/faq.css。
- 表格来源 / 刷新间隔：content/faq/source.json，字段说明见相邻 README。
- 问答背景：所有 FAQ 条目共用无色块结构，不再读取颜色配置；完整页透出 article-cream 底色。
- 标题字号：styles/faq/index.css 的 .full-faq__title；字体复用 --font-heading。

## 验证
2026-11-25：公开 CSV 返回 200，浏览器状态为 connected，加载 16 条完整问答，与表格前两列映射一致。检查 320 / 390 / 820 / 1440px，无横向溢出；背景为 rgb(254,254,237)，标题实际使用 GT Eesti Display。键盘 Enter 可展开第一条，答案换行与既有色块 / 留白沿用共享组件。

`node --test scripts/faq/sync.test.mjs` 覆盖 60 秒自动轮询回调、问答增改删、保持展开和焦点、失败保留、空表提示及 HTML 转义。同步变化用模拟 CSV 验证，未修改用户表格。额外检查 Contact 简略 FAQ 仍为 connected / 4 条，便签和 FAQ page 链接保持正常；完整页 Contact 区块下缘与 Footer 顶缘一致。网站文件尚未发布。

2026-11-25 显示范围更新：浏览器实测连接成功后显示 15 条问答，COMING SOON 下方的 “Can I customize what I share with my partner?” 已排除。分区边界通过配置驱动，自动刷新时同样应用；相关解析和轮询验证共 3 项通过。
