import type { CapacitorConfig } from '@capacitor/cli';

// Folia 本地版 iOS 壳：前端页面在打包时从 folia-major 的 local-only 分支构建并内置进
// App（见 scripts/build-frontend.mjs），打开不加载任何远程网址、不请求任何音乐平台，
// 只播放用户导入到手机本地的音乐文件。

const config: CapacitorConfig = {
  appId: 'com.coco.folia.local',
  appName: 'Folia本地版',
  webDir: 'www',
  backgroundColor: '#09090b',
  ios: {
    contentInset: 'never',
    backgroundColor: '#09090b',
  },
};

export default config;
