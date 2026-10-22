import type { CapacitorConfig } from '@capacitor/cli';

// Folia iOS 壳：App 打开后直接加载 Sage 自建的 Folia 实例（远程页面），
// 网站侧的更新（公告、功能、后端地址）会即时到达 App，无需重新打包。

const config: CapacitorConfig = {
  appId: 'com.coco.folia.local',
  appName: 'Folia本地版',
  webDir: 'www',
  backgroundColor: '#09090b',
  server: {
    url: 'https://local.cococcfans.cn',
    cleartext: false,
  },
  ios: {
    contentInset: 'never',
    backgroundColor: '#09090b',
  },
};

export default config;
