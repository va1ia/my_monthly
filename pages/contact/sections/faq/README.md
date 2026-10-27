# Contact Q&A

## 目录
- 结构与交互
- 整页背景
- Google Sheet
- 颜色
- 验证

## 结构与交互
结构在 faq.js，样式 styles/contact/faq.css，读取逻辑 scripts/contact/faq.js。Contact 入口在表单后挂载。左侧使用用户上传的 assets/images/contact/faq/text-frame.svg 作为装饰背景（原文件 text frame.svg 按规范重命名），上方保留绿色胶带装饰并与边框重叠，正文通过 flex 垂直居中，使用统一内边距。SVG 设 preserveAspectRatio="none" 以跟随内容撑高后的便签尺寸，避免居中留白导致胶带与实际边框脱离，文字保留 HTML，复用现有字体和色板，文案可直接在 faq.js 编辑。full FAQ 链接预留 ./faq.html（完整 FAQ 页面按用户要求后续搭建，目前尚不存在）；手机同样显示便签，随后单列问题列表。不再引用原站标题图片。展开时背景从上到下擦入，答案淡入；支持的浏览器同时平滑展开高度，其余保留原生折叠。prefers-reduced-motion 下禁用动效。使用原生 details/summary，支持鼠标、Enter/Space、多条展开和可见键盘焦点。答案保持纯文本及换行，不执行表格 HTML。

## 整页背景
Q&A 透明显示整页底色，无局部渐变。content/contact/background.json 配置默认绿色、Q&A 的 darker linen、触发线（Q&A 内容顶部到达视口高度 33%）和 1000ms 整体换色。上滚回退，Footer 固定使用 brand 绿色背景，不参与换色。共享读取器见 scripts/shared/scroll-background.js；配置说明见 scripts/shared/README.md。原站 a-35（bg change faq）使用 #3d8054 → #dae3c3，本实现复用对应色板变量。

## Google Sheet
已连接 [MM Website Copy — Q&A: Preview](https://docs.google.com/spreadsheets/d/1lllEhCLX2yxzz5jNIgq3TxdKBSewufZc2xWGsXnGUgU/edit#gid=0)。当前通过固定 gid=0 选用 Q&A: Preview；Q&A: All（gid=1307779966）不在网页展示。读取不依赖工作表或文件名称，改名不需要修改链接。csvUrl 使用该工作表公开 CSV export 地址；未更改表格共享权限。本地 items 保存接入时的 4 条内容作为网络不可用时的后备。

表格第一行为“问题,回答”、“Question,Answer”或“Q,A”，A 列问题，B 列回答。空行和缺少任一字段的行跳过；多行答案和带逗号、双引号的 CSV 支持解析，最多 200 条。按有效行顺序显示。

当前静态网站适配器支持 Google Sheet 可公开读取的单工作表 CSV 地址。当前表格已可匿名读取 export CSV，无需另行发布。更换来源时，将可读取的 CSV 地址填写到 faq.json 的 csvUrl。表格必须只包含可公开 Q&A，不能用网站前端读取私密文档的凭据。用户未提供或授权发布前，不替用户修改共享权限。若需要保留 Sheet 私密，应另接服务端读取接口。

refreshSeconds 默认 60，最低 30。首次加载、回到可见标签以及定时刷新时读取；无变化不重绘，有变化保留相同问题的展开状态和焦点。失败保留最近成功内容，首次失败保留本地后备。Google 发布端可能缓存几分钟，不能承诺实时秒级同步。参考 https://support.google.com/docs/answer/183965 。已验证匿名 CSV 导出与本地预览页面跨域读取成功；未修改源表格做写入联调。

## 颜色
content/contact/faq-colors.json 的 colors 数组按显示行 1:1 对应：第 1 条用 colors[0]，第 2 条用 colors[1]，以此类推。不循环、不随机；颜色不足用 fallback 中性底色。添加问题时相应补齐颜色项。接受六位十六进制色值（可省略 #，可有首尾空格），统一规范为 #RRGGBB，其他格式回退中性色，避免外部配置注入样式。颜色配置在页面加载时读取，修改后需刷新；只有展开条目才显示对应底色。

暂用原站金色 #f1bf75、浅绿 #d9e584、蓝色 #b0d2eb，展开时显色。用户提供 JSON 后替换此配置，不改表格列结构。

## 验证
已验证 CSV 中文/英文表头、双引号、逗号、多行答案、坏数据拒绝、文本 HTML 转义及颜色不足兜底。浏览器已确认鼠标展开、Enter 收起。已验证真实 Q&A: Preview 表格 4 条数据成功读取（页面 sourceState=connected），无浏览器警告；未修改远端表格验证编辑传播。
