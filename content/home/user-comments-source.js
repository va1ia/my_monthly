// 目录：1. Google Sheet 来源
// MM Website Copy → 第三个 tab「Home: user comments」；列为 title,date,rating,body。
// 用 sheet gid 定位，修改 tab 名称不影响连接；请求失败时保留已有内容。
export const userCommentsSource = {
  csvUrl: 'https://docs.google.com/spreadsheets/d/1lllEhCLX2yxzz5jNIgq3TxdKBSewufZc2xWGsXnGUgU/export?format=csv&gid=999999',
  refreshSeconds: 60
};
