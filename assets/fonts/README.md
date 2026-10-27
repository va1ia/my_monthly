# 全站字体

## 目录
- 使用方式
- 字体登记
- 待确认信息

## 使用方式
字体集中在 styles/foundations/fonts.css 注册，随 styles/shared.css 加载。页面不要重复定义 @font-face；待 Figma 确认用途后，在 tokens.css 中统一指定正文和标题字体。导航/Footer 已使用 Graphik；手机导航与标题使用 GT Eesti Display。其他页面的文字规范仍待 Figma 确认。声明字体不会预加载所有文件，浏览器按实际使用情况加载。

## 字体登记
字重暂依据文件名映射，尚未核验字体内部元数据。

| 文件 | CSS 字重 | 样式 | 状态 |
| --- | --- | --- | --- |
| `GT-Eesti-Display-Medium.woff2` | 500 | normal | 已注册 |
| `garabosse/Garabosse-Gaillard·e.woff2` | 待确认 | 待确认 | Shop 招牌暂用独立 family（400），最终用途待确认 |
| `garabosse/Garabosse-Mignon·ne.woff2` | 待确认 | 待确认 | 仅登记，待确认变体用途 |
| `garabosse/Garabosse-Nonpareil·le.woff2` | 待确认 | 待确认 | 仅登记，待确认变体用途 |
| `garabosse/Garabosse-Parangon.woff2` | 待确认 | 待确认 | 仅登记，待确认变体用途 |
| `garabosse/Garabosse-Perle.woff2` | 待确认 | 待确认 | 仅登记，待确认变体用途 |
| `graphik/Graphik-Black.woff2` | 800 | normal | 已注册 |
| `graphik/Graphik-BlackItalic.woff2` | 800 | italic | 已注册 |
| `graphik/Graphik-Bold.woff2` | 700 | normal | 已注册 |
| `graphik/Graphik-BoldItalic.woff2` | 700 | italic | 已注册 |
| `graphik/Graphik-Extralight.woff2` | 200 | normal | 已注册 |
| `graphik/Graphik-ExtralightItalic.woff2` | 200 | italic | 已注册 |
| `graphik/Graphik-Light.woff2` | 300 | normal | 已注册 |
| `graphik/Graphik-LightItalic.woff2` | 300 | italic | 已注册 |
| `graphik/Graphik-Medium.woff2` | 500 | normal | 已注册 |
| `graphik/Graphik-MediumItalic.woff2` | 500 | italic | 已注册 |
| `graphik/Graphik-Regular.woff2` | 400 | normal | 已注册 |
| `graphik/Graphik-RegularItalic.woff2` | 400 | italic | 已注册 |
| `graphik/Graphik-Semibold.woff2` | 600 | normal | 已注册 |
| `graphik/Graphik-SemiboldItalic.woff2` | 600 | italic | 已注册 |
| `graphik/Graphik-Super.woff2` | 900 | normal | 已注册 |
| `graphik/Graphik-SuperItalic.woff2` | 900 | italic | 已注册 |
| `graphik/Graphik-Thin.woff2` | 100 | normal | 已注册 |
| `graphik/Graphik-ThinItalic.woff2` | 100 | italic | 已注册 |

## 待确认信息
- GT Eesti Display、Graphik 和 Garabosse 分别用于哪些文字样式。
- Garabosse 五个命名变体的设计用途及字体映射；保留上传的原文件名。
- 字体 Web 使用授权来源尚未记录。

Shop 展示墙招牌暂用 Garabosse Gaillard·e，CSS family 为 Garabosse Gaillarde，集中注册于 foundations/fonts.css；其余变体不推断映射。
