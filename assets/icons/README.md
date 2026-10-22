# 品牌标识与图标

## 目录
- 素材清单
- 使用约定

## 素材清单
| 文件 | 内容 |
| --- | --- |
| wordmark-green.svg | 绿色 Wordmark |
| wordmark-beige.svg | 米色 Wordmark |
| favicon.svg | 网站 favicon |

## 使用约定
Header、Footer 直接引用这里的文件，按背景与 Figma 选择颜色版本，不复制素材。Wordmark 保持原始比例，作为品牌链接时提供公司名称作为可访问名称。

正式页面建立后，在公共 head 中统一配置 favicon：`<link rel="icon" type="image/svg+xml" href="…">`，href 由框架根据 assets/icons/favicon.svg 的实际发布地址生成。当前预览入口 index.html 已挂载 favicon。
