// 目录：1. 花园播放资源 2. 手机版替换入口
// 路径相对本组件目录；≤991px 使用独立手机版构图。
export const preFooterMedia = {
  garden: {
    webm: './media/garden.webm',
    mp4: './media/garden.mp4',
    poster: './media/garden-poster.webp',
    durationSeconds: 20,
    aspectRatio: '3439 / 920',
    frameHeightRatio: 1080 / 920,
  },
  mobileGarden: {
    webm: './media/garden-mobile.webm',
    mp4: './media/garden-mobile.mp4',
    poster: './media/garden-mobile-poster.webp',
    durationSeconds: 10.75,
    aspectRatio: '1648 / 889',
    frameHeightRatio: 890 / 889,
  },
};
