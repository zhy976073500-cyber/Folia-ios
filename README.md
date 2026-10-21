# Folia iOS（Sage 自建版）

这是 [Folia](https://github.com/chthollyphile/folia-major) 的 iOS 壳工程（Capacitor）。
App 打开后加载 Sage 自行部署的 Folia 实例，网站更新会自动同步到 App，不需要重新打包。

- 网页版：https://folia-major-flax-xi.vercel.app
- Web 源码（Sage 的 fork，含本实例的全部改动）：https://github.com/zhy976073500-cyber/folia-major
- 问题反馈、版本更新：微信公众号

## 构建

推送到 main 或手动触发 GitHub Actions（Build iOS IPA），会在云端 Mac 上构建出
**未签名** 的 `Folia.ipa`，在 Actions 的 Artifacts 里下载。

## 安装

IPA 未签名，需要用自己的 Apple ID 侧载，任选其一：

- **SideStore / AltStore**：导入 IPA 后用自己的 Apple ID 签名安装（免费账号 7 天续签）。
- **TrollStore（巨魔）**：支持的系统版本可直接永久安装。

## 许可证

AGPL-3.0（同上游 Folia）。第三方商标与音乐内容版权归各自权利方所有。
