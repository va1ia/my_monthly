// 目录：1. 花园播放资源 2. 手机版替换入口
// 路径相对本组件目录；手机素材完成后，仅在 mobileGarden 填入同样的字段。
export const preFooterMedia = {
  garden: {
    webm: './media/garden.webm',
    mp4: './media/garden.mp4',
    poster: './media/garden-poster.webp',
    aspectRatio: '3439 / 920',
    frameHeightRatio: 1080 / 920,
  },
  // 暂时复用电脑版，保持完整画面；后续替换视频、poster 及对应画布比例。
  mobileGarden: null,
};
