# 首页评论区

## 目录
- 结构与素材
- 内容和 Google Sheet
- 弧线与交互
- 验证与待确认

## 结构与素材
首页 Hero / Logo marquee 后挂载。结构为本目录 user-comments.js，样式 styles/home/user-comments.css，交互 scripts/home/user-comments.js。沿用全站 Graphik、GT Eesti 和颜色变量；手机直接使用 assets/images/home/user-comments/phone.svg（内含 From Our Community, With Love），不采用截图手机版的旧标题。bg-pattern-pc.svg / bg-pattern-phone.svg 是上传的两个 Group SVG 的 kebab-case 副本，原始文件保留。图片都是装饰，语义标题单独提供给辅助技术。

## 内容和 Google Sheet
2026-10-27 从 https://mymonthly.io/ 的 .reviewscontainer 提取六条唯一评论，排除第二组滚动副本；均为五星，无作者与年份，不自行补充。已连接 [MM Website Copy → Home: user comments](https://docs.google.com/spreadsheets/d/1lllEhCLX2yxzz5jNIgq3TxdKBSewufZc2xWGsXnGUgU/edit?gid=999999)，第三个工作表，gid=999999。未新增本地 JSON；结构模块保留原站初始快照，作为首次加载及请求失败时的回退。

表头为 `title,date,rating,body`，可调整列顺序；rating 为 1–5 整数，title / body 必填，最多 100 条。content/home/user-comments-source.js 的 csvUrl 已配置该工作表公开 CSV 导出地址；按 gid 定位，修改 tab 名称不会影响连接。每 60 秒读取（后台暂停），失败保留上次内容；CSV 支持带逗号、引号、多行文本。正文按纯文本转义，不执行表格中的 HTML。Sheet 接入后覆盖初始快照。

## 弧线与交互
参考 https://codepen.io/GreenSock/pen/eYEXmJm 的圆周定位和切线旋转思路，自行用原生 JS 实现浅弧线，不增加 GSAP / 框架依赖。中央卡片端正，两侧随圆弧下沉并倾斜；每秒约 22px，首条居中为 First ever?!?。少量评论补足宽度。视觉轨道对辅助技术隐藏，另提供唯一评论列表。

按原站 reviewscontainer 的 group 排列方式，所有卡片置于同一横向 Flex group，用 align-items: stretch 保持等宽等高，高度由组内最长内容共同决定，保留完整文字和弧线。已移除悬停暂停、暂停按钮及左右切换；仅后台、离开视口和减少动画偏好停止自动滚动。mountUserComments 返回 refresh() / destroy()，清理请求、观察器与动画帧。

非手机端（≥768px 且支持精细鼠标）复用 scripts/shared/pointer-parallax.js，与首屏同样映射 X ±2vw、Y 0–4vw，并平滑跟随；手机及减少动画模式静止。Contact 原有 mountContactMotion 接口重新导出共享实现，行为不变。

## 验证与待确认
已在浏览器检查 320、390、768、1024、1920 宽度，无横向溢出或评论卡片内部文字裁切；查看桌面和手机截图；初版验证过键盘切换、暂停 / 恢复、减少动画偏好，未发现脚本错误。CSV 的逗号、嵌入引号、BOM、多行正文及 FAQ 共用解析器回归通过。模拟 Sheet 成功更新、正文转义、唯一辅助技术列表及请求失败保留内容均通过；已通过本地首页真实浏览器跨域读取验证，sourceState=connected，6 条评论的标题、日期与正文逐条匹配 Sheet，辅助技术列表同样为 6 条。

局部字号、尺寸、圆弧半径和速度依据截图暂定，待 Figma / 用户确认，不作为最终品牌规范。星星为评分图形，另有文字替代；正文和日期使用全站深色文字以保留对比度。

本次调整后重新检查 320、390、768、1440 宽度，组内所有卡片高度相同，无横向溢出或卡片内部文字裁切；确认底部控件已移除、鼠标进入后卡片继续移动、非手机背景跟随鼠标、手机背景静止、减少动画偏好停止卡片与背景运动，并查看桌面 / 手机截图。

评论位置复核：桌面 group 顶部改为手机顶部 + 手机宽度约 1.145 倍，以 SVG 内标题为参照，替代原分区高度 69% 的中心定位；1440px 宽下上移约 56px。手机 SVG 桌面最大宽度 477px，评论锚点同步封顶，避免超宽屏手机超出分区。手机版仍维持原 66% 中心定位。复核 390、768、1024、1440、1840、2398 宽度，标题与卡片保留间距，无横向溢出。

卡片内容纵向居中：每张卡片用纵向 Flex 和 justify-content: center，把标题、评分 / 日期及正文作为整体居中；保留左对齐和整组等高。已在 390、768、1440 宽度检查，文字组上下留白相等（像素取整误差不超过 1px），无文字裁切或横向溢出。

短评论间距：标题与正文合计不超过 200 字符时使用 card--short 变体，在原段间距上增加 .3em 行间 gap（约 3–4px），保持文字组纵向居中。Sheet 更新后自动按内容重新判断。已复核 320、390、768、1440 宽度，卡片仍等高，无文字裁切或横向溢出。
