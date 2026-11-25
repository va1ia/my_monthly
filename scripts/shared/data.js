// 目录：1. 相对站点目录读取 JSON
// 以模块位置确定站点目录，兼容子目录部署与嵌套活动页。
const siteRoot = new URL('../../', import.meta.url);
export async function readJSON(path) {
  const response = await fetch(new URL(path, siteRoot));
  if (!response.ok) throw new Error(`Could not load ${path}`);
  return response.json();
}
