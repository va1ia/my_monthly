# article 页面模板

## 目录
- 创建步骤
- 文件说明
- 公共依赖

## 创建步骤
复制整个目录到 `article/<slug>/`，将 page.json 中的 slug、title、description 和 sections 改成真实内容。模板不包含发布路由，选定框架后再接入。

## 文件说明
- page.html：待替换的结构片段。
- page.json：页面元数据；slug 为目录标识，title 为标题，description 为简介，sections 为分区数据数组，具体字段按设计定义。
- styles/page.css：专属样式。
- scripts/page.js：专属交互入口，无交互时可删除。
- images/：专属图片。
- assets/：其他专属素材。
- components/：该页面独有组件，需要时创建并添加说明。

## 公共依赖
接入页面时先引用 styles/shared.css，再加载本页样式。公共 Header、Footer 和按钮直接引用共享实现；不要复制到此目录。路径由最终构建方式确定。
