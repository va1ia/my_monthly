# 素材同步工具

## 目录
- 本地预览
- 静态发布
- GitHub 自动同步

## 本地预览
`python3 scripts/tools/preview.py` 启动 127.0.0.1:4173，可用 --port 指定端口。请求 content/home/logo-marquee.json 时扫描 Logo 文件夹、按数字排序并更新清单；页面每 15 秒及重新获得焦点时读取一次。预览仅绑定本机，使用标准库，不安装依赖。

## 静态发布
`python3 scripts/tools/sync-marquee.py` 生成清单；`--check` 用于检查清单是否一致。静态站发布时必须将 content/home/logo-marquee.json 与图片一起发布，浏览器本身无法列出服务器目录。文件替换后通过内容 SHA-256 指纹刷新图片缓存；清单不变时不重写文件。

## GitHub 自动同步
.github/workflows/sync-marquee.yml 在图片目录或生成器 push 后运行，将最新清单提交回相同分支；只写清单，不修改图片、不部署网站，也不更改仓库 Pages 设置。需要 Actions contents 写权限；分支保护限制 bot 提交时，需在现有发布构建中执行生成器。工作流尚未在远程运行，本轮只验证了本地生成与页面同步。
