# Contact form

## 目录
- 文件与接口
- 状态与适配
- 后端

## 文件与接口
form.js 的 renderContactForm(content.form) 渲染结构，styles/contact/form.css 管理样式。scripts/contact/form.js 提供 createContactSubmitter(config, request) 和 mountContactForm(section, submit)，可注入异步适配器；destroy 中断请求并清理监听。

## 状态与适配
输入框、下拉框和留言区聚焦时不增加外描边或阴影，保留原有细边框；提交按钮保留键盘焦点提示，必填校验不变。

面板宽度为 88vw，最大 1000px；桌面内边距也设上限，避免超宽屏继续撑大表单。高度随内容增长，不裁切输入内容或提交状态。

原站字段、选项值和可选类型保留。每字段有隐藏 label，姓名和邮箱有 autocomplete。等待禁用按钮并设置 aria-busy，成功隐藏表单，失败保留输入允许重试；aria-live 公告并移入焦点。未连接时给出邮件地址，不伪造成功。未修改内容的重试使用同一 submissionId，数据库唯一约束防止重复保存。按用户 2026-10-23 截图修复原站显示 bug：桌面和手机姓名同排，First / Last 宽度分别为 58/42 与 63/37，极窄屏为 60/40。面板、标题、输入高度、留言区及按钮比例按截图调整；手机输入保持 16px。输入框提示文字为灰色，实际输入内容为深绿；下拉框边框与绿色底色一致，保留原生键盘与选项交互，使用 CSS 绘制向内留白 22px 的浅色箭头。绿色下拉框文字保持浅色以便阅读。

提交按钮沿用顶部 Download 的左侧圆形扩散：300ms 平滑展开 / 收回，按较宽按钮放大至 18 倍，悬停和键盘焦点均触发；禁用时不触发，减少动画偏好下即时切换。文字位于色块上层。

## 后端
contact-submit 校验公开 key、来源、请求大小与字段后写入私有 contact_submissions。数据库确认才返回 ok:true。Zapier 已接入新增留言记录，合作及一般问题发往 hello@mymonthly.co，技术支持发往 support@mymonthly.co。详见 docs/contact.md。
